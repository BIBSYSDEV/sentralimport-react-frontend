import React, { useState } from 'react';
import { Button, Divider, Typography } from '@material-ui/core';
import styled from 'styled-components';
import { SavedPublicationLogLine } from '../../types/PublicationTypes';
import { Colors } from '../../assets/styles/StyleConstants';
import { CRISTIN_REACT_APP_URL } from '../../utils/constants';
import LaunchIcon from '@material-ui/icons/Launch';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';

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

const StyledPublicationItemWrapper = styled.div`
  margin: 1.5rem 0;
  display: flex;
  justify-content: space-between;
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

const StyledButtonLinkWrapper = styled.div`
  min-width: 13rem;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
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
          <>
            <StyledPublicationItemWrapper key={index} data-testid={`log-publication-${index}`}>
              <div>
                <StyledTitleTypography>{pub.title}</StyledTitleTypography>
                <StyledMetaDataTypography>{pub.authorsPresentation}</StyledMetaDataTypography>
              </div>
              <StyledButtonLinkWrapper>
                <Button
                  data-testid={`log-publication-button-${index}`}
                  color="default"
                  variant="outlined"
                  startIcon={<LaunchIcon />}
                  rel="noopener noreferrer"
                  target="_blank"
                  href={`${CRISTIN_REACT_APP_URL}/results/show.jsf?id=${pub.id}`}>
                  Vis publikasjon
                </Button>
              </StyledButtonLinkWrapper>
            </StyledPublicationItemWrapper>
            <Divider />
          </>
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
