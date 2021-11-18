import React from 'react';
import YearSelect from '../YearSelect/YearSelect';
import { Grid, Typography } from '@material-ui/core';

export default function PublicationYearPanel() {
  return (
    <Grid container spacing={3} alignItems="baseline">
      <Grid item>
        <Typography variant="body1">Velg publiseringsår</Typography>
      </Grid>
      <Grid item>
        <YearSelect />
      </Grid>
    </Grid>
  );
}
