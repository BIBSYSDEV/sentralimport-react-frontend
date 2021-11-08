import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import { red } from '@material-ui/core/colors';
import InstitutionSelect from '../InstitutionSelect/InstitutionSelect';
import { Checkbox, FormControlLabel, IconButton, TextField } from '@material-ui/core';
import { Context } from '../../Context';
import ClearIcon from '@material-ui/icons/Clear';
import ImportStatus from './ImportStatus';

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

export default function FilterFormPanel() {
  const classes = useStyles();

  let { state, dispatch } = React.useContext(Context);
  const [doi, setDoi] = React.useState('');

  function handleCheck() {
    dispatch({ type: 'setSampublikasjon', payload: !state.isSampublikasjon });
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
    <Card className={classes.card} variant="outlined" data-testid="filter-panel">
      <CardContent>
        <ImportStatus />
        <CardHeader title="Institusjoner" style={{ marginTop: '2rem' }} />
        <div data-testid="institution-filter-wrapper">
          <FormControlLabel control={<Checkbox onClick={handleCheck} />} label="Sampublikasjoner" />
          <InstitutionSelect onChange={handleChange} />
        </div>
        <CardHeader title="DOI" style={{ marginTop: '2rem' }} />
        <div>
          <TextField
            data-testid="doi-filter"
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
