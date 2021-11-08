import React, { ChangeEvent, useEffect } from 'react';
import CardHeader from '@material-ui/core/CardHeader';
import { CardSubtitle } from 'reactstrap';
import { FormControl, FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import ExportIcon from '../../assets/icons/export-purple.png';
import DownloadIcon from '../../assets/icons/download-green.png';
import X2Icon from '../../assets/icons/x2-red.png';
import { Context } from '../../Context';
import axios from 'axios';
import { PIA_REST_API } from '../../utils/constants';
import { useHistory } from 'react-router-dom';

const imgStyle = {
  height: '22px',
  marginRight: '0.7rem',
};

const importedStyle = {
  display: 'flex',
  marginTop: '16px',
};

const labelStyle = {
  display: 'flex',
};

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
    <FormControl component="fieldset">
      <CardHeader title="Importstatus" />
      <CardSubtitle data-testid="import-status-total-quantity">Totalt antall: {data.totalCount}</CardSubtitle>
      <RadioGroup
        aria-label="Importstatus"
        name="Importstatus"
        value={state.currentImportStatus}
        onChange={handleStatusChange}>
        <FormControlLabel
          value="false"
          control={<Radio />}
          label={
            <span style={labelStyle}>
              <img src={ExportIcon} style={imgStyle} alt="Not imported" />
              <div data-testid="import-status-not-imported">Ikke importert ({data.notImportedCount})</div>
            </span>
          }
        />
        <FormControlLabel
          value="true"
          control={<Radio />}
          label={
            <span style={importedStyle}>
              <img src={DownloadIcon} style={imgStyle} alt="Imported" />
              <p data-testid="import-status-imported">Importert ({data.importedCount})</p>
            </span>
          }
        />
        <FormControlLabel
          value="ikke aktuelle"
          control={<Radio />}
          label={
            <span style={labelStyle}>
              <img src={X2Icon} style={imgStyle} alt="Not relevant" />
              <div data-testid="import-status-not-relevant">Ikke aktuelle ({data.notRelevantCount})</div>
            </span>
          }
        />
      </RadioGroup>
    </FormControl>
  );
}
