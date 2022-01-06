import React from 'react';
import queryString from 'query-string';
import jwt from 'jsonwebtoken';
import './style.css';
import loginIcon from '../../assets/icons/login.png';
import logo from '../../assets/icons/Hovedlogo-Liten-Farge.svg';
import { Button } from 'reactstrap';
import { Card, CardContent, Grid, Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

export const ACESS_TOKEN = 'access_token';
export const EXPIRES = 'expires';
export const AUTHORIZED = 'authorized';

export default function Login(props) {
  const search = queryString.parse(props.location.hash);
  const authState = 'bra';
  let history = useHistory();

  function handleLogin() {
    localStorage.setItem('nonce', generateNonce());
    window.location.href =
      'https://auth.dataporten.no/oauth/authorization?client_id=' +
      process.env.REACT_APP_CLIENT_ID +
      '&redirect_uri=' +
      process.env.REACT_APP_REDIRECT_URL +
      '&scope=openid userid email userid-feide userid-nin profile ' +
      process.env.REACT_APP_PIAREST_GATEWAY_SCOPE +
      ' ' +
      process.env.REACT_APP_CRISREST_GATEWAY_SCOPE +
      '&response_type=id_token token&state=' +
      authState +
      '&nonce=' +
      localStorage.getItem('nonce');
  }

  function handleLogout() {
    let id = localStorage.getItem('id_token');
    localStorage.clear();
    window.location.href =
      'https://auth.dataporten.no/openid/endsession?post_logout_redirect_uri=' +
      process.env.REACT_APP_REDIRECT_URL +
      '&id_token_hint=' +
      id;
  }

  function generateNonce() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  function validate() {
    let jsonToken = jwt.decode(search.id_token);

    if (
      jsonToken.aud !== process.env.REACT_APP_CLIENT_ID ||
      jsonToken.nonce !== localStorage.getItem('nonce') ||
      search.state !== authState
    )
      console.log('Error! Wrong invalid login!');
    else {
      localStorage.setItem('authorized', 'true');
      localStorage.setItem(ACESS_TOKEN, search.access_token.toString());
      localStorage.setItem('expires', jsonToken.exp);
      localStorage.setItem('id_token', search.id_token.toString());
      history.push('/');
    }
  }

  if (search.access_token != null) validate();

  return (
    <div className={`login`}>
      <br />
      {localStorage.getItem('authorized') && localStorage.getItem('authorized') === 'true' ? (
        <div>
          <p>Du er allerede logget inn. Ønsker du å logge ut?</p>
          <Button onClick={handleLogout}>Logg ut</Button>
        </div>
      ) : (
        <Grid container justifyContent="center" direction="row" className={'login-grid'}>
          <Grid item xs={12}>
            <img src={logo} className={'cristin-logo'} title="CRISTIN-logo" alt="CRISTIN-logo" />
          </Grid>
          <Grid item xs={12}>
            <h1> CRISTIN Sentralimport</h1>
          </Grid>
          <Grid container item xs={12} justifyContent="center">
            <Card className={'login-card'}>
              <CardContent>
                <Typography variant="body1" component="div" gutterBottom>
                  Logg inn til Sentralimport:
                </Typography>
                <Button onClick={handleLogin} color="primary" variant="contained">
                  <Grid container alignContent="center" spacing={2}>
                    <Grid item xs={2}>
                      <img src={loginIcon} className={'feide-login-icon'} title="Feide Login" alt="Feide Login" />
                    </Grid>
                    <Grid item container xs={10} alignItems="center" justifyContent="center">
                      <div>
                        Logg inn via <span className={'feide-login-button'}> Feide</span>
                      </div>
                    </Grid>
                  </Grid>
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </div>
  );
}
