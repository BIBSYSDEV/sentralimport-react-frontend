import React from 'react';
import { Typography } from '@material-ui/core';
import styled from 'styled-components';
import { ImportPublicationPerson } from '../../types/ContributorTypes';
import { Colors } from '../../assets/styles/StyleConstants';
import { StyledVerifiedBadge } from '../../assets/styles/StyledBadges';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';

const StyledUnorderedList = styled.ul`
  list-style: none;
  overflow: auto;
`;

const StyledModal = styled(Modal)`
  width: 96%;
  min-width: 50rem;
  max-width: 80rem;
  min-height: 100%;
  margin: 1rem auto;
  padding: 0;
`;

const StyledListItem = styled.li`
  padding: 0.4rem;
`;

const StyledActivePersonNameTypography = styled(Typography)`
  color: ${Colors.Text.GREEN};
`;

const StyledMainUnitTypography = styled(Typography)`
  padding-bottom: 0.5rem;
`;

const StyledUnitTypography = styled(Typography)`
  && {
    font-size: 0.9rem;
  }
  padding: 4px 0 1rem 4px;
`;

const StyledUnverifiedPersonNameTypography = styled(Typography)`
  color: ${Colors.Text.OPAQUE_87_BLACK};
`;

const StyledAffiliationsWrapper = styled.div`
  margin: 1rem 0 0 0;
  background-color: ${Colors.LIGHT_GREY};
  padding: 0.5rem;
`;

const generateAffiliationView = (author: ImportPublicationPerson) => {
  const unitSplit: string[][] = author.institutions.map(
    (institution) => institution.unitName?.split(';').reverse() ?? []
  );
  return unitSplit.map((unit, index) => (
    <StyledAffiliationsWrapper key={index}>
      {unit.map((name, index) => {
        return index === 0 ? (
          <StyledMainUnitTypography key={index}>{name}</StyledMainUnitTypography>
        ) : (
          <StyledUnitTypography key={index}>{name}</StyledUnitTypography>
        );
      })}
    </StyledAffiliationsWrapper>
  ));
};

interface AuthorListModalProps {
  isAuthorListModalOpen: boolean;
  handleCloseAuthorListModal: () => void;
  authors: ImportPublicationPerson[] | undefined;
}

export default function AuthorListModal({
  isAuthorListModalOpen,
  handleCloseAuthorListModal,
  authors,
}: AuthorListModalProps) {
  return (
    <StyledModal isOpen={isAuthorListModalOpen} size="lg" data-testid="author-list-modal">
      <ModalHeader toggle={handleCloseAuthorListModal}>Forfatterliste</ModalHeader>
      <ModalBody>
        {authors === undefined ? (
          <div>Ingen forfattere funnet</div>
        ) : (
          <StyledUnorderedList>
            {authors.map((author, authorIndex) => (
              <StyledListItem key={authorIndex}>
                {author.cristinId !== 0 ? (
                  <StyledActivePersonNameTypography data-testid={`authorlist-name-${authorIndex}`} variant="h6">
                    <StyledVerifiedBadge data-testid={`authorlist-name-${authorIndex}-verified-badge`} />
                    {`${author.firstname ?? ''} ${author.surname ?? ''}`}
                  </StyledActivePersonNameTypography>
                ) : (
                  <StyledUnverifiedPersonNameTypography data-testid={`authorlist-name-${authorIndex}`} variant="h6">
                    {`${author.firstname ?? ''} ${author.surname ?? ''}`}
                  </StyledUnverifiedPersonNameTypography>
                )}
                {generateAffiliationView(author)}
              </StyledListItem>
            ))}
          </StyledUnorderedList>
        )}
      </ModalBody>
    </StyledModal>
  );
}
