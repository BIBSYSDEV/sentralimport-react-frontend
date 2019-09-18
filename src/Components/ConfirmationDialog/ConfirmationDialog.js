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

export default function ConfirmationDialog(props) {
  let { dispatch } = React.useContext(Context);

  var emptyArray = [];

  function emptyArr() {
    dispatch({ type: "setFormErrors", payload: emptyArray });
  }
  return (
    <Dialog open={props.open} onClose={props.handleClose}>
      <DialogTitle>Bekreft import</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Er du sikker på at du vil importere denne publikasjonen?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={props.handleCloseDialog}>
          Avbryt
        </Button>
        <Button
          color="primary"
          onClick={() => {
            props.handleClose();
            emptyArr();
          }}
        >
          Importer
        </Button>
      </DialogActions>
    </Dialog>
  );
}
