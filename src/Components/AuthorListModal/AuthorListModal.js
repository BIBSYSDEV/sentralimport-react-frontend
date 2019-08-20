import React from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { FixedSizeList as VList } from "react-window";

export default function AuthorListModal(props) {
  const Row = ({ data, index, style }) => {
    const items = data;
    return (
      <div style={style}>
        {items[index].sequenceNr}
        &nbsp;
        {items[index].authorName}
        <br />
        {items[index].institutions[0].institutionName}
      </div>
    );
  };

  return (
    <Modal isOpen={props.open}>
      <ModalHeader toggle={props.handleClose}>Forfatterliste</ModalHeader>
      <ModalBody>
        <VList
          height={
            props.data.authors.length < 5 ? props.data.authors.length * 60 : 250
          }
          itemCount={props.data.authors.length}
          itemSize={55}
          width={475}
          itemData={props.data.authors}
        >
          {Row}
        </VList>
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
