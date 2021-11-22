import React, { useContext } from 'react';
import { Context } from '../../Context';
import { Autocomplete, FilterOptionsState } from '@material-ui/lab';
import { TextField } from '@material-ui/core';
import styled from 'styled-components';
import { InstitutionSelector } from '../../types/ContextType';

const StyledTextField = styled(TextField)`
  .MuiInputBase-root {
    background-color: white;
  }
`;

//this function exists so that typing institution acronyms, also get their label. Ex. typing "ntnu", returns "norges tekninske naturvitenskapelige universitet"
function filterByInstitutionNameAndAcronym(
  options: InstitutionSelector[],
  state: FilterOptionsState<InstitutionSelector>
): InstitutionSelector[] {
  return options.filter(
    (option) =>
      option.label.toLowerCase().includes(state.inputValue.toLowerCase()) ||
      option.value.toLowerCase().includes(state.inputValue.toLowerCase())
  );
}

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
        noOptionsText="fant ingen institusjon"
        data-testid="insitution-select"
        filterOptions={(options: InstitutionSelector[], state) => filterByInstitutionNameAndAcronym(options, state)}
        options={state.institutions
          .slice()
          .sort((institutionA, institutionB) => institutionA.label.localeCompare(institutionB.label))}
        getOptionLabel={(option) => option.label}
        onChange={(_event, value) => {
          handleChange(value);
        }}
        renderInput={(params) => (
          <StyledTextField
            {...params}
            data-testid="filter-institution-select"
            multiline
            label="Filtrer på institusjoner"
            variant="outlined"
          />
        )}
      />
    );
  }
  return <></>;
}
