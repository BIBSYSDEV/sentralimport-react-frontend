import React, { FC, useContext, useState } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Context } from '../../Context';
import ComparePublicationDataModal from '../ComparePublicationData/ComparePublicationDataModal';
import { ImportPublication } from '../../types/PublicationTypes';
import { Button, Divider, Grid, Typography } from '@material-ui/core';
import ImportPublicationPresentation from './ImportPublicationPresentation';
import DuplicateSearch from './DuplicateSearch';
import styled from 'styled-components';
import { changePublicationImportStatus, NOT_RELEVANT } from '../../api/publicationApi';
import { handlePotentialExpiredSession } from '../../api/api';

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
  padding: 1rem;
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
  const [isDuplicate, setDuplicate] = useState(false);
  const [selectedRadioButton, setSelectedRadioButton] = useState<string>(SelectValues.CREATE_NEW);
  const [handleOkButtonError, setHandleOkButtonError] = useState<Error | undefined>();

  async function handleClickOkButton() {
    try {
      setHandleOkButtonError(undefined);
      if (selectedRadioButton === SelectValues.CREATE_NEW) {
        dispatch({ type: 'doSave', payload: true }); //TODO: trengs denne egentlig?
        setDuplicate(false);
        setIsComparePublicationDataModalOpen(true);
      } else if (selectedRadioButton === SelectValues.TOGGLE_RELEVANT) {
        await toggleRelevantStatus();
        handleDuplicateCheckModalClose();
        dispatch({ type: 'triggerImportDataSearch', payload: !state.triggerImportDataSearch });
      } else {
        dispatch({ type: 'doSave', payload: true });
        setDuplicate(true);
        setIsComparePublicationDataModalOpen(true);
      }
    } catch (error) {
      handlePotentialExpiredSession(error);
      setHandleOkButtonError(error as Error);
    }
  }

  function handleComparePublicationDataModalClose() {
    setDuplicate(false);
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
          <ImportPublicationPresentation importPublication={importPublication} />
          <Divider />
          <DuplicateSearch
            importPublication={importPublication}
            setSelectedRadioButton={setSelectedRadioButton}
            selectedRadioButton={selectedRadioButton}
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
      {/*TODO: only render ComparePublicationDataModal on handleClickOkButton (dropp å sette i state: "setSelectedPublication")*/}
      {isComparePublicationDataModalOpen && (
        <ComparePublicationDataModal
          isComparePublicationDataModalOpen={isComparePublicationDataModalOpen}
          handleComparePublicationDataModalClose={handleComparePublicationDataModalClose.bind(this)}
          handleDuplicateCheckModalClose={handleDuplicateCheckModalClose}
          importPublication={importPublication}
          cristinPublication={state.selectedPublication}
          isDuplicate={isDuplicate}
        />
      )}
    </StyledModal>
  );
};
export default DuplicateCheckModal;
