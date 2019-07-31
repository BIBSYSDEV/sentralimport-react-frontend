import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import {
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText
} from "reactstrap";
import {
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel
} from "@material-ui/core";
import InnerModal from "../InnerModal/InnerModal";

export default function ResultModal(props) {
  const [selected, setSelected] = React.useState("0");
  const [innerModal, setInnerModal] = React.useState(false);

  function handleChange(event) {
    setSelected(event.target.value);
  }

  function handleSubmit() {
    if (selected === "1") {
      setInnerModal(true);
    } else if (selected === 0) {
      this.props.handleClose();
    }
  }

  function handleClose() {
    setInnerModal(false);
  }

  return (
    <Modal isOpen={props.open}>
      <ModalHeader toggle={props.handleClose}>
        Importvalg for resultat
      </ModalHeader>
      <ModalBody>
        <ListGroup flush>
          <ListGroupItem>
            <ListGroupItemHeading>Importpublikasjon:</ListGroupItemHeading>
            <ListGroupItemText>
              {props.data.participants.map(participant => (
                <text>
                  {participant.surname}, {participant.first_name};{" "}
                </text>
              ))}
              {props.data.title.en || props.data.title.nb}
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
              <FormControl>
                <RadioGroup onChange={handleChange} row>
                  <FormControlLabel
                    value="0"
                    control={<Radio />}
                    label="Ikke importer"
                  />
                  <FormControlLabel
                    value="1"
                    control={<Radio />}
                    label="Opprett ny cristin-publikasjon basert på importpublikasjon"
                  />
                </RadioGroup>
              </FormControl>
            </div>
          </ListGroupItem>
        </ListGroup>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </ModalFooter>
      <InnerModal
        open={innerModal}
        toggle={handleClose.bind(this)}
        data={props.data}
      />
    </Modal>
  );
}

ResultModal.defaultProps = {
  data: {
    title: {
      nb: "Tittelen",
      en: "The title"
    },
    participants: []
  },
  isOpen: false
};
