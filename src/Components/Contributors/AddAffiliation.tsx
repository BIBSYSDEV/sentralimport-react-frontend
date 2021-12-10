import React, { useContext, useEffect, useState } from 'react';
import { Button, CircularProgress, Collapse, TextField, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { Autocomplete, FilterOptionsState } from '@material-ui/lab';
import { Context } from '../../Context';
import { Institution } from '../../types/InstitutionTypes';
import useDebounce from '../../utils/useDebounce';
import { searchForInstitutionsByName } from '../../api/institutionApi';
import { SearchLanguage } from '../../api/contributorApi';

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

const AddAffiliation = () => {
  const { state } = useContext(Context);
  const [showAddAffiliationSelector, setShowAddAffiliationSelector] = useState(false);
  const [institutionsWithGlobalInstitutions, setInstitutionsWithGlobalInstitutions] = useState(
    state.globalInstitutions
  );
  const [institutionInputFieldValue, setinstitutionInputFieldValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  const debouncedInputValue = useDebounce(institutionInputFieldValue);
  const [errorFetchingAdditionalInstitutions, setErrorFetchingAdditionalInstitutions] = useState<Error | undefined>();

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

  return (
    <>
      {!showAddAffiliationSelector && (
        <Button startIcon={<AddIcon />} color="primary" onClick={() => setShowAddAffiliationSelector(true)}>
          Legg til tilknyttning
        </Button>
      )}
      <Collapse in={showAddAffiliationSelector}>
        <Autocomplete
          value={selectedInstitution}
          onChange={(_event, value: any, reason) => {
            console.log('detecting change');
            setSelectedInstitution(value);
            if (reason === 'clear') {
              setinstitutionInputFieldValue('');
            } else {
              if (value && value.institution_name.en) {
                setinstitutionInputFieldValue(value.institution_name.en);
              } else if (value && value.institution_name.nb) {
                setinstitutionInputFieldValue(value.institution_name.nb);
              } else {
                setinstitutionInputFieldValue('');
              }
            }
          }}
          onInputChange={(event, newInputValue, _reason) => {
            setinstitutionInputFieldValue(newInputValue);
          }}
          freeSolo
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
              data-testid="filter-institution-select"
              multiline
              label="velg institusjon"
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
        {errorFetchingAdditionalInstitutions && (
          <Typography variant="caption" color="error">
            Noe gikk galt under henting av institusjoner: {errorFetchingAdditionalInstitutions.message}
          </Typography>
        )}
      </Collapse>
    </>
  );
};

export default AddAffiliation;
