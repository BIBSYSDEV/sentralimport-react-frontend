import React, { useContext, useEffect, useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { CircularProgress, Typography } from '@material-ui/core';
import { Context } from '../../Context';

const searchLanguage = 'en';

export default function InstitutionCountrySelect(props) {
  let { state } = useContext(Context);
  const [units, setUnits] = useState([]);
  const [places, setPlaces] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loadingUnits, setLoadingUnits] = useState(false);
  const [searchingForPlaces, setSearchingForPlaces] = useState(false);
  const [groupOptions, setGroupOptions] = useState([
    { label: 'Cristin-institusjoner', options: state.institutionsEnglish },
    { label: 'Annet', options: places },
  ]);

  useEffect(() => {
    const fetchUnits = async () => {
      if (props.selectedInstitution.cristinInstitutionNr) {
        try {
          setLoadingUnits(true);
          let response = await axios.get(
            process.env.REACT_APP_CRISREST_GATEKEEPER_URL +
              `/units?parent_unit_id=${props.selectedInstitution.cristinInstitutionNr}.0.0.0&per_page=900&lang=${searchLanguage}`,
            JSON.parse(localStorage.getItem('config'))
          );
          let units = [];
          for (let i = 0; i < response.data.length; i++) {
            if (
              response.data[i].hasOwnProperty('unit_name') &&
              (response.data[i].unit_name.en || response.data[i].unit_name.nb)
            ) {
              units.push({
                label: response.data[i].unit_name.en || response.data[i].unit_name.nb,
                value: response.data[i].cristin_unit_id,
              });
            }
          }
          setUnits(units);
        } catch (err) {
          props.enqueueSnackbar('Kunne ikke laste enheter', { variant: 'error' });
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
        let response = await axios.get(
          process.env.REACT_APP_CRISREST_GATEKEEPER_URL +
            `/institutions?cristin_institution=false&lang=${searchLanguage}&name=${inputValue}`,
          JSON.parse(localStorage.getItem('config'))
        );
        setSearchingForPlaces(false);
        let places = [];
        for (let i = 0; i < response.data.length; i++) {
          places.push({
            value: response.data[i].acronym,
            label: response.data[i].institution_name.en || response.data[i].institution_name.nb,
            cristinInstitutionNr: response.data[i].cristin_institution_id,
          });
        }
        setPlaces(places);
        setGroupOptions([
          { label: 'Cristin-institusjoner', options: state.institutionsEnglish },
          { label: 'Annet', options: places },
        ]);
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
      {units.length > 0 ? (
        <div style={{ marginTop: '0.5rem', marginMottom: '0.5rem' }}>
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
