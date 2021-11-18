import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { Context } from '../../Context';

export default function ClosingDialog(props) {
  let { state } = React.useContext(Context);

  return (
    <Dialog open={props.open} onClose={props.handleClose} disableBackdropClick disableEscapeKeyDown>
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{props.text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={props.handleCloseDialog} variant="outlined">
          Nei
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={() => {
            props.doFunction(state.param);
            props.handleClose();
          }}>
          Ja
        </Button>
      </DialogActions>
    </Dialog>
  );
}
