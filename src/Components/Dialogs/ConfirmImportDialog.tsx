import React, { FC, useState } from 'react';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import styled from 'styled-components';

const StyledProgressStatusTypography = styled(Typography)`
  && {
    margin: 0 1rem 0 0;
  }
`;

const CircularProgressWrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: flex-end;
`;

interface ConfirmImportDialogProps {
  handleImportPublicationConfirmed: (annotation?: string) => void;
  isOpen: boolean;
  handleAbort: any;
}

const ConfirmImportDialog: FC<ConfirmImportDialogProps> = ({
  handleImportPublicationConfirmed,
  isOpen,
  handleAbort,
}) => {
  const [annotation, setAnnotation] = useState<string | undefined>(undefined);
  const [isImportButtonClicked, setIsImportButtonClicked] = useState(false);

  function handleAnnotationChanged(event: React.ChangeEvent<HTMLInputElement>) {
    setAnnotation(event.target.value);
  }

  function handleImportButtonClick() {
    setIsImportButtonClicked(true);
    handleImportPublicationConfirmed(annotation);
  }

  return (
    <Dialog
      open={isOpen}
      onClose={(event, reason) => {
        if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
          handleAbort();
        }
      }}
      disableEscapeKeyDown>
      <DialogTitle>Bekreft import</DialogTitle>
      <DialogContent>
        <TextField
          placeholder="Om du ønsker å legge ved en merknad, skriv den inn her før du importerer"
          multiline
          minRows={3}
          maxRows={6}
          margin="normal"
          onChange={handleAnnotationChanged}
          fullWidth
          inputProps={{ maxLength: 250 }}
        />
        <DialogContentText>Er du sikker på at du vil importere denne publikasjonen?</DialogContentText>
        {isImportButtonClicked && (
          <CircularProgressWrapper>
            <StyledProgressStatusTypography>Importerer post</StyledProgressStatusTypography>
            <CircularProgress size={'1rem'} />
          </CircularProgressWrapper>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          color="secondary"
          onClick={handleAbort}
          variant="outlined"
          data-testid="confirm-import-dialog-cancel"
          disabled={isImportButtonClicked}>
          Avbryt
        </Button>
        <Button
          color="primary"
          disabled={isImportButtonClicked}
          variant="contained"
          data-testid="confirm-import-dialog-ok"
          onClick={handleImportButtonClick}>
          Importer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmImportDialog;
