import React, { useContext } from 'react';
import Select from 'react-select';
import { Context } from '../../Context';

export default function InstitutionSelect(props) {
  let { state } = useContext(Context);

  return (
    <Select
      placeholder="Søk på institusjoner"
      name="institutionSelect"
      options={state.institutions}
      onChange={props.onChange}
      aria-label="Velg institusjon"
      isClearable
      menuPortalTarget={document.body}
    />
  );
}
