import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

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

  render() {
    return (
      <Modal
        isOpen={this.props.open}
        toggle={this.toggle}
        className={this.props.className}
      >
        <ModalHeader toggle={this.props.handleClose}>
          Importvalg for resultat
        </ModalHeader>
        <ModalBody>
          <div>
            Publikasjon:
            {this.props.data.participants.map(participant => (
              <div>
                {participant.surname}, {participant.first_name};
              </div>
            ))}
            {this.props.data.title.en || this.props.data.title.nb}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={this.props.handleClose}>
            Lukk
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
    participants: []
  }
};

export default ResultModal;
