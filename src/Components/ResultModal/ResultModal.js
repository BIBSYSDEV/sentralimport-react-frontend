import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import {
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText
} from "reactstrap";
import InnerModal from "../InnerModal/InnerModal";
import { Duplicates } from "./Duplicates"
import {Context} from "../../Context";

export default function ResultModal(props) {
  const [innerModal, setInnerModal] = React.useState(false);
  let { state } = React.useContext(Context);

  const divStyle = {
    fontWeight: "bold"
  };

  const style = {
    background: "green"
  };

  function handleSubmit() {
    if (state.selectedValue === "true") {
        setInnerModal(true);
    } else if (state.selectedValue === "false") {
        props.handleClose();
    } else {
        console.log(state.selectedPublication);
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
            <div>
                <Duplicates publication={props.data}/>
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
