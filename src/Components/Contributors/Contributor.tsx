import React, { FC, useState } from 'react';
import { Button, Card, CircularProgress, FormGroup, TextField, Typography } from '@material-ui/core';
import InstitutionCountrySelect from '../InstitutionSelect/InstitutionCountrySelect';
import ContributorSearchPanel from './ContributorSearchPanel';
import { Form } from 'reactstrap';
import '../../assets/styles/common.scss';
import {
  getInstitutionName,
  getPersonDetailById,
  SearchLanguage,
  searchPersonDetailByName,
} from '../../api/contributorApi';
import { Colors } from '../../assets/styles/StyleConstants';
import styled from 'styled-components';
import { getAffiliationDetails } from '../../utils/contributorUtils';
import { ContributorType, ContributorWrapper } from '../../types/ContributorTypes';
import {
  Affiliation,
  emptyInstitutionSelector,
  emptyUnitSelector,
  InstitutionSelector,
  SimpleUnitResponse,
  UnitSelector,
} from '../../types/InstitutionTypes';
import { handlePotentialExpiredSession } from '../../api/api';
import AffiliationDisplay from './AffiliationDisplay';
import { ReactComponent as VerifiedBadge } from '../../assets/icons/verified-badge.svg';

const StyledVerifiedBadge = styled(VerifiedBadge)`
  margin-right: 0.5rem;
  width: 1.7rem;
  height: 1.7rem;
  & path {
    fill: ${Colors.Text.GREEN};
  }
`;
const StyledResultTypography = styled(Typography)`
  color: ${Colors.Text.OPAQUE_87_BLACK};
`;

const StyledInstitutionList = styled.div`
  margin-top: 1rem;
`;

const StyledFlexEndButtons = styled(Button)`
  &&.MuiButton-root {
    margin-left: 1rem;
  }
`;

interface ContributorProps {
  contributorData: ContributorWrapper;
  updateContributor: (contributorData: ContributorWrapper, rowIndex: number) => void;
  resultListIndex: number;
  handleChosenAuthorAffiliations: (affiliations: Affiliation[]) => Promise<Affiliation[]>;
  deleteContributor: (index: number) => void;
}

const Contributor: FC<ContributorProps> = ({
  contributorData,
  updateContributor,
  resultListIndex,
  handleChosenAuthorAffiliations,
  deleteContributor,
}) => {
  const [addDisabled, setAddDisabled] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<UnitSelector>(emptyUnitSelector);
  const [searchResults, setSearchResults] = useState<ContributorType[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<Error | undefined>();
  const [openContributorSearchPanel, setOpenContributorSearchPanel] = useState(false);
  const [selectedInstitution, setSetSelectedInstitution] = useState(emptyInstitutionSelector);
  const [addUnitError, setAddUnitError] = useState<{ institutionNr: string; message: string } | undefined>();
  const [deleteUnitError, setDeleteUnitError] = useState<{ institutionNr: string; message: string } | undefined>();

  function updateEditing() {
    const temp = contributorData;
    temp.isEditing = true;
    updateContributor(temp, resultListIndex);
  }

  async function handleSubmit(continueEditing: boolean) {
    //TODO: finn ut om det er noen grunn til objekt-copy i det hele tatt ?
    const temp = JSON.parse(JSON.stringify(contributorData));
    const cleanedAffiliations = await handleChosenAuthorAffiliations(temp.toBeCreated.affiliations);
    temp.toBeCreated.affiliations = removeInstitutionsDuplicatesBasedOnCristinId(cleanedAffiliations);
    temp.isEditing = continueEditing;
    await updateContributor(temp, resultListIndex);
    setSetSelectedInstitution(emptyInstitutionSelector);
  }

  function handleUnitChange(unit: UnitSelector) {
    setSelectedUnit(unit);
  }

  function handleInstitutionChange(institutionSelector: InstitutionSelector) {
    setSetSelectedInstitution(institutionSelector);
    setSelectedUnit(emptyUnitSelector);
  }

  function removeInstitutionByCristinNrOrName(cristinInstitutionNr: string | undefined, institutionName: string) {
    if (contributorData.toBeCreated.affiliations) {
      const temp = contributorData;
      if (cristinInstitutionNr) {
        temp.toBeCreated.affiliations = [...contributorData.toBeCreated.affiliations].filter(
          (affiliation) => affiliation.cristinInstitutionNr !== cristinInstitutionNr
        );
      } else {
        temp.toBeCreated.affiliations = [...contributorData.toBeCreated.affiliations].filter(
          (affiliation) => affiliation.institutionName !== institutionName
        );
      }
      updateContributor(temp, resultListIndex);
    }
  }

  function checkIfSelectedUnitsExistsInAffiliations() {
    if (contributorData.toBeCreated.affiliations && selectedUnit) {
      const affiliations = contributorData.toBeCreated.affiliations;
      return affiliations.some((affiliation) => {
        return affiliation.units?.some((unit) => {
          return unit.unitNr === selectedUnit.value;
        });
      });
    }
  }

  function removeInstitutionsDuplicatesBasedOnCristinId(affiliations: Affiliation[]) {
    const cristinIdSet = new Set();
    return affiliations.filter((affiliation: Affiliation) => {
      if (cristinIdSet.has(affiliation.cristinInstitutionNr)) return false;
      cristinIdSet.add(affiliation.cristinInstitutionNr);
      return true;
    });
  }

  //TODO: bytt ut med egen lagd autocomplete som KUN legger til institusjon og ikke enhet.
  async function addInstitution() {
    if (contributorData.toBeCreated.affiliations) {
      setAddDisabled(true);
      let affiliationsCopy: Affiliation[] = [...contributorData.toBeCreated.affiliations];
      //WHY THO? når brukeren har valgt institusjon i nedtrekksmenyen så vet jo applikasjonen hva navnet er?
      const { institutionName } = await getInstitutionName(
        selectedInstitution.cristinInstitutionNr,
        SearchLanguage.En,
        new Map()
      );

      let duplicate = 0;
      for (let i = 0; i < affiliationsCopy.length; i++) {
        if (affiliationsCopy[i].cristinInstitutionNr === selectedInstitution.cristinInstitutionNr) {
          duplicate++;
          //TODO: Why is institutionName set as unitName?? Ask somebody if they know, this doesn't make  any sense
          //Maybe linked to bug SMILE-1131?
          if (affiliationsCopy[i].unitName !== institutionName) {
            affiliationsCopy[i].unitName = institutionName;
          }
        }
      }
      if (duplicate < 1) {
        affiliationsCopy.push({
          institutionName: selectedInstitution.label,
          cristinInstitutionNr: '' + selectedInstitution.cristinInstitutionNr,
          isCristinInstitution: true,
        });
      }

      if (selectedUnit.value !== '') {
        affiliationsCopy = addUnit(affiliationsCopy);
      }

      const temp = contributorData;
      temp.toBeCreated.affiliations = removeInstitutionsDuplicatesBasedOnCristinId(affiliationsCopy);

      updateContributor(temp, resultListIndex);
      setAddDisabled(false);
    }
  }

  //Brukes av gammel React select, hives ut når vi får skrevet den om
  function addUnit(affiliationsCopy: Affiliation[]) {
    for (let i = 0; i < affiliationsCopy.length; i++) {
      if (affiliationsCopy[i].cristinInstitutionNr === selectedInstitution.cristinInstitutionNr) {
        if (affiliationsCopy[i].units) {
          affiliationsCopy[i].units?.push({
            unitName: selectedUnit.label,
            unitNr: selectedUnit.value,
          });
        } else {
          affiliationsCopy[i].units = [];
          affiliationsCopy[i].units?.push({
            unitName: selectedUnit.label,
            unitNr: selectedUnit.value,
          });
        }
      }
    }
    return affiliationsCopy;
  }

  //TODO: TO BE REPLACED BY FORMIK
  //Krav fra sidelinjen: bidragsyter uten noen institusjoner er en formik feil
  function handleFieldChange(event: any, obj: any, property: string) {
    if (!obj.authorName) {
      obj.authorName = '';
    }
    const firstName = property === 'first' ? event.target.value : obj.toBeCreated.first_name;
    const lastName = property === 'last' ? event.target.value : obj.toBeCreated.surname;
    const authorName = property === 'authorName' ? event.target.value : obj.toBeCreated.authorName;
    if (property === 'first') {
      obj.toBeCreated.first_name = firstName;
    } else if (property === 'last') {
      obj.toBeCreated.surname = lastName;
    } else {
      obj.toBeCreated.authorName = authorName;
    }
    updateContributor(obj, resultListIndex);
  }

  async function retrySearch() {
    setSearching(true);
    setSearchError(undefined);
    let unitNameCache = new Map();
    let institutionNameCache = new Map();
    try {
      const authorResults = await searchPersonDetailByName(
        `${contributorData.toBeCreated.first_name} ${contributorData.toBeCreated.surname}`
      );

      if (authorResults.data.length > 0) {
        const fetchedAuthors: ContributorType[] = [];
        for (let i = 0; i < authorResults.data.length; i++) {
          const resultAffiliations: Affiliation[] = [];
          const fetchedAuthor = await getPersonDetailById(authorResults.data[i]);
          if (fetchedAuthor && fetchedAuthor.affiliations) {
            const activeAffiliations = fetchedAuthor.affiliations.filter(
              (affiliation: Affiliation) => affiliation.active
            );
            for (const activeAffiliation of activeAffiliations) {
              const detailedAffiliationAndCache = await getAffiliationDetails(
                activeAffiliation,
                unitNameCache,
                institutionNameCache
              );
              unitNameCache = detailedAffiliationAndCache.unitNameCache;
              institutionNameCache = detailedAffiliationAndCache.institutionNameCache;
              detailedAffiliationAndCache.affiliation &&
                resultAffiliations.push(detailedAffiliationAndCache.affiliation);
            }
            fetchedAuthor.affiliations = removeInstitutionsDuplicatesBasedOnCristinId(resultAffiliations);
          } else if (fetchedAuthor && !fetchedAuthor.affiliations) {
            fetchedAuthor.affiliations = [];
          }
          if (fetchedAuthor) {
            fetchedAuthors.push(fetchedAuthor);
          }
        }
        setSearchResults(fetchedAuthors);
        setOpenContributorSearchPanel(true);
      } else {
        setSearchResults([]);
        setOpenContributorSearchPanel(true);
      }
    } catch (error: any) {
      handlePotentialExpiredSession(error);
      setSearchError(error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }

  function handleContributorSearchPanelClose() {
    setOpenContributorSearchPanel(false);
    if (searchResults.length > 0) {
      setSearchResults([]);
    }
  }

  function handleChooseThis(author: ContributorType) {
    const temp = contributorData;
    temp.cristin = author;
    temp.cristin.isEditing = false;
    temp.cristin.order = resultListIndex + 1;
    temp.toBeCreated = author;
    if (temp.toBeCreated.first_name_preferred) {
      temp.toBeCreated.first_name = temp.toBeCreated.first_name_preferred;
    }
    if (temp.toBeCreated.surname_preferred) {
      temp.toBeCreated.surname = temp.toBeCreated.surname_preferred;
    }
    temp.toBeCreated.isEditing = false;
    temp.toBeCreated.order = resultListIndex + 1;
    temp.isEditing = false;
    setOpenContributorSearchPanel(false);
    updateContributor(temp, resultListIndex);
  }

  function addUnitToInstitutionAndHandleError(newUnit: SimpleUnitResponse, institutionNr: string) {
    try {
      setAddUnitError(undefined);
      addUnitToInstitution(newUnit, institutionNr);
    } catch (error) {
      if (error instanceof Error) {
        setAddUnitError({ institutionNr: institutionNr, message: error.message });
      }
    }
  }

  function addUnitToInstitution(newUnit: SimpleUnitResponse, institutionNr: string) {
    const affiliationIndex = contributorData.toBeCreated.affiliations
      ? contributorData.toBeCreated.affiliations.findIndex(
          (affiliation) => affiliation.cristinInstitutionNr === institutionNr
        )
      : -1;
    if (contributorData.toBeCreated.affiliations && contributorData.toBeCreated.affiliations[affiliationIndex]) {
      const newUnitMassaged = {
        unitName: newUnit.unit_name.en ?? newUnit.unit_name.nb,
        unitNr: newUnit.cristin_unit_id ?? '',
      };
      if (
        contributorData.toBeCreated.affiliations[affiliationIndex].units?.some(
          (existingUnit) => existingUnit.unitNr === newUnit.cristin_unit_id
        )
      ) {
        throw new Error(`Enhet eksisterer allerede, enhet : ${newUnit.unit_name.en ?? newUnit.unit_name.nb}`);
      }
      contributorData.toBeCreated.affiliations[affiliationIndex].units
        ? contributorData.toBeCreated.affiliations[affiliationIndex].units?.push(newUnitMassaged)
        : (contributorData.toBeCreated.affiliations[affiliationIndex].units = [newUnitMassaged]);
      updateContributor(contributorData, resultListIndex);
    } else {
      throw new Error(`Fant ikke institusjon med institusjons nummer: ${institutionNr}`);
    }
  }

  function deleteUnitToInstitutionAndHandleError(unitToBeDeleted: SimpleUnitResponse, institutionNr: string) {
    try {
      setDeleteUnitError(undefined);
      deleteUnitToInstitution(unitToBeDeleted, institutionNr);
    } catch (error) {
      if (error instanceof Error) {
        setDeleteUnitError({ institutionNr: institutionNr, message: error.message });
      }
    }
  }

  function deleteUnitToInstitution(unitToBeDeleted: SimpleUnitResponse, institutionNr: string) {
    const affiliationIndex = contributorData.toBeCreated.affiliations
      ? contributorData.toBeCreated.affiliations.findIndex(
          (affiliation) => affiliation.cristinInstitutionNr === institutionNr
        )
      : -1;
    if (contributorData.toBeCreated.affiliations && contributorData.toBeCreated.affiliations[affiliationIndex]) {
      const unitIndex =
        contributorData.toBeCreated.affiliations[affiliationIndex].units?.findIndex(
          (existingUnit) => existingUnit.unitNr === unitToBeDeleted.cristin_unit_id
        ) ?? -1;
      if (unitIndex < 0) {
        throw new Error('Fant ikke enhet');
      } else {
        contributorData.toBeCreated.affiliations[affiliationIndex].units?.splice(unitIndex, 1);
        updateContributor(contributorData, resultListIndex);
      }
    } else {
      throw new Error(`Fant ikke institusjon med institusjons nummer: ${institutionNr}`);
    }
  }

  return (
    <div>
      {!contributorData.isEditing ? (
        <div data-testid={`contributor-for-import-wrapper-${resultListIndex}`}>
          <Typography gutterBottom variant="h6">
            {contributorData.toBeCreated.first_name + ' ' + contributorData.toBeCreated.surname}{' '}
            {contributorData.toBeCreated.identified_cristin_person && (
              <>
                <StyledVerifiedBadge />
                <Typography variant="srOnly">Har CristinId</Typography>
              </>
            )}
          </Typography>
          <div className={`metadata`}>
            {contributorData.toBeCreated.affiliations
              ?.sort((affiliationA, affiliationB) => {
                if (affiliationA.institutionName && affiliationB.institutionName) {
                  return affiliationA.institutionName.localeCompare(affiliationB.institutionName);
                }
                return 0;
              })
              .map((affiliation) => (
                <AffiliationDisplay
                  affiliation={{
                    institutionName: affiliation.institutionName ?? '',
                    units: affiliation.units
                      ? affiliation.units
                          .filter((unit) => unit.unitName !== affiliation.institutionName)
                          .map((unit) => ({
                            cristin_unit_id: unit.unitNr,
                            unit_name: { nb: unit.unitName },
                          }))
                          .reverse()
                      : [],
                    countryCode: affiliation.countryCode ?? '',
                  }}
                  dataTestid={`list-item-author-${contributorData.toBeCreated.cristin_person_id}-affiliations-${affiliation.cristinInstitutionNr}`}
                  backgroundcolor={Colors.LIGHT_GREY}
                />
              ))}
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
            <Button data-testid={`contributor-edit-button-${resultListIndex}`} color="primary" onClick={updateEditing}>
              Rediger
            </Button>
            <Button
              data-testid={`contributor-delete-button-${resultListIndex}`}
              color="secondary"
              onClick={() => deleteContributor(resultListIndex)}>
              Slett person
            </Button>
          </div>
        </div>
      ) : (
        <Form data-testid={`contributor-form-${resultListIndex}`}>
          <FormGroup>
            <TextField
              id={'firstName' + resultListIndex}
              label="Fornavn"
              value={contributorData.toBeCreated.first_name}
              margin="normal"
              onChange={(e) => handleFieldChange(e, contributorData, 'first')}
              required
            />
          </FormGroup>
          <FormGroup>
            <TextField
              id={'lastName' + resultListIndex}
              label="Etternavn"
              value={contributorData.toBeCreated.surname}
              margin="normal"
              onChange={(e) => handleFieldChange(e, contributorData, 'last')}
              required
            />
          </FormGroup>
          <Button
            variant="outlined"
            color="primary"
            data-testid={`contributor-search-button-${resultListIndex}`}
            onClick={() => retrySearch()}
            disabled={contributorData.toBeCreated.first_name === '' || contributorData.toBeCreated.surname === ''}>
            {contributorData.toBeCreated.cristin_person_id ? 'Søk og erstatt person' : 'Søk etter person'}
          </Button>
          {!searching && searchError && (
            <Typography color="error">{searchError.message ?? 'Noe gikk galt med søket, prøv igjen'} </Typography>
          )}
          {searching && <CircularProgress />}
          {openContributorSearchPanel && !searching && (
            <StyledResultTypography>Fant {searchResults.length} bidragsytere</StyledResultTypography>
          )}
          <ContributorSearchPanel
            collapsed={openContributorSearchPanel && !searching}
            searchResult={searchResults}
            handleChoose={handleChooseThis}
            handleAbort={handleContributorSearchPanelClose}
          />
          <StyledInstitutionList>
            {contributorData.toBeCreated.affiliations
              ?.filter(
                (item: Affiliation, number: number) =>
                  contributorData.toBeCreated.affiliations?.indexOf(item) === number
              )
              .map((affiliation) => (
                <AffiliationDisplay
                  affiliation={{
                    institutionName: affiliation.institutionName ?? '',
                    units: affiliation.units
                      ? affiliation.units
                          .filter((unit) => unit.unitName !== affiliation.institutionName)
                          .map((unit) => ({
                            cristin_unit_id: unit.unitNr,
                            unit_name: { nb: unit.unitName },
                          }))
                          .reverse()
                      : [],
                    countryCode: affiliation.countryCode ?? '',
                    cristinInstitutionNr: affiliation.cristinInstitutionNr,
                  }}
                  dataTestid={`institution-${affiliation.cristinInstitutionNr}`}
                  backgroundcolor={Colors.LIGHT_GREY}
                  handleAddUnitClick={
                    affiliation.isCristinInstitution === true
                      ? (unit) => {
                          addUnitToInstitutionAndHandleError(unit, affiliation.cristinInstitutionNr ?? '');
                        }
                      : undefined
                  }
                  handleDeleteUnitClick={(unit) => {
                    deleteUnitToInstitutionAndHandleError(unit, affiliation.cristinInstitutionNr ?? '');
                  }}
                  handleDeleteAffiliationClick={() =>
                    removeInstitutionByCristinNrOrName(
                      affiliation.cristinInstitutionNr,
                      affiliation.institutionName ?? ''
                    )
                  }
                  addUnitError={
                    addUnitError && addUnitError.institutionNr === affiliation.cristinInstitutionNr
                      ? addUnitError.message
                      : undefined
                  }
                  deleteUnitError={
                    deleteUnitError && deleteUnitError.institutionNr === affiliation.cristinInstitutionNr
                      ? deleteUnitError.message
                      : undefined
                  }
                />
              ))}
          </StyledInstitutionList>
          <Card variant="outlined" style={{ overflow: 'visible', padding: '0.5rem', marginTop: '0.5rem' }}>
            <InstitutionCountrySelect
              handleInstitutionChange={handleInstitutionChange}
              handleUnitChange={handleUnitChange}
              aria-label={'Institusjonsvelger ' + resultListIndex}
              selectedInstitution={selectedInstitution}
              unit={selectedUnit}
            />
            <Button
              style={{ marginTop: '0.5rem' }}
              onClick={() => {
                addInstitution();
              }}
              variant="outlined"
              color="primary"
              size="small"
              disabled={
                addDisabled ||
                selectedInstitution.cristinInstitutionNr === '0' ||
                (contributorData.toBeCreated.affiliations?.filter((toBeCreatedAffiliation: Affiliation) => {
                  return selectedInstitution.cristinInstitutionNr === '' + toBeCreatedAffiliation.cristinInstitutionNr;
                }) &&
                  !selectedUnit) ||
                (selectedUnit.value !== '' && checkIfSelectedUnitsExistsInAffiliations())
              }>
              OK
            </Button>
          </Card>
          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
            <StyledFlexEndButtons
              variant="outlined"
              data-testid={`contributor-delete-button-form-${resultListIndex}`}
              color="secondary"
              onClick={() => deleteContributor(resultListIndex)}>
              Slett person
            </StyledFlexEndButtons>
            <StyledFlexEndButtons
              variant="outlined"
              data-testid={`contributor-save-button-${resultListIndex}`}
              color="primary"
              onClick={() => handleSubmit(true)}>
              Lagre endringer
            </StyledFlexEndButtons>
            <StyledFlexEndButtons
              variant="outlined"
              data-testid={`contributor-save-and-close-button-${resultListIndex}`}
              color="primary"
              onClick={() => handleSubmit(false)}>
              Lagre endringer og lukk
            </StyledFlexEndButtons>
          </div>
        </Form>
      )}
    </div>
  );
};

export default Contributor;
