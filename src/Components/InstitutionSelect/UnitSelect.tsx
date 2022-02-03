import React, { FC, useState } from 'react';
import { Autocomplete, FilterOptionsState } from '@material-ui/lab';
import { SimpleUnitResponse } from '../../types/InstitutionTypes';
import styled from 'styled-components';
import { TextField, Typography } from '@material-ui/core';

const StyledTextField = styled(TextField)`
  .MuiInputBase-root {
    background-color: white;
  }
`;

function filterByUnitNameAndAcronym(
  options: SimpleUnitResponse[],
  state: FilterOptionsState<SimpleUnitResponse>
): SimpleUnitResponse[] {
  return options.filter(
    (option) =>
      option.acronym?.toLowerCase().includes(state.inputValue.toLowerCase()) ||
      option.unit_name.nb?.toLowerCase().includes(state.inputValue.toLowerCase()) ||
      option.unit_name.en?.toLowerCase().includes(state.inputValue.toLowerCase())
  );
}
interface UnitSelectProps {
  handleUnitChange: any;
  units: SimpleUnitResponse[];
}

const UnitSelect: FC<UnitSelectProps> = ({ handleUnitChange, units }) => {
  const [selectedUnit, setSelectedUnit] = useState<SimpleUnitResponse | null>(null);

  return (
    <Autocomplete
      defaultValue={null}
      fullWidth
      value={selectedUnit}
      id="unit-select"
      noOptionsText="fant ingen enhet"
      data-testid="unit-select"
      getOptionSelected={(option, value) => {
        if (value) {
          return option.cristin_unit_id === value.cristin_unit_id;
        } else return false;
      }}
      filterOptions={(options: SimpleUnitResponse[], state) => filterByUnitNameAndAcronym(options, state)}
      options={units
        .slice()
        .sort((unitA, unitB) => (unitA.unit_name.en ? unitA.unit_name.en.localeCompare(unitB.unit_name.en ?? '') : 0))}
      getOptionLabel={(option) => option.unit_name.en ?? ''}
      renderOption={(option) => (
        <div
          data-testid={`${
            option.unit_name.en ? option.unit_name.en.replaceAll(' ', '-') : option.unit_name.nb.replaceAll(' ', '-')
          }-option`}>
          <Typography>{option.unit_name.en}</Typography>
          <Typography variant="body2">{option.unit_name.nb}</Typography>
        </div>
      )}
      onChange={(_event, value) => {
        setSelectedUnit(value);
        handleUnitChange(value);
      }}
      renderInput={(params) => (
        <StyledTextField {...params} data-testid="filter-unit-select" multiline label="velg enhet" variant="outlined" />
      )}
    />
  );
};

export default UnitSelect;
