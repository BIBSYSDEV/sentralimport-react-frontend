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
import { ImportPublication, Language } from '../../types/PublicationTypes';
import { cleanTitleForMarkup } from '../../utils/stringUtils';
import { Markup } from 'interweave';

interface CompareFormTitleProps {
  importPublication: ImportPublication;
  selectedLang: Language;
  updatePublicationLanguages: any;
}

const CompareFormTitle: FC<CompareFormTitleProps> = ({
  importPublication,
  selectedLang,
  updatePublicationLanguages,
}) => {
  const { values, handleBlur, setFieldValue } = useFormikContext<CompareFormValuesType>();

  return (
    <StyledLineWrapper>
      <StyledLineLabelTypography htmlFor="Cristin-tittel">Tittel</StyledLineLabelTypography>
      <StyledLineImportValue>
        <Typography data-testid="importdata-title">
          <Markup
            content={cleanTitleForMarkup(
              importPublication.languages?.filter((language: Language) => language?.lang === selectedLang?.lang)[0]
                ?.title
            )}
          />
        </Typography>
      </StyledLineImportValue>
      <ActionButtons
        isImportAndCristinEqual={values.title === selectedLang.title}
        isCopyButtonDisabled={!importPublication.languages}
        copyCommand={() => setFieldValue('title', selectedLang.title ?? '', true)}
        dataTestid={'compare-form-title-action'}
      />
      <StyledLineCristinValue>
        <Field name="title">
          {({ field, meta: { error } }: FieldProps) => (
            <TextField
              {...field}
              id="Cristin-title"
              name="title"
              placeholder="Tittel"
              data-testid="cristindata-title-textfield"
              inputProps={{ 'data-testid': 'cristindata-title-textfield-input' }}
              required
              multiline
              onBlur={(event) => {
                handleBlur(event);
                updatePublicationLanguages(values.title, selectedLang.lang);
              }}
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

export default CompareFormTitle;
