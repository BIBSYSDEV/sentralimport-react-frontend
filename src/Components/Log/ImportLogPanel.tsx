import React, { useState } from 'react';
import { Button, Typography } from '@material-ui/core';
import styled from 'styled-components';
import { SavedPublicationLogLine } from '../../types/PublicationTypes';
import { Colors } from '../../assets/styles/StyleConstants';
import { CRISTIN_REACT_APP_URL } from '../../utils/constants';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import { StyledCristinLink } from '../ComparePublicationData/CompareFormWrappers';

const LogPanelWrapper = styled.div`
  display: flex;
  margin-top: 2rem;
  padding-left: 1rem;
`;

const StyledModal = styled(Modal)`
  width: 80%;
  max-width: 60rem;
  margin: 1rem auto;
  padding: 0;
`;

const StyledDivider = styled.hr`
  margin: 1.5rem 0 1rem 0;
`;

const StyledMetaDataTypography = styled(Typography)`
  color: ${Colors.BLACK};
  && {
    font-size: 0.8rem;
  }
`;

const StyledShowLogModalButton = styled(Button)`
  margin: 10px;
`;

const StyledTitleTypography = styled(Typography)`
  color: ${Colors.PURPLE};
  && {
    margin: 0 0 0.5rem;
    font-weight: bold;
    line-height: 1.2;
  }
`;

export default function ImportLogPanel() {
  const [openLogModal, setOpenLogModal] = useState(false);

  function showLogModal() {
    setOpenLogModal(!openLogModal);
  }

  function handleCloseModal() {
    setOpenLogModal(false);
  }

  function createLogModalContent() {
    const publications = JSON.parse(localStorage.getItem('log') ?? '[]') as any[];
    return publications && publications.length > 0 ? (
      <>
        {publications.reverse().map((pub: SavedPublicationLogLine, index: number) => (
          <div key={index} data-testid={`log-publication-${index}`}>
            <StyledCristinLink
              data-testid={`log-publication-link-${index}`}
              href={`${CRISTIN_REACT_APP_URL}/results/show.jsf?id=${pub.id}`}
              target="_blank"
              rel="noopener noreferrer">
              <StyledTitleTypography>{pub.title}</StyledTitleTypography>
            </StyledCristinLink>
            <StyledMetaDataTypography>{pub.authorsPresentation}</StyledMetaDataTypography>
            <StyledDivider />
          </div>
        ))}
        <Typography variant="caption">
          (Viser en liste over sist importerte publikasjoner lagret i minnet til nettleseren)
        </Typography>
      </>
    ) : (
      <Typography data-testid="no-log-content">
        Ingen nylig importerte publikasjoner funnet i minnet til nettleseren
      </Typography>
    );
  }

  return (
    <LogPanelWrapper data-testid="log-panel">
      <StyledShowLogModalButton color="default" onClick={showLogModal} variant="contained" data-testid="show-log-modal">
        Vis mine siste importerte publikasjoner
      </StyledShowLogModalButton>
      <StyledModal isOpen={openLogModal}>
        <ModalHeader toggle={handleCloseModal}>Mine siste importerte publikasjoner</ModalHeader>
        <ModalBody>{createLogModalContent()}</ModalBody>
      </StyledModal>
    </LogPanelWrapper>
  );
}
