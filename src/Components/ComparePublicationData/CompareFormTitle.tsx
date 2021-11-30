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

interface myProps {
  importPublication: any;
  selectedLang: any;
}

const CompareFormTitle: FC<myProps> = ({ importPublication, selectedLang }) => {
  const { values, setFieldValue } = useFormikContext<compareFormValuesType>();

  return (
    <StyledLineWrapper>
      <StyledLineLabelTypography htmlFor="Cristin-tittel">Tittel</StyledLineLabelTypography>
      <StyledLineImportValue>
        <Typography data-testid="importdata-title">{selectedLang?.title}</Typography>
      </StyledLineImportValue>
      <ActionButtons
        isImportAndCristinEqual={values.title === selectedLang?.title}
        isCopyBottonDisabled={!importPublication.languages}
        copyCommand={() => setFieldValue('title', selectedLang?.title ?? '', true)}
      />
      <StyledLineCristinValue>
        <Field name="title">
          {({ field, meta: { error } }: FieldProps) => (
            <TextField
              inputProps={{ 'data-testid': 'new-journal-form-title-input' }}
              {...field}
              error={!!error}
              data-testid="cristindata-title-textfield"
              id="Cristin-tittel"
              name="title"
              placeholder="Tittel"
              required
              multiline
              fullWidth
              helperText={<ErrorMessage name={field.name} />}
            />
          )}
        </Field>
      </StyledLineCristinValue>
    </StyledLineWrapper>
  );
};

export default CompareFormTitle;
