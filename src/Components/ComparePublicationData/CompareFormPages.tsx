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

interface CompareFormPagesProps {
  importPublication: ImportPublication;
}

const CompareFormPages: FC<CompareFormPagesProps> = ({ importPublication }) => {
  const { values, setFieldValue } = useFormikContext<CompareFormValuesType>();

  return (
    <StyledLineWrapper>
      <StyledLineLabelTypography>Sider</StyledLineLabelTypography>
      <StyledLineImportValue>
        <Typography data-testid="importdata-pages">
          {importPublication.channel?.pageFrom && `Fra: ${importPublication.channel.pageFrom}`}
          {importPublication.channel?.pageTo && ` Til: ${importPublication.channel.pageTo}`}
        </Typography>
      </StyledLineImportValue>
      <ActionButtons
        isImportAndCristinEqual={
          ((!importPublication.channel?.pageFrom && values.pageFrom === '') ||
            importPublication.channel?.pageFrom === values.pageFrom) &&
          ((!importPublication.channel?.pageTo && values.pageTo === '') ||
            importPublication.channel?.pageTo === values.pageTo)
        }
        isCopyButtonDisabled={!(importPublication.channel?.pageFrom || importPublication.channel?.pageTo)}
        copyCommand={() => {
          setFieldValue('pageFrom', importPublication.channel?.pageFrom ?? '', true);
          setFieldValue('pageTo', importPublication.channel?.pageTo ?? '', true);
        }}
        dataTestid={'compare-form-pages-action'}
      />
      <StyledLineCristinValue>
        <div style={{ display: 'flex' }}>
          <Field name="pageFrom">
            {({ field, meta: { error } }: FieldProps) => (
              <TextField
                {...field}
                id="cristindata-pagefrom"
                name="pageFrom"
                placeholder="Side fra"
                data-testid="cristindata-pages-textfield"
                inputProps={{ 'data-testid': 'cristindata-pagesfrom-textfield-input' }}
                error={!!error}
                helperText={<ErrorMessage name={field.name} />}
              />
            )}
          </Field>
          <Field name="pageTo">
            {({ field, meta: { error } }: FieldProps) => (
              <TextField
                {...field}
                id="cristindata-pageto"
                name="pageTo"
                placeholder="Side til"
                data-testid="cristindata-pages-textfield"
                inputProps={{ 'data-testid': 'cristindata-pagesto-textfield-input' }}
                style={{ marginLeft: '2rem' }}
                error={!!error}
                helperText={<ErrorMessage name={field.name} />}
              />
            )}
          </Field>
        </div>
      </StyledLineCristinValue>
    </StyledLineWrapper>
  );
};

export default CompareFormPages;
