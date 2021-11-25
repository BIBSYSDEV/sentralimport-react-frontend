import React from 'react';
import { Typography } from '@material-ui/core';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import styled from 'styled-components';
import { ImportPublicationPerson } from '../../types/ContributorTypes';

interface StyledUnorderedListProps {
  height: number;
}

const StyledUnorderedList = styled.ul<StyledUnorderedListProps>`
  list-style: none;
  overflow: auto;
  height: ${(props: StyledUnorderedListProps) => props.height};
`;

const StyledListItem = styled.li`
  padding: 0.4rem;
`;

interface AuthorListProps {
  authors: ImportPublicationPerson[] | undefined;
}

export default function AuthorList({ authors }: AuthorListProps) {
  return authors === undefined ? (
    <div>Ingen forfattere funnet</div>
  ) : (
    <StyledUnorderedList
      height={authors.length < 5 ? authors.length * 90 : 600}
      style={{ listStyle: 'none', overflow: 'auto', height: authors.length < 5 ? authors.length * 90 : 600 }}>
      {authors.map((author, authorIndex) => (
        <StyledListItem key={authorIndex}>
          <Typography>
            <b>{author.sequenceNr + '. ' + author.authorName}</b>
            {author.cristinId !== 0 && (
              <VerifiedUserIcon aria-label="har cristin id" style={{ paddingBottom: '0.3rem' }} color="primary" />
            )}
          </Typography>
          {author.institutions.map((inst, instIndex) => (
            <Typography variant="body2" key={instIndex}>
              <i>{inst.unitName}</i>
            </Typography>
          ))}
        </StyledListItem>
      ))}
    </StyledUnorderedList>
  );
}
