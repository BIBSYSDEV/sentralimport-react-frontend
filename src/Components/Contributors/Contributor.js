import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, FormGroup, TextField, Typography } from '@material-ui/core';
import InstitutionCountrySelect from '../InstitutionSelect/InstitutionCountrySelect';
import ContributorSearchPanel from './ContributorSearchPanel';
import { Form } from 'reactstrap';
import { Context } from '../../Context';
import axios from 'axios';
import { withSnackbar } from 'notistack';
import '../../assets/styles/common.scss';
import { CRIST_REST_API } from '../../utils/constants';
import {
  getInstitutionName,
  getInstitutionUnitNameBasedOnIDAndInstitutionStatus,
  getPersonDetailById,
  SearchLanguage,
  searchPersonDetailById,
  searchPersonDetailByName,
} from '../../api/contributorApi';

const searchLanguage = 'en';

function Contributor(props) {
  let { state } = useContext(Context);
  const [addDisabled, setAddDisabled] = useState(false);
  const [data, setData] = useState(props.author);
  const [rowIndex, setRowIndex] = useState(props.index);
  const [selectedUnit, setSelectedUnit] = useState('');
  const [searchResults, setSearchResults] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedInstitution, setSetSelectedInstitution] = useState({
    value: '',
    cristinInstitutionNr: 0,
  });

  useEffect(() => {
    setRowIndex(props.index);
    setData(props.author);
  }, [props.author]);

  useEffect(() => {
    setSelectedUnit('');
    setSetSelectedInstitution('');
  }, [state.contributorPage]);

  function updateEditing() {
    let temp = data;
    temp.isEditing = true;

    props.updateData(temp, rowIndex);
  }

  async function handleSubmit() {
    let temp = JSON.parse(JSON.stringify(data));
    temp.isEditing = false;

    let cleanedAffiliations = await props.cleanUnknownInstitutions(temp.toBeCreated.affiliations);
    temp.toBeCreated.affiliations = await filterInstitutions(cleanedAffiliations);

    await props.updateData(temp, rowIndex);
    setSetSelectedInstitution({
      value: '',
      cristinInstitutionNr: 0,
    });
  }

  function handleUnitChange(unit) {
    setSelectedUnit(unit);
  }

  function handleInstitutionChange(institution) {
    setSetSelectedInstitution(institution);
    setSelectedUnit('');
  }

  function removeInstitution(index) {
    let affiliationCopy = [...data.toBeCreated.affiliations];
    affiliationCopy.splice(index, 1);
    let temp = data;
    temp.toBeCreated.affiliations = affiliationCopy;

    props.updateData(temp, rowIndex);
  }

  function removeUnit(instIndex, unitIndex) {
    let affiliationCopy = [...data.toBeCreated.affiliations];
    affiliationCopy[instIndex].units.splice(unitIndex, 1);
    let temp = data;
    temp.toBeCreated.affiliations = affiliationCopy;

    props.updateData(temp, rowIndex);
  }

  function checkForUnit() {
    let affiliationCopy = [...data.toBeCreated.affiliations];
    let duplicate = 0;
    if (selectedUnit) {
      for (let i = 0; i < affiliationCopy.length; i++) {
        if (affiliationCopy[i].units) {
          for (let h = 0; h < affiliationCopy[i].units.length; h++) {
            if (affiliationCopy[i].units[h].unitNr === selectedUnit.value) {
              duplicate++;
            }
          }
        }
      }

      return duplicate > 0;
    }
  }

  async function filterInstitutions(affiliations) {
    //TODO: bruk filter isteden
    for (let i = 0; i < affiliations.length - 1; i++) {
      if (affiliations[i].cristinInstitutionNr === affiliations[i + 1].cristinInstitutionNr) {
        affiliations.splice(i, 1);
        i--;
      }
    }

    return affiliations;
  }

  async function addInstitution() {
    setAddDisabled(true);
    let affiliationCopy = [...data.toBeCreated.affiliations];
    let fetchedInstitution = await axios.get(
      CRIST_REST_API + '/institutions/' + selectedInstitution.cristinInstitutionNr + '?lang=' + searchLanguage,
      JSON.parse(localStorage.getItem('config'))
    );

    let duplicate = 0;
    for (let i = 0; i < affiliationCopy.length; i++) {
      if (parseInt(affiliationCopy[i].cristinInstitutionNr) === parseInt(selectedInstitution.cristinInstitutionNr)) {
        duplicate++;

        if (affiliationCopy[i].unitName !== fetchedInstitution.data.institution_name.en) {
          affiliationCopy[i].unitName = fetchedInstitution.data.institution_name.en;
        }
      }
    }
    if (duplicate < 1) {
      affiliationCopy.push({
        institutionName: selectedInstitution.label,
        cristinInstitutionNr: selectedInstitution.cristinInstitutionNr,
        isCristinInstitution: true,
      });
    }

    if (selectedUnit) {
      affiliationCopy = addUnit(affiliationCopy);
    }

    let temp = data;
    temp.toBeCreated.affiliations = await filterInstitutions(affiliationCopy);

    props.updateData(temp, rowIndex);
    setAddDisabled(false);
  }

  function addUnit(affiliationCopy) {
    for (let i = 0; i < affiliationCopy.length; i++) {
      if (parseInt(affiliationCopy[i].cristinInstitutionNr) === parseInt(selectedInstitution.cristinInstitutionNr)) {
        if (affiliationCopy[i].units) {
          affiliationCopy[i].units.push({
            unitName: selectedUnit.label,
            unitNr: selectedUnit.value,
          });
        } else {
          affiliationCopy[i].units = [];
          affiliationCopy[i].units.push({
            unitName: selectedUnit.label,
            unitNr: selectedUnit.value,
          });
        }
      }
    }
    return affiliationCopy;
  }

  function handleChange(event, obj, property) {
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

    props.updateData(obj, rowIndex);
  }

  async function retrySearch(data) {
    let unitNameCache = new Map();
    let institutionNameCache = new Map();
    try {
      const authorResults =
        data.imported.cristin_person_id && data.imported.cristin_person_id !== 0
          ? await searchPersonDetailById(data.imported.cristin_person_id)
          : await searchPersonDetailByName(`${data.toBeCreated.first_name} ${data.toBeCreated.surname}`);

      if (authorResults.data.length > 0) {
        let fetchedAuthors = [];
        let tempAffiliations = [];
        for (let i = 0; i < authorResults.data.length; i++) {
          const fetchedAuthor = (await getPersonDetailById(authorResults.data[i].cristin_person_id)).data;
          const activeAffiliations = fetchedAuthor.affiliations.filter((affiliation) => affiliation.active);
          for (let h = 0; h < activeAffiliations.length; h++) {
            const institutionNameAndCache = await getInstitutionName(
              activeAffiliations[h].institution.cristin_institution_id,
              SearchLanguage.En,
              institutionNameCache
            );
            institutionNameCache = institutionNameAndCache.cachedInstitutionResult;
            const unitNameAndCache = await getInstitutionUnitNameBasedOnIDAndInstitutionStatus(
              activeAffiliations[h],
              unitNameCache
            );
            unitNameCache = unitNameAndCache.cache;
            tempAffiliations[h] = {
              institutionName: institutionNameAndCache.institutionName,
              cristinInstitutionNr: activeAffiliations[h].institution.cristin_institution_id,
              isCristinInstitution: true,
              units: [
                {
                  unitName: unitNameAndCache.unitName,
                  unitNr: activeAffiliations[h].unit ? activeAffiliations[h].unit.cristin_unit_id : '',
                },
              ],
            };
          }
          fetchedAuthor.affiliations = await filterInstitutions(tempAffiliations);
          fetchedAuthors.push(fetchedAuthor);
        }
        props.enqueueSnackbar('Fant ' + fetchedAuthors.length + ' bidragsytere', { variant: 'success' });
        setSearchResults(fetchedAuthors);
        handleOpen();
      } else {
        props.enqueueSnackbar('Fant ingen bidragsytere', { variant: 'error' });
      }
    } catch {
      props.enqueueSnackbar('Noe gikk galt med søket, prøv igjen', { variant: 'error' });
    }
  }

  function handleOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    if (searchResults !== '') {
      setSearchResults('');
    }
  }

  function handleSelect(author) {
    let temp = data;

    temp.cristin = author;
    temp.cristin.isEditing = false;
    temp.cristin.order = rowIndex + 1;

    temp.toBeCreated = author;
    if (temp.toBeCreated.first_name_preferred) {
      temp.toBeCreated.first_name = temp.toBeCreated.first_name_preferred;
    }
    if (temp.toBeCreated.surname_preferred) {
      temp.toBeCreated.surname = temp.toBeCreated.surname_preferred;
    }
    temp.toBeCreated.isEditing = false;
    temp.toBeCreated.order = rowIndex + 1;

    temp.isEditing = false;

    setOpen(false);
    props.updateData(temp, rowIndex);
  }

  function editInstitution(inst) {
    let tempInst = {
      value: inst.cristinInstitutionNr,
      label: inst.institutionName,
      cristinInstitutionNr: inst.cristinInstitutionNr,
    };
    handleInstitutionChange(tempInst);
  }

  function displayAuthorForm() {
    return (
      <Form data-testid={`contributor-form-${props.index}`}>
        <FormGroup>
          <TextField
            id={'firstName' + props.index}
            label="Fornavn"
            value={data.toBeCreated.first_name}
            margin="normal"
            onChange={(e) => handleChange(e, data, 'first')}
            required
          />
        </FormGroup>
        <FormGroup>
          <TextField
            id={'lastName' + props.index}
            label="Etternavn"
            value={data.toBeCreated.surname}
            margin="normal"
            onChange={(e) => handleChange(e, data, 'last')}
            required
          />
        </FormGroup>
        <FormGroup>
          <TextField
            id={'authorName' + props.index}
            label="Forfatternavn"
            value={
              data.toBeCreated.authorName
                ? data.toBeCreated.authorName
                : data.toBeCreated.surname + ', ' + data.toBeCreated.first_name
            }
            margin="normal"
            onChange={(e) => handleChange(e, data, 'authorName')}
          />
        </FormGroup>
        <div className={`metadata`}>
          {data.toBeCreated.affiliations
            .filter((item, number) => data.toBeCreated.affiliations.indexOf(item) === number)
            .map((inst, index) => (
              <Card variant="outlined" key={index} style={{ padding: '0.5rem', marginBottom: '0.5rem' }}>
                <Typography style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>{inst.institutionName}</Typography>
                {inst.units && (
                  <ul style={{ marginBottom: 0 }}>
                    {inst.units.map(
                      (unit, unitIndex) =>
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
            aria-label={'Institusjonsvelger ' + props.index}
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
              selectedInstitution.cristinInstitutionNr === 0 ||
              (data.toBeCreated.affiliations.filter((instNr) => {
                return parseInt(selectedInstitution.cristinInstitutionNr) === parseInt(instNr.cristinInstitutionNr);
              }).length > 0 &&
                !selectedUnit) ||
              (selectedUnit !== '' ? checkForUnit() : null)
            }>
            OK
          </Button>
        </Card>
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            data-testid={`contributor-delete-button-${props.index}`}
            color="secondary"
            onClick={() => props.deleteContributor(rowIndex)}>
            Slett person
          </Button>
          <Button
            data-testid={`contributor-search-button-${props.index}`}
            onClick={() => retrySearch(data)}
            disabled={data.toBeCreated.first_name === '' || data.toBeCreated.surname === ''}>
            Søk igjen
          </Button>
          <Button data-testid={`contributor-save-button-${props.index}`} color="primary" onClick={() => handleSubmit()}>
            Lagre endringer
          </Button>
        </div>
        <ContributorSearchPanel
          collapsed={open}
          data={searchResults}
          handleChoose={handleSelect}
          handleAbort={handleClose}
        />
      </Form>
    );
  }

  return (
    <div className="content-wrapper">
      {!data.isEditing ? (
        <div data-testid={`contributor-for-import-wrapper-${props.index}`}>
          <h6>{data.toBeCreated.surname + ', ' + data.toBeCreated.first_name}</h6>
          <div className={`metadata`}>
            {data.toBeCreated.affiliations.map((inst, instIndex) => (
              <div style={{ fontStyle: 'italic' }} key={instIndex}>
                <p key={instIndex}>{inst.institutionName}</p>
                <ul style={{ marginBottom: '0.3rem' }}>
                  {inst.units &&
                    inst.units.map(
                      (unit, unitIndex) =>
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
            <Button data-testid={`contributor-edit-button-${props.index}`} color="primary" onClick={updateEditing}>
              Rediger
            </Button>
            <Button
              data-testid={`contributor-delete-button-${props.index}`}
              color="secondary"
              onClick={() => props.deleteContributor(rowIndex)}>
              Slett person
            </Button>
          </div>
        </div>
      ) : (
        displayAuthorForm()
      )}
    </div>
  );
}

export default withSnackbar(Contributor);
