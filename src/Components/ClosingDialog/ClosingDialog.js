import React from "react";
import {
  Dialog,
  Button,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText
} from "@material-ui/core";

export default function ClosingDialog(props) {
  return (
    <Dialog open={props.open} onClose={props.handleClose}>
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
        <Button color="primary" onClick={props.handleClose}>
          Ja
        </Button>
      </DialogActions>
    </Dialog>
  );
}
