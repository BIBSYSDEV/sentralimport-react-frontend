import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import { green, red } from '@material-ui/core/colors';
import InstitutionSelect from '../InstitutionSelect/InstitutionSelect';

import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
} from '@material-ui/core';
import { Context } from '../../Context';
import DownloadIcon from '../../assets/icons/download-green.png';
import ExportIcon from '../../assets/icons/export-purple.png';
import X2Icon from '../../assets/icons/x2-red.png';
import ClearIcon from '@material-ui/icons/Clear';

const useStyles = makeStyles((theme) => ({
  root: {
    overflowX: 'visible',
    overflowY: 'visible',
  },
  card: {
    marginTop: 25,
    marginLeft: 10,
    [theme.breakpoints.down('md')]: {
      marginLeft: 0,
    },
  },
  media: {
    height: 0,
    paddingTop: '54.25%', // 16:9
  },
  expand: {
    marginLeft: 'auto',
    transform: 'rotate(0deg)',
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
  formControl: {
    marginRight: 'auto',
  },
}));

export default function FilterForm() {
  const classes = useStyles();

  let { state, dispatch } = React.useContext(Context);
  const [doi, setDoi] = React.useState('');

  const imgStyle = {
    height: '22px',
    fill: green,
  };

  const importedStyle = {
    display: 'flex',
    marginTop: '16px',
  };

  const labelStyle = {
    display: 'flex',
  };

  function handleCheck() {
    dispatch({ type: 'setSampublikasjon', payload: !state.isSampublikasjon });
  }

  function handleStatusChange(event) {
    dispatch({ type: 'setImportStatus', payload: event.target.value });
  }

  function handleChange(option) {
    if (option !== null) {
      dispatch({ type: 'setInstitution', payload: option });
    } else {
      const tempOption = { value: null, label: 'Ingen filtrering' };
      dispatch({ type: 'setInstitution', payload: tempOption });
    }
  }

  function handleDoiChange(event) {
    if (event === null || event.target.value === '') {
      setDoi('');
      dispatch({ type: 'doiFilter', payload: null });
      return;
    } else if (event.target.value.match(/^([0-9]{2})[.]([0-9]{4,5})[/]([a-z0-9-.]{1,})/i)) {
      dispatch({ type: 'doiFilter', payload: event.target.value });
    }
    setDoi(event.target.value);
  }

  return (
    <Card className={classes.card} variant="outlined">
      <CardContent>
        <FormControl component="fieldset" className={classes.formControl}>
          <CardHeader title="Importstatus" />
          <RadioGroup
            aria-label="Importstatus"
            name="Importstatus"
            className={classes.group}
            value={state.currentImportStatus}
            onChange={handleStatusChange}>
            <FormControlLabel
              value="false"
              control={<Radio />}
              label={
                <span style={labelStyle}>
                  <img src={ExportIcon} style={imgStyle} alt="Not imported" /> &nbsp;
                  <div>Ikke importert</div>
                </span>
              }
            />
            <FormControlLabel
              value="true"
              control={<Radio />}
              label={
                <span style={importedStyle}>
                  <img src={DownloadIcon} style={imgStyle} alt="Imported" /> &nbsp; <p>Importert</p>
                </span>
              }
            />
            <FormControlLabel
              value="ikke aktuelle"
              control={<Radio />}
              label={
                <span style={labelStyle}>
                  <img src={X2Icon} style={imgStyle} alt="Not relevant" /> &nbsp; <div>Ikke aktuelle</div>
                </span>
              }
            />
          </RadioGroup>
        </FormControl>
        <CardHeader title="Institusjoner" style={{ marginTop: '2rem' }} />
        <div>
          <FormControlLabel control={<Checkbox onClick={handleCheck} />} label="Sampublikasjoner" />
          <InstitutionSelect onChange={handleChange} />
        </div>
        <CardHeader title="DOI" style={{ marginTop: '2rem' }} />
        <div>
          <TextField
            id="doiFilter"
            label="Søk på doi"
            fullWidth
            variant={'outlined'}
            onChange={handleDoiChange}
            value={doi}
            InputProps={{
              endAdornment: (
                <IconButton onClick={() => handleDoiChange(null)}>
                  <ClearIcon />
                </IconButton>
              ),
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
