import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-table/react-table.css";
import { SnackbarProvider } from "notistack";
import createHistory from 'history/createBrowserHistory';
import { Router } from "react-router-dom";
import Routes from "./Components/Routes/Routes";
const history = createHistory();

ReactDOM.render(
  <SnackbarProvider maxSnack={1}>
      <Router history={history}>
          <Routes />
      </Router>
  </SnackbarProvider>,

  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
