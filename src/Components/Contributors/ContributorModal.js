import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import axios from 'axios';
import { Context } from '../../Context';
import { Button, CircularProgress, Divider, Typography } from '@material-ui/core';
import Contributor from './Contributor';
import ConfirmDialog from '../Dialogs/ConfirmDialog';
import { CRIST_REST_API } from '../../utils/constants';
import { getInstitutionName, getPersonDetailById, SearchLanguage } from '../../api/contributorApi';
import { getAffiliationDetails } from '../../utils/contributorUtils';
import styled from 'styled-components';
import AddIcon from '@material-ui/icons/Add';
import ContributorOrderComponent from './ContributorOrderComponent';
import ImportContributorComponent from './ImportContributorComponent';
import { defaultAuthor, emptyContributor } from '../../types/contributorTypes';
import { Colors } from '../../assets/styles/StyleConstants';

const foreign_educational_institution_generic_code = 9127;
const other_institutions_generic_code = 9126;

let countries = {};
async function fetchInstitutions(affiliations) {
  let arr = [];
  for (let i = 0; i < affiliations.length; i++) {
    let inst = affiliations[i];
    if (
      (inst.cristinInstitutionNr === foreign_educational_institution_generic_code ||
        inst.cristinInstitutionNr === other_institutions_generic_code ||
        inst.cristinInstitutionNr === 0) &&
      inst.countryCode
    ) {
      if (countries[inst.countryCode] === undefined) {
        let response = await axios.get(
          CRIST_REST_API + '/institutions/country/' + inst.countryCode + '?lang=' + SearchLanguage.En,
          JSON.parse(localStorage.getItem('config'))
        );
        if (response.data.length > 0) {
          inst = {
            cristinInstitutionNr: response.data[0].cristin_institution_id,
            institutionName:
              (response.data[0].institution_name.en || response.data[0].institution_name.nb) + ' (Ukjent institusjon)',
            countryCode: response.data[0].country,
            isCristinInstitution: response.data[0].isCristinInstitution,
          };
        }
        countries[inst.countryCode] = inst;
      } else {
        inst = countries[inst.countryCode];
      }
    }
    if (inst !== null) {
      arr.push(inst);
    }
  }
  return arr;
}

async function searchContributors(authors) {
  let unitNameCache = new Map();
  let institutionNameCache = new Map();
  let suggestedAuthors = [];
  for (let i = 0; i < authors.length; i++) {
    let person = defaultAuthor;
    let affiliations = [];
    if (authors[i].cristinId !== 0) {
      person = (await getPersonDetailById(authors[i].cristinId)).data;
      if (person.affiliations) {
        const activeAffiliations = person.affiliations.filter((affiliation) => affiliation.active);
        for (const activeAffiliation of activeAffiliations) {
          const detailedAffiliationAndCache = await getAffiliationDetails(
            activeAffiliation,
            unitNameCache,
            institutionNameCache
          );
          unitNameCache = detailedAffiliationAndCache.unitNameCache;
          institutionNameCache = detailedAffiliationAndCache.institutionNameCache;
          affiliations.push(detailedAffiliationAndCache.affiliation);
        }
      } else {
        affiliations = await fetchInstitutions(authors[i].institutions);
      }
      person = {
        cristin_person_id: person.cristin_person_id,
        first_name: person.first_name_preferred ?? person.first_name,
        surname: person.surname_preferred ?? person.surname,
        affiliations: affiliations.filter((item, index) => affiliations.indexOf(item) === index),
        url: CRIST_REST_API + '/persons/' + person.cristin_person_id + '?lang=' + SearchLanguage.En,
        isEditing: false,
        order: i + 1,
        identified_cristin_person: person.identified_cristin_person,
      };
    }
    suggestedAuthors[i] = person;
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

const StyledContributorLineWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
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

//todo : typescript

function ContributorModal(props) {
  //props = { importPublication, isContributorModalOpen, isDuplicate, handleContributorModalClose }
  const [contributors, setContributors] = useState([]);
  const [isLoadingContributors, setIsLoadingContributors] = useState(false);
  const [isClosingDialogOpen, setIsClosingDialogOpen] = useState(false);
  const { state, dispatch } = useContext(Context);

  let countries = {}; //TODO: countries både utenfor og inni mocalen.

  const firstUpdate = useRef(true);

  useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    handleSaveToLocalStorage();
  }, [contributors]);

  //TODO: denne må brytes ned - trigges på props.importPublication, props.isContributorModalOpen, state.selectedPublication
  useLayoutEffect(() => {
    async function fetch() {
      setIsLoadingContributors(true);

      let contributorsFromLocalStorage = [];
      let cristinAuthors = [];
      let identified = [];

      //TODO: Vi bør la være å bruke tempContributors som arbeidsminne.
      let tempContributors = JSON.parse(localStorage.getItem('tempContributors') || '{}');
      if (
        tempContributors !== null &&
        tempContributors.pubId === props.importPublication.pubId &&
        tempContributors.duplicate === props.isDuplicate
      ) {
        contributorsFromLocalStorage = tempContributors.contributors;
      } else {
        if (props.isDuplicate === true) {
          cristinAuthors = state.selectedPublication.authors;
        } else if (props.isDuplicate === false) {
          cristinAuthors = await searchContributors(props.importPublication.authors);
        }

        const authorsFromImportPublication = props.importPublication.authors;

        for (let i = 0; i < Math.max(cristinAuthors.length, authorsFromImportPublication.length); i++) {
          if (props.isDuplicate && state.doSave) {
            if (i < cristinAuthors.length) {
              cristinAuthors[i].affiliations = await getDuplicateAffiliations(state.selectedPublication.authors[i]);
            } else {
              cristinAuthors[i] = defaultAuthor;
            }
          }
          identified[i] = cristinAuthors[i].identified_cristin_person;
          contributorsFromLocalStorage[i] = {
            imported:
              authorsFromImportPublication.length > i
                ? {
                    cristin_person_id: authorsFromImportPublication[i].cristinId,
                    first_name: authorsFromImportPublication[i].firstname
                      ? authorsFromImportPublication[i].firstname
                      : authorsFromImportPublication[i].authorName.split(' ')[1].replace(',', ''),
                    surname: authorsFromImportPublication[i].surname
                      ? authorsFromImportPublication[i].surname
                      : authorsFromImportPublication[i].authorName.split(' ')[0].replace(',', ''),
                    authorName: authorsFromImportPublication[i].authorName
                      ? authorsFromImportPublication[i].authorName
                      : '',
                    order: authorsFromImportPublication[i].sequenceNr,
                    affiliations: authorsFromImportPublication[i].institutions,
                    role_code: authorsFromImportPublication[i].roleCode
                      ? authorsFromImportPublication[i].roleCode === 'FORFATTER'
                        ? 'AUTHOR'
                        : authorsFromImportPublication[i].roleCode
                      : 'AUTHOR',
                  }
                : defaultAuthor,
            cristin: cristinAuthors[i],
            toBeCreated: defaultAuthor,
          };

          contributorsFromLocalStorage[i].isEditing =
            contributorsFromLocalStorage[i].cristin.cristin_person_id === null;

          let copy =
            contributorsFromLocalStorage[i].cristin === defaultAuthor
              ? Object.assign({}, contributorsFromLocalStorage[i].imported)
              : Object.assign({}, contributorsFromLocalStorage[i].cristin);

          contributorsFromLocalStorage[i].toBeCreated =
            cristinAuthors[i].cristin_person_id !== null
              ? cristinAuthors[i]
              : {
                  ...copy,
                  affiliations: await fetchInstitutions(
                    props.isDuplicate ? cristinAuthors[i].affiliations : authorsFromImportPublication[i].institutions
                  ),
                };
        }
      }

      setContributors(contributorsFromLocalStorage);
      dispatch({ type: 'setContributorsLoaded', payload: true });
      if (
        localStorage.getItem('tempContributors') === null ||
        localStorage.getItem('tempContributors').pubId !== props.importPublication.pubId
      ) {
        let tempCon = {
          pubId: props.importPublication.pubId,
          contributors: contributorsFromLocalStorage,
          duplicate: props.isDuplicate,
        };
        localStorage.setItem('tempContributors', JSON.stringify(tempCon));
      }
      dispatch({ type: 'identified', payload: identified }); //skjer dette to steder ?
      dispatch({ type: 'identifiedImported', payload: identified });
      setIsLoadingContributors(false);

      // VALIDATION
      let errors = [];
      //TODO: replace  validation with formik and yup
      for (let i = 0; i < contributorsFromLocalStorage.length; i++) {
        if (
          !contributorsFromLocalStorage[i].toBeCreated.first_name ||
          contributorsFromLocalStorage[i].toBeCreated.first_name === '' ||
          !contributorsFromLocalStorage[i].toBeCreated.surname ||
          contributorsFromLocalStorage[i].toBeCreated.surname === '' ||
          contributorsFromLocalStorage[i].toBeCreated.affiliations.length < 1
        ) {
          errors.push({ value: i + 1 });
        }
      }

      dispatch({ type: 'setContributorErrors', payload: errors });
    }

    fetch().then();
    handleSaveToLocalStorage(); //TODO what!? den lagret jo akkurat noen linjer over?
  }, [props.importPublication, props.isContributorModalOpen, state.selectedPublication]);

  useEffect(() => {
    async function identifyCristinPersonsInContributors_And_CreateListOfIdentified() {
      if (!isLoadingContributors) {
        return;
      }
      let identified = [];
      let identifiedImported = [];
      for (let i = 0; i < contributors.length; i++) {
        if (
          !contributors[i].imported.identified_cristin_person &&
          contributors[i].imported.cristin_person_id !== null &&
          contributors[i].imported.cristin_person_id !== 0 &&
          i < contributors.length
        ) {
          let person = await getPersonDetailById(contributors[i].imported.cristin_person_id);
          identifiedImported[i] = person !== undefined ? person.data.identified_cristin_person : false;
        }
        if (!contributors[i].toBeCreated.identified_cristin_person && props.isDuplicate) {
          let person = await getPersonDetailById(contributors[i].toBeCreated.cristin_person_id);
          identified[i] = person !== undefined ? person.data.identified_cristin_person : false;
        }
      }
      dispatch({ type: 'identifiedImported', payload: identifiedImported });
      dispatch({ type: 'identified', payload: identified });
      //TODO: kan ikke dette ligge direkte på contributor-objektet isteden ?
    }
    if (!props.isDuplicate) return;
    identifyCristinPersonsInContributors_And_CreateListOfIdentified().then();
  }, [contributors]);

  async function getDuplicateAffiliations(author) {
    let institutionNameCache = new Map();
    let affiliations = [];
    for (let i = 0; i < author.affiliations.length; i++) {
      let index = affiliations.findIndex(
        (id) => id.cristinInstitutionNr === author.affiliations[i].institution.cristin_institution_id
      );
      if (index >= 0 && i !== index) {
        affiliations[index].units.push({
          unitNr: author.affiliations[i].unit.cristin_unit_id,
          unitName: author.affiliations[i].unit.unit_name['nb'],
        });
      } else {
        const institutionNameAndCache = await getInstitutionName(
          author.affiliations[i].institution.cristin_institution_id,
          SearchLanguage.En,
          institutionNameCache
        );
        institutionNameCache = institutionNameAndCache.cachedInstitutionResult;
        affiliations.push({
          cristinInstitutionNr: author.affiliations[i].institution.cristin_institution_id,
          institutionName: institutionNameAndCache.institutionName,
          isCristinInstitution:
            author.affiliations[i].institution.isCristinInstitution &&
            author.affiliations[i].institution.isCristinInstitution === true,
          units: [
            author.affiliations[i].unit
              ? {
                  unitNr: author.affiliations[i].unit.cristin_unit_id,
                  unitName: author.affiliations[i].unit.unit_name['nb'],
                }
              : null,
          ],
        });
      }
    }
    return affiliations;
  }

  async function handleChooseAuthor(author) {
    const toBeCreatedOrder = author.toBeCreated.order;

    let copiedAffiliations = JSON.parse(JSON.stringify(author.imported.affiliations));

    let temp = [...contributors];
    //TODO: kjøre inst-sjekken  - som konverterer ukjente institutusjoner til landkoder
    temp[toBeCreatedOrder - 1].toBeCreated.affiliations = copiedAffiliations;
    temp[toBeCreatedOrder - 1].toBeCreated.first_name = author.imported.first_name;
    temp[toBeCreatedOrder - 1].toBeCreated.surname = author.imported.surname;
    temp[toBeCreatedOrder - 1].toBeCreated.authorName = author.imported.authorName;
    temp[toBeCreatedOrder - 1].toBeCreated.cristin_person_id = author.cristin.cristin_person_id
      ? author.cristin.cristin_person_id
      : author.imported.cristin_person_id;
    temp[toBeCreatedOrder - 1].isEditing = false;

    setContributors(temp);
  }

  async function handleChosenAuthorAffiliations(affiliations) {
    let tempAffiliations = [];
    for (let i = 0; i < affiliations.length; i++) {
      let tempInst = affiliations[i];

      if (
        tempInst.countryCode &&
        (tempInst.cristinInstitutionNr === foreign_educational_institution_generic_code ||
          tempInst.cristinInstitutionNr === other_institutions_generic_code ||
          tempInst.cristinInstitutionNr === 0)
      ) {
        //bytter ut institusjon med instkode for nasjonalitet
        let response = await axios.get(
          CRIST_REST_API + '/institutions/country/' + affiliations[i].countryCode + '?lang=' + SearchLanguage.En,
          JSON.parse(localStorage.getItem('config'))
        );
        if (response.data.length > 0) {
          tempInst.institutionName =
            (response.data[0].institution_name.en || response.data[0].institution_name.nb) + ' (Ukjent institusjon)';
          tempInst.unitName =
            (response.data[0].institution_name.en || response.data[0].institution_name.nb) + ' (Ukjent institusjon)';
          tempInst.cristinInstitutionNr = response.data[0].cristin_institution_id
            ? response.data[0].cristin_institution_id
            : 0;
        }
        countries[tempInst.countryCode] = tempInst;
      }
      tempAffiliations.push(tempInst);
    }
    return tempAffiliations;
  }

  function handleSaveToLocalStorage() {
    if (state.doSave) {
      localStorage.setItem(
        'tempContributors',
        JSON.stringify({
          pubId: props.importPublication.pubId,
          contributors: contributors,
          duplicate: props.isDuplicate,
        })
      );
    }
  }

  const updateContributor = (author, rowIndex) => {
    let temp = [...contributors];
    temp[rowIndex] = author;
    setContributors(temp);
  };

  // Ved sletting av en bidragsyter, sjekk om indeksering skal bli beholdt / oppdatert for alle andre elementer i bidragsyterlisten
  //TODO skriv om funksjonen slik at den blir enklere å lese
  //TODO Sjekk om alle edge-cases blir håndtert korrekt med tanke på rekkefølge i toBeCreated og imported (Sørg for at rekkefølgenummer på en gitt bidragsyter aldri blir mindre enn 1)
  const removeContributor = (rowIndex) => {
    let tempContrib = [...contributors];
    tempContrib.splice(rowIndex, 1);
    for (let i = rowIndex; i < tempContrib.length; i++) {
      if (
        tempContrib[i].imported.order === tempContrib[i].toBeCreated.order &&
        tempContrib[i].imported.order >= rowIndex
      ) {
        tempContrib[i].imported.order = tempContrib[i].imported.order - 1;
        tempContrib[i].toBeCreated.order = tempContrib[i].toBeCreated.order - 1;
      } else {
        if (tempContrib[i].imported.order !== rowIndex) {
          if (tempContrib[i].imported.order > rowIndex) {
            if (tempContrib[i].imported.order > 0) {
              if (tempContrib[i].imported.order < tempContrib[i].toBeCreated.order) {
                tempContrib[i].toBeCreated.order = tempContrib[i].toBeCreated.order - 1;
              }
            } else {
              tempContrib[i].toBeCreated.order = tempContrib[i].toBeCreated.order - 1;
            }
          }
        }
      }
    }
    for (let j = 0; j < rowIndex; j++) {
      if (
        tempContrib[j].imported.order === rowIndex &&
        tempContrib[j].imported.order !== tempContrib[j].toBeCreated.order
      ) {
        tempContrib[j].imported.order = tempContrib[j].imported.order - 1;
      } else if (tempContrib[j].imported.order > rowIndex) {
        tempContrib[j].imported.order = tempContrib[j].imported.order - 1;
      }
    }
    setContributors(tempContrib);
  };

  function addContributor() {
    const newContributor = { ...emptyContributor };
    newContributor.imported.order = contributors.length + 1;
    newContributor.cristin.order = contributors.length + 1;
    newContributor.toBeCreated.order = contributors.length + 1;
    setContributors([...contributors, newContributor]);
  }

  const handleCloseDeleteConfirmDialog = (rowIndex) => {
    dispatch({ type: 'param', payload: rowIndex });
    setIsClosingDialogOpen(!isClosingDialogOpen);
  };

  function handleCloseContributorModal() {
    props.handleContributorModalClose();
    dispatch({ type: 'contributors', payload: contributors });
  }

  return (
    <>
      <StyledModal isOpen={props.isContributorModalOpen}>
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
              <CircularProgress />
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
                            author={row}
                            index={index}
                            updateData={updateContributor}
                            isOpen={props.isContributorModalOpen}
                            deleteContributor={handleCloseDeleteConfirmDialog}
                            cleanUnknownInstitutions={handleChosenAuthorAffiliations}
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
}

export default ContributorModal;
