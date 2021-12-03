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
import { CompareFormValuesType } from './ComparePublicationDataModal';
import { ImportPublication } from '../../types/PublicationTypes';

interface CompareFormYearProps {
  importPublication: ImportPublication;
}

const CompareFormYear: FC<CompareFormYearProps> = ({ importPublication }) => {
  const { values, setFieldValue } = useFormikContext<CompareFormValuesType>();

  return (
    <StyledLineWrapper>
      <StyledLineLabelTypography htmlFor="cristindata-year">Årstall</StyledLineLabelTypography>
      <StyledLineImportValue>
        <Typography data-testid="importdata-year">{importPublication.yearPublished}</Typography>
      </StyledLineImportValue>
      <ActionButtons
        isImportAndCristinEqual={+values.year === +importPublication.yearPublished}
        isCopyBottonDisabled={!importPublication.yearPublished}
        copyCommand={() => setFieldValue('year', importPublication.yearPublished, true)}
      />
      <StyledLineCristinValue>
        <Field name="year">
          {({ field, meta: { error } }: FieldProps) => (
            <TextField
              {...field}
              id="Cristin-year"
              name="year"
              placeholder="Årstall"
              data-testid="cristindata-year-textfield"
              inputProps={{ 'data-testid': 'cristindata-year-textfield-input' }}
              required
              fullWidth
              error={!!error}
              helperText={<ErrorMessage name={field.name} />}
            />
          )}
        </Field>
      </StyledLineCristinValue>
    </StyledLineWrapper>
  );
};

export default CompareFormYear;
