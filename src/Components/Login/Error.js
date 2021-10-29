import Grid from '@material-ui/core/Grid/Grid';
import { Typography } from '@material-ui/core';
import { Button } from 'react-bootstrap';
import React from 'react';
import ErrorIcon from '../../assets/icons/alert-triangle.svg';
import { useHistory } from 'react-router-dom';

export default function Error() {
  let history = useHistory();

  return (
    <Grid container direction="column" alignItems="center" spacing={3} style={{ marginTop: '2rem' }}>
      <Grid item>
        <img src={ErrorIcon} alt="warning icon" />
      </Grid>
      <Grid item>
        <Typography gutterBottom align="center" variant="h4" component="h1">
          Det har skjedd en feil
        </Typography>
      </Grid>
      <Grid item>
        <Typography gutterBottom>Dette kan være fordi:</Typography>
        <Typography>1. Du ikke har blitt gitt tilgang til Sentralimport av administrator</Typography>
        <Typography>2. Det har skjedd noe galt ved innlogging </Typography>
        <Typography>3. Din sesjon har gått ut og du må logge inn på nytt</Typography>
        <Typography gutterBottom>4. Det har skjedd en feil på serveren</Typography>
        <Typography>Dersom problemet vedvarer, kontakt administrator</Typography>
      </Grid>
      <Grid item>
        <Button
          onClick={() => {
            history.push('/login');
          }}>
          Logg inn
        </Button>
      </Grid>
    </Grid>
  );
}
