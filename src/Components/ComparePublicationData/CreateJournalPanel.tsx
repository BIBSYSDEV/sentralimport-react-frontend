import React, { FC } from 'react';
import { Button, TextField, Typography } from '@material-ui/core';
import styled from 'styled-components';
import { ErrorMessage, Field, FieldProps, Formik } from 'formik';
import * as Yup from 'yup';
import CommonErrorMessage from '../CommonErrorMessage';

const StyledFormWrapper = styled.div`
  padding: 1rem;
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
  const handleFormSubmit = (values: CreateJournalFormValues) => {
    handleCreateJournal({
      title: values.title.trim(),
      issn: values.issn.trim(),
      eissn: values.eissn.trim(),
      cristinTidsskriftNr: '0',
    });
  };

  const formValidationSchema = Yup.object().shape({
    title: Yup.string().required('Tittel er et obligatorisk felt').min(6, 'Tittel må ha minimum 6 tegn'),
    issn: Yup.string().trim().matches(ISSNCodeFormat, 'ISSN er ikke på korrekt format (NNNN-NNNC)'),
    eissn: Yup.string().trim().matches(ISSNCodeFormat, 'e-ISSN er ikke på korrekt format (NNNN-NNNC)'),
  });

  return (
    <StyledFormWrapper>
      <Typography gutterBottom variant="caption">
        Felter merket med * er obligatoriske
      </Typography>
      <Formik initialValues={emptyFormValues} validationSchema={formValidationSchema} onSubmit={handleFormSubmit}>
        {({ isValid, handleSubmit }) => (
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
                onClick={() => {
                  //kan ikke bruke type=submit ettersom denne formiken er inni en annen formik
                  handleSubmit();
                }}
                data-testid="submit-create-journal-button">
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
  );
};
export default CreateJournalPanel;
