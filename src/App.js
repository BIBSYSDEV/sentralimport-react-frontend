import React from "react";
import "./App.css";
import Panel from "./Components/Panel/ImportPanel";
import LogoHeader from "./Components/LogoHeader/LogoHeader";
import ImportTable from "./Components/ImportTable/ImportTable";
import Grid from "@material-ui/core/Grid/Grid";
import FilterForm from "./Components/FilterForm/FilterForm";
import DropdownPanel from "./Components/DropdownPanel/DropdownPanel";
import { ContextProvider } from "./Context";

export default function App() {
  return (
    <ContextProvider>
      <div className="App">
        <Grid container spacing={3}>
          <Grid item xs>
            <LogoHeader />
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs>
            <DropdownPanel />
          </Grid>
          <Grid item xs={8}>
            <Panel />
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs>
            <FilterForm />
          </Grid>
          <Grid item xs={8}>
            <ImportTable />
          </Grid>
        </Grid>
      </div>
    </ContextProvider>
  );
}
