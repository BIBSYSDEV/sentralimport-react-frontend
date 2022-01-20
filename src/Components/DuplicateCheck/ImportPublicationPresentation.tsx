import React, { FC } from 'react';
import { Markup } from 'interweave';
import { cleanTitleForMarkup } from '../../utils/stringUtils';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';
import { ImportPublication } from '../../types/PublicationTypes';
import { Colors } from '../../assets/styles/StyleConstants';
import { ImportPublicationPerson } from '../../types/ContributorTypes';

const StyledImportPublicationPresentation = styled.div`
  padding-left: 1rem;
  word-wrap: break-word;
`;

const StyledTitleTypography = styled(Typography)`
  color: ${Colors.PURPLE};

  && {
    margin: 0 0 0.5rem;
    font-weight: bold;
    line-height: 1.2;
  }
`;

const StyledMetaDataTypography = styled(Typography)`
  color: ${Colors.BLACK};
  && {
    font-size: 0.8rem;
  }
`;

const StyledMonsterPostWarningTypography = styled(StyledMetaDataTypography)`
  color: ${Colors.WARNING};
  && {
    font-weight: 700;
  }
`;

const countFoundPersons = (persons: ImportPublicationPerson[]) => {
  return persons.filter((person: ImportPublicationPerson) => person.cristinId && person.cristinId !== 0).length;
};

const generateAuthorPresentation = (importPublication: ImportPublication) => {
  return importPublication.authors
    .slice(0, 5)
    .map((author: any) => author.authorName)
    .join('; ')
    .concat(importPublication.authors.length > 3 ? ' et al.' : '');
};

const filterTitle = (importPublication: ImportPublication) => {
  if (importPublication.languages) {
    return importPublication.languages.filter((l) => l.original)[0].title;
  }
};

interface ImportPublicationPresentationProps {
  importPublication: ImportPublication;
  isInImportTable?: boolean;
}

const ImportPublicationPresentation: FC<ImportPublicationPresentationProps> = ({
  importPublication,
  isInImportTable = false,
}) => {
  return (
    <StyledImportPublicationPresentation data-testid="duplicate-check-importdata">
      <StyledTitleTypography>
        {importPublication?.languages && <Markup content={cleanTitleForMarkup(filterTitle(importPublication))} />}
      </StyledTitleTypography>
      {!isInImportTable && importPublication.category && (
        <StyledMetaDataTypography>{importPublication.categoryName}</StyledMetaDataTypography>
      )}
      <StyledMetaDataTypography>{generateAuthorPresentation(importPublication)}</StyledMetaDataTypography>
      {isInImportTable &&
        (importPublication.authors.length > 100 ? (
          <StyledMonsterPostWarningTypography>
            ({importPublication.authors.length}) Stort antall bidragsytere
          </StyledMonsterPostWarningTypography>
        ) : (
          <StyledMetaDataTypography variant="caption">
            {`(${countFoundPersons(importPublication.authors)} av ${importPublication.authors.length} er verifisert)`}
          </StyledMetaDataTypography>
        ))}
      {importPublication.channel?.title && (
        <StyledMetaDataTypography>{importPublication.channel?.title}</StyledMetaDataTypography>
      )}
      <StyledMetaDataTypography>
        {importPublication.yearPublished + ';'}
        {importPublication.channel?.volume && importPublication.channel.volume + ';'}
        {importPublication.channel?.pageFrom && importPublication.channel.pageFrom + '-'}
        {importPublication.channel?.pageTo && importPublication.channel.pageTo}
        {importPublication.doi && ' doi:' + importPublication.doi}
      </StyledMetaDataTypography>
    </StyledImportPublicationPresentation>
  );
};

export default ImportPublicationPresentation;
