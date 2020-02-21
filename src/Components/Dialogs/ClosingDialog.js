import React from "react";
import {
  Dialog,
  Button,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText
} from "@material-ui/core";
import {Context} from "../../Context";

export default function ClosingDialog(props) {
  let {state} = React.useContext(Context);

  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      disableBackdropClick
      disableEscapeKeyDown
    >
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {props.text}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={props.handleCloseDialog}>
          Nei
        </Button>
        <Button
          color="primary"
          onClick={() => {
            props.doFunction(state.param);
            props.handleClose();
          }}
        >
          Ja
        </Button>
      </DialogActions>
    </Dialog>
  );
}
