import Grid from "@material-ui/core/Grid/Grid";
import React from "react";
import LogoHeader from "./LogoHeader";

export default function Header() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <LogoHeader />
      </Grid>
    </Grid>
  );
}
