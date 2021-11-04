import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { SnackbarProvider } from 'notistack';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';
import Routes from './Components/Routes/Routes';
import { ContextProvider } from './Context';
import { USE_MOCK_DATA } from './utils/constants';
import { interceptRequestsOnMock } from './utils/mock-interceptor';

const history = createBrowserHistory();

if (USE_MOCK_DATA) {
  interceptRequestsOnMock();
}

ReactDOM.render(
  <SnackbarProvider maxSnack={1}>
    <ContextProvider>
      <Router history={history}>
        <Routes />
      </Router>
    </ContextProvider>
  </SnackbarProvider>,

  document.getElementById('root')
);
