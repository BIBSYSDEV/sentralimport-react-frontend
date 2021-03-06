import React, { FC, useContext, useState } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Context } from '../../Context';
import ComparePublicationDataModal from '../ComparePublicationData/ComparePublicationDataModal';
import { CristinPublication, ImportPublication } from '../../types/PublicationTypes';
import { Button, Divider, Grid, Typography } from '@material-ui/core';
import ImportPublicationPresentation from './ImportPublicationPresentation';
import DuplicateSearch from './DuplicateSearch';
import styled from 'styled-components';
import { changePublicationImportStatus, NOT_RELEVANT } from '../../api/publicationApi';
import { handlePotentialExpiredSession } from '../../api/api';
import { Colors } from '../../assets/styles/StyleConstants';

const StyledModal = styled(Modal)`
  width: 80%;
  max-width: 80rem;
  margin: 1rem auto;
  min-height: 100%;
  padding: 0;
`;

const StyledBodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 0.5rem;
`;

const StyledImportPublicationPresentationWrapper = styled.div`
  border-left: 0.4rem solid ${Colors.PURPLE};
  margin: 1rem 0;
`;

export enum SelectValues {
  TOGGLE_RELEVANT = 'toggle_relevant',
  CREATE_NEW = 'create_new',
  //could also be a cristinId
}

interface DuplicateCheckModalProps {
  isDuplicateCheckModalOpen: boolean;
  handleDuplicateCheckModalClose: () => void;
  importPublication: ImportPublication;
}

const DuplicateCheckModal: FC<DuplicateCheckModalProps> = ({
  isDuplicateCheckModalOpen,
  handleDuplicateCheckModalClose,
  importPublication,
}) => {
  const { state, dispatch } = useContext(Context);
  const [isComparePublicationDataModalOpen, setIsComparePublicationDataModalOpen] = useState(false);
  const [selectedRadioButton, setSelectedRadioButton] = useState<string>(SelectValues.CREATE_NEW);
  const [handleOkButtonError, setHandleOkButtonError] = useState<Error | undefined>();
  const [selectedPublication, setSelectedPublication] = useState<CristinPublication | undefined>();

  async function handleClickOkButton() {
    try {
      setHandleOkButtonError(undefined);
      if (selectedRadioButton === SelectValues.CREATE_NEW) {
        setSelectedPublication(undefined);
        setIsComparePublicationDataModalOpen(true);
      } else if (selectedRadioButton === SelectValues.TOGGLE_RELEVANT) {
        await toggleRelevantStatus();
        handleDuplicateCheckModalClose();
        dispatch({ type: 'triggerImportDataSearch', payload: !state.triggerImportDataSearch });
      } else {
        setIsComparePublicationDataModalOpen(true);
      }
    } catch (error) {
      handlePotentialExpiredSession(error);
      setHandleOkButtonError(error as Error);
    }
  }

  function handleComparePublicationDataModalClose() {
    setIsComparePublicationDataModalOpen(false);
  }

  async function toggleRelevantStatus() {
    const relevantStatus = state.currentImportStatus !== NOT_RELEVANT;
    setHandleOkButtonError(undefined);
    await changePublicationImportStatus(importPublication.pubId, relevantStatus);
  }

  return (
    <StyledModal isOpen={isDuplicateCheckModalOpen} size="lg" data-testid="duplicate-check-modal">
      <ModalHeader toggle={handleDuplicateCheckModalClose}>Importvalg for resultat</ModalHeader>
      <ModalBody>
        <StyledBodyWrapper>
          <Typography variant="h6">Importpublikasjon:</Typography>
          <StyledImportPublicationPresentationWrapper>
            <ImportPublicationPresentation importPublication={importPublication} />
          </StyledImportPublicationPresentationWrapper>
          <Divider />
          <DuplicateSearch
            importPublication={importPublication}
            setSelectedRadioButton={setSelectedRadioButton}
            selectedRadioButton={selectedRadioButton}
            setSelectedPublication={setSelectedPublication}
          />
        </StyledBodyWrapper>
      </ModalBody>
      <ModalFooter>
        <Grid container spacing={2} justifyContent="flex-end" alignItems="baseline">
          <Grid item>
            <Button
              data-testid="duplication-modal-cancel-button"
              variant="outlined"
              color="secondary"
              onClick={handleDuplicateCheckModalClose}>
              Avbryt
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              data-testid="duplication-modal-ok-button"
              onClick={handleClickOkButton}>
              OK
            </Button>
            {handleOkButtonError && <Typography color="error">Noe gikk galt {handleOkButtonError.message}</Typography>}
          </Grid>
        </Grid>
      </ModalFooter>
      {isComparePublicationDataModalOpen && (
        <ComparePublicationDataModal
          isComparePublicationDataModalOpen={isComparePublicationDataModalOpen}
          handleComparePublicationDataModalClose={handleComparePublicationDataModalClose.bind(this)}
          handleDuplicateCheckModalClose={handleDuplicateCheckModalClose}
          importPublication={importPublication}
          cristinPublication={selectedPublication}
        />
      )}
    </StyledModal>
  );
};
export default DuplicateCheckModal;
