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

interface CompareFormIssueProps {
  importPublication: ImportPublication;
}

const CompareFormIssue: FC<CompareFormIssueProps> = ({ importPublication }) => {
  const { values, setFieldValue } = useFormikContext<CompareFormValuesType>();

  return (
    <StyledLineWrapper>
      <StyledLineLabelTypography htmlFor="cristindata-issue">Hefte</StyledLineLabelTypography>
      <StyledLineImportValue>
        <Typography data-testid="importdata-issue">{importPublication.channel?.issue}</Typography>
      </StyledLineImportValue>
      <ActionButtons
        isImportAndCristinEqual={values.issue === importPublication.channel?.issue}
        isCopyBottonDisabled={!importPublication.channel?.issue}
        copyCommand={() => setFieldValue('issue', importPublication.channel?.issue ?? '', true)}
      />
      <StyledLineCristinValue>
        <Field name="issue">
          {({ field, meta: { error } }: FieldProps) => (
            <TextField
              {...field}
              id="cristindata-issue"
              name="issue"
              placeholder="Hefte"
              data-testid="cristindata-issue-textfield"
              inputProps={{ 'data-testid': 'cristindata-issue-textfield-input' }}
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

export default CompareFormIssue;
