import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import data from "../ResultModal/data";

class ResultModal extends React.Component {
  state = {
    modal: false,
    index: this.props.index
  };

  toggle = this.toggle.bind(this);

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  componentDidRender() {}

  render() {
    let modalData = this.state.modaldata;

    return (
      <Modal
        isOpen={this.props.open}
        toggle={this.toggle}
        className={this.props.className}
      >
        <ModalHeader toggle={this.props.handleClose}>
          {" "}
          Detaljert info om prosjekt:{" "}
          {this.props.data.title.en || this.props.data.title.nb}
        </ModalHeader>
        <ModalBody>
          <div>Språk: {this.props.data.main_language}</div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.props.handleClose}>
            Do Something
          </Button>{" "}
          <Button color="secondary" onClick={this.props.handleClose}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

ResultModal.defaultProps = {
  data: {
    title: {
      nb: "Tittelen",
      en: "The title"
    },
    main_language: "nb"
  }
};

export default ResultModal;
