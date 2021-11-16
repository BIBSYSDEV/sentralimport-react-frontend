import React, { useContext, useState } from 'react';
import { Context } from '../../Context';
import { IconButton, TextField } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import styled from 'styled-components';
import { Colors } from '../../assets/styles/StyleConstants';

const StyledTextField = styled(TextField)`
  .MuiInputBase-root {
    background-color: ${Colors.WHITE};
  }
`;

export default function DoiTextField() {
  const { dispatch } = useContext(Context);
  const [doi, setDoi] = useState('');
  const [error, setError] = useState<string | undefined>();

  function handleDoiChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | null) {
    if (event === null || event.target.value === '') {
      setDoi('');
      dispatch({ type: 'doiFilter', payload: null });
      setError(undefined);
      return;
    } else if (event.target.value.trim().match(/^([0-9]{2})[.]([0-9]{4,5})[/]([a-z0-9-.]{1,})/i)) {
      dispatch({ type: 'doiFilter', payload: event.target.value.trim() });
      setError(undefined);
    } else {
      setError('skriv inn gyldig DOI');
    }
    setDoi(event.target.value.trim());
  }

  return (
    <StyledTextField
      error={!!error}
      data-testid="doi-filter"
      id="doiFilter"
      label="Søk på doi"
      fullWidth
      variant={'outlined'}
      onChange={handleDoiChange}
      value={doi}
      helperText={error}
      InputProps={{
        endAdornment: (
          <>
            {doi && (
              <IconButton onClick={() => handleDoiChange(null)}>
                <ClearIcon />
              </IconButton>
            )}
          </>
        ),
      }}
    />
  );
}
