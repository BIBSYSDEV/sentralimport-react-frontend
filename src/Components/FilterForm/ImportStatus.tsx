import React, { ChangeEvent, useEffect } from 'react';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Typography } from '@material-ui/core';
import { Context } from '../../Context';
import axios from 'axios';
import { PIA_REST_API } from '../../utils/constants';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Colors } from '../../assets/styles/StyleConstants';

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

interface CountData {
  totalCount: string;
  notImportedCount: string;
  notRelevantCount: string;
  importedCount: string;
}

export default function ImportStatus() {
  const { state, dispatch } = React.useContext(Context);
  const [prevYear, setPrevYear] = React.useState(0);
  const [data, setData] = React.useState<CountData>({
    totalCount: '',
    notImportedCount: '',
    notRelevantCount: '',
    importedCount: '',
  });
  const [prevCount, setPrevCount] = React.useState(state.totalCount);
  const history = useHistory();

  function handleStatusChange(event: ChangeEvent<HTMLInputElement>) {
    dispatch({ type: 'setImportStatus', payload: event.target.value });
  }

  useEffect(() => {
    async function getNumbers() {
      if (
        state.currentImportYear.value !== prevYear ||
        (state.totalCount !== prevCount && localStorage.getItem('config'))
      ) {
        await axios
          .get(
            PIA_REST_API + '/sentralimport/publicationCount/' + state.currentImportYear.value,
            JSON.parse(localStorage.getItem('config') ?? '{}')
          )
          .then((response) => {
            setData(response.data as CountData);
          })
          .catch(function (error) {
            console.log(error);
            if (!error.response || error.response.status === 401 || error.response.status === 403) {
              localStorage.setItem('authorized', 'false');
              history.push('/login');
            } else {
              history.push('/error');
            }
          });
        setPrevYear(state.currentImportYear.value);
        setPrevCount(state.totalCount);
      }
    }
    getNumbers().then();
  }, [state.currentImportYear, state.totalCount]);

  return (
    <StyledFormControl component="fieldset">
      <FormLabel>
        <StyledTypography data-testid="import-status-total-quantity" variant="body1">
          Funnet for valgte år: <b>{data.totalCount}</b>
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
                Ikke importert (<b>{data.notImportedCount}</b>)
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
                Importert (<b>{data.importedCount}</b>)
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
                Ikke aktuelle (<b>{data.notRelevantCount}</b>)
              </div>
            </span>
          }
        />
      </StyledRadioGroup>
    </StyledFormControl>
  );
}
