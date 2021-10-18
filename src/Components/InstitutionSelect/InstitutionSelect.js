import React, { useEffect } from 'react';

import Select from 'react-select';
import axios from 'axios';
import { Context } from '../../Context';

export default function InstitutionSelect(props) {
  const [institutions, setInstitutions] = React.useState('');
  let { state, dispatch } = React.useContext(Context);

  useEffect(() => {
    async function fetch() {
      await getInstitutions();
    }

    fetch();
  }, []);

  async function getInstitutions() {
    if (state.institutions === null) {
      let temp = await axios.get(
        process.env.REACT_APP_CRISREST_GATEKEEPER_URL + '/institutions?cristin_institution=true&lang=nb&per_page=300',
        JSON.parse(localStorage.getItem('config'))
      );

      temp = temp.data.filter((i) => i.cristin_user_institution);
      let institutions = [];
      for (let i = 0; i < temp.length; i++) {
        institutions.push({
          value: temp[i].acronym,
          label: temp[i].institution_name.nb,
          cristinInstitutionNr: temp[i].cristin_institution_id,
        });
      }
      setInstitutions(institutions);
      await dispatch({ type: 'institutions', payload: institutions });
    } else {
      setInstitutions(state.institutions);
    }
  }

  return (
    <Select
      placeholder="Søk på institusjoner"
      name="institutionSelect"
      options={institutions}
      className="basic-multi-select"
      classNamePrefix="select"
      onChange={props.onChange}
      aria-label="Velg institusjon"
      isClearable
    />
  );
}
