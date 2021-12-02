import React, { FC } from 'react';
import { Accordion, AccordionSummary, Button, TextField, Typography } from '@material-ui/core';
import styled from 'styled-components';
import { ErrorMessage, Field, FieldProps, Formik } from 'formik';
import * as Yup from 'yup';
import CommonErrorMessage from '../CommonErrorMessage';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const StyledFormWrapper = styled.div`
  padding: 1rem;
`;

const StyledFormHeaderTypography = styled(Typography)`
  && {
    font-weight: bold;
  }
`;

const StyledButtonWrapper = styled.div`
  margin-top: 1rem;
`;

const StyledTextField = styled(TextField)`
  && {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
`;

const ISSNCodeFormat = /^[0-9]{4}-[0-9]{3}[0-9xX]$/g;
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
  const handleSubmit = (values: CreateJournalFormValues) => {
    handleCreateJournal({ title: values.title, issn: values.issn, eissn: values.eissn });
  };

  const formValidationSchema = Yup.object().shape({
    title: Yup.string().required('Tittel er et obligatorisk felt').min(6, 'Tittel må ha minimum 6 tegn'),
    issn: Yup.string().matches(ISSNCodeFormat, 'ISSN er ikke på korrekt format (NNNN-NNNC)'),
    eissn: Yup.string().matches(ISSNCodeFormat, 'e-ISSN er ikke på korrekt format (NNNN-NNNC)'),
  });

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="create-journal-content"
        id="create-journal-header">
        <StyledFormHeaderTypography>Registrer nytt tidskrift</StyledFormHeaderTypography>
      </AccordionSummary>
      <StyledFormWrapper>
        <Typography gutterBottom variant="caption">
          Felter merket med * er obligatoriske (ISSN eller e-ISSN må fylles ut)
        </Typography>
        <Formik onSubmit={handleSubmit} initialValues={emptyFormValues} validationSchema={formValidationSchema}>
          {({ values, isValid }) => (
            <>
              <Field name="title">
                {({ field, meta: { error, touched } }: FieldProps) => (
                  <StyledTextField
                    fullWidth
                    label="Tittel *"
                    data-testid="new-journal-form-title-field"
                    inputProps={{ 'data-testid': 'new-journal-form-title-input' }}
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
                    label="ISSN "
                    data-testid="new-journal-form-issn-field"
                    inputProps={{ 'data-testid': 'new-journal-form-issn-input' }}
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
                    label="e-ISSN "
                    data-testid="new-journal-form-eissn-field"
                    inputProps={{ 'data-testid': 'new-journal-form-eissn-input' }}
                    {...field}
                    error={!!error && touched}
                    helperText={<ErrorMessage name={field.name} />}
                  />
                )}
              </Field>
              <StyledButtonWrapper>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleSubmit(values)}
                  data-testid="submit-journal-button">
                  Opprett
                </Button>
              </StyledButtonWrapper>
              {!isValid && (
                <CommonErrorMessage datatestid="new-journal-form-error" errorMessage="Det er feil i tidskrift-skjema" />
              )}
            </>
          )}
        </Formik>
      </StyledFormWrapper>
    </Accordion>
  );
};
export default CreateJournalPanel;
