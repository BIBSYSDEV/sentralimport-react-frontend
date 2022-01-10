import React, { FC, useState } from 'react';
import { Button, CircularProgress, TextField, Typography } from '@material-ui/core';
import styled from 'styled-components';
import { ErrorMessage, Field, FieldProps, Formik } from 'formik';
import * as Yup from 'yup';
import CommonErrorMessage from '../CommonErrorMessage';
import { IssnFormat } from '../../utils/stringUtils';
import { ChannelQueryMethod, getJournalsByQuery } from '../../api/publicationApi';
import { handlePotentialExpiredSession } from '../../api/api';

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
  const [isSearchingIssn, setIsSearchingIssn] = useState(false);
  const [errorFetchingJournal, setErrorFetchingJournal] = useState<Error | undefined>();

  const [isSearchingEIssn, setIsSearchingEIssn] = useState(false);

  const handleFormSubmit = (values: CreateJournalFormValues) => {
    !errorFetchingJournal &&
      handleCreateJournal({
        title: values.title.trim(),
        issn: values.issn.trim(),
        eissn: values.eissn.trim(),
        cristinTidsskriftNr: '0',
      });
  };

  const formValidationSchema = Yup.object().shape({
    title: Yup.string().required('Tittel er et obligatorisk felt'),
    issn: Yup.string()
      .trim()
      .matches(IssnFormat, 'ISSN er ikke på korrekt format (NNNN-NNNC)')
      .test('checkStandardNumberExists', 'ISSN eksisterer allerede', async (value) => {
        if (value && value.length > 8) {
          const issnExists = await checkStandardNumberExists(value, ChannelQueryMethod.issn);
          return !issnExists;
        }
        return true;
      }),
    eissn: Yup.string()
      .trim()
      .matches(IssnFormat, 'e-ISSN er ikke på korrekt format (NNNN-NNNC)')
      .test('checkStandardNumberExists', 'e-ISSN eksisterer allerede', async (value) => {
        if (value && value.length > 8) {
          const eIssnExists = await checkStandardNumberExists(value, ChannelQueryMethod.eissn);
          return !eIssnExists;
        }
        return true;
      }),
  });

  const checkStandardNumberExists = async (issnValue: string, type: ChannelQueryMethod) => {
    try {
      setErrorFetchingJournal(undefined);
      type === ChannelQueryMethod.eissn ? setIsSearchingEIssn(true) : setIsSearchingIssn(true);
      const response = await getJournalsByQuery(issnValue, type);
      return response.data.length > 0;
    } catch (error: any) {
      handlePotentialExpiredSession(error);
      setErrorFetchingJournal(error);
    } finally {
      type === ChannelQueryMethod.eissn ? setIsSearchingEIssn(false) : setIsSearchingIssn(false);
    }
  };

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
                  id="new-journal-title"
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
              {({ field, meta: { error } }: FieldProps) => (
                <StyledTextField
                  fullWidth
                  label="ISSN "
                  id="new-journal-issn"
                  data-testid="new-journal-form-issn-field"
                  inputProps={{ 'data-testid': 'new-journal-form-issn-input' }}
                  {...field}
                  error={!!error}
                  helperText={<ErrorMessage name={field.name} />}
                  InputProps={{
                    endAdornment: <>{isSearchingIssn && <CircularProgress color="inherit" size={'1rem'} />}</>,
                  }}
                />
              )}
            </Field>
            <Field name="eissn">
              {({ field, meta: { error } }: FieldProps) => (
                <StyledTextField
                  fullWidth
                  label="e-ISSN "
                  id="new-journal-eissn"
                  data-testid="new-journal-form-eissn-field"
                  inputProps={{ 'data-testid': 'new-journal-form-eissn-input' }}
                  {...field}
                  error={!!error}
                  helperText={<ErrorMessage name={field.name} />}
                  InputProps={{
                    endAdornment: <>{isSearchingEIssn && <CircularProgress color="inherit" size={'1rem'} />}</>,
                  }}
                />
              )}
            </Field>
            {errorFetchingJournal && <Typography color="error">Noe gikk galt under sjekk av issn/eissn.</Typography>}
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
              <CommonErrorMessage datatestid="new-journal-form-error" errorMessage="Det er feil i tidsskrift-skjema" />
            )}
          </>
        )}
      </Formik>
    </StyledFormWrapper>
  );
};
export default CreateJournalPanel;
