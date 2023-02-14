import React, { useContext } from 'react';
import Select from 'react-select';
import { Context } from '../../Context';

export default function YearSelect() {
  const { state, dispatch } = useContext(Context);

  const years = [];
  const currentYear = new Date().getFullYear();
  // const currentDate = new Date();
  //
  // // Sjekk om dato er før/etter 1. april. Dersom dato er før, sett importår til årstall - 1 ellers bruk eksisterende årstall
  // if (currentDate.getMonth() < 3) {
  //   currentYear = currentYear - 1;
  // }

  for (let i = currentYear - 10; i <= currentYear; i++) {
    years.push({ value: i, label: i.toString() });
  }

  years.reverse();

  function handleChange(option: any) {
    dispatch({ type: 'setImportYear', payload: option });
  }

  return (
    <Select options={years} value={state.currentImportYear} onChange={handleChange} aria-label="Velg publiseringsår" />
  );
}
