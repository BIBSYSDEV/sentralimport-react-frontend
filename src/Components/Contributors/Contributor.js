import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, CircularProgress, FormGroup, TextField, Typography } from '@material-ui/core';
import InstitutionCountrySelect from '../InstitutionSelect/InstitutionCountrySelect';
import ContributorSearchPanel from './ContributorSearchPanel';
import { Form } from 'reactstrap';
import { Context } from '../../Context';
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

const StyledResultTypography = styled(Typography)`
  color: ${Colors.Text.OPAQUE_87_BLACK};
`;

function Contributor(props) {
  const { state } = useContext(Context);
  const [addDisabled, setAddDisabled] = useState(false);
  const [authorData, setAuthorData] = useState(props.author);
  const [selectedUnit, setSelectedUnit] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [openContributorSearchPanel, setOpenContributorSearchPanel] = useState(false);
  const [selectedInstitution, setSetSelectedInstitution] = useState({
    value: '',
    cristinInstitutionNr: 0,
  });

  useEffect(() => {
    setAuthorData(props.author);
  }, [props.author]);

  useEffect(() => {
    setSelectedUnit('');
    setSetSelectedInstitution('');
  }, [state.contributorPage]);

  function updateEditing() {
    const temp = authorData;
    temp.isEditing = true;

    props.updateData(temp, props.index);
  }

  async function handleSubmit() {
    const temp = JSON.parse(JSON.stringify(authorData));
    temp.isEditing = false;

    const cleanedAffiliations = await props.cleanUnknownInstitutions(temp.toBeCreated.affiliations);
    temp.toBeCreated.affiliations = removeInstitutionsDuplicatesBasedOnCristinId(cleanedAffiliations);

    await props.updateData(temp, props.index);
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
    let affiliationCopy = [...authorData.toBeCreated.affiliations];
    affiliationCopy.splice(index, 1);
    let temp = authorData;
    temp.toBeCreated.affiliations = affiliationCopy;

    props.updateData(temp, props.index);
  }

  function removeUnit(instIndex, unitIndex) {
    let affiliationCopy = [...authorData.toBeCreated.affiliations];
    affiliationCopy[instIndex].units.splice(unitIndex, 1);
    let temp = authorData;
    temp.toBeCreated.affiliations = affiliationCopy;

    props.updateData(temp, props.index);
  }

  function checkForUnit() {
    let affiliationCopy = [...authorData.toBeCreated.affiliations];
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

  function removeInstitutionsDuplicatesBasedOnCristinId(affiliations) {
    const cristinIdSet = new Set();
    return affiliations.filter((affiliation) => {
      if (cristinIdSet.has(affiliation.cristinInstitutionNr)) return false;
      cristinIdSet.add(affiliation.cristinInstitutionNr);
      return true;
    });
  }

  async function addInstitution() {
    setAddDisabled(true);
    let affiliationCopy = [...authorData.toBeCreated.affiliations];
    const { institutionName } = await getInstitutionName(
      selectedInstitution.cristinInstitutionNr,
      SearchLanguage.En,
      new Map()
    );

    let duplicate = 0;
    for (let i = 0; i < affiliationCopy.length; i++) {
      if (parseInt(affiliationCopy[i].cristinInstitutionNr) === parseInt(selectedInstitution.cristinInstitutionNr)) {
        duplicate++;

        //TODO: Why is institutionName set as unitName?? Ask somebody if they know, this doesn't make  any sense
        //Maybe linked to bug SMILE-1131?
        if (affiliationCopy[i].unitName !== institutionName) {
          affiliationCopy[i].unitName = institutionName;
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

    let temp = authorData;
    temp.toBeCreated.affiliations = removeInstitutionsDuplicatesBasedOnCristinId(affiliationCopy);

    props.updateData(temp, props.index);
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

    props.updateData(obj, props.index);
  }

  async function retrySearch(authorData) {
    setSearching(true);
    setSearchError(null);
    let unitNameCache = new Map();
    let institutionNameCache = new Map();
    try {
      const authorResults = await searchPersonDetailByName(
        `${authorData.toBeCreated.first_name} ${authorData.toBeCreated.surname}`
      );

      if (authorResults.data.length > 0) {
        const fetchedAuthors = [];
        for (let i = 0; i < authorResults.data.length; i++) {
          const resultAffiliations = [];
          const fetchedAuthor = await getPersonDetailById(authorResults.data[i]);
          if (fetchedAuthor && fetchedAuthor.affiliations) {
            const activeAffiliations = fetchedAuthor.affiliations.filter((affiliation) => affiliation.active);
            for (const activeAffiliation of activeAffiliations) {
              const detailedAffiliationAndCache = await getAffiliationDetails(
                activeAffiliation,
                unitNameCache,
                institutionNameCache
              );
              unitNameCache = detailedAffiliationAndCache.unitNameCache;
              institutionNameCache = detailedAffiliationAndCache.institutionNameCache;
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
    } catch (error) {
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

  function handleSelect(author) {
    let temp = authorData;

    temp.cristin = author;
    temp.cristin.isEditing = false;
    temp.cristin.order = props.index + 1;

    temp.toBeCreated = author;
    if (temp.toBeCreated.first_name_preferred) {
      temp.toBeCreated.first_name = temp.toBeCreated.first_name_preferred;
    }
    if (temp.toBeCreated.surname_preferred) {
      temp.toBeCreated.surname = temp.toBeCreated.surname_preferred;
    }
    temp.toBeCreated.isEditing = false;
    temp.toBeCreated.order = props.index + 1;

    temp.isEditing = false;

    setOpenContributorSearchPanel(false);
    props.updateData(temp, props.index);
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
            value={authorData.toBeCreated.first_name}
            margin="normal"
            onChange={(e) => handleChange(e, authorData, 'first')}
            required
          />
        </FormGroup>
        <FormGroup>
          <TextField
            id={'lastName' + props.index}
            label="Etternavn"
            value={authorData.toBeCreated.surname}
            margin="normal"
            onChange={(e) => handleChange(e, authorData, 'last')}
            required
          />
        </FormGroup>
        <FormGroup>
          <TextField
            id={'authorName' + props.index}
            label="Forfatternavn"
            value={
              authorData.toBeCreated.authorName
                ? authorData.toBeCreated.authorName
                : authorData.toBeCreated.surname + ', ' + authorData.toBeCreated.first_name
            }
            margin="normal"
            onChange={(e) => handleChange(e, authorData, 'authorName')}
          />
        </FormGroup>
        <div className={`metadata`}>
          {authorData.toBeCreated.affiliations
            .filter((item, number) => authorData.toBeCreated.affiliations.indexOf(item) === number)
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
              (authorData.toBeCreated.affiliations.filter((instNr) => {
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
            data-testid={`contributor-delete-button-form-${props.index}`}
            color="secondary"
            onClick={() => props.deleteContributor(props.index)}>
            Slett person
          </Button>
          <Button
            data-testid={`contributor-search-button-${props.index}`}
            onClick={() => retrySearch(authorData)}
            disabled={authorData.toBeCreated.first_name === '' || authorData.toBeCreated.surname === ''}>
            Søk igjen
          </Button>
          <Button data-testid={`contributor-save-button-${props.index}`} color="primary" onClick={() => handleSubmit()}>
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
          handleChoose={handleSelect}
          handleAbort={handleContributorSearchPanelClose}
        />
      </Form>
    );
  }

  return (
    <div className="content-wrapper">
      {!authorData.isEditing ? (
        <div data-testid={`contributor-for-import-wrapper-${props.index}`}>
          <Typography gutterBottom variant="h6">
            {authorData.toBeCreated.first_name + ' ' + authorData.toBeCreated.surname}
          </Typography>
          <div className={`metadata`}>
            {authorData.toBeCreated.affiliations.map((inst, instIndex) => (
              <div style={{ fontStyle: `italic`, fontSize: '0.9rem' }} key={instIndex}>
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
              onClick={() => props.deleteContributor(props.index)}>
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

export default Contributor;
