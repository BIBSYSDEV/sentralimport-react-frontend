import React from "react";
import { Collapse, Button } from "react-bootstrap";
import {
  Card,
  CardContent,
  FormGroup,
  TextField,
  Grid
} from "@material-ui/core";
import "../../assets/styles/buttons.scss";

function CreateJournalPanel(props) {
  const [open, setOpen] = React.useState(false);

  const [issn, setIssn] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [eissn, setEissn] = React.useState("");
  const [url, setUrl] = React.useState("");
  const [publisher, setPublisher] = React.useState("");

  const [formHasErrors, setFormHasErrors] = React.useState(true);

  function emptyAllFields() {
    setTitle("");
    setIssn("");
    setEissn("");
    setUrl("");
    setPublisher("");
  }

  function handleOpen() {
    if (!open) {
      emptyAllFields();
      setOpen(true);
    }
  }

  function handleClose() {
    setOpen(false);
  }

  function handleSubmit() {
    setOpen(false);
    var newJournal;
    newJournal.title = title;
    newJournal.issn = issn;
    newJournal.eissn = eissn;
    newJournal.url = url;
    newJournal.countryCode = publisher;

    // props.handleNewJournal(newJournal)
    // Send den nyopprettede journalen til InnerModal og sett den til aktiv via hooks
  }

  function checkFields() {
    // Sjekk at felter har blitt fylt ut korrekt
  }

  function handleChangeTitle(event) {
    setTitle(event.target.value);
  }
  function handleChangeIssn(event) {
    setIssn(event.target.value);
  }
  function handleChangeEissn(event) {
    setEissn(event.target.value);
  }
  function handleChangeUrl(event) {
    setUrl(event.target.value);
  }
  function handleChangePublisher(event) {
    setPublisher(event.target.value);
  }

  return (
    <div>
      <Button className={"createJournalButton"} onClick={() => handleOpen()}>
        Nytt tidsskrift
      </Button>
      <Collapse in={open}>
        <div className={"createJournalCard"}>
          <Card>
            <CardContent>
              <FormGroup>
                <TextField
                  label={"Tittel"}
                  value={title}
                  onChange={e => handleChangeTitle(e)}
                ></TextField>
                <TextField
                  label={"ISSN"}
                  value={issn}
                  onChange={e => handleChangeIssn(e)}
                ></TextField>
                <TextField
                  label={"EISSN"}
                  value={eissn}
                  onChange={e => handleChangeEissn(e)}
                ></TextField>
                <TextField
                  label={"URL"}
                  value={url}
                  onChange={e => handleChangeUrl(e)}
                ></TextField>
                <TextField
                  label={"Utgiver (Landkode)"}
                  value={publisher}
                  onChange={e => handleChangePublisher(e)}
                ></TextField>
              </FormGroup>
              <br />
              <Grid container spacing={6}>
                <Grid item>
                  <Button
                    variant="success"
                    onClick={() => handleSubmit()}
                    disabled={formHasErrors}
                  >
                    Opprett
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="danger" onClick={() => handleClose()}>
                    Avbryt
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </div>
      </Collapse>
    </div>
  );
}
export default CreateJournalPanel;
