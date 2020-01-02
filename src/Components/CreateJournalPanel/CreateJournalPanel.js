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

  const [formHasErrors] = React.useState([
    { value: 1 },
    { value: 0 },
    { value: 0 },
    { value: 1 },
    { value: 1 }
  ]);

  const [totalFormErrors, setTotalFormErrors] = React.useState(5);

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

  function checkFormErrors() {
    var errorsFound = 0;
    for (var i = 0; i < formHasErrors.length; i++) {
      if (formHasErrors[i].value === 1) {
        errorsFound++;
      }
    }
    setTotalFormErrors(errorsFound);
  }

  function handleSubmit() {
    setOpen(false);

    var newJournal = new Object();
    newJournal.title = title;
    newJournal.issn = issn;
    newJournal.eissn = eissn;
    newJournal.url = url;
    newJournal.countryCode = publisher;
    newJournal.id = 0;

    console.log(newJournal);

    props.handleCreateJournal(newJournal);
  }

  function handleChangeTitle(event) {
    if (event.target.value.length < 6) {
      formHasErrors[0].value = 1;
    } else {
      formHasErrors[0].value = 0;
    }
    checkFormErrors();
    setTitle(event.target.value);
  }
  function handleChangeIssn(event) {
    if (
      event.target.value.length > 0 &&
      !event.target.value.match(/([0-9]{4})[-]([0-9]{3})[0-9X]/g)
    ) {
      formHasErrors[1].value = 1;
    } else {
      formHasErrors[1].value = 0;
    }
    checkFormErrors();
    setIssn(event.target.value);
  }
  function handleChangeEissn(event) {
    if (
      event.target.value.length > 0 &&
      !event.target.value.match(/([0-9]{4})[-]([0-9]{3})[0-9X]/g)
    ) {
      formHasErrors[2].value = 1;
    } else {
      formHasErrors[2].value = 0;
    }
    checkFormErrors();
    setEissn(event.target.value);
  }
  function handleChangeUrl(event) {
    if (event.target.value.length < 10) {
      formHasErrors[3].value = 1;
    } else {
      formHasErrors[3].value = 0;
    }
    checkFormErrors();
    setUrl(event.target.value);
  }
  function handleChangePublisher(event) {
    if (event.target.value.length < 2) {
      formHasErrors[4].value = 1;
    } else {
      formHasErrors[4].value = 0;
    }
    checkFormErrors();
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
                id="Tittel"
                  error={title.length > 0 && title.length <= 6}
                  label={"Tittel"}
                 
                  value={title}
                  onChange={e => handleChangeTitle(e)}
                ></TextField>
                </FormGroup>
                <FormGroup>
                <TextField
                id="ISSN"
                  error={
                    issn.length > 0 &&
                    !issn.match(/([0-9]{4})[-]([0-9]{3})[0-9X]/g)
                  }
                  label={"ISSN"}
                  
                  value={issn}
                  onChange={e => handleChangeIssn(e)}
                ></TextField>
                </FormGroup>

                <FormGroup>
                <TextField
                id="EISSN"
                  error={
                    eissn.length > 0 &&
                    !eissn.match(/([0-9]{4})[-]([0-9]{3})[0-9X]/g)
                  }
                  label={"EISSN"}
                  
                  value={eissn}
                  onChange={e => handleChangeEissn(e)}
                ></TextField>
                <TextField
                  error={url.length > 0 && url.length < 10}
                  label={"URL"}
                  id="URL"
                  value={url}
                  onChange={e => handleChangeUrl(e)}
                ></TextField>
                <TextField
                  error={publisher.length > 0 && publisher.length < 2}
                  label={"Utgiver (Landkode)"}
                  id="Landkode"
                  value={publisher}
                  onChange={e => handleChangePublisher(e)}
                ></TextField>
              </FormGroup>
              <br />
              <Grid container spacing={6}>
                <Grid item>
                  <Button variant="danger" onClick={() => handleClose()}>
                    Avbryt
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="success"
                    onClick={() => handleSubmit()}
                    disabled={totalFormErrors > 0 && totalFormErrors !== null}
                  >
                    Opprett
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
