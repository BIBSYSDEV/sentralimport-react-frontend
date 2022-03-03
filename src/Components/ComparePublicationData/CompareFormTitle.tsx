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
import { cleanTitleForMarkup } from '../../utils/stringUtils';
import { Markup } from 'interweave';

interface CompareFormTitleProps {
  titlesFromImportPublicationMap: Map<string, string>;
}

const CompareFormTitle: FC<CompareFormTitleProps> = ({ titlesFromImportPublicationMap }) => {
  const { values, setFieldValue } = useFormikContext<CompareFormValuesType>();

  const langCodes = [...titlesFromImportPublicationMap.keys()];
  return (
    <>
      {langCodes.map((langCode, index) => (
        <StyledLineWrapper key={langCode}>
          <StyledLineLabelTypography htmlFor="Cristin-tittel">Tittel ({langCode})</StyledLineLabelTypography>
          <StyledLineImportValue>
            <Typography data-testid={`importdata-title-${langCode}`}>
              <Markup content={cleanTitleForMarkup(titlesFromImportPublicationMap.get(langCode))} />
            </Typography>
          </StyledLineImportValue>
          <ActionButtons
            isImportAndCristinEqual={values.titles[index].title === titlesFromImportPublicationMap.get(langCode)}
            isCopyButtonDisabled={false}
            copyCommand={() => setFieldValue(`titles[${index}].title`, titlesFromImportPublicationMap.get(langCode))}
            dataTestid={`compare-form-title-${langCode}-action`}
          />
          <StyledLineCristinValue>
            <Field name={`titles[${index}].title`}>
              {({ field, meta: { error } }: FieldProps) => (
                <TextField
                  {...field}
                  id={`Cristin-title-${index}`}
                  name={`titles[${index}].title`}
                  placeholder={`Tittel (${langCode})`}
                  data-testid={`cristindata-title-${langCode}-textfield`}
                  inputProps={{ 'data-testid': `cristindata-title-${langCode}-textfield-input` }}
                  multiline
                  fullWidth
                  error={!!error}
                  helperText={<ErrorMessage name={field.name} />}
                />
              )}
            </Field>
          </StyledLineCristinValue>
        </StyledLineWrapper>
      ))}
    </>
  );
};

export default CompareFormTitle;
