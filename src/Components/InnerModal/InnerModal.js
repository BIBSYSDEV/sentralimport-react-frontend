import React from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { TextField, FormGroup, Button } from "@material-ui/core";
import { Form } from "reactstrap";

export default function InnerModal(props) {
  const kilde = props.data.sourceName;

  const [tittel, setTittel] = React.useState(props.data.title);

  const [aarstall, setAarstall] = React.useState(props.data.registered);

  const [kategori, setKategori] = React.useState(props.data.category);

  const [lang, setLang] = React.useState(props.data.originalLanguage);

  const [utgivelse, setUtgivelse] = React.useState(
    "Volum " +
      props.data.volume +
      " (" +
      props.data.pageFrom +
      "-" +
      props.data.pageTo +
      ") "
  );

  function handleChangeTittel(event) {
    setTittel(event.target.value);
  }

  function handleChangeAarstall(event) {
    setAarstall(event.target.value);
  }

  function handleChangeKategori(event) {
    setKategori(event.target.value);
  }

  function handleChangeLang(event) {
    setLang(event.target.value);
  }

  function handleChangeUtgivelse(event) {
    setUtgivelse(event.target.value);
  }

  return (
    <Modal isOpen={props.open}>
      <ModalHeader toggle={props.toggle}>Import av publikasjon</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <TextField
              id="import-kilde"
              label="Kilde"
              value={kilde}
              margin="normal"
              disabled
              required
            />
          </FormGroup>
          <FormGroup>
            <TextField
              id="import-tittel"
              label="Tittel"
              value={tittel}
              onChange={handleChangeTittel}
              margin="normal"
              multiline
              required
            />
          </FormGroup>
          <FormGroup>
            <TextField
              id="import-aarstall"
              label="Årstall"
              value={aarstall.substring(aarstall.length - 4, aarstall.length)}
              onChange={handleChangeAarstall}
              margin="normal"
              required
            />
          </FormGroup>
          <FormGroup>
            <TextField
              id="import-kategori"
              label="Kategori"
              value={kategori}
              onChange={handleChangeKategori}
              margin="normal"
              required
            />
          </FormGroup>
          <FormGroup>
            <TextField
              id="import-lang"
              label="Språk"
              value={lang}
              onChange={handleChangeLang}
              margin="normal"
              required
            />
          </FormGroup>
          <FormGroup>
            <TextField
              id="import-utgivelsesdata"
              label="Utgivelsesdata"
              value={utgivelse}
              onChange={handleChangeUtgivelse}
              margin="normal"
              disabled
              required
            />
          </FormGroup>
          <FormGroup>
            <Button color="green" onClick={props.toggle}>
              Submit
            </Button>
          </FormGroup>
        </Form>
      </ModalBody>
    </Modal>
  );
}
