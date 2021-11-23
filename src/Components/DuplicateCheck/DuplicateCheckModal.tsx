import React, { FC, useContext, useState } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Context } from '../../Context';
import '../../assets/styles/Results.scss';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import ComparePublicationDataModal from '../ComparePublicationData/ComparePublicationDataModal';
import { ImportData } from '../../types/PublicationTypes';
import { Button, Divider, Grid } from '@material-ui/core';
import ImportPublicationPresentation from './ImportPublicationPresentation';
import DuplicateSearch from './DuplicateSearch';
import styled from 'styled-components';
import { changePublicationImportStatus } from '../../api/publicationApi';

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
  importPublication: ImportData;
}

const DuplicateCheckModal: FC<DuplicateCheckModalProps> = ({
  isDuplicateCheckModalOpen,
  handleDuplicateCheckModalClose,
  importPublication,
}) => {
  const { state, dispatch } = useContext(Context);
  const history = useHistory();
  const [isComparePublicationDataModalOpen, setIsComparePublicationDataModalOpen] = useState(false);
  const [isDuplicate, setDuplicate] = useState(false);
  const [selectedRadioButton, setSelectedRadioButton] = useState<string>(SelectValues.CREATE_NEW);

  function handleClickOkButton() {
    if (selectedRadioButton === SelectValues.CREATE_NEW) {
      dispatch({ type: 'doSave', payload: true });
      setDuplicate(false);
      setIsComparePublicationDataModalOpen(true);
    } else if (selectedRadioButton === SelectValues.TOGGLE_RELEVANT) {
      toggleRelevantStatus().then();
      handleDuplicateCheckModalClose();
      dispatch({ type: 'importDone', payload: !state.importDone });
    } else {
      dispatch({ type: 'doSave', payload: true });
      setDuplicate(true);
      setIsComparePublicationDataModalOpen(true);
    }
  }

  function handleComparePublicationDataModalClose() {
    setDuplicate(false);
    setIsComparePublicationDataModalOpen(false);
  }

  async function toggleRelevantStatus() {
    const relevantStatus = state.currentImportStatus !== 'ikke aktuelle';
    try {
      await changePublicationImportStatus(importPublication.pubId, relevantStatus);
    } catch (error) {
      console.log('Patch request failed:', error);
      if (
        axios.isAxiosError(error) &&
        (!error.response || error.response.status === 401 || error.response.status === 403)
      ) {
        localStorage.setItem('authorized', 'false');
        history.push('/login');
      } else {
        history.push('/error');
      }
    }
  }

  return (
    <StyledModal isOpen={isDuplicateCheckModalOpen} size="lg">
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
          </Grid>
        </Grid>
      </ModalFooter>

      <ComparePublicationDataModal
        isComparePublicationDataModalOpen={isComparePublicationDataModalOpen}
        handleComparePublicationDataModalClose={handleComparePublicationDataModalClose.bind(this)}
        handleDuplicateCheckModalClose={handleDuplicateCheckModalClose}
        importPublication={importPublication}
        cristinPublication={state.selectedPublication}
        isDuplicate={isDuplicate}
      />
    </StyledModal>
  );
};
export default DuplicateCheckModal;
