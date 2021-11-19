import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { Context } from '../../Context';

export default function ConfirmDialog(props) {
  let { state } = React.useContext(Context);

  return (
    <Dialog open={props.open} onClose={props.handleClose} disableBackdropClick disableEscapeKeyDown>
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{props.text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button data-testid="dialog-deny-button" color="secondary" onClick={props.handleCloseDialog} variant="outlined">
          Nei
        </Button>
        <Button
          color="primary"
          data-testid="dialog-confirm-button"
          variant="contained"
          onClick={() => {
            props.doFunction(state.param); //urk!
            props.handleClose();
          }}>
          Ja
        </Button>
      </DialogActions>
    </Dialog>
  );
}
