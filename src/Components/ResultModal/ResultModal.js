import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import {
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText
} from "reactstrap";
import InnerModal from "../InnerModal/InnerModal";
import { Duplicates } from "./Duplicates";
import { Context } from "../../Context";
import "../../assets/styles/Results.scss";
import axios from "axios";
import {useHistory} from "react-router-dom";
import {properties} from "../../properties";

export default function ResultModal(props) {
  const [innerModal, setInnerModal] = React.useState(false);
  const [isDuplicate, setDuplicate] = React.useState(false);
  let { state, dispatch } = React.useContext(Context);
  let history = useHistory();

  const divStyle = {
    fontWeight: "bold"
  };

  const style = {
    background: "green"
  };

  function handleSubmit() {
    if (state.selected === "true") {
      dispatch({type: "doSave", payload: true});
      setDuplicate(false);
      setInnerModal(true);
    } else if (state.selected === "false") {
      setNotRelevant();
      props.handleClose();
      props.removeFromList();
    } else {
      dispatch({type: "doSave", payload: true});
      setDuplicate(true);
      setInnerModal(true);
    }
  }

  function handleClose() {
    setInnerModal(false);
  }

  async function setNotRelevant() {
    let relevantStatus = state.currentImportStatus !== "ikke aktuelle";
    await axios.patch(
      properties.piarest_gatekeeper_url + "/sentralimport/publication/" +
        props.data.pubId,
      JSON.stringify({ not_relevant: relevantStatus }), JSON.parse(localStorage.getItem("config"))
    ).catch(function (e) {
      localStorage.setItem("authorized", "false");
      console.log("Patch request failed:", e);
      if (e.response && (e.response.status === 401 || e.response.status === 403)) {
        history.push("/login");
      } else {
        history.push("/error");
      }
    });
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
              {props.data.authors.slice(0, 5).map(author => (
                <span style={divStyle} key={author.sequenceNr}>
                  {author.authorName};{" "}
                </span>
              ))}
              {props.data.authors.length > 5
                ? "et al (" + props.data.authors.length + ") "
                : ""}
              {props.data.languages[0].title}
              <i>
                {props.data.hasOwnProperty("channel")
                  ? " " + props.data.channel.title + " "
                  : ""}
              </i>
              {props.data.registered.substring(
                props.data.registered.length - 4,
                props.data.registered.length
              ) + ";"}
              {props.data.hasOwnProperty("channel")
                ? props.data.channel.volume + ";"
                : ""}
              {props.data.hasOwnProperty("channel") &&
              props.data.channel.hasOwnProperty("pageFrom")
                ? props.data.channel.pageFrom + "-"
                : ""}
              {props.data.hasOwnProperty("channel") &&
              props.data.channel.hasOwnProperty("pageTo")
                ? props.data.channel.pageTo
                : ""}
              {props.data.hasOwnProperty("doi") ? " doi:" + props.data.doi : ""}
            </ListGroupItemText>
          </ListGroupItem>
          <ListGroupItem>
            <ListGroupItemHeading>
              Cristinpublikasjoner (Velg korrekt publikasjon fra Cristin):
            </ListGroupItemHeading>
            <div>
              <Duplicates publication={props.data} />
            </div>
          </ListGroupItem>
        </ListGroup>
      </ModalBody>
      <ModalFooter>
        <Button style={style} onClick={handleSubmit}>
          OK
        </Button>
      </ModalFooter>

      <InnerModal
        open={innerModal}
        toggle={handleClose.bind(this)}
        data={props.data}
        cristinpub={state.selectedPublication}
        duplicate={isDuplicate}
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
