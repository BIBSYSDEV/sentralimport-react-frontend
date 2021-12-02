import React, { FC, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import { Context } from '../../Context';
import { Button, CircularProgress, Divider, Typography } from '@material-ui/core';
import ConfirmDialog from '../Dialogs/ConfirmDialog';
import { CRIST_REST_API } from '../../utils/constants';
import { getInstitutionName, getPersonDetailById, SearchLanguage } from '../../api/contributorApi';
import { getAffiliationDetails } from '../../utils/contributorUtils';
import styled from 'styled-components';
import AddIcon from '@material-ui/icons/Add';
import ContributorOrderComponent from './ContributorOrderComponent';
import ImportContributorComponent from './ImportContributorComponent';
import {
  ContributorType,
  ContributorWrapper,
  emptyContributor,
  emptyContributorWrapper,
  ImportPublicationPerson,
  RoleCodes,
} from '../../types/ContributorTypes';
import { Colors } from '../../assets/styles/StyleConstants';
import { getInstitutionsByCountryCodes } from '../../api/institutionApi';
import Contributor from './Contributor';
import { ImportPublication } from '../../types/PublicationTypes';
import { Affiliation, ImportPublicationPersonInstutution } from '../../types/InstitutionTypes';

const Foreign_educational_institution_generic_code = '9127';
const Other_institutions_generic_code = '9126';

const countries: any = {};

const isCristinInstitution = (cristinInstitutionNr: string | undefined) => {
  cristinInstitutionNr = '' + cristinInstitutionNr; //cristinInstitutionNr from pia is a number
  return (
    cristinInstitutionNr !== Foreign_educational_institution_generic_code &&
    cristinInstitutionNr !== Other_institutions_generic_code &&
    cristinInstitutionNr !== '0'
  );
};

async function replaceNonCristinInstitutions(
  affiliations: Affiliation[] | ImportPublicationPersonInstutution[] | undefined
): Promise<Affiliation[]> {
  //TODO rydd opp i typer - her trengs bare en institusjonstype
  const resultAffiliations = [];
  if (affiliations) {
    for (let i = 0; i < affiliations.length; i++) {
      let affiliation = affiliations[i];
      if (!isCristinInstitution(affiliation.cristinInstitutionNr) && affiliation.countryCode) {
        if (countries[affiliation.countryCode] === undefined) {
          const institutionCountryInformation = (
            await getInstitutionsByCountryCodes(affiliation.countryCode, SearchLanguage.En)
          ).data;
          if (institutionCountryInformation.length > 0) {
            affiliation = {
              cristinInstitutionNr: institutionCountryInformation[0].cristin_institution_id,
              institutionName:
                (institutionCountryInformation[0].institution_name.en ||
                  institutionCountryInformation[0].institution_name.nb) + ' (Ukjent institusjon)',
              countryCode: institutionCountryInformation[0].country,
              isCristinInstitution: institutionCountryInformation[0].cristin_user_institution,
            };
          }
          if (affiliation.countryCode) countries[affiliation.countryCode] = affiliation; //sjekken burde vørt unødvendig
        } else {
          affiliation = countries[affiliation.countryCode];
        }
      }
      if (affiliation !== null) {
        resultAffiliations.push(affiliation);
      }
    }
  }
  return resultAffiliations;
}

async function searchCristinPersons(authors: ImportPublicationPerson[]) {
  let unitNameCache = new Map();
  let institutionNameCache = new Map();
  const suggestedAuthors = [];
  for (let i = 0; i < authors.length; i++) {
    let cristinPerson = { ...emptyContributor };
    let affiliations: Affiliation[] = [];
    if (authors[i].cristinId !== 0) {
      cristinPerson.cristin_person_id = authors[i].cristinId;
      cristinPerson = await getPersonDetailById(cristinPerson); //TODO: error-handling
      if (cristinPerson.affiliations) {
        const activeAffiliations = cristinPerson.affiliations.filter((affiliation) => affiliation.active);
        for (const activeAffiliation of activeAffiliations) {
          const detailedAffiliationAndCache = await getAffiliationDetails(
            activeAffiliation,
            unitNameCache,
            institutionNameCache
          );
          unitNameCache = detailedAffiliationAndCache.unitNameCache;
          institutionNameCache = detailedAffiliationAndCache.institutionNameCache;
          if (detailedAffiliationAndCache.affiliation) affiliations.push(detailedAffiliationAndCache.affiliation);
        }
      } else {
        affiliations = await replaceNonCristinInstitutions(authors[i].institutions);
      }
      cristinPerson = {
        cristin_person_id: cristinPerson.cristin_person_id,
        first_name: cristinPerson.first_name_preferred ?? cristinPerson.first_name,
        surname: cristinPerson.surname_preferred ?? cristinPerson.surname,
        affiliations: affiliations.filter((item: Affiliation, index: number) => affiliations.indexOf(item) === index),
        url: CRIST_REST_API + '/persons/' + cristinPerson.cristin_person_id + '?lang=' + SearchLanguage.En,
        isEditing: false,
        order: i + 1,
        identified_cristin_person: cristinPerson.identified_cristin_person,
      };
    }
    suggestedAuthors[i] = cristinPerson;
  }
  return suggestedAuthors;
}

const StyledModal = styled(Modal)`
  width: 95%;
  max-width: 95%;
  overflow: hidden;
`;

const StyledContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const CircularProgressWrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  height: 4rem;
`;

const StyledContributorLineWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 0.5rem;
`;

const StyledContributorHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0.5rem;
`;

const StyledOrderColumn = styled.div`
  width: 5%;
  min-width: 6rem;
`;

const StyledOrderedList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const StyledContributorColumn = styled.div`
  width: 45%;
  min-width: 15rem;
  margin-left: 2rem;
  padding: 0.5rem;
`;

const StyledHeaderText = styled(Typography)`
  color: ${Colors.PURPLE};
  && {
    font-weight: bold;
    font-size: 1.2rem;
  }
`;

const StyledContributorFooter = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 2rem;
`;

interface ContributorProps {
  importPublication: ImportPublication;
  isContributorModalOpen: boolean;
  isDuplicate: boolean;
  handleContributorModalClose: () => void;
}

const ContributorModal: FC<ContributorProps> = ({
  importPublication,
  isContributorModalOpen,
  isDuplicate,
  handleContributorModalClose,
}) => {
  const [contributors, setContributors] = useState<ContributorWrapper[]>([]);
  const [isLoadingContributors, setIsLoadingContributors] = useState(false);
  const [isClosingDialogOpen, setIsClosingDialogOpen] = useState(false);
  const { state, dispatch } = useContext(Context);

  const countries: any = {}; //object //TODO: denne må fikses

  const firstUpdate = useRef(true);

  useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    handleSaveToLocalStorage();
  }, [contributors]);

  const createContributorWrapper = (
    authorsFromImportPublication: ImportPublicationPerson[],
    index: number,
    cristinAuthors: ContributorType[]
  ): ContributorWrapper => {
    const author = authorsFromImportPublication[index];
    const importedContributor: ContributorType =
      authorsFromImportPublication.length > index && author
        ? {
            cristin_person_id: author.cristinId,
            first_name: author.firstname ? author.firstname : author.authorName?.split(' ')[1].replace(',', ''),
            surname: author.surname ? author.surname : author.authorName?.split(' ')[0].replace(',', ''),
            authorName: author.authorName,
            order: author.sequenceNr,
            affiliations: author.institutions,
            role_code: author.roleCode
              ? author.roleCode === RoleCodes.Forfatter
                ? RoleCodes.Author
                : author.roleCode
              : RoleCodes.Author,
          }
        : emptyContributor;
    return {
      imported: importedContributor,
      cristin: cristinAuthors[index],
      toBeCreated: emptyContributor,
      isEditing: false,
    };
  };

  const replaceLocalStorage = (tempContributors: ContributorWrapper[]) => {
    const contributorsFromLocalStorage = JSON.parse(localStorage.getItem('tempContributors') || '{}');
    if (contributorsFromLocalStorage.pubId && contributorsFromLocalStorage.pubId !== importPublication.pubId) {
      localStorage.setItem(
        'tempContributors',
        JSON.stringify({
          pubId: importPublication.pubId,
          contributors: tempContributors,
          duplicate: isDuplicate,
        })
      );
    }
  };

  const generateToBeCreatedContributor = async (
    contributor: ContributorWrapper,
    cristinAuthor: ContributorType,
    importPerson: ImportPublicationPerson
  ) => {
    const hasFoundCristinPerson = contributor.cristin.cristin_person_id !== 0;
    const personToBeCreated: ContributorType = hasFoundCristinPerson
      ? { ...contributor.cristin }
      : { ...contributor.imported };
    return cristinAuthor.cristin_person_id !== 0
      ? cristinAuthor
      : {
          ...personToBeCreated,
          affiliations: await replaceNonCristinInstitutions(
            isDuplicate ? cristinAuthor.affiliations : importPerson.institutions
          ),
        };
  };

  const validateContributor = (tempContributors: ContributorWrapper[]) => {
    //TODO: replace  validation with formik and yup
    const errors = [];
    for (let i = 0; i < tempContributors.length; i++) {
      const toBeCreated = tempContributors[i].toBeCreated;
      if (
        !toBeCreated.first_name ||
        toBeCreated.first_name === '' ||
        !toBeCreated.surname ||
        toBeCreated.surname === '' ||
        (toBeCreated.affiliations && toBeCreated.affiliations.length < 1)
      ) {
        console.log('Contributor has error(s) no firstname||surname||affiliations: ', toBeCreated);
        errors.push({ value: i + 1 });
      }
    }

    dispatch({ type: 'setContributorErrors', payload: errors });
  };

  //TODO: denne må brytes ned - trigges på importPublication, isContributorModalOpen, state.selectedPublication
  useLayoutEffect(() => {
    async function fetch() {
      setIsLoadingContributors(true);
      let tempContributors: ContributorWrapper[] = [];
      const identified: boolean[] = [];
      const authorsFromImportPublication = importPublication.authors;

      //TODO: Vi bør la være å bruke tempContributors som arbeidsminne.
      const contributorsFromLocalStorage = JSON.parse(localStorage.getItem('tempContributors') || '{}');
      if (
        contributorsFromLocalStorage !== null &&
        contributorsFromLocalStorage.pubId === importPublication.pubId &&
        contributorsFromLocalStorage.duplicate === isDuplicate
      ) {
        tempContributors = contributorsFromLocalStorage.contributors;
      } else {
        let cristinAuthors: ContributorType[] = [];
        if (isDuplicate) {
          cristinAuthors = state.selectedPublication.authors;
        } else if (!isDuplicate) {
          cristinAuthors = await searchCristinPersons(authorsFromImportPublication);
        }
        for (let i = 0; i < Math.max(cristinAuthors.length, authorsFromImportPublication.length); i++) {
          if (isDuplicate && state.doSave) {
            if (i < cristinAuthors.length) {
              cristinAuthors[i].affiliations = await getDuplicateAffiliations(state.selectedPublication.authors[i]);
            } else {
              cristinAuthors[i] = { ...emptyContributor };
            }
          }
          identified[i] = cristinAuthors[i].identified_cristin_person || false;
          tempContributors[i] = createContributorWrapper(authorsFromImportPublication, i, cristinAuthors);
          tempContributors[i].isEditing = tempContributors[i].cristin.cristin_person_id === 0;
          tempContributors[i].toBeCreated = await generateToBeCreatedContributor(
            tempContributors[i],
            cristinAuthors[i],
            authorsFromImportPublication[i]
          );
        }
      }
      setContributors(tempContributors);
      dispatch({ type: 'setContributorsLoaded', payload: true });
      replaceLocalStorage(tempContributors);
      dispatch({ type: 'identified', payload: identified }); //skjer dette to steder ?
      dispatch({ type: 'identifiedImported', payload: identified });
      setIsLoadingContributors(false);
      validateContributor(tempContributors);
    }

    fetch().then();
    handleSaveToLocalStorage(); //TODO what!? den lagret jo akkurat noen linjer over?
  }, [importPublication, isContributorModalOpen, state.selectedPublication]);

  useEffect(() => {
    async function identifyCristinPersonsInContributors_And_CreateListOfIdentified() {
      if (!isLoadingContributors) {
        return;
      }
      const identified: boolean[] = [];
      const identifiedImported: boolean[] = [];
      for (let i = 0; i < contributors.length; i++) {
        if (
          !contributors[i].imported.identified_cristin_person &&
          contributors[i].imported.cristin_person_id !== null &&
          contributors[i].imported.cristin_person_id !== 0 &&
          i < contributors.length
        ) {
          const person = await getPersonDetailById(contributors[i].imported);
          identifiedImported[i] = person.identified_cristin_person ?? false;
        }
        if (!contributors[i].toBeCreated.identified_cristin_person && isDuplicate) {
          //const person = await getPersonDetailById(contributors[i].toBeCreated); //TODO! Denne gir ingen mening - søker på cristinid=0 som gir 404-feil
          // identified[i] = person.identified_cristin_person ?? false;
        }
      }
      dispatch({ type: 'identifiedImported', payload: identifiedImported });
      dispatch({ type: 'identified', payload: identified });
      //TODO: kan ikke dette ligge direkte på contributor-objektet isteden ?
    }
    if (!isDuplicate) return;
    identifyCristinPersonsInContributors_And_CreateListOfIdentified().then();
  }, [contributors]);

  async function getDuplicateAffiliations(author: ContributorType) {
    let institutionNameCache = new Map();
    const affiliations: Affiliation[] = [];
    if (author.affiliations) {
      for (let i = 0; i < author.affiliations.length; i++) {
        const index: number = affiliations.findIndex((id) => {
          return (
            author.affiliations &&
            id.cristinInstitutionNr === author.affiliations[i].institution?.cristin_institution_id
          );
        });
        if (index >= 0 && i !== index) {
          if (!affiliations[index].units) affiliations[index].units = [];
          affiliations[index].units?.push({
            unitNr: author.affiliations[i].unit?.cristin_unit_id ?? '',
            unitName: author.affiliations[i].unit?.unit_name?.nb ?? '',
          });
        } else {
          const institutionNameAndCache = await getInstitutionName(
            author.affiliations[i].institution?.cristin_institution_id,
            SearchLanguage.En,
            institutionNameCache
          );
          institutionNameCache = institutionNameAndCache.cachedInstitutionResult;

          const temptemp: Affiliation = {
            cristinInstitutionNr: author.affiliations[i].institution?.cristin_institution_id,
            institutionName: institutionNameAndCache.institutionName,
            isCristinInstitution: author.affiliations[i].institution?.isCristinInstitution === true,
          };
          const unit = author.affiliations[i].unit;
          if (unit)
            temptemp.units = [
              {
                unitNr: unit.cristin_unit_id ?? '',
                unitName: unit.unit_name?.nb ?? '',
              },
            ];
          affiliations.push(temptemp);
        }
      }
    }
    return affiliations;
  }

  async function handleChooseAuthor(author: ContributorWrapper) {
    const toBeCreatedOrder = author.toBeCreated.order;
    const copiedAffiliations = JSON.parse(JSON.stringify(author.imported.affiliations));
    const temp = [...contributors];
    //TODO: kjøre inst-sjekken  - som konverterer ukjente institutusjoner til landkoder
    if (toBeCreatedOrder) {
      temp[toBeCreatedOrder - 1].toBeCreated.affiliations = copiedAffiliations;
      temp[toBeCreatedOrder - 1].toBeCreated.first_name = author.imported.first_name;
      temp[toBeCreatedOrder - 1].toBeCreated.surname = author.imported.surname;
      temp[toBeCreatedOrder - 1].toBeCreated.authorName = author.imported.authorName;
      temp[toBeCreatedOrder - 1].toBeCreated.cristin_person_id = author.cristin.cristin_person_id
        ? author.cristin.cristin_person_id
        : author.imported.cristin_person_id;
      temp[toBeCreatedOrder - 1].isEditing = false;
    }
    setContributors(temp);
  }

  async function handleChosenAuthorAffiliations(affiliations: Affiliation[]): Promise<Affiliation[]> {
    const tempAffiliations = [];
    for (let i = 0; i < affiliations.length; i++) {
      const affiliation = affiliations[i];
      if (!isCristinInstitution(affiliation.cristinInstitutionNr) && affiliation.countryCode) {
        //bytter ut institusjon med instkode for nasjonalitet
        const institutionCountryInformations = (
          await getInstitutionsByCountryCodes(affiliation.countryCode, SearchLanguage.En)
        ).data;
        if (institutionCountryInformations.length > 0) {
          affiliation.institutionName =
            (institutionCountryInformations[0].institution_name.en ||
              institutionCountryInformations[0].institution_name.nb) + ' (Ukjent institusjon)';
          affiliation.unitName =
            (institutionCountryInformations[0].institution_name.en ||
              institutionCountryInformations[0].institution_name.nb) + ' (Ukjent institusjon)';
          affiliation.cristinInstitutionNr = institutionCountryInformations[0].cristin_institution_id;
        }
        countries[affiliation.countryCode] = affiliation;
      }
      tempAffiliations.push(affiliation);
    }
    return tempAffiliations;
  }

  function handleSaveToLocalStorage() {
    if (state.doSave) {
      localStorage.setItem(
        'tempContributors',
        JSON.stringify({
          pubId: importPublication.pubId,
          contributors: contributors,
          duplicate: isDuplicate,
        })
      );
    }
  }

  const updateContributor = (author: ContributorWrapper, rowIndex: number) => {
    const temp = [...contributors];
    temp[rowIndex] = author;
    setContributors(temp);
  };

  // Ved sletting av en bidragsyter, sjekk om indeksering skal bli beholdt / oppdatert for alle andre elementer i bidragsyterlisten
  //TODO skriv om funksjonen slik at den blir enklere å lese !!!!!!!!
  //TODO Sjekk om alle edge-cases blir håndtert korrekt med tanke på rekkefølge i toBeCreated og imported (Sørg for at rekkefølgenummer på en gitt bidragsyter aldri blir mindre enn 1)
  const removeContributor = (rowIndex: number) => {
    const tempContrib = [...contributors];
    tempContrib.splice(rowIndex, 1);
    for (let i = rowIndex; i < tempContrib.length; i++) {
      const importedOrder = tempContrib[i].imported.order;
      const toBeCreatedOrder = tempContrib[i].toBeCreated.order;
      if (toBeCreatedOrder && importedOrder) {
        if (importedOrder === tempContrib[i].toBeCreated.order && importedOrder >= rowIndex) {
          tempContrib[i].imported.order = importedOrder - 1;
          tempContrib[i].toBeCreated.order = toBeCreatedOrder - 1;
        } else {
          if (importedOrder !== rowIndex) {
            if (importedOrder > rowIndex) {
              if (importedOrder > 0) {
                if (importedOrder < toBeCreatedOrder) {
                  tempContrib[i].toBeCreated.order = toBeCreatedOrder - 1;
                }
              } else {
                tempContrib[i].toBeCreated.order = toBeCreatedOrder - 1;
              }
            }
          }
        }
      }
    }
    for (let j = 0; j < rowIndex; j++) {
      const importedOrder = tempContrib[j].imported.order;
      const toBeCreatedOrder = tempContrib[j].toBeCreated.order;
      if (toBeCreatedOrder && importedOrder) {
        if (importedOrder === rowIndex && importedOrder !== toBeCreatedOrder) {
          tempContrib[j].imported.order = importedOrder - 1;
        } else if (importedOrder > rowIndex) {
          tempContrib[j].imported.order = importedOrder - 1;
        }
      }
    }
    setContributors(tempContrib);
  };

  function addContributor() {
    const newContributor = { ...emptyContributorWrapper };
    newContributor.imported.order = contributors.length + 1;
    newContributor.cristin.order = contributors.length + 1;
    newContributor.toBeCreated.order = contributors.length + 1;
    setContributors([...contributors, newContributor]);
  }

  const handleCloseDeleteConfirmDialog = (rowIndex: number) => {
    dispatch({ type: 'param', payload: rowIndex });
    setIsClosingDialogOpen(!isClosingDialogOpen);
  };

  function handleCloseContributorModal() {
    handleContributorModalClose();
    dispatch({ type: 'contributors', payload: contributors });
  }

  return (
    <>
      <StyledModal isOpen={isContributorModalOpen}>
        <ModalHeader toggle={handleCloseContributorModal}>Bidragsytere</ModalHeader>
        <ModalBody>
          <StyledContentWrapper>
            <StyledContributorHeader>
              <StyledOrderColumn>
                <StyledHeaderText>Rekkefølge</StyledHeaderText>
              </StyledOrderColumn>
              <StyledContributorColumn>
                <StyledHeaderText>Import-Forfatter</StyledHeaderText>
              </StyledContributorColumn>
              <StyledContributorColumn>
                <StyledHeaderText>Cristin-Forfatter</StyledHeaderText>
              </StyledContributorColumn>
            </StyledContributorHeader>
            <Divider />
            {isLoadingContributors ? (
              <CircularProgressWrapper>
                <CircularProgress />
              </CircularProgressWrapper>
            ) : (
              <StyledOrderedList>
                {contributors.map((row, index) => (
                  <li key={index} data-testid={`contributor-line-${index}`}>
                    <StyledContributorLineWrapper>
                      <StyledOrderColumn>
                        <ContributorOrderComponent
                          row={row}
                          contributors={contributors}
                          setContributors={setContributors}
                        />
                      </StyledOrderColumn>
                      <StyledContributorColumn>
                        <ImportContributorComponent row={row} handleChooseAuthor={handleChooseAuthor} />
                      </StyledContributorColumn>
                      <StyledContributorColumn>
                        <div>
                          <Contributor
                            contributorData={row}
                            resultListIndex={index}
                            updateContributor={updateContributor}
                            deleteContributor={handleCloseDeleteConfirmDialog}
                            handleChosenAuthorAffiliations={handleChosenAuthorAffiliations}
                          />
                        </div>
                      </StyledContributorColumn>
                    </StyledContributorLineWrapper>
                    <Divider />
                  </li>
                ))}
              </StyledOrderedList>
            )}
            <StyledContributorFooter>
              <Button
                variant="outlined"
                color="primary"
                onClick={addContributor}
                data-testid="add-contributor-button"
                startIcon={<AddIcon />}>
                Legg til bidragsyter
              </Button>
              <Button
                style={{ marginLeft: '1rem' }}
                variant="contained"
                color="primary"
                data-testid="contributor-back-button"
                onClick={handleCloseContributorModal}>
                Tilbake
              </Button>
            </StyledContributorFooter>
          </StyledContentWrapper>
        </ModalBody>
      </StyledModal>
      <ConfirmDialog
        doFunction={removeContributor}
        title={'Slett bidragsyter'}
        text={'Er du sikker på at du vil slette denne bidragsyteren?'}
        open={isClosingDialogOpen}
        handleClose={handleCloseDeleteConfirmDialog}
        handleCloseDialog={handleCloseDeleteConfirmDialog}
      />
    </>
  );
};

export default ContributorModal;
