import React, { FC, useContext, useEffect, useState } from 'react';
import { Button, CircularProgress, Collapse, Grid, TextField, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { Autocomplete, AutocompleteChangeReason, FilterOptionsState } from '@material-ui/lab';
import { Context } from '../../Context';
import { Institution } from '../../types/InstitutionTypes';
import useDebounce from '../../utils/useDebounce';
import { searchForInstitutionsByName } from '../../api/institutionApi';
import { SearchLanguage } from '../../api/contributorApi';
import { ContributorWrapper } from '../../types/ContributorTypes';
import styled from 'styled-components';

const StyledCollapse = styled(Collapse)`
  margin-bottom: 1rem;
`;

function filterByInstitutionNameAndAcronym(
  options: Institution[],
  state: FilterOptionsState<Institution>
): Institution[] {
  return options.filter(
    (option) =>
      option.acronym?.toLowerCase().includes(state.inputValue.toLowerCase()) ||
      option.institution_name.nb?.toLowerCase().includes(state.inputValue.toLowerCase()) ||
      option.institution_name.en?.toLowerCase().includes(state.inputValue.toLowerCase())
  );
}

const sortInstitutions = (institutions: Institution[]) => {
  return institutions.slice().sort((institutionA, institutionB) => {
    if (institutionA.cristin_user_institution && !institutionB.cristin_user_institution) {
      return -1;
    } else if (!institutionA.cristin_user_institution && institutionB.cristin_user_institution) {
      return 1;
    } else if (institutionA.institution_name.en && institutionB.institution_name.en) {
      return institutionA.institution_name.en.localeCompare(institutionB.institution_name.en);
    } else if (institutionA.institution_name.nb && institutionB.institution_name.nb) {
      return institutionA.institution_name.nb.localeCompare(institutionB.institution_name.nb);
    } else if (institutionA.acronym && institutionB.acronym) {
      return institutionA.acronym.localeCompare(institutionB.acronym);
    } else {
      return 0;
    }
  });
};

interface AddAffiliationProps {
  contributorData: ContributorWrapper;
  updateContributor: (contributorData: ContributorWrapper, rowIndex: number) => void;
  resultListIndex: number;
}

const AddAffiliation: FC<AddAffiliationProps> = ({ contributorData, resultListIndex, updateContributor }) => {
  const { state } = useContext(Context);
  const [showAddAffiliationSelector, setShowAddAffiliationSelector] = useState(false);
  const [institutionsWithGlobalInstitutions, setInstitutionsWithGlobalInstitutions] = useState(
    state.globalInstitutions
  );
  const [institutionInputFieldValue, setInstitutionInputFieldValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  const debouncedInputValue = useDebounce(institutionInputFieldValue);
  const [errorFetchingAdditionalInstitutions, setErrorFetchingAdditionalInstitutions] = useState<Error | undefined>();
  const [addInstitutionError, setAddInstitutionError] = useState<Error | undefined>();

  useEffect(() => {
    const fetchAdditionalInstitutions = async () => {
      setLoading(true);
      try {
        const institutionsResponse = await searchForInstitutionsByName(institutionInputFieldValue, SearchLanguage.En);
        setInstitutionsWithGlobalInstitutions(
          sortInstitutions([...state.globalInstitutions, ...institutionsResponse.data])
        );
      } catch (error) {
        setErrorFetchingAdditionalInstitutions(error as Error);
      } finally {
        setLoading(false);
      }
    };
    if (debouncedInputValue.length > 1) {
      fetchAdditionalInstitutions().then();
    }
  }, [debouncedInputValue]);

  const handleSelectInstitutionClick = () => {
    try {
      setAddInstitutionError(undefined);
      addInstitution();
      setShowAddAffiliationSelector(false);
      setSelectedInstitution(null);
      setInstitutionInputFieldValue('');
    } catch (error) {
      setAddInstitutionError(error as Error);
    }
  };

  const addInstitution = () => {
    const institutionAlreadyExists = contributorData.toBeCreated.affiliations
      ? contributorData.toBeCreated.affiliations.some(
          (existingAffiliation) =>
            existingAffiliation.cristinInstitutionNr?.toString() ===
            selectedInstitution?.cristin_institution_id.toString()
        )
      : false;
    if (institutionAlreadyExists) {
      throw new Error('institusjonen finnes allerede fra før av');
    }
    if (selectedInstitution === null) {
      throw new Error('ingen institusjon valgt');
    }

    contributorData.toBeCreated.affiliations = [
      ...(contributorData.toBeCreated.affiliations ?? []),
      {
        institution: selectedInstitution,
        cristinInstitutionNr: selectedInstitution.cristin_institution_id,
        institutionName: selectedInstitution.institution_name.en ?? selectedInstitution.institution_name.nb,
        isCristinInstitution: true,
        countryCode: selectedInstitution.country,
      },
    ];
    updateContributor(contributorData, resultListIndex);
  };

  const handleAutoCompleteValueChange = (value: string | Institution | null, reason: AutocompleteChangeReason) => {
    if (!(value instanceof String) && reason !== 'clear') {
      setSelectedInstitution(value as Institution | null);
      if ((value as Institution).institution_name.en || (value as Institution).institution_name.nb) {
        setInstitutionInputFieldValue(
          (value as Institution).institution_name.en ?? (value as Institution).institution_name.nb
        );
      } else {
        setInstitutionInputFieldValue('');
      }
    } else {
      setInstitutionInputFieldValue('');
      setSelectedInstitution(null);
    }
  };

  return (
    <>
      {!showAddAffiliationSelector && (
        <Button
          data-testid={`show-institution-selector-${resultListIndex}`}
          startIcon={<AddIcon />}
          color="primary"
          onClick={() => {
            setShowAddAffiliationSelector(true);
            setAddInstitutionError(undefined);
            setErrorFetchingAdditionalInstitutions(undefined);
          }}>
          Legg til tilknytning
        </Button>
      )}
      <StyledCollapse in={showAddAffiliationSelector}>
        <Grid container spacing={2} justifyContent="flex-start" alignItems="baseline">
          <Grid item xs={12}>
            <Autocomplete
              loading={loading}
              value={selectedInstitution}
              onChange={(_event, value: any, reason) => {
                handleAutoCompleteValueChange(value, reason);
              }}
              onInputChange={(event, newInputValue, _reason) => {
                setInstitutionInputFieldValue(newInputValue);
              }}
              inputValue={institutionInputFieldValue}
              groupBy={(option) => (option.cristin_user_institution ? 'cristin-institusjoner' : 'annet')}
              noOptionsText="fant ingen institusjon"
              filterOptions={(options: Institution[], state) => filterByInstitutionNameAndAcronym(options, state)}
              renderOption={(option) => (
                <div data-testid={`${option.cristin_institution_id}-option`}>
                  <Typography>{option.institution_name.en ?? ''}</Typography>
                  <Typography variant="body2">{option.institution_name.nb ?? ''}</Typography>
                </div>
              )}
              getOptionLabel={(option) => option.institution_name.en ?? option.institution_name.nb}
              renderInput={(params) => (
                <TextField
                  {...params}
                  data-testid={`filter-institution-select-${resultListIndex}`}
                  multiline
                  label="Velg institusjon"
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading ? <CircularProgress color="inherit" size={'1rem'} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              options={sortInstitutions(institutionsWithGlobalInstitutions)}
            />
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item>
                <Button
                  variant="contained"
                  data-testid={`add-institution-button-${resultListIndex}`}
                  disabled={selectedInstitution === null}
                  onClick={handleSelectInstitutionClick}
                  color="primary">
                  bruk valgt institusjon
                </Button>
              </Grid>
              <Grid item>
                <Button onClick={() => setShowAddAffiliationSelector(false)} color="secondary">
                  Avbryt institusjonsvalg
                </Button>
              </Grid>
              {errorFetchingAdditionalInstitutions && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="error">
                    Noe gikk galt under henting av institusjoner: {errorFetchingAdditionalInstitutions.message}
                  </Typography>
                </Grid>
              )}
              {addInstitutionError && (
                <Grid item xs={12}>
                  <Typography data-testid={`add-institution-error-${resultListIndex}`} variant="body2" color="error">
                    {addInstitutionError.message}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </StyledCollapse>
    </>
  );
};

export default AddAffiliation;
