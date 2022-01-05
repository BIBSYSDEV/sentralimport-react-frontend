import React, { FC } from 'react';
import { Markup } from 'interweave';
import { cleanTitleForMarkup } from '../../utils/stringUtils';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';
import { ImportPublication } from '../../types/PublicationTypes';
import { Colors } from '../../assets/styles/StyleConstants';

const StyledImportPublicationPresentation = styled.div`
  padding-left: 1rem;
  margin: 1rem 0 1rem 0.4rem;
  border-left: 0.4rem solid ${Colors.PURPLE};
  color: ${Colors.PURPLE};
  word-wrap: break-word;
`;

const StyledTitleTypography = styled(Typography)`
  && {
    margin: 0 0 0.5rem;
    font-weight: bold;
    line-height: 1.2;
  }
`;

const generateAuthorPresentation = (importPublication: ImportPublication) => {
  return importPublication.authors
    .slice(0, 3)
    .map((author: any) => author.authorName)
    .join('; ')
    .concat(importPublication.authors.length > 3 ? ' et al.' : '');
};

interface ImportPublicationPresentationProps {
  importPublication: ImportPublication;
}

const ImportPublicationPresentation: FC<ImportPublicationPresentationProps> = ({ importPublication }) => {
  return (
    <>
      <Typography variant="h6">Importpublikasjon:</Typography>
      <StyledImportPublicationPresentation data-testid="duplicate-check-importdata">
        <StyledTitleTypography>
          {importPublication?.languages && (
            <Markup content={cleanTitleForMarkup(importPublication.languages[0].title)} />
          )}
        </StyledTitleTypography>
        <Typography>{generateAuthorPresentation(importPublication)}</Typography>
        <Typography>{importPublication.channel?.title}</Typography>
        <Typography>{importPublication.yearPublished}</Typography>
      </StyledImportPublicationPresentation>
    </>
  );
};

export default ImportPublicationPresentation;
