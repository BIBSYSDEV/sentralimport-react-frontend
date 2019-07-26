import React from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";

export default function InnerModal(props) {
  return (
    <Modal isOpen={props.open}>
      <ModalHeader toggle={props.toggle}>Import av publikasjon</ModalHeader>
      <ModalBody />
    </Modal>
  );
}
