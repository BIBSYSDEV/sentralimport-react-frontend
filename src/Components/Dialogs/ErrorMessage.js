import React from 'react';
import { Card, CardContent } from '@material-ui/core';
import { Context } from '../../Context';

export default function ErrorMessage(props) {
  let { state } = React.useContext(Context);

  const errorMessageCard = {
    textAlign: 'center',
    width: '200px',
    display: 'inherit',
    alignItems: 'inherit',
    justifyContent: 'inherit',
  };

  return (
    <Card style={errorMessageCard}>
      <CardContent>
        Feil oppdaget i bidragsyterliste, feil ved indeks:
        {state.contributorErrors.length >= 1
          ? state.contributorErrors.map((error) => <li key={error.value}> {error.value} </li>)
          : ''}
      </CardContent>
    </Card>
  );
}
