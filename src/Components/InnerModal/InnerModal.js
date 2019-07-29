import React from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { TextField, FormGroup } from "@material-ui/core";
import { Form } from "reactstrap";

export default function InnerModal(props) {
  const [tittel, setTittel] = React.useState(
    props.data.title.en || props.data.title.nb
  );

  const [aarstall, setAarstall] = React.useState(
    props.data.created.date.substring(0, 4)
  );

  const kilde = "SCOPUS";

  function handleChangeTittel(event) {
    setTittel(event.target.value);
  }

  function handleChangeAarstall(event) {
    setAarstall(event.target.value);
  }

  return (
    <Modal isOpen={props.open}>
      <ModalHeader toggle={props.toggle}>Import av publikasjon</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <TextField
              id="import-kilde"
              label="Kilde"
              value={kilde}
              margin="normal"
              disabled
            />
          </FormGroup>
          <FormGroup>
            <TextField
              id="import-tittel"
              label="Tittel"
              value={tittel}
              onChange={handleChangeTittel}
              margin="normal"
            />
          </FormGroup>
          <FormGroup>
            <TextField
              id="import-aarstall"
              label="Årstall"
              value={aarstall}
              onChange={handleChangeAarstall}
              margin="normal"
            />
          </FormGroup>
        </Form>
      </ModalBody>
    </Modal>
  );
}
