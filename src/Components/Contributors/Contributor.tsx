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
  Unit,
  UnitSelector,
} from '../../types/InstitutionTypes';
import { handlePotentialExpiredSession } from '../../api/api';

const StyledResultTypography = styled(Typography)`
  color: ${Colors.Text.OPAQUE_87_BLACK};
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

  function updateEditing() {
    const temp = contributorData;
    temp.isEditing = true;
    updateContributor(temp, resultListIndex);
  }

  async function handleSubmit() {
    //TODO: finn ut om det er noen grunn til objekt-copy i det hele tatt ?
    const temp = JSON.parse(JSON.stringify(contributorData));
    temp.isEditing = false;
    const cleanedAffiliations = await handleChosenAuthorAffiliations(temp.toBeCreated.affiliations);
    temp.toBeCreated.affiliations = removeInstitutionsDuplicatesBasedOnCristinId(cleanedAffiliations);
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

  function removeInstitution(index: number) {
    if (contributorData.toBeCreated.affiliations) {
      const affiliationCopy = [...contributorData.toBeCreated.affiliations];
      affiliationCopy.splice(index, 1);
      const temp = contributorData;
      temp.toBeCreated.affiliations = affiliationCopy;
      updateContributor(temp, resultListIndex);
    }
  }

  function removeUnit(instIndex: number, unitIndex: number) {
    if (contributorData.toBeCreated.affiliations) {
      const affiliationCopy = [...contributorData.toBeCreated.affiliations];
      affiliationCopy[instIndex].units?.splice(unitIndex, 1);
      const temp = contributorData;
      temp.toBeCreated.affiliations = affiliationCopy;
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

  async function addInstitution() {
    if (contributorData.toBeCreated.affiliations) {
      setAddDisabled(true);
      let affiliationsCopy: Affiliation[] = [...contributorData.toBeCreated.affiliations];
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

  async function retrySearch(contributorData: ContributorWrapper) {
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

  function editInstitution(inst: Affiliation) {
    const tempInst: InstitutionSelector = {
      value: inst.cristinInstitutionNr ?? '',
      label: inst.institutionName ?? '',
      cristinInstitutionNr: inst.cristinInstitutionNr ?? '',
    };
    handleInstitutionChange(tempInst);
  }

  return (
    <div className="content-wrapper">
      {!contributorData.isEditing ? (
        <div data-testid={`contributor-for-import-wrapper-${resultListIndex}`}>
          <Typography gutterBottom variant="h6">
            {contributorData.toBeCreated.first_name + ' ' + contributorData.toBeCreated.surname}
          </Typography>
          <div className={`metadata`}>
            {contributorData.toBeCreated.affiliations?.map((inst: Affiliation, instIndex: number) => (
              <div style={{ fontStyle: `italic`, fontSize: '0.9rem' }} key={instIndex}>
                <p key={instIndex}>{inst.institutionName}</p>
                <ul style={{ marginBottom: '0.3rem' }}>
                  {inst.units &&
                    inst.units.map(
                      (unit: Unit, unitIndex: number) =>
                        unit.unitName !== inst.institutionName && (
                          <li
                            data-testid={`institution-${inst.cristinInstitutionNr}-unit-${unit.unitNr}-list-item`}
                            key={unitIndex}>
                            {unit.unitName}
                          </li>
                        )
                    )}
                </ul>
              </div>
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
          <FormGroup>
            <TextField
              id={'authorName' + resultListIndex}
              label="Forfatternavn"
              value={
                contributorData.toBeCreated.authorName
                  ? contributorData.toBeCreated.authorName
                  : contributorData.toBeCreated.surname + ', ' + contributorData.toBeCreated.first_name
              }
              margin="normal"
              onChange={(e) => handleFieldChange(e, contributorData, 'authorName')}
            />
          </FormGroup>
          <div className={`metadata`}>
            {contributorData.toBeCreated.affiliations
              ?.filter(
                (item: Affiliation, number: number) =>
                  contributorData.toBeCreated.affiliations?.indexOf(item) === number
              )
              .map((inst: Affiliation, index: number) => (
                <Card variant="outlined" key={index} style={{ padding: '0.5rem', marginBottom: '0.5rem' }}>
                  <Typography style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>{inst.institutionName}</Typography>
                  {inst.units && (
                    <ul style={{ marginBottom: 0 }}>
                      {inst.units.map(
                        (unit: Unit, unitIndex: number) =>
                          unit.unitName !== inst.institutionName && (
                            <li key={unitIndex}>
                              {unit.unitName}
                              <Button
                                style={{ marginLeft: '0.5rem' }}
                                color="secondary"
                                size="small"
                                onClick={() => removeUnit(index, unitIndex)}>
                                Fjern enhet
                              </Button>
                            </li>
                          )
                      )}
                    </ul>
                  )}
                  <div style={{ float: 'right' }}>
                    {inst.isCristinInstitution === true && (
                      <Button
                        color="primary"
                        style={{ marginLeft: '0.5rem' }}
                        size="small"
                        onClick={() => editInstitution(inst)}>
                        Legg til enhet
                      </Button>
                    )}
                    <Button
                      style={{ marginLeft: '0.5rem' }}
                      size="small"
                      color="secondary"
                      onClick={() => removeInstitution(index)}>
                      Fjern tilknytning
                    </Button>
                  </div>
                </Card>
              ))}
          </div>
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
            <Button
              data-testid={`contributor-delete-button-form-${resultListIndex}`}
              color="secondary"
              onClick={() => deleteContributor(resultListIndex)}>
              Slett person
            </Button>
            <Button
              data-testid={`contributor-search-button-${resultListIndex}`}
              onClick={() => retrySearch(contributorData)}
              disabled={contributorData.toBeCreated.first_name === '' || contributorData.toBeCreated.surname === ''}>
              Søk igjen
            </Button>
            <Button
              data-testid={`contributor-save-button-${resultListIndex}`}
              color="primary"
              onClick={() => handleSubmit()}>
              Lagre endringer
            </Button>
          </div>
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
        </Form>
      )}
    </div>
  );
};

export default Contributor;
