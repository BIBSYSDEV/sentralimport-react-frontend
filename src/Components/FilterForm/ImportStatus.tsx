import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Typography } from '@material-ui/core';
import { Context } from '../../Context';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Colors } from '../../assets/styles/StyleConstants';
import { getImportStatisticsByYear } from '../../api/publicationApi';
import { PublicationCount } from '../../types/PublicationTypes';

const importedStyle = {
  display: 'flex',
  marginTop: '16px',
};

const labelStyle = {
  display: 'flex',
};

const StyledFormControl: any = styled(FormControl)`
  &.MuiFormControl-root {
    margin-top: 2rem;
    width: 100%;
    display: flex;
    align-items: flex-start;
  }
`;

const StyledTypography = styled(Typography)`
  color: ${Colors.Text.OPAQUE_87_BLACK};
`;

const StyledRadioGroup = styled(RadioGroup)`
  margin-left: 1rem;
  margin-top: 1rem;
`;

export default function ImportStatus() {
  const { state, dispatch } = useContext(Context);
  const [count, setCount] = useState<PublicationCount>();
  const history = useHistory();

  function handleStatusChange(event: ChangeEvent<HTMLInputElement>) {
    dispatch({ type: 'setImportStatus', payload: event.target.value });
  }

  useEffect(() => {
    async function getNumbers() {
      try {
        const publicationCount = await getImportStatisticsByYear(state.currentImportYear.value);
        setCount(publicationCount.data);
      } catch (error) {
        console.log(error);
        if (
          axios.isAxiosError(error) &&
          (!error.response || error.response.status === 401 || error.response.status === 403)
        ) {
          localStorage.setItem('authorized', 'false');
          history.push('/login');
        } else {
          history.push('/error');
        }
      }
    }
    getNumbers().then();
  }, [state.currentImportYear, state.totalCount]);

  return (
    <StyledFormControl component="fieldset">
      <FormLabel>
        <StyledTypography data-testid="import-status-total-quantity" variant="body1">
          Funnet for valgte år: <b>{count?.totalCount}</b>
        </StyledTypography>
      </FormLabel>
      <StyledRadioGroup
        aria-label="Importstatus"
        name="Importstatus"
        value={state.currentImportStatus}
        onChange={handleStatusChange}>
        <FormControlLabel
          value="false"
          control={<Radio />}
          label={
            <span style={labelStyle}>
              <div data-testid="import-status-not-imported">
                Ikke importert (<b>{count?.notImportedCount}</b>)
              </div>
            </span>
          }
        />
        <FormControlLabel
          value="true"
          control={<Radio />}
          label={
            <span style={importedStyle}>
              <p data-testid="import-status-imported">
                Importert (<b>{count?.importedCount}</b>)
              </p>
            </span>
          }
        />
        <FormControlLabel
          value="ikke aktuelle"
          control={<Radio />}
          label={
            <span style={labelStyle}>
              <div data-testid="import-status-not-relevant">
                Ikke aktuelle (<b>{count?.notRelevantCount}</b>)
              </div>
            </span>
          }
        />
      </StyledRadioGroup>
    </StyledFormControl>
  );
}
