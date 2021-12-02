import { Button, TextField, Typography } from '@material-ui/core';
import ActionButtons from './ActionButtons';
import { ErrorMessage, Field, FieldProps, useFormikContext } from 'formik';
import React, { FC } from 'react';
import {
  StyledActionButtonsPlaceHolder,
  StyledLineCristinValue,
  StyledLineImportValue,
  StyledLineLabelTypography,
  StyledLineWrapper,
} from './CompareFormWrappers';
import { compareFormValuesType } from './ComparePublicationDataModal';
import { ImportPublication, Language } from '../../types/PublicationTypes';
import ButtonGroup from '@material-ui/core/ButtonGroup/ButtonGroup';

interface CompareFormLanguageProps {
  importPublication: ImportPublication;
  languages?: Language;
  selectedLang?: any;
}

const CompareFormLanguage: FC<CompareFormLanguageProps> = ({ importPublication, selectedLang, languages }) => {
  const { values, setFieldValue } = useFormikContext<compareFormValuesType>();

  return (
    <StyledLineWrapper>
      <StyledLineLabelTypography>Språk</StyledLineLabelTypography>
      <StyledLineImportValue>
        <Typography data-testid="importdata-lang">{selectedLang?.lang}</Typography>
      </StyledLineImportValue>
      <StyledActionButtonsPlaceHolder />
      <StyledLineCristinValue>
        //TODO: language buttons are used to change title on different languages
        {/*  */}
        {/*<ButtonGroup*/}
        {/*  data-testid="cristindata-lang-buttongroup"*/}
        {/*  className={`buttonGroup`}*/}
        {/*  size="small"*/}
        {/*  aria-label="language buttons">*/}
        {/*  {languages.map((lang: Language, index: number) => (*/}
        {/*    <Button*/}
        {/*      key={lang.lang}*/}
        {/*      variant="outlined"*/}
        {/*      className={selectedLang === lang ? `selected` : ``}*/}
        {/*      onClick={() => handleSelectedLang(lang)}>*/}
        {/*      {lang.lang}*/}
        {/*    </Button>*/}
        {/*  ))}*/}
        {/*</ButtonGroup>*/}
      </StyledLineCristinValue>
    </StyledLineWrapper>
  );
};
/*
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

*/
export default CompareFormLanguage;
