import React from "react";
import DropdownSelect from "../DropdownSelect/DropdownSelect";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { Typography } from "@material-ui/core";

export default function DropdownPanel() {
  const useStyles = {
    overflowX: "auto",
    overflowY: "visible",
    marginTop: 25,
    height: 148,
    marginLeft: 10
  };

  const divStyle = {
    marginTop: 25
  };

  return (
    <Card style={useStyles}>
      <CardContent>
        <Typography variant="h5">Velg publiseringsår</Typography>
        <div style={divStyle}>
          <DropdownSelect />
        </div>
      </CardContent>
    </Card>
  );
}
