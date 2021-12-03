import { Button, Typography } from '@material-ui/core';
import React, { FC } from 'react';
import {
  StyledActionButtonsPlaceHolder,
  StyledLineCristinValue,
  StyledLineImportValue,
  StyledLineLabelTypography,
  StyledLineWrapper,
} from './CompareFormWrappers';
import { Language } from '../../types/PublicationTypes';
import ButtonGroup from '@material-ui/core/ButtonGroup/ButtonGroup';

interface CompareFormLanguageProps {
  setSelectedLang: (lang: Language) => void;
  selectedLang?: Language;
  languages: Language[];
}

const CompareFormLanguage: FC<CompareFormLanguageProps> = ({ setSelectedLang, selectedLang, languages }) => {
  return (
    <StyledLineWrapper>
      <StyledLineLabelTypography>Språk</StyledLineLabelTypography>
      <StyledLineImportValue>
        <Typography data-testid="importdata-lang">{selectedLang?.lang}</Typography>
      </StyledLineImportValue>
      <StyledActionButtonsPlaceHolder />
      <StyledLineCristinValue>
        {selectedLang && (
          <ButtonGroup data-testid="cristindata-lang-buttongroup" aria-label="language buttons">
            {languages.map((language: Language) => (
              <Button
                key={language.lang}
                color="primary"
                variant={selectedLang?.lang === language.lang ? `contained` : `outlined`}
                onClick={() => setSelectedLang(language)}>
                {language.lang}
              </Button>
            ))}
          </ButtonGroup>
        )}
      </StyledLineCristinValue>
    </StyledLineWrapper>
  );
};

export default CompareFormLanguage;
