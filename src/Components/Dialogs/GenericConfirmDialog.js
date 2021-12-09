import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { Context } from '../../Context';

export default function GenericConfirmDialog(props) {
  let { state } = React.useContext(Context);

  return (
    <Dialog
      open={props.open}
      onClose={(event, reason) => {
        if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
          props.handleClose();
        }
      }}
      disableEscapeKeyDown>
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{props.text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button data-testid="dialog-deny-button" color="secondary" onClick={props.handleAbort} variant="outlined">
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
