import React from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';

export default function ListModal(props) {
  return (
    <Modal isOpen={props.open}>
      <ModalHeader toggle={props.handleClose}>{props.title}</ModalHeader>
      <ModalBody>{props.body}</ModalBody>
    </Modal>
  );
}
