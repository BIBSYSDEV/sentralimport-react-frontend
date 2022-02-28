import React, { FC, useContext, useEffect, useState } from 'react';
import { Button, CircularProgress, Collapse, Grid, TextField, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { Autocomplete, FilterOptionsState } from '@material-ui/lab';
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

const StyledGridForAbortButton = styled(Grid)`
  display: grid;
  justify-content: end;
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

  //trigger institusjonssøk på endret inputvalue
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

  //lytter på endret institusjonsvalg
  useEffect(() => {
    if (selectedInstitution) {
      try {
        setAddInstitutionError(undefined);
        addInstitutionToContributorIfNotExists();
        setShowAddAffiliationSelector(false);
        setSelectedInstitution(null);
        setInstitutionInputFieldValue('');
      } catch (error) {
        setAddInstitutionError(error as Error);
      }
    }
  }, [selectedInstitution]);

  const addInstitutionToContributorIfNotExists = () => {
    if (selectedInstitution === null) {
      throw new Error('ingen institusjon valgt');
    }
    const institutionAlreadyExists =
      !!contributorData.toBeCreated.affiliations &&
      contributorData.toBeCreated.affiliations.some(
        (existingAffiliation) =>
          existingAffiliation.cristinInstitutionNr?.toString() ===
          selectedInstitution?.cristin_institution_id.toString()
      );
    if (institutionAlreadyExists) {
      throw new Error(`Institusjonen finnes allerede fra før`);
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
        <Grid container alignItems="center">
          <Grid item sm={9}>
            <Autocomplete
              loading={loading}
              value={selectedInstitution}
              onChange={(_event, value: Institution | null) => {
                setSelectedInstitution(value);
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
                  <Typography>
                    {option.institution_name.en ?? ''} ({option.country})
                  </Typography>
                  <Typography variant="body2">{option.institution_name.nb ?? ''}</Typography>
                </div>
              )}
              getOptionLabel={(option) => option.institution_name.en ?? option.institution_name.nb}
              renderInput={(params) => (
                <TextField
                  {...params}
                  data-testid={`filter-institution-select-${resultListIndex}`}
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
          <StyledGridForAbortButton item sm={3}>
            <Button onClick={() => setShowAddAffiliationSelector(false)} color="secondary">
              Avbryt
            </Button>
          </StyledGridForAbortButton>
        </Grid>
        {errorFetchingAdditionalInstitutions && (
          <Typography variant="body2" color="error">
            Noe gikk galt under henting av institusjoner: {errorFetchingAdditionalInstitutions.message}
          </Typography>
        )}
        {addInstitutionError && (
          <Typography data-testid={`add-institution-error-${resultListIndex}`} variant="body2" color="error">
            {addInstitutionError.message}
          </Typography>
        )}
      </StyledCollapse>
    </>
  );
};

export default AddAffiliation;
