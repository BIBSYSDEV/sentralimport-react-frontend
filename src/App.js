import React from "react";
import "./App.css";
import Panel from "./Components/Panel/ImportPanel";
import ImportTable from "./Components/ImportTable/ImportTable";
import Grid from "@material-ui/core/Grid/Grid";
import FilterForm from "./Components/FilterForm/FilterForm";
import DropdownPanel from "./Components/DropdownPanel/DropdownPanel";
import Header from "./Components/Header/Header";

export default function App() {
  return (
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
  );
}
