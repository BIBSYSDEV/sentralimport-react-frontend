import React from 'react';
import logo from './logo.svg';
import './logo.css';
import { Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid/Grid';

export default function LogoHeader() {
  const history = useHistory();

  const logout = () => {
    let id = localStorage.getItem('id_token');
    localStorage.clear();
    window.location.href =
      'https://auth.dataporten.no/openid/endsession?post_logout_redirect_uri=' +
      process.env.REACT_APP_REDIRECT_URL +
      '&id_token_hint=' +
      id;
  };

  const login = () => {
    history.push('/login');
  };

  const pageHeaderStyle = {
    backgroundColor: '#f5f5f5',
    // borderBottom: '1px solid #666666',
  };

  return (
    <Grid container spacing={3} style={pageHeaderStyle}>
      <Grid item xs={12} sm={5} style={{ display: 'flex', alignItems: 'center' }}>
        <img src={logo} style={{ height: '3.5rem' }} alt="CRISTIN - Current Research Information SysTem In Norway" />
        <Typography style={{ fontSize: '2rem', fontFamily: 'PT Sans, sans-serif', marginLeft: '1rem' }}>
          Sentralimport
        </Typography>
      </Grid>
      <Grid item xs={12} sm={7} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        {localStorage.getItem('authorized') === 'true' ? (
          <Button variant="contained" color="primary" onClick={logout} style={{ marginRight: '1rem' }}>
            Logg ut
          </Button>
        ) : (
          <Button variant="contained" color="primary" onClick={login} style={{ marginRight: '1rem' }}>
            Logg inn
          </Button>
        )}
      </Grid>
    </Grid>
  );
}
