import React, { useContext, useEffect, useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { Context } from '../../Context';
import {
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@material-ui/core';

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
  const [searchingForPlaces, setSearchingForPlaces] = useState(false);
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
    const fetchUnits = async () => {
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
    console.log('søker units på nytt');
    setUnits([]);
    fetchUnits().then();
  }, [inputValue, selectedLanguage]);

  useEffect(() => {
    const fetchPlaces = async () => {
      if (inputValue !== '') {
        setSearchingForPlaces(true);
        let response = await axios.get(
          process.env.REACT_APP_CRISREST_GATEKEEPER_URL +
            `/institutions?cristin_institution=false&lang=${selectedLanguage}&name=${inputValue}`,
          JSON.parse(localStorage.getItem('config'))
        );
        setSearchingForPlaces(false);
        let places = [];
        for (let i = 0; i < response.data.length; i++) {
          places.push({
            value: response.data[i].acronym,
            label: generateLanguageLabel(response.data[i].institution_name),
            cristinInstitutionNr: response.data[i].cristin_institution_id,
          });
        }
        setPlaces(places);
        setGroupOptions([
          { label: 'Cristin-institusjoner', options: state.institutions },
          { label: 'Annet', options: places },
        ]);
      }
    };
    fetchPlaces().then();
  }, [inputValue, selectedLanguage]);

  return (
    <div>
      <div style={{ display: 'flex', justifyConent: 'space-between' }}>
        <Typography style={{ fontSize: '1.2rem', marginBottom: '1rem' }} gutterBottom>
          Søk etter institusjon:
        </Typography>
        {searchingForPlaces && <CircularProgress size={'1rem'} />}
      </div>
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
      {units.length > 0 && (
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
    </div>
  );
}
