import React, { FC } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';

interface ConfirmImportDialogProps {
  handleImportPublicationConfirmed: any;
  isOpen: boolean;
  handleAbort: any;
}

const ConfirmImportDialog: FC<ConfirmImportDialogProps> = ({
  handleImportPublicationConfirmed,
  isOpen,
  handleAbort,
}) => {
  const [annotation, setAnnotation] = React.useState(null);

  function handleAnnotationChanged(event: any) {
    setAnnotation(event.target.value);
  }

  function handleImportButtonClick() {
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
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={handleAbort} variant="outlined" data-testid="confirm-import-dialog-cancel">
          Avbryt
        </Button>
        <Button
          color="primary"
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
