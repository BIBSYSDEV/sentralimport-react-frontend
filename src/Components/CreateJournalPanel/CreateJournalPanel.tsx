import React, { FC, useState } from 'react';
import { Collapse } from 'react-bootstrap';
import { Button, Grid, TextField, Typography } from '@material-ui/core';
import styled from 'styled-components';
import AddIcon from '@material-ui/icons/Add';
import { Colors } from '../../assets/styles/StyleConstants';
import { ErrorMessage, Field, FieldProps, Form, Formik } from 'formik';
import * as Yup from 'yup';

const StyledFormWrapper = styled.div`
  padding: 1rem;
  background-color: ${Colors.LIGHT_GREY}; ;
`;

const StyledCreateJournalPanel = styled.div`
  margin-top: 0.5rem;
`;

const StyledTextField = styled(TextField)`
  && {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
`;

interface CreateJournalPanelProps {
  handleCreateJournal: any;
}

const CreateJournalPanel: FC<CreateJournalPanelProps> = ({ handleCreateJournal }) => {
  const [expanded, setExpanded] = useState(false);
  const emptyFormValues = { title: '', issn: '', eissn: '' };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Tittel er et obligatorisk felt').min(6, 'Tittel må ha minimum 6 tegn'),
    issn: Yup.string()
      .required('ISSN er et obligatorisk felt')
      .matches(/([0-9]{4})[-]([0-9]{3})[0-9X]/g, 'ISSN is not in correct format'),
    eissn: Yup.string()
      .required('E-ISSN er et obligatorisk felt')
      .matches(/([0-9]{4})[-]([0-9]{3})[0-9X]/g, 'E-ISSN is not in correct format'),
  });

  function handleExpand() {
    if (!expanded) {
      //emptyAllFields();
      setExpanded(true);
    }
  }

  function handleCancel() {
    setExpanded(false);
  }

  function handleSubmit() {
    // if (totalFormErrors > 0 && totalFormErrors !== null) {
    //   setErrorMessage('Det er feil i skjema. Fyll ut alle obligatoriske felt');
    // } else {
    //   setExpanded(false);
    //   //todo: nullstill
    //   const newJournal = {
    //     title: title,
    //     issn: issn,
    //     eissn: eissn,
    //     url: url,
    //     countryCode: publisher,
    //     id: 0,
    //   };
    //   console.log(newJournal);
    //   handleCreateJournal(newJournal);
    // }
  }

  return (
    <StyledCreateJournalPanel>
      {!expanded && (
        <Button
          data-testid="creator-journal-button"
          startIcon={<AddIcon />}
          variant="outlined"
          color="primary"
          onClick={handleExpand}>
          Legg til nytt tidsskrift
        </Button>
      )}
      <Collapse in={expanded} unmountOnExit>
        <StyledFormWrapper>
          <Typography gutterBottom style={{ fontWeight: 'bold' }}>
            Registrer nytt tidskrift
          </Typography>
          <Formik onSubmit={handleSubmit} initialValues={emptyFormValues} validationSchema={validationSchema}>
            {() => (
              <Form>
                <Field name="title">
                  {({ field, meta: { error, touched } }: FieldProps) => (
                    <StyledTextField
                      fullWidth
                      label="Tittel"
                      inputProps={{ 'data-testid': 'journal-form-title-input' }}
                      {...field}
                      error={!!error && touched}
                      helperText={<ErrorMessage name={field.name} />}
                    />
                  )}
                </Field>
                <Field name="issn">
                  {({ field, meta: { error, touched } }: FieldProps) => (
                    <StyledTextField
                      fullWidth
                      label="ISSN"
                      inputProps={{ 'data-testid': 'journal-form-issn-input' }}
                      {...field}
                      error={!!error && touched}
                      helperText={<ErrorMessage name={field.name} />}
                    />
                  )}
                </Field>
                <Field name="eissn">
                  {({ field, meta: { error, touched } }: FieldProps) => (
                    <StyledTextField
                      fullWidth
                      label="E-ISSN"
                      inputProps={{ 'data-testid': 'journal-form-eissn-input' }}
                      {...field}
                      error={!!error && touched}
                      helperText={<ErrorMessage name={field.name} />}
                    />
                  )}
                </Field>
              </Form>
            )}
          </Formik>
          <Grid container spacing={3}>
            <Grid item>
              <Button variant="outlined" color="secondary" onClick={handleCancel}>
                Avbryt
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                Opprett
              </Button>
            </Grid>
          </Grid>
        </StyledFormWrapper>
      </Collapse>
    </StyledCreateJournalPanel>
  );
};
export default CreateJournalPanel;
