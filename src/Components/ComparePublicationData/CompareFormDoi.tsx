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
import { CompareFormValuesType } from './CompareFormTypes';
import { ImportPublication } from '../../types/PublicationTypes';

interface CompareFormDoiProps {
  importPublication: ImportPublication;
}

const DoiBaseUrl = 'https://doi.org/';

const CompareFormDoi: FC<CompareFormDoiProps> = ({ importPublication }) => {
  const { values, setFieldValue } = useFormikContext<CompareFormValuesType>();

  return (
    <StyledLineWrapper>
      <StyledLineLabelTypography>DOI</StyledLineLabelTypography>
      <StyledLineImportValue>
        <Typography data-testid="importdata-doi">
          {importPublication.doi ? (
            <a href={`${DoiBaseUrl}${importPublication.doi}`} target="_blank" rel="noopener noreferrer">
              {importPublication.doi}
            </a>
          ) : (
            'Ingen DOI funnet'
          )}
        </Typography>
      </StyledLineImportValue>
      <ActionButtons
        isImportAndCristinEqual={values.doi === importPublication.doi}
        isCopyButtonDisabled={!importPublication.doi}
        copyCommand={() => setFieldValue('doi', importPublication.doi, true)}
        dataTestid={'compare-form-doi-action'}
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
              fullWidth
              error={!!error}
              helperText={<p>howdy</p>}
            />
          )}
        </Field>
      </StyledLineCristinValue>
    </StyledLineWrapper>
  );
};

export default CompareFormDoi;
