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
import { BrowserRouter, Route, Link } from "react-router-dom";


export default function ResultModal(props) {
  const [selected, setSelected] = React.useState("0");
  const [innerModal, setInnerModal] = React.useState(false);

  const divStyle = {
    fontWeight: "bold"
  };

  const style = {
    background: "green"
  };

  function handleChange(event) {
    setSelected(event.target.value);
  }

  function handleSubmit() {
    if (selected === "1") {
      setInnerModal(true);
      return(
        
      );
    } else if (selected === "0") {
      props.handleClose();
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
              {props.data.authors.map(author => (
                <span style={divStyle} key={author.sequenceNr}>
                  {author.authorName};{" "}
                </span>
              ))}
              {props.data.languages[0].title}
            </ListGroupItemText>
          </ListGroupItem>
          <ListGroupItem>
            <ListGroupItemHeading>
              Cristinpublikasjoner (Velg korrekt publikasjon fra Cristin):
            </ListGroupItemHeading>
            <ListGroupItemText>
              Det finnes ingen Cristinpublikasjoner som matcher
              importpublikasjonen
            </ListGroupItemText>
          </ListGroupItem>
          <ListGroupItem>
            <div>
              <FormControl>
                <RadioGroup onChange={handleChange} value={selected} row>
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
        <Button style={style} onClick={handleSubmit}>
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
    authors: [
      {
        authorName: "default1",
        sequenceNr: 0
      },
      {
        authorName: "default2",
        sequenceNr: 1
      }
    ],
    registered: "200",
    category: "CAT",
    languages: [
      {
        lang: "EN",
        title: "Title"
      }
    ],
    channel: {
      volume: "100",
      pageFrom: "1",
      pageTo: "10"
    }
  },
  isOpen: false
};
