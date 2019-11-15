import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import { red, green } from "@material-ui/core/colors";
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
import DownloadIcon from "./download-green.png";
import ExportIcon from "./export-purple.png";
import X2Icon from "./x2-red.png";

const useStyles = makeStyles(theme => ({
  root: {
    overflowX: "auto",
    overflowY: "visible"
  },
  card: {
    marginTop: 25,
    marginLeft: 10,
    [theme.breakpoints.down("md")]: {
      marginLeft: 0
    }
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

  const imgStyle = {
    height: "22px",
    fill: green
  };

  const importedStyle = {
    display: "flex",
    marginTop: "16px"
  };

  const labelStyle = {
    display: "flex"
  };

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
              value="false"
              control={<Radio />}
              label={
                <span style={labelStyle}>
                  <img src={ExportIcon} style={imgStyle} alt="ikke importert" />{" "}
                  &nbsp;
                  <div>Ikke importert</div>
                </span>
              }
            />
            <FormControlLabel
              value="true"
              control={<Radio />}
              label={
                <span style={importedStyle}>
                  <img src={DownloadIcon} style={imgStyle} alt="importert" />{" "}
                  &nbsp; <p>Importert</p>
                </span>
              }
            />
            <FormControlLabel
              value="ikke aktuelle"
              control={<Radio />}
              label={
                <span style={labelStyle}>
                  <img src={X2Icon} style={imgStyle} alt="ikke aktuelle" />{" "}
                  &nbsp; <div>Ikke aktuelle</div>
                </span>
              }
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
