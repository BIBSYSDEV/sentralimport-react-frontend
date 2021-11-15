import React, { useState } from 'react';
import { Collapse } from 'react-bootstrap';
import { Button, Card, CardContent, FormGroup, Grid, TextField, Typography } from '@material-ui/core';
import '../../assets/styles/buttons.scss';

function CreateJournalPanel(props) {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [issn, setIssn] = useState('');
  const [title, setTitle] = useState('');
  const [eissn, setEissn] = useState('');
  const [url, setUrl] = useState('');
  const [publisher, setPublisher] = useState('');

  const [formHasErrors] = useState([{ value: 1 }, { value: 0 }, { value: 0 }, { value: 1 }, { value: 1 }]);

  const [totalFormErrors, setTotalFormErrors] = useState(5);

  //TODO: YUP, toggleopen, check params - uses only title and issn/eissn, styling

  function emptyAllFields() {
    setTitle('');
    setIssn('');
    setEissn('');
    setUrl('');
    setPublisher('');
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
    let errorsFound = 0;
    for (let i = 0; i < formHasErrors.length; i++) {
      if (formHasErrors[i].value === 1) {
        errorsFound++;
      }
    }
    setTotalFormErrors(errorsFound);
  }

  function handleSubmit(formErrors) {
    if (formErrors > 0 && formErrors !== null) {
      setErrorMessage('Det er feil i skjema. Fyll ut alle obligatoriske felt');
    } else {
      setOpen(false);
      const newJournal = {
        title: title,
        issn: issn,
        eissn: eissn,
        url: url,
        countryCode: publisher,
        id: 0,
      };
      console.log(newJournal);
      props.handleCreateJournal(newJournal);
    }
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
    if (event.target.value.length > 0 && !event.target.value.match(/([0-9]{4})[-]([0-9]{3})[0-9X]/g)) {
      formHasErrors[1].value = 1;
    } else {
      formHasErrors[1].value = 0;
    }
    checkFormErrors();
    setIssn(event.target.value);
  }
  function handleChangeEissn(event) {
    if (event.target.value.length > 0 && !event.target.value.match(/([0-9]{4})[-]([0-9]{3})[0-9X]/g)) {
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
      <Button className={'createJournalButton'} onClick={() => handleOpen()}>
        Nytt tidsskrift
      </Button>
      <Collapse in={open}>
        <div className={'createJournalCard'}>
          <Card>
            <CardContent>
              <FormGroup>
                <TextField
                  id="Tittel"
                  error={title.length > 0 && title.length <= 6}
                  label={'Tittel *'}
                  value={title}
                  onChange={(e) => handleChangeTitle(e)}
                />
              </FormGroup>
              <FormGroup>
                <TextField
                  id="ISSN"
                  error={issn.length > 0 && !issn.match(/([0-9]{4})[-]([0-9]{3})[0-9X]/g)}
                  label={'ISSN'}
                  value={issn}
                  onChange={(e) => handleChangeIssn(e)}
                />
              </FormGroup>
              <FormGroup>
                <TextField
                  id="E-ISSN"
                  error={eissn.length > 0 && !eissn.match(/([0-9]{4})[-]([0-9]{3})[0-9X]/g)}
                  label={'E-ISSN'}
                  value={eissn}
                  onChange={(e) => handleChangeEissn(e)}
                />
                <TextField
                  id="URL"
                  error={url.length > 0 && url.length < 10}
                  label={'URL *'}
                  value={url}
                  onChange={(e) => handleChangeUrl(e)}
                />
                <TextField
                  id="Landkode"
                  error={publisher.length > 0 && publisher.length < 2}
                  label={'Utgiver (Landkode) *'}
                  value={publisher}
                  onChange={(e) => handleChangePublisher(e)}
                />
              </FormGroup>
              <div>
                {errorMessage && (
                  <Typography variant="caption" style={{ color: 'red' }}>
                    {errorMessage}
                  </Typography>
                )}
              </div>
              <Grid container spacing={6} style={{ marginTop: '0.5rem' }}>
                <Grid item>
                  <Button variant="outlined" color="secondary" onClick={handleClose}>
                    Avbryt
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" onClick={() => handleSubmit(totalFormErrors)}>
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
