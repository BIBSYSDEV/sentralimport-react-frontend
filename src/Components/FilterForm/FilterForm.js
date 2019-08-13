import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import { red } from "@material-ui/core/colors";
import InstitutionSelect from "../InstitutionSelect/InstitutionSelect";

import {
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Checkbox
} from "@material-ui/core";
import { Context } from "../../Context";

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 650,
    marginTop: 25,
    marginLeft: 10,
    overflow: "visible"
  },
  media: {
    height: 0,
    paddingTop: "54.25%" // 16:9
  },
  expand: {
    marginLeft: "auto",
    transform: "rotate(0deg)"
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  avatar: {
    backgroundColor: red[500]
  },
  formControl: {
    marginRight: "auto"
  }
}));

export default function FilterForm() {
  const classes = useStyles();

  let { state, dispatch } = React.useContext(Context);

  function handleCheck() {
    dispatch({ type: "setSampublikasjon", payload: !state.isSampublikasjon });
  }

  function handleStatusChange(event) {
    dispatch({ type: "setImportStatus", payload: event.target.value });
  }

  function handleChange(option) {
    dispatch({ type: "setInstitution", payload: option });
  }

  return (
    <Card className={classes.card}>
      <CardHeader title="Importstatus" />
      <hr />
      <CardContent>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">Importstatus</FormLabel>
          <RadioGroup
            aria-label="Importstatus"
            name="Importstatus"
            className={classes.group}
            value={state.currentImportStatus}
            onChange={handleStatusChange}
          >
            <FormControlLabel
              value="Ikke importert"
              control={<Radio />}
              label="Ikke importert"
            />
            <FormControlLabel
              value="Importert"
              control={<Radio />}
              label="Importert"
            />
          </RadioGroup>
        </FormControl>
        <hr />
        <CardHeader title="Institusjoner" />
        <hr />
        <div>
          <FormControlLabel
            control={<Checkbox onClick={handleCheck} />}
            label="Sampublikasjoner"
          />
          <InstitutionSelect onChange={handleChange} />
        </div>
      </CardContent>
    </Card>
  );
}
