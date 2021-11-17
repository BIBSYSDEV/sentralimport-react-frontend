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

const StyledErrorTypography = styled(Typography)`
  color: ${Colors.ERROR};
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

const ISSNCodeFormat = /([0-9]{4})[-]([0-9]{3})[0-9X]/g;
const emptyFormValues: CreateJournalFormValues = { title: '', issn: '', eissn: '' };

interface CreateJournalFormValues {
  title: string;
  issn: string;
  eissn: string;
}

interface CreateJournalPanelProps {
  handleCreateJournal: any;
}

const CreateJournalPanel: FC<CreateJournalPanelProps> = ({ handleCreateJournal }) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpand = () => {
    if (!expanded) {
      setExpanded(true);
    }
  };

  const handleCancel = () => {
    setExpanded(false);
  };

  const handleSubmit = (values: CreateJournalFormValues) => {
    setExpanded(false);
    //old code :  const newJournal = {title: title,issn: issn,eissn: eissn,url: url,countryCode: publisher,id: 0};
    handleCreateJournal({ title: values.title, issn: values.issn, eissn: values.issn });
  };

  const formValidationSchema = Yup.object().shape(
    {
      title: Yup.string().required('Tittel er et obligatorisk felt').min(6, 'Tittel må ha minimum 6 tegn'),
      issn: Yup.string()
        .matches(ISSNCodeFormat, 'ISSN er ikke på korrekt format (NNNN-NNNC)')
        .when('eissn', {
          is: (eissn: string) => !eissn || eissn.length === 0,
          then: Yup.string().required('Enten skriv inn ISSN eller e-ISSN'),
          otherwise: Yup.string(),
        }),
      eissn: Yup.string()
        .matches(ISSNCodeFormat, 'e-ISSN er ikke på korrekt format (NNNN-NNNC)')
        .when('issn', {
          is: (issn: string) => !issn || issn.length === 0,
          then: Yup.string().required('Enten skriv inn ISSN eller e-ISSN)'),
          otherwise: Yup.string(),
        }),
    },
    [['issn', 'eissn']]
  );

  return (
    <StyledCreateJournalPanel>
      {!expanded && (
        <Button
          data-testid="add-journal-button"
          startIcon={<AddIcon />}
          variant="outlined"
          color="primary"
          onClick={handleExpand}>
          Legg til nytt tidsskrift
        </Button>
      )}
      <Collapse in={expanded} unmountOnExit>
        <StyledFormWrapper>
          <Typography style={{ fontWeight: 'bold' }}>Registrer nytt tidskrift</Typography>
          <Typography gutterBottom variant="caption">
            Felter merket med * er obligatoriske (ISSN eller e-ISSN må fylles ut)
          </Typography>
          <Formik
            onSubmit={handleSubmit}
            initialValues={emptyFormValues}
            validateOnChange={false}
            validateOnBlur={false}
            validationSchema={formValidationSchema}>
            {({ isValid }) => (
              <Form>
                <Field name="title">
                  {({ field, meta: { error, touched } }: FieldProps) => (
                    <StyledTextField
                      fullWidth
                      label="Tittel *"
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
                      label="ISSN *"
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
                      label="e-ISSN *"
                      inputProps={{ 'data-testid': 'journal-form-eissn-input' }}
                      {...field}
                      error={!!error && touched}
                      helperText={<ErrorMessage name={field.name} />}
                    />
                  )}
                </Field>
                <Grid container spacing={3} style={{ marginTop: '0.5rem' }}>
                  <Grid item>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={handleCancel}
                      data-testid="cancel-journal-button">
                      Avbryt
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button variant="contained" color="primary" type="submit" data-testid="submit-journal-button">
                      Opprett
                    </Button>
                  </Grid>
                </Grid>
                {!isValid && (
                  <StyledErrorTypography variant="caption">Det er feil i tidskrift-skjema.</StyledErrorTypography>
                )}
              </Form>
            )}
          </Formik>
        </StyledFormWrapper>
      </Collapse>
    </StyledCreateJournalPanel>
  );
};
export default CreateJournalPanel;
