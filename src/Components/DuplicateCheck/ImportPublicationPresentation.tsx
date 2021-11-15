import React, { FC } from 'react';
import { ListGroupItemHeading, ListGroupItemText } from 'reactstrap';
import { Markup } from 'interweave';
import { cleanTitleForMarkup } from '../../utils/stringUtils';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';
import { ImportData } from '../../types/PublicationTypes';

const StyledAuthorTypography = styled(Typography)`
  && {
    font-weight: bold;
  }
`;

interface ImportPublicationPresentationProps {
  importPublication: ImportData;
}

const ImportPublicationPresentation: FC<ImportPublicationPresentationProps> = ({ importPublication }) => {
  return (
    <>
      <ListGroupItemHeading>Importpublikasjon:</ListGroupItemHeading>
      <ListGroupItemText data-testid="duplicate-check-importdata">
        {importPublication.authors.slice(0, 5).map((author) => (
          <StyledAuthorTypography display="inline" key={author.sequenceNr}>
            {author.authorName};{' '}
          </StyledAuthorTypography>
        ))}
        {importPublication.authors.length > 5 && 'et al (' + importPublication.authors.length + ') '}
        {importPublication?.languages && <Markup content={cleanTitleForMarkup(importPublication.languages[0].title)} />}
        <i>{importPublication.channel && ' ' + importPublication.channel.title + ' '}</i>
        {importPublication.yearPublished + ';'}
        {importPublication.channel && importPublication.channel.volume + ';'}
        {importPublication.channel && importPublication.channel.pageFrom && importPublication.channel.pageFrom + '-'}
        {importPublication.channel && importPublication.channel.pageTo && importPublication.channel.pageTo}
        {importPublication.doi && ' doi:' + importPublication.doi}
      </ListGroupItemText>
    </>
  );
};

export default ImportPublicationPresentation;
