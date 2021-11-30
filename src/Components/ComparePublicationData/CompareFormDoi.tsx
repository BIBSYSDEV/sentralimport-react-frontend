import { TextField, Typography } from '@material-ui/core';
import ActionButtons from './ActionButtons';
import { ErrorMessage, Field, FieldProps, useFormikContext } from 'formik';
import React, { FC } from 'react';
import {
  StyledLineCristinValue,
  StyledLineImportValue,
  StyledLineLabelTypography,
  StyledLineWrapper,
} from './CompareFormWrappers';
import { compareFormValuesType } from './ComparePublicationDataModal';
import { ImportPublication } from '../../types/PublicationTypes';

interface CompareFormDoiProps {
  importPublication: ImportPublication;
}

const CompareFormDoi: FC<CompareFormDoiProps> = ({ importPublication }) => {
  const { values, setFieldValue } = useFormikContext<compareFormValuesType>();

  return (
    <StyledLineWrapper>
      <StyledLineLabelTypography>DOI</StyledLineLabelTypography>
      <StyledLineImportValue>
        <Typography data-testid="importdata-doi">
          {importPublication.doi ? (
            <a href={`https://doi.org/${importPublication.doi}`} target="_blank" rel="noopener noreferrer">
              {importPublication.doi}
            </a>
          ) : (
            'Ingen DOI funnet'
          )}
        </Typography>
      </StyledLineImportValue>
      <ActionButtons
        isImportAndCristinEqual={values.doi === importPublication.doi}
        isCopyBottonDisabled={!importPublication.doi}
        copyCommand={() => setFieldValue('doi', importPublication.doi, true)}
      />
      <StyledLineCristinValue>
        <Field name="doi">
          {({ field, meta: { error } }: FieldProps) => (
            <TextField
              {...field}
              id="Cristin-doi"
              name="doi"
              placeholder="DOI"
              data-testid="cristindata-doi-textfield"
              inputProps={{ 'data-testid': 'cristindata-doi-textfield-input' }}
              required
              fullWidth
              error={!!error}
              helperText={<ErrorMessage name={field.name} />}
            />
          )}
        </Field>
        {/*<FormControl fullWidth>*/}
      </StyledLineCristinValue>
    </StyledLineWrapper>
  );
};

export default CompareFormDoi;
