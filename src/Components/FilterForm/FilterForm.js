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

import {
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel
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
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  avatar: {
    backgroundColor: red[500]
  }
}));

export default function FilterForm() {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [status, setStatus] = React.useState("Ikke importert");
  const [value, setValue] = React.useState("");

  function handleChange(event) {
    setValue(event.target.value);
  }

  function handleExpandClick() {
    setExpanded(!expanded);
  }

  function handleStatusChange(event) {
    setStatus(event.target.value);
  }

  return (
    <Card className={classes.card}>
      <CardHeader title="Filtrering" />
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

        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">Institusjoner</FormLabel>
          <RadioGroup
            aria-label="Publikasjonssted"
            name="Publikasjonssted"
            className={classes.group}
            value={value}
            onChange={handleChange}
          >
            <FormControlLabel
              value=""
              control={<Radio />}
              label="Ingen filtrering"
            />
            <FormControlLabel value="UIO" control={<Radio />} label="UIO" />
            <FormControlLabel
              value="OsloMet"
              control={<Radio />}
              label="OsloMet"
            />
            <FormControlLabel value="UIB" control={<Radio />} label="UIB" />
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
          aria-label="Show more"
        >
          <ExpandMoreIcon />
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
              <FormControlLabel value="UIS" control={<Radio />} label="UIS" />
              <FormControlLabel value="NTNU" control={<Radio />} label="NTNU" />
              <FormControlLabel value="UOS" control={<Radio />} label="UOS" />
            </RadioGroup>
          </FormControl>
        </CardContent>
      </Collapse>
    </Card>
  );
}
