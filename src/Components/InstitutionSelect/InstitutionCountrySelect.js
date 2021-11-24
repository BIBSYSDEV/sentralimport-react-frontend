import React, { useContext, useEffect, useState } from 'react';
import Select from 'react-select';
import { CircularProgress, Typography } from '@material-ui/core';
import { Context } from '../../Context';
import CommonErrorMessage from '../CommonErrorMessage';
import { getParentsUnitName, searchForInstitutionsByName } from '../../api/institutionApi';
import { handlePotentialExpiredSession } from '../../api/api';

const searchLanguage = 'en';

export default function InstitutionCountrySelect(props) {
  let { state } = useContext(Context);
  const [units, setUnits] = useState([]);
  const [loadingError, setLoadingError] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [loadingUnits, setLoadingUnits] = useState(false);
  const [searchingForPlaces, setSearchingForPlaces] = useState(false);
  const [searchingForPlacesError, setSearchingForPlacesError] = useState();
  const [groupOptions, setGroupOptions] = useState([
    { label: 'Cristin-institusjoner', options: state.institutionsEnglish },
    { label: 'Annet', options: [] },
  ]);

  useEffect(() => {
    const fetchUnits = async () => {
      setLoadingError('');
      if (props.selectedInstitution.cristinInstitutionNr) {
        try {
          setLoadingUnits(true);
          const parentUnitNamesResponse = await getParentsUnitName(
            props.selectedInstitution.cristinInstitutionNr,
            searchLanguage
          );
          const units = parentUnitNamesResponse.data.map((parentUnitName) => ({
            label: parentUnitName.unit_name.en ?? parentUnitName.unit_name.nb,
            value: parentUnitName.cristin_unit_id,
          }));
          setUnits(units);
        } catch (err) {
          setLoadingError('Kunne ikke laste enheter');
        } finally {
          setLoadingUnits(false);
        }
      }
    };
    setUnits([]);
    fetchUnits().then();
  }, [inputValue, searchLanguage, props.selectedInstitution]);

  useEffect(() => {
    const fetchPlaces = async () => {
      if (inputValue !== '') {
        setSearchingForPlaces(true);
        setSearchingForPlacesError(undefined);
        try {
          const institutionsResponse = await searchForInstitutionsByName(inputValue, searchLanguage);
          const places = institutionsResponse.data.map((institution) => ({
            value: institution.acronym,
            label: institution.institution_name.en ?? institution.institution_name.nb,
            cristinInstitutionNr: institution.cristin_institution_id,
          }));
          setGroupOptions([
            { label: 'Cristin-institusjoner', options: state.institutionsEnglish },
            { label: 'Annet', options: places },
          ]);
        } catch (error) {
          handlePotentialExpiredSession(error);
          setSearchingForPlacesError(error);
        } finally {
          setSearchingForPlaces(false);
        }
      }
    };
    fetchPlaces().then();
  }, [inputValue, searchLanguage]);

  return (
    <div>
      <div style={{ display: 'flex', justifyConent: 'space-between' }}>
        <Typography style={{ fontSize: '1.2rem', marginBottom: '1rem' }} gutterBottom>
          Søk etter institusjon:
        </Typography>
        {searchingForPlaces && <CircularProgress size={'1rem'} />}
        {!searchingForPlaces && searchingForPlacesError && (
          <Typography color="error">Søket på institusjon feilet.</Typography>
        )}
      </div>
      <Select
        placeholder="Søk på institusjoner eller sted"
        name="institutionSelect"
        options={groupOptions}
        className="basic-multi-select"
        classNamePrefix="select"
        onChange={props.handleInstitutionChange}
        onInputChange={(event) => {
          setInputValue(event);
        }}
        aria-label="Institusjonsvelger"
        value={props.selectedInstitution}
      />
      {loadingUnits && <CircularProgress size={'1rem'} style={{ margin: '0.5rem' }} />}
      {loadingError && <CommonErrorMessage errorMessage={loadingError} />}
      {units.length > 0 ? (
        <div style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
          <Select
            placeholder="Søk på enheter"
            name="unitSelect"
            options={units}
            value={props.unit}
            onChange={props.handleUnitChange}
            isClearable
          />
        </div>
      ) : (
        props.selectedInstitution &&
        !loadingUnits && <Typography variant="caption">Institusjonen har ingen enheter</Typography>
      )}
    </div>
  );
}
