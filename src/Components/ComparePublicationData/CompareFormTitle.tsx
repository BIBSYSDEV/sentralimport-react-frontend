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
import { ImportPublication, Language } from '../../types/PublicationTypes';
import { cleanTitleForMarkup } from '../../utils/stringUtils';
import { Markup } from 'interweave';

interface CompareFormTitleProps {
  importPublication: ImportPublication;
  selectedLang?: Language; //todo: verdien vil vi få fra formik etterhvert
}

const CompareFormTitle: FC<CompareFormTitleProps> = ({ importPublication, selectedLang }) => {
  const { values, setFieldValue } = useFormikContext<CompareFormValuesType>();

  return (
    <StyledLineWrapper>
      <StyledLineLabelTypography htmlFor="Cristin-tittel">Tittel</StyledLineLabelTypography>
      <StyledLineImportValue>
        <Typography data-testid="importdata-title">
          <Markup content={cleanTitleForMarkup(selectedLang?.title)} />
        </Typography>
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
              {...field}
              id="Cristin-tittel"
              name="title"
              placeholder="Tittel"
              data-testid="cristindata-title-textfield"
              inputProps={{ 'data-testid': 'cristindata-title-textfield-input' }}
              required
              multiline
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
