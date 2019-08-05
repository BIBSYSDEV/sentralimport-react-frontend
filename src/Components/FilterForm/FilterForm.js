import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import { red } from "@material-ui/core/colors";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import InstitutionSelect from "../InstitutionSelect/InstitutionSelect";
import Icon from "@material-ui/core/Icon";

import {
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Checkbox
} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 650,
    marginTop: 25,
    marginLeft: 10
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
  const [expanded, setExpanded] = React.useState(false);
  const [status, setStatus] = React.useState("Ikke importert");
  const [value, setValue] = React.useState("Ingen filtrering");
  const [isDisabled, setDisabled] = React.useState(false);

  function handleChange(event) {
    setValue(event.target.value);
  }

  function handleExpandClick() {
    setExpanded(!expanded);
  }

  function handleStatusChange(event) {
    setStatus(event.target.value);
  }

  function handleCheck() {
    setDisabled(!isDisabled);

    setValue("Ingen filtrering");
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
            value={status}
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

            <FormControlLabel
              value="Ikke aktuelle"
              disabled
              control={<Radio />}
              label="Ikke aktuelle"
            />
          </RadioGroup>
        </FormControl>
        <hr />
        <CardHeader title="Institusjoner" />
        <hr />
        <p>
          <FormControlLabel
            control={<Checkbox onClick={handleCheck} />}
            label="Sampublikasjoner"
          />
          <InstitutionSelect disabled={!isDisabled} />
        </p>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">Institusjoner</FormLabel>
          <RadioGroup
            aria-label="Publikasjonssted"
            name="Publikasjonssted"
            className={classes.group}
            value={value}
            onChange={handleChange}
            color="primary"
          >
            <FormControlLabel
              value="Ingen filtrering"
              control={<Radio />}
              label="Ingen filtrering"
              disabled={isDisabled}
            />
            <FormControlLabel
              value="UIO"
              control={<Radio />}
              label="UIO"
              disabled={isDisabled}
            />
            <FormControlLabel
              value="OsloMet"
              control={<Radio />}
              label="OsloMet"
              disabled={isDisabled}
            />
            <FormControlLabel
              value="UIB"
              control={<Radio />}
              label="UIB"
              disabled={isDisabled}
            />
          </RadioGroup>
        </FormControl>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="Alle institusjoner"
        >
          <Icon className={classes.icon} color="secondary">
            keyboard_arrow_down
          </Icon>
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <FormControl component="fieldset" className={classes.formControl}>
            <FormLabel component="legend">Alle institusjoner</FormLabel>
            <RadioGroup
              aria-label="Publikasjonssted"
              name="Publikasjonssted"
              className={classes.group}
              value={value}
              onChange={handleChange}
            >
              <FormControlLabel
                value="UIS"
                control={<Radio />}
                label="UIS"
                disabled={isDisabled}
              />
              <FormControlLabel
                value="NTNU"
                control={<Radio />}
                label="NTNU"
                disabled={isDisabled}
              />
              <FormControlLabel
                value="UOS"
                control={<Radio />}
                label="UOS"
                disabled={isDisabled}
              />
            </RadioGroup>
          </FormControl>
        </CardContent>
      </Collapse>
    </Card>
  );
}
