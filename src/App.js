import React from "react";
import "./App.css";
import Panel from "./Components/Panel/ImportPanel";
import ImportTable from "./Components/ImportTable/ImportTable";
import Grid from "@material-ui/core/Grid/Grid";
import FilterForm from "./Components/FilterForm/FilterForm";
import DropdownPanel from "./Components/DropdownPanel/DropdownPanel";
import Header from "./Components/Header/Header";
import { Card, CardContent, Typography } from "@material-ui/core";
import ErrorIcon from "./assets/icons/alert-triangle.svg";
import { Button } from "react-bootstrap";
import "./assets/styles/buttons.scss";

export default function App() {
  const getMainImage = () => {
    return ErrorIcon;
  };

  function logOut() {
    localStorage.clear();
    window.location.href = "/login";
  }

  return localStorage.getItem("authorized") &&
    localStorage.getItem("authorized") === "true" ? (
    <div className="App">
      <Header />
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <DropdownPanel />
        </Grid>
        <Grid item xs={9}>
          <Panel />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <FilterForm />
        </Grid>
        <Grid item xs={9}>
          <ImportTable />
        </Grid>
      </Grid>
    </div>
  ) : (
    <div>
      <Header />

      <Grid container direction="column" justify="center" alignItems="center">
        <Grid item>
          <img src={getMainImage()} alt="warning icon" />
        </Grid>
        <br></br>
        <Grid item>
          <Card>
            <CardContent alignItems="center">
              <Typography variant="h4">
                Du har ikke tilgang til Sentralimport
              </Typography>
              <hr />
              <Typography variant="body1">
                <div>Dette kan være fordi:</div>
                <div>
                  1. Du ikke har blitt gitt tilgang til Sentralimport av
                  administrator
                </div>
                <div>2. Det har skjedd noe galt ved innlogging </div>
                <div> --- </div>
                <div>Dersom problemet vedvarer, kontakt administrator</div>
                <div> --- </div>
              </Typography>
              <hr />

              <Button
                variant="dark"
                className="errorLogoutButton"
                onClick={() => logOut()}
              >
                Logg ut
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
