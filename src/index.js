import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-table/react-table.css";
import { SnackbarProvider } from "notistack";
import { Switch, BrowserRouter, Route } from "react-router-dom";
import ImportPage from "./Components/ImportPage/ImportPage";

ReactDOM.render(
  <BrowserRouter>
    <SnackbarProvider maxSnack={1}>
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/importpage" component={ImportPage} />
      </Switch>
    </SnackbarProvider>
  </BrowserRouter>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
