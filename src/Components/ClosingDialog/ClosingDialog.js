import React from "react";
import {
  Dialog,
  Button,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText
} from "@material-ui/core";
import { Context } from "../../Context";

export default function ClosingDialog(props) {
  let { dispatch } = React.useContext(Context);

  var emptyArray = [];

  function emptyArr() {
    dispatch({ type: "setFormErrors", payload: emptyArray });
  }

  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      disableBackdropClick
      disableEscapeKeyDown
    >
      <DialogTitle>Avbryt import</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Er du sikker på at du vil lukke denne publikasjonen? <br />
          (Ulagrede endringer vil bli tapt)
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={props.handleCloseDialog}>
          Nei
        </Button>
        <Button
          color="primary"
          onClick={() => {
            emptyArr();
            props.handleClose();
          }}
        >
          Ja
        </Button>
      </DialogActions>
    </Dialog>
  );
}
