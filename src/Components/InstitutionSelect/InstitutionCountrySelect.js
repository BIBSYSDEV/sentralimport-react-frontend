import React, { useContext, useEffect, useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { Context } from '../../Context';
import { Card, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Typography } from '@material-ui/core';

const cardStyle = {
  overflow: 'visible',
  padding: '0.5rem',
  marginTop: '0.5rem',
};

const unitSelectStyle = {
  marginTop: '10px',
};

const langCodes = {
  NB: 'nb',
  EN: 'en',
};

export default function InstitutionCountrySelect(props) {
  let { state, dispatch } = useContext(Context);
  const [units, setUnits] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(langCodes.EN);
  const [places, setPlaces] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [groupOptions, setGroupOptions] = useState([
    { label: 'Cristin-institusjoner', options: state.institutions },
    { label: 'Annet', options: places },
  ]);

  const generateLanguageLabel = (name) => {
    const names = [];
    name.nb && names.push(name.nb);
    name.en && names.push(name.en);
    //NB. har ikke funnet en eneste post med flere navn, men det varierer hvilke språk som returneres.
    return names.join(' / ');
  };

  useEffect(() => {
    const getInstitutions = async () => {
      let response = await axios.get(
        process.env.REACT_APP_CRISREST_GATEKEEPER_URL +
          `/institutions?cristin_institution=true&lang=${selectedLanguage}&per_page=300`,
        JSON.parse(localStorage.getItem('config'))
      );
      response = response.data.filter((i) => i.cristin_user_institution);
      let institutions = [];
      for (let i = 0; i < response.length; i++) {
        institutions.push({
          value: response[i].acronym,
          label: selectedLanguage === langCodes.NB ? response[i].institution_name.nb : response[i].institution_name.en,
          cristinInstitutionNr: response[i].cristin_institution_id,
        });
      }
      setGroupOptions([
        { label: 'Cristin-institusjoner', options: institutions },
        { label: 'Annet', options: places },
      ]);
      await dispatch({ type: 'institutions', payload: institutions });
    };
    getInstitutions().then();
  }, [selectedLanguage]);

  useEffect(() => {
    const getUnits = async () => {
      if (props.institution.cristinInstitutionNr) {
        let response = await axios.get(
          process.env.REACT_APP_CRISREST_GATEKEEPER_URL +
            `/units?parent_unit_id=${props.institution.cristinInstitutionNr}.0.0.0&per_page=900&lang=${selectedLanguage}`,
          JSON.parse(localStorage.getItem('config'))
        );
        let units = [];
        for (let i = 0; i < response.data.length; i++) {
          if (
            response.data[i].hasOwnProperty('unit_name') &&
            (response.data[i].unit_name.nb || response.data[i].unit_name.en)
          ) {
            units.push({
              label: generateLanguageLabel(response.data[i].unit_name),
              value: response.data[i].cristin_unit_id,
            });
          }
        }
        setUnits(units);
      }
    };

    const fetchPlaces = async () => {
      if (inputValue !== '') {
        let response = await axios.get(
          process.env.REACT_APP_CRISREST_GATEKEEPER_URL +
            `/institutions?cristin_institution=false&lang=${selectedLanguage}&name=${inputValue}`,
          JSON.parse(localStorage.getItem('config'))
        );
        let places = [];
        for (let i = 0; i < response.data.length; i++) {
          places.push({
            value: response.data[i].acronym,
            label: generateLanguageLabel(response.data[i].institution_name),
            cristinInstitutionNr: response.data[i].cristin_institution_id,
          });
        }
        setPlaces(places);
      }
    };

    fetchPlaces().then();

    getUnits().then();
    setGroupOptions([
      { label: 'Cristin-institusjoner', options: state.institutions },
      { label: 'Annet', options: places },
    ]);
  }, [inputValue, selectedLanguage]);

  return (
    <Card variant="outlined" style={cardStyle}>
      <Typography style={{ fontSize: '1.2rem', marginBottom: '1rem' }} gutterBottom>
        Søk etter institusjon:
      </Typography>
      <FormControl component="fieldset">
        <FormLabel component="legend">Søkespråk</FormLabel>
        <RadioGroup
          row
          aria-label="Velg språk"
          name="language"
          value={selectedLanguage}
          onChange={(event) => {
            setSelectedLanguage(event.target.value);
            props.handleInstitutionChange('');
            props.handleUnitChange('');
          }}>
          <FormControlLabel value="nb" control={<Radio />} label="Norsk" />
          <FormControlLabel value="en" control={<Radio />} label="Engelsk" />
        </RadioGroup>
      </FormControl>
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
        value={props.institution}
      />
      {props.institution.value && units.length > 0 && (
        <div style={unitSelectStyle}>
          <Select
            placeholder="Søk på enheter"
            name="unitSelect"
            options={units}
            value={props.unit}
            onChange={props.handleUnitChange}
            isClearable
          />
        </div>
      )}
    </Card>
  );
}
