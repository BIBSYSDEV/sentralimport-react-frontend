import React, { FC } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';

interface ConfirmRemoveContributorDialogProps {
  isDialogOpen: boolean;
  handleRemoveContributor: () => void;
  handleCloseDialog: () => void;
}
const ConfirmRemoveContributorDialog: FC<ConfirmRemoveContributorDialogProps> = ({
  isDialogOpen,
  handleCloseDialog,
  handleRemoveContributor,
}) => {
  return (
    <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
      <DialogTitle>Slett bidragsyter</DialogTitle>
      <DialogContent>
        <DialogContentText>Er du sikker på at du vil fjerne denne bidragsyteren?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button data-testid="dialog-deny-button" color="secondary" onClick={handleCloseDialog} variant="outlined">
          Nei
        </Button>
        <Button
          color="primary"
          data-testid="dialog-confirm-button"
          variant="contained"
          onClick={handleRemoveContributor}>
          Ja
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default ConfirmRemoveContributorDialog;
