import React from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";

export default function AuthorListModal(props) {

  function createRow(props) {
    return (
        <div style={{overflow: 'auto', height: props.data.authors.length < 5 ? props.data.authors.length * 70 : 350}}>
          {props.data.authors.map(author => (<div style={{padding: '5px'}}><b>{author.sequenceNr + ". " + author.authorName}</b><br />
            {author.institutions.map(inst => (<p style={{margin: 0}}><i>{inst.institutionName}</i></p>))}</div>))}
        </div>
    );
  }

  return (
    <Modal isOpen={props.open}>
      <ModalHeader toggle={props.handleClose}>Forfatterliste</ModalHeader>
      <ModalBody>
          {createRow(props)}
      </ModalBody>
    </Modal>
  );
}

AuthorListModal.defaultProps = {
  data: {
    authors: [
      {
        authorName: "default1",
        sequenceNr: 0,
        institutions: [
          {
            institutionName: "Name"
          }
        ]
      },
      {
        authorName: "default2",
        sequenceNr: 1,
        institutions: [
          {
            institutionName: "Name"
          }
        ]
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
  }
};
