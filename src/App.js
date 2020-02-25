import React from "react";
import "./App.css";
import Panel from "./Components/Panel/ImportPanel";
import ImportTable from "./Components/ImportTable/ImportTable";
import Grid from "@material-ui/core/Grid/Grid";
import FilterForm from "./Components/FilterForm/FilterForm";
import DropdownPanel from "./Components/DropdownPanel/DropdownPanel";
import Header from "./Components/Header/Header";
import { Box } from "@material-ui/core";
import "./assets/styles/buttons.scss";
import {useHistory} from "react-router-dom";
import Login from "./Components/Login/Login";
import Log from "./Components/Log/Log"

export default function App() {
    let history = useHistory();

  if (!localStorage.getItem("authorized"))
      history.push("login");

  return localStorage.getItem("authorized") &&
    localStorage.getItem("authorized") === "true" ? (
    <div className="App">
      <Header />
      <Grid container spacing={3}>
        <Box clone order={{ xs: 2, md: 1 }}>
          <Grid item xs={12} md={3}>
            <DropdownPanel />
          </Grid>
        </Box>
        <Box clone order={{ xs: 1, md: 2 }}>
          <Grid item xs={12} md={9}>
            <Panel />
          </Grid>
        </Box>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <FilterForm />
          <Log />
        </Grid>
        <Grid item xs={12} md={9}>
          <ImportTable />
        </Grid>
      </Grid>
    </div>
  )
      : (<div><Login location={"login"}/></div>
  );
}
