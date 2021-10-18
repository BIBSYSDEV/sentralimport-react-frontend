import React from 'react';
import { Route } from 'react-router-dom';
import App from '../../App';
import Login from '../Login/Login';
import Error from '../Login/Error';

export default function Routes() {
  return (
    <div>
      <Route exact path="/" component={App} />
      <Route path="/login" component={Login} />
      <Route path="/error" component={Error} />
    </div>
  );
}
