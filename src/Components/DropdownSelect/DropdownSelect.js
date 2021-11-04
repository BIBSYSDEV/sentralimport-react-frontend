import React from 'react';
import Select from 'react-select';
import { Context } from '../../Context';

export default function DropdownSelect() {
  let { state, dispatch } = React.useContext(Context);

  let years = [];
  let currentYear = new Date().getFullYear();
  let currentDate = new Date();

  // Sjekk om dato er før/etter 1. april. Dersom dato er før, sett importår til årstall - 1 ellers bruk eksisterende årstall
  if (currentDate.getMonth() < 3) {
    currentYear = currentYear - 1;
  }

  for (let i = currentYear - 10; i <= currentYear; i++) {
    years.push({ value: i, label: i.toString() });
  }

  years.reverse();

  function handleChange(option) {
    dispatch({ type: 'setImportYear', payload: option });
  }

  return (
    <Select options={years} value={state.currentImportYear} onChange={handleChange} aria-label="Velg publiseringsår" />
  );
}
