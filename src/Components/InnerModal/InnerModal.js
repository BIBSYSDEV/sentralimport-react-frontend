import React from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { TextField, FormGroup, Button } from "@material-ui/core";
import { Form } from "reactstrap";
import { withSnackbar } from "notistack";

function InnerModal(props) {
  const kilde = props.data.sourceName;

  const [tittel, setTittel] = React.useState(props.data.languages[0].title);

  const [aarstall, setAarstall] = React.useState(props.data.registered);

  const [kategori, setKategori] = React.useState(props.data.category);

  const [lang, setLang] = React.useState(props.data.languages[0].lang);

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

  function handleSubmit() {
    props.enqueueSnackbar("Endringer lagret", {
      variant: "success"
    });
    props.toggle();
  }

  function handleClose() {
    props.enqueueSnackbar("Endringer er ikke lagret!", { variant: "warning" });
    props.toggle();
  }

  return (
    <Modal isOpen={props.open}>
      <ModalHeader toggle={handleClose}>Import av publikasjon</ModalHeader>
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
              value={
                props.data.channel
                  ? "Volum " +
                    props.data.channel.volume +
                    " (" +
                    props.data.channel.pageFrom +
                    "-" +
                    props.data.channel.pageTo +
                    ") "
                  : "Ingen utgivelsesdata funnet"
              }
              margin="normal"
              disabled
              required
            />
          </FormGroup>
          <FormGroup>
            <Button color="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </FormGroup>
        </Form>
      </ModalBody>
    </Modal>
  );
}

InnerModal.defaultProps = {
  data: {
    registered: "200",
    categroy: "CAT",
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

export default withSnackbar(InnerModal);
