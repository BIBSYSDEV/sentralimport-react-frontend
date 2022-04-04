import React from 'react';
import { Typography } from '@material-ui/core';
import styled from 'styled-components';
import { ImportPublicationPerson } from '../../types/ContributorTypes';
import { Colors } from '../../assets/styles/StyleConstants';
import { StyledVerifiedBadgeSmall } from '../../assets/styles/StyledBadges';
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

const StyledUnverifiedPersonNameTypography = styled(Typography)`
  color: ${Colors.Text.OPAQUE_87_BLACK};
`;

const StyledAffiliationsWrapper = styled.div`
  margin-left: 0.5rem;
`;

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
                  <StyledActivePersonNameTypography data-testid={`author-list-name-${authorIndex}`} variant="h6">
                    {`${author.sequenceNr}. `}
                    <StyledVerifiedBadgeSmall data-testid={`author-list-name-${authorIndex}-verified-badge`} />
                    {`${author.firstname ?? ''} ${author.surname ?? ''} `}
                  </StyledActivePersonNameTypography>
                ) : (
                  <StyledUnverifiedPersonNameTypography data-testid={`author-list-name-${authorIndex}`} variant="h6">
                    {`${author.sequenceNr}. ${author.firstname ?? ''} ${author.surname ?? ''}`}
                  </StyledUnverifiedPersonNameTypography>
                )}
                {author.institutions.map((inst) => (
                  <StyledAffiliationsWrapper>{inst.unitName}</StyledAffiliationsWrapper>
                ))}
              </StyledListItem>
            ))}
          </StyledUnorderedList>
        )}
      </ModalBody>
    </StyledModal>
  );
}
