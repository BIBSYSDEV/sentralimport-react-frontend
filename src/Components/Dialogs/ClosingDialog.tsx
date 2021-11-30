import React, { FC, useContext } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { Context } from '../../Context';

interface ClosingDialogProps {
  open: any;
  handleClose: any;
  title: string;
  text: string;
  handleConfirmButtonClick: any;
  handleCloseDialog: any;
}

//TODO: denne kan nok byttes ut med en Alert fra materiualUi for begge brukstilfellene
const ClosingDialog: FC<ClosingDialogProps> = ({
  open,
  handleClose,
  title,
  text,
  handleConfirmButtonClick,
  handleCloseDialog,
}) => {
  const { state } = useContext(Context);

  return (
    <Dialog open={open} onClose={handleClose} disableBackdropClick disableEscapeKeyDown>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={handleCloseDialog} variant="outlined">
          Nei
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={() => {
            handleConfirmButtonClick(state.param);
            handleClose();
          }}>
          Ja
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ClosingDialog;
