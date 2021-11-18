import React, { useEffect } from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import axios from 'axios';
import { withSnackbar } from 'notistack';
import '../../assets/styles/Results.scss';
import { Context } from '../../Context';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import PersonIcon from '../../assets/icons/person-active.svg';
import InactivePersonIcon from '../../assets/icons/person-inactive.svg';
import ArrowUpIcon from '../../assets/icons/arrowhead-up3.svg';
import ArrowDownIcon from '../../assets/icons/arrowhead-down3.svg';
import { Button, TableFooter } from '@material-ui/core';

import ContributorPagination from '../ContributorPagination/ContributorPagination';
import Contributor from './Contributor';
import ClosingDialog from '../Dialogs/ClosingDialog';
import { CRIST_REST_API } from '../../utils/constants';
import { getInstitutionName, getPersonDetailById, SearchLanguage } from '../../api/contributorApi';
import ContributorSkeleton from './ContributorSkeleton';
import { getAffiliationDetails } from '../../utils/contributorUtils';

const searchLanguage = 'en';
const foreign_educational_institution_generic_code = 9127;
const other_institutions_generic_code = 9126;

function ContributorModal(props) {
  const { useRef, useLayoutEffect } = React;
  const [data, setData] = React.useState([]);
  const [fetched, setFetched] = React.useState(false);
  const [dialog, setDialog] = React.useState(false);

  let { state, dispatch } = React.useContext(Context);

  let countries = {};

  const firstUpdate = useRef(true);
  useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    handleTempSave();
  }, [data]);

  // useEffect(() => {
  //   return;
  // }, [state.contributorPage]);
  //TODO: MULIG KODE FOR Å TVINGE RENDRING

  useLayoutEffect(() => {
    async function fetch() {
      setFetched(false);

      let contributors = [];
      let cristinAuthors = [];
      let identified = [];

      let temp = JSON.parse(localStorage.getItem('tempContributors'));
      if (temp !== null && temp.pubId === props.data.pubId && temp.duplicate === props.duplicate) {
        contributors = temp.contributors;
      } else {
        if (props.duplicate === true) {
          cristinAuthors = state.selectedPublication.authors;
        } else if (props.duplicate === false) {
          cristinAuthors = await searchContributors(props.data.authors);
        }

        const imported = props.data.authors;

        for (let i = 0; i < Math.max(cristinAuthors.length, imported.length); i++) {
          if (props.duplicate && state.doSave) {
            if (i < cristinAuthors.length) {
              cristinAuthors[i].affiliations = await getDuplicateAffiliations(state.selectedPublication.authors[i]);
            } else {
              cristinAuthors[i] = defaultAuthor;
            }
          }
          identified[i] = cristinAuthors[i].identified_cristin_person;
          contributors[i] = {
            imported:
              imported.length > i
                ? {
                    cristin_person_id: imported[i].cristinId,
                    first_name: imported[i].firstname
                      ? imported[i].firstname
                      : imported[i].authorName.split(' ')[1].replace(',', ''),
                    surname: imported[i].surname
                      ? imported[i].surname
                      : imported[i].authorName.split(' ')[0].replace(',', ''),
                    authorName: imported[i].authorName ? imported[i].authorName : '',
                    order: imported[i].sequenceNr,
                    affiliations: imported[i].institutions,
                    role_code: imported[i].roleCode
                      ? imported[i].roleCode === 'FORFATTER'
                        ? 'AUTHOR'
                        : imported[i].roleCode
                      : 'AUTHOR',
                  }
                : defaultAuthor,
            cristin: cristinAuthors[i],
            toBeCreated: defaultAuthor,
          };

          contributors[i].isEditing = contributors[i].cristin.cristin_person_id === null;

          let copy =
            contributors[i].cristin === defaultAuthor
              ? Object.assign({}, contributors[i].imported)
              : Object.assign({}, contributors[i].cristin);
          contributors[i].toBeCreated =
            cristinAuthors[i].cristin_person_id !== null
              ? cristinAuthors[i]
              : {
                  ...copy,
                  affiliations: await fetchInstitutions(
                    props.duplicate ? cristinAuthors[i].affiliations : imported[i].institutions
                  ),
                };
        }
      }

      setData(contributors);
      dispatch({ type: 'setContributorsLoaded', payload: true });
      if (
        localStorage.getItem('tempContributors') === null ||
        localStorage.getItem('tempContributors').pubId !== props.data.pubId
      ) {
        let tempCon = {
          pubId: props.data.pubId,
          contributors: contributors,
          duplicate: props.duplicate,
        };
        localStorage.setItem('tempContributors', JSON.stringify(tempCon));
      }
      dispatch({ type: 'identified', payload: identified });
      dispatch({ type: 'identifiedImported', payload: identified });
      setFetched(true);

      let errors = [];

      for (let i = 0; i < contributors.length; i++) {
        if (
          !contributors[i].toBeCreated.first_name ||
          contributors[i].toBeCreated.first_name === '' ||
          !contributors[i].toBeCreated.surname ||
          contributors[i].toBeCreated.surname === '' ||
          contributors[i].toBeCreated.affiliations.length < 1
        ) {
          errors.push({ value: i + 1 });
        }
      }

      dispatch({ type: 'setContributorErrors', payload: errors });
    }

    fetch().then();
    handleTempSave();
  }, [props.data, props.open, state.selectedPublication]);

  function handleClose() {
    props.enqueueSnackbar(
      'Endringer er blitt lagret midlertidig. (Ved åpning av ny publikasjon vil endringer bli mistet)',
      {
        variant: 'warning',
      }
    );
    props.toggle();
    dispatch({ type: 'setContributorPage', payload: 0 });
    dispatch({ type: 'setContributorPerPage', payload: 5 });
    dispatch({ type: 'contributors', payload: data });
  }

  useEffect(() => {
    if (!props.duplicate) return;

    identifyCristinPerson().then();
  }, [state.contributorPerPage, state.contributorPage, data]);

  async function identifyCristinPerson() {
    if (!fetched) {
      return;
    }
    let identified = [];
    let identifiedImported = [];
    let start = state.contributorPage * state.contributorPerPage;
    for (let i = start; i < Math.min(start + state.contributorPerPage, data.length); i++) {
      if (
        !data[i].imported.identified_cristin_person &&
        data[i].imported.cristin_person_id !== null &&
        data[i].imported.cristin_person_id !== 0 &&
        i < data.length
      ) {
        let person = await getPersonDetailById(data[i].imported.cristin_person_id);
        identifiedImported[i] = person !== undefined ? person.data.identified_cristin_person : false;
      }
      if (!data[i].toBeCreated.identified_cristin_person && props.duplicate) {
        let person = await getPersonDetailById(data[i].toBeCreated.cristin_person_id);
        identified[i] = person !== undefined ? person.data.identified_cristin_person : false;
      }
    }
    dispatch({ type: 'identifiedImported', payload: identifiedImported });
    dispatch({ type: 'identified', payload: identified });
  }

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

  function handleSave() {
    props.enqueueSnackbar('Bidragsyterliste har blitt oppdatert.', {
      variant: 'success',
    });
    props.toggle();
    dispatch({ type: 'setContributorPage', payload: 0 });
    dispatch({ type: 'setContributorPerPage', payload: 5 });
    dispatch({ type: 'contributors', payload: data });
  }

  async function handleChooseAuthor(author) {
    const toBeCreatedOrder = author.toBeCreated.order;

    let copiedAffiliations = JSON.parse(JSON.stringify(author.imported.affiliations));

    let temp = [...data];
    //TODO: kjøre inst-sjekken  - som konverterer ukjente institutusjoner til landkoder
    temp[toBeCreatedOrder - 1].toBeCreated.affiliations = copiedAffiliations;
    temp[toBeCreatedOrder - 1].toBeCreated.first_name = author.imported.first_name;
    temp[toBeCreatedOrder - 1].toBeCreated.surname = author.imported.surname;
    temp[toBeCreatedOrder - 1].toBeCreated.authorName = author.imported.authorName;
    temp[toBeCreatedOrder - 1].toBeCreated.cristin_person_id = author.cristin.cristin_person_id
      ? author.cristin.cristin_person_id
      : author.imported.cristin_person_id;
    temp[toBeCreatedOrder - 1].isEditing = false;

    setData(temp);
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
          CRIST_REST_API + '/institutions/country/' + affiliations[i].countryCode + '?lang=' + searchLanguage,
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

  function handleTempSave() {
    let temp = {
      pubId: props.data.pubId,
      contributors: data,
      duplicate: props.duplicate,
    };
    if (state.doSave) {
      localStorage.setItem('tempContributors', JSON.stringify(temp));
    }
  }

  function handleOrder(author, up) {
    let copy = [...data];
    let index = author.toBeCreated.order - 1;
    let movedToOrder;
    if (up) {
      copy[index] = copy[index - 1];
      copy[index - 1] = author;

      movedToOrder = index;

      setData((prevObjs) =>
        prevObjs.map((o, i) => {
          if (i === index) {
            return {
              ...copy[i],
              toBeCreated: {
                ...copy[i].toBeCreated,
                order: index + 1,
              },
            };
          }
          if (i === index - 1) {
            return {
              ...copy[i],
              toBeCreated: {
                ...copy[i].toBeCreated,
                order: movedToOrder,
              },
            };
          }
          return copy[i];
        })
      );
      if (index / state.contributorPerPage === state.contributorPage) {
        dispatch({ type: 'setContributorPage', payload: state.contributorPage - 1 });
      }
    } else {
      copy[index] = copy[index + 1];
      copy[index + 1] = author;

      movedToOrder = index + 2;

      setData((prevObjs) =>
        prevObjs.map((o, i) => {
          if (i === index) {
            return {
              ...copy[i],
              toBeCreated: {
                ...copy[i].toBeCreated,
                order: index + 1,
              },
            };
          }
          if (i === index + 1) {
            return {
              ...copy[i],
              toBeCreated: {
                ...copy[i].toBeCreated,
                order: movedToOrder,
              },
            };
          }
          return copy[i];
        })
      );
      if (index + (1 % state.contributorPerPage) === 0) {
        dispatch({ type: 'setContributorPage', payload: state.contributorPage + 1 });
      }
    }
  }

  const updateContributor = (author, rowIndex) => {
    let temp = [...data];
    temp[rowIndex] = author;
    setData(temp);
  };

  // Ved sletting av en bidragsyter, sjekk om indeksering skal bli beholdt / oppdatert for alle andre elementer i bidragsyterlisten
  //TODO skriv om funksjonen slik at den blir enklere å lese
  //TODO Sjekk om alle edge-cases blir håndtert korrekt med tanke på rekkefølge i toBeCreated og imported (Sørg for at rekkefølgenummer på en gitt bidragsyter aldri blir mindre enn 1)
  const removeContributor = (rowIndex) => {
    let temp = [...data];
    temp.splice(rowIndex, 1);
    for (let i = rowIndex; i < temp.length; i++) {
      if (temp[i].imported.order === temp[i].toBeCreated.order && temp[i].imported.order >= rowIndex) {
        temp[i].imported.order = temp[i].imported.order - 1;
        temp[i].toBeCreated.order = temp[i].toBeCreated.order - 1;
      } else {
        if (temp[i].imported.order !== rowIndex) {
          if (temp[i].imported.order > rowIndex) {
            if (temp[i].imported.order > 0) {
              if (temp[i].imported.order < temp[i].toBeCreated.order) {
                temp[i].toBeCreated.order = temp[i].toBeCreated.order - 1;
              }
            } else {
              temp[i].toBeCreated.order = temp[i].toBeCreated.order - 1;
            }
          }
        }
      }
    }
    for (let j = 0; j < rowIndex; j++) {
      if (temp[j].imported.order === rowIndex && temp[j].imported.order !== temp[j].toBeCreated.order) {
        temp[j].imported.order = temp[j].imported.order - 1;
      } else if (temp[j].imported.order > rowIndex) {
        temp[j].imported.order = temp[j].imported.order - 1;
      }
    }
    setData(temp);
  };

  const toggle = (rowIndex) => {
    dispatch({ type: 'param', payload: rowIndex });
    setDialog(!dialog);
  };

  const getMainImage = () => {
    return PersonIcon;
  };
  const getArrowDownImage = () => {
    return ArrowDownIcon;
  };
  const getArrowUpImage = () => {
    return ArrowUpIcon;
  };
  const getInactiveImage = () => {
    return InactivePersonIcon;
  };

  function addContributor() {
    const temp = [...data];
    const newContributor = {
      imported: {
        order: temp.length + 1,
        affiliations: [],
        first_name: '',
        surname: '',
        cristin_person_id: 0,
        role_code: 'AUTHOR',
      },
      cristin: {
        order: temp.length + 1,
        affiliations: [],
        first_name: '',
        surname: '',
        cristin_person_id: 0,
        role_code: 'AUTHOR',
      },
      toBeCreated: {
        order: temp.length + 1,
        affiliations: [],
        first_name: '',
        surname: '',
        cristin_person_id: 0,
        role_code: 'AUTHOR',
      },
    };
    temp.push(newContributor);

    if (data.length / state.contributorPerPage === state.contributorPage + 1) {
      dispatch({ type: 'setContributorPage', payload: state.contributorPage + 1 });
    }

    setData(temp);
  }

  function createBody() {
    if (fetched) {
      return (
        <TableBody>
          {data
            .slice(
              state.contributorPage * state.contributorPerPage,
              (state.contributorPage + 1) * state.contributorPerPage
            )
            .map((row, i) => (
              <TableRow key={i} hover>
                <TableCell>
                  {row.toBeCreated.order === row.imported.order
                    ? row.imported.order
                    : row.imported.order + ' (' + row.toBeCreated.order + ')'}
                </TableCell>
                <TableCell style={{ width: '40%' }}>
                  <div className={`result contributor`}>
                    <div className="image-wrapper person">
                      <img
                        src={row.cristin.identified_cristin_person ? getMainImage() : getInactiveImage()}
                        alt={
                          row.cristin.identified_cristin_person
                            ? 'person identifisert i Cristin'
                            : 'person ikke identifisert i Cristin'
                        }
                      />
                    </div>
                    <div className="content-wrapper">
                      <h6>
                        {row.imported.surname && row.imported.first_name
                          ? row.imported.surname + ', ' + row.imported.first_name
                          : row.imported.authorName
                          ? row.imported.authorName
                          : null}
                      </h6>
                      <div className={`metadata`}>
                        {row.imported.affiliations.map((inst, j) => (
                          <p className={`italic`} key={j}>
                            {inst.countryCode ? inst.unitName + '  (' + inst.countryCode + ')' : inst.unitName}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                  {row.imported.surname && row.imported.first_name ? (
                    <Button color="primary" onClick={() => handleChooseAuthor(row)}>
                      Velg denne
                    </Button>
                  ) : null}
                </TableCell>
                <TableCell>
                  <div className={`result contributor`}>
                    <div className="image-wrapper person">
                      {row.toBeCreated.identified_cristin_person ? (
                        <img src={getMainImage()} alt="person identifisert i Cristin" />
                      ) : (
                        <img src={getInactiveImage()} alt="person ikke identifisert i Cristin" />
                      )}
                    </div>
                    <div className={`orderButtons`}>
                      {row.toBeCreated.order > 1 && row.toBeCreated.order < data.length ? (
                        <div>
                          <div>
                            <Button onClick={() => handleOrder(row, true)}>
                              <img src={getArrowUpImage()} alt="up-arrow" />
                            </Button>
                          </div>
                          <div>
                            <Button onClick={() => handleOrder(row, false)}>
                              <img src={getArrowDownImage()} alt="down-arrow" />
                            </Button>
                          </div>
                        </div>
                      ) : row.toBeCreated.order === data.length && data.length > 1 ? (
                        <Button onClick={() => handleOrder(row, true)}>
                          <img src={getArrowUpImage()} alt="up-arrow" />
                        </Button>
                      ) : row.toBeCreated.order < data.length ? (
                        <Button onClick={() => handleOrder(row, false)}>
                          <img src={getArrowDownImage()} alt="down-arrow" />
                        </Button>
                      ) : null}
                    </div>
                    <Contributor
                      author={row}
                      index={i + state.contributorPage * state.contributorPerPage}
                      updateData={updateContributor}
                      isOpen={props.open}
                      deleteContributor={toggle}
                      cleanUnknownInstitutions={handleChosenAuthorAffiliations}
                    />
                    <ClosingDialog
                      doFunction={removeContributor}
                      title={'Slett bidragsyter'}
                      text={'Er du sikker på at du vil slette denne bidragsyteren?'}
                      open={dialog}
                      handleClose={toggle}
                      handleCloseDialog={toggle}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          {state.contributorPage + 1 >= data.length / state.contributorPerPage ? (
            <TableRow>
              <TableCell>+</TableCell>
              <TableCell />
              <TableCell>
                <Button onClick={() => addContributor()}>Legg til bidragsyter</Button>
              </TableCell>
            </TableRow>
          ) : null}
          <ContributorPagination totalCount={data.length} />
        </TableBody>
      );
    } else {
      return <ContributorSkeleton />;
    }
  }

  return (
    <Modal isOpen={props.open} className={`contributorModal`}>
      <ModalHeader toggle={handleClose}>Bidragsytere</ModalHeader>
      <ModalBody>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Rekkefølge nummer</TableCell>
              <TableCell>Import-Forfatter</TableCell>
              <TableCell>Cristin-Forfatter</TableCell>
            </TableRow>
          </TableHead>
          {createBody()}
          <TableFooter>
            <TableRow>
              <TableCell />
              <TableCell />

              <TableCell align="right">
                <Button variant="contained" color="primary" onClick={() => handleSave()}>
                  Lagre
                </Button>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </ModalBody>
    </Modal>
  );
}

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
          CRIST_REST_API + '/institutions/country/' + inst.countryCode + '?lang=' + searchLanguage,
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
        } else {
          console.log(affiliations[i]);
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
        url: CRIST_REST_API + '/persons/' + person.cristin_person_id + '?lang=' + searchLanguage,
        isEditing: false,
        order: i + 1,
        identified_cristin_person: person.identified_cristin_person,
      };
    }
    suggestedAuthors[i] = person;
  }
  return suggestedAuthors;
}

const defaultAuthor = {
  cristin_person_id: null,
  identified_cristin_person: false,
  first_name: '',
  surname: '',
  order: 0,
  affiliations: [],
  url: null,
  isEditing: true,
};

export default withSnackbar(ContributorModal);
