import { TextField, Typography } from '@material-ui/core';
import ActionButtons from './ActionButtons';
import { ErrorMessage, Field, FieldProps, useFormikContext } from 'formik';
import React, { FC } from 'react';
import {
  StyledDisabledTypography,
  StyledLineCristinValue,
  StyledLineImportValue,
  StyledLineLabelTypography,
  StyledLineWrapper,
} from './CompareFormWrappers';
import { CompareFormValuesType } from './CompareFormTypes';
import { ImportPublication } from '../../types/PublicationTypes';

interface CompareFormYearProps {
  importPublication: ImportPublication;
  isCristinPublicationSelected: boolean;
}

const CompareFormYear: FC<CompareFormYearProps> = ({ importPublication, isCristinPublicationSelected }) => {
  const { values, setFieldValue } = useFormikContext<CompareFormValuesType>();

  return (
    <StyledLineWrapper>
      <StyledLineLabelTypography htmlFor="cristindata-year">Årstall</StyledLineLabelTypography>
      <StyledLineImportValue>
        <Typography data-testid="importdata-year">{importPublication.yearPublished}</Typography>
      </StyledLineImportValue>
      <ActionButtons
        isImportAndCristinEqual={+values.year === +importPublication.yearPublished}
        isCopyButtonDisabled={!importPublication.yearPublished || isCristinPublicationSelected}
        copyCommand={() => setFieldValue('year', importPublication.yearPublished, true)}
        dataTestid={'compare-form-year-action'}
      />
      <StyledLineCristinValue>
        {!isCristinPublicationSelected ? (
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
        ) : (
          <StyledDisabledTypography data-testid="cristindata-year-for-duplicate">
            {values.year}
          </StyledDisabledTypography>
        )}
      </StyledLineCristinValue>
    </StyledLineWrapper>
  );
};

export default CompareFormYear;
