import React, { useContext } from 'react';
import { Context } from '../../Context';
import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';
import styled from 'styled-components';

const StyledTextField = styled(TextField)`
  .MuiInputBase-root {
    background-color: white;
  }
`;

export default function InstitutionSelect() {
  const { state, dispatch } = useContext(Context);

  function handleChange(option: any) {
    if (option !== null) {
      dispatch({ type: 'setInstitution', payload: option });
    } else {
      const tempOption = { value: null, label: 'Ingen filtrering' };
      dispatch({ type: 'setInstitution', payload: tempOption });
    }
  }

  if (state.institutions) {
    return (
      <Autocomplete
        fullWidth
        id="institution-select"
        data-testid="insitution-select"
        options={state.institutions
          .slice()
          .sort((institutionA, institutionB) => institutionA.label.localeCompare(institutionB.label))}
        getOptionLabel={(option) => option.label}
        onChange={(_event, value) => {
          console.log(value);
          handleChange(value);
        }}
        renderInput={(params) => (
          <StyledTextField {...params} multiline label="Filtrer på institusjoner" variant="outlined" />
        )}
      />
    );
  }
  return <></>;
}
