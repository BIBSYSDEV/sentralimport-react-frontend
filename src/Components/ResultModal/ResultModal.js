import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import {
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText
} from "reactstrap";
import { fontWeight } from "@material-ui/system";
import { RadioGroup, Radio } from "@material-ui/core";

class ResultModal extends React.Component {
  state = {
    modal: false,
    index: this.props.index,
    selected: "0"
  };

  render() {
    return (
      <Modal isOpen={this.props.open} className={this.props.className}>
        <ModalHeader toggle={this.props.handleClose}>
          Importvalg for resultat
        </ModalHeader>
        <ModalBody>
          <ListGroup flush>
            <ListGroupItem>
              <ListGroupItemHeading>Importpublikasjon:</ListGroupItemHeading>
              <ListGroupItemText>
                {this.props.data.participants.map(participant => (
                  <text>
                    {participant.surname}, {participant.first_name};{" "}
                  </text>
                ))}
                {this.props.data.title.en || this.props.data.title.nb}
              </ListGroupItemText>
            </ListGroupItem>
            <ListGroupItem>
              <ListGroupItemHeading>Cristinpublikasjoner:</ListGroupItemHeading>
              <ListGroupItemText>
                Det finnes ingen Cristinpublikasjoner som matcher
                importpublikasjonen
              </ListGroupItemText>
            </ListGroupItem>
            <ListGroupItem>
              <div>
                <Radio
                  checked={this.state.selected === "0"}
                  onChange={this.handleChange}
                  value="0"
                  label="Ikke importer"
                />
                <Radio
                  checked={this.state.selected === "1"}
                  onChange={this.handleChange}
                  value="1"
                />
              </div>
            </ListGroupItem>
          </ListGroup>
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
