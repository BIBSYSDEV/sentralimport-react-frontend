import React from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { TextField, FormGroup, Button, Grid } from "@material-ui/core";
import { Form } from "reactstrap";
import { withSnackbar } from "notistack";

function InnerModal(props) {
  const [kilde, setKilde] = React.useState(props.data.sourceName);

  const [tittel, setTittel] = React.useState(props.data.languages[0].title);

  const [aarstall, setAarstall] = React.useState(
    props.data.registered.substring(
      props.data.registered.length - 4,
      props.data.registered.length
    )
  );

  const [kategori, setKategori] = React.useState(props.data.category);

  const [lang, setLang] = React.useState(props.data.languages[0].lang);

  const [doi, setDoi] = React.useState(
    props.data.doi ? props.data.doi : "Ingen DOI funnet for publikasjon"
  );

  const [kildeIsEqual, setKildeIsEqual] = React.useState(true);

  const [tittelIsEqual, setTittelIsEqual] = React.useState(true);

  const [aarstallIsEqual, setAarstallIsEqual] = React.useState(true);

  const [kategoriIsEqual, setKategoriIsEqual] = React.useState(true);

  const [langIsEqual, setLangIsEqual] = React.useState(true);

  const [doiIsEqual, setDoiIsEqual] = React.useState(true);

  function handleChangeKilde(event) {
    if (event.target.value !== props.data.sourceName) {
      setKildeIsEqual(false);
    } else {
      setKildeIsEqual(true);
    }
    setKilde(event.target.value);
  }

  function handleChangeTittel(event) {
    if (event.target.value !== props.data.languages[0].title) {
      setTittelIsEqual(false);
    } else {
      setTittelIsEqual(true);
    }
    setTittel(event.target.value);
  }

  function handleChangeAarstall(event) {
    if (
      event.target.value !==
      props.data.registered.substring(
        props.data.registered.length - 4,
        props.data.registered.length
      )
    ) {
      setAarstallIsEqual(false);
    } else {
      setAarstallIsEqual(true);
    }
    setAarstall(event.target.value);
  }

  function handleChangeKategori(event) {
    if (event.target.value !== props.data.category) {
      setKategoriIsEqual(false);
    } else {
      setKategoriIsEqual(true);
    }
    setKategori(event.target.value);
  }

  function handleChangeLang(event) {
    if (event.target.value !== props.data.languages[0].lang) {
      setLangIsEqual(false);
    } else {
      setLangIsEqual(true);
    }
    setLang(event.target.value);
  }

  function handleChangeDoi(event) {
    if (event.target.value !== props.data.doi) {
      setDoiIsEqual(false);
    } else {
      setDoiIsEqual(true);
    }
    setDoi(event.target.value);
  }

  function handleSubmit() {
    props.enqueueSnackbar(
      "Importerte publikasjon med id: " + props.data.pubId,
      {
        variant: "success"
      }
    );
    props.toggle();
  }

  function handleClose() {
    props.enqueueSnackbar("Endringer er ikke blitt lagret.", {
      variant: "warning"
    });
    props.toggle();
  }

  function copyKilde() {
    setKilde(props.data.sourceName);
    setKildeIsEqual(true);
  }

  function copyTittel() {
    setTittel(props.data.languages[0].title);
    setTittelIsEqual(true);
  }

  function copyAarstall() {
    setAarstall(
      props.data.registered.substring(
        props.data.registered.length - 4,
        props.data.registered.length
      )
    );
    setAarstallIsEqual(true);
  }

  function copyKategori() {
    setKategori(props.data.category);
    setKategoriIsEqual(true);
  }

  function copyLang() {
    setLang(props.data.languages[0].lang);
    setLangIsEqual(true);
  }

  function copyDoi() {
    setDoi(
      props.data.doi ? props.data.doi : "Ingen DOI funnet for publikasjon"
    );
    setDoiIsEqual(true);
  }

  const buttonStyle = {
    marginTop: "30px"
  };

  return (
    <Modal isOpen={props.open} size="xl">
      <ModalHeader toggle={handleClose}>Import av publikasjon</ModalHeader>
      <ModalBody>
        <Grid container direction="row" justify="center" alignItems="center">
          <Grid container item xs={12} sm={4}>
            <Form>
              <h3>Importpublikasjon</h3>
              <FormGroup>
                <Grid item>
                  <TextField
                    id="import-kilde"
                    label="Kilde"
                    value={props.data.sourceName}
                    margin="normal"
                    disabled
                  />
                  {kildeIsEqual ? (
                    <Button style={buttonStyle}> == </Button>
                  ) : (
                    <Button style={buttonStyle} onClick={copyKilde}>
                      =>
                    </Button>
                  )}
                </Grid>
              </FormGroup>
              <FormGroup>
                <Grid item>
                  <TextField
                    id="import-doi"
                    label="Doi"
                    value={props.data.doi || "Ingen DOI funnet for publikasjon"}
                    margin="normal"
                    disabled
                  />
                  {doiIsEqual ? (
                    <Button style={buttonStyle}> == </Button>
                  ) : (
                    <Button style={buttonStyle} onClick={copyDoi}>
                      =>
                    </Button>
                  )}
                </Grid>
              </FormGroup>
              <FormGroup>
                <Grid item>
                  <TextField
                    id="import-tittel"
                    label="Tittel"
                    value={props.data.languages[0].title}
                    margin="normal"
                    disabled
                  />
                  {tittelIsEqual ? (
                    <Button style={buttonStyle}> == </Button>
                  ) : (
                    <Button style={buttonStyle} onClick={copyTittel}>
                      =>
                    </Button>
                  )}
                </Grid>
              </FormGroup>
              <FormGroup>
                <Grid item>
                  <TextField
                    id="import-aarstall"
                    label="Årstall"
                    value={props.data.registered.substring(
                      props.data.registered.length - 4,
                      props.data.registered.length
                    )}
                    margin="normal"
                    disabled
                  />
                  {aarstallIsEqual ? (
                    <Button style={buttonStyle}> == </Button>
                  ) : (
                    <Button style={buttonStyle} onClick={copyAarstall}>
                      =>
                    </Button>
                  )}
                </Grid>
              </FormGroup>
              <FormGroup>
                <Grid item>
                  <TextField
                    id="import-kategori"
                    label="Kategori"
                    value={props.data.category}
                    margin="normal"
                    disabled
                  />
                  {kategoriIsEqual ? (
                    <Button style={buttonStyle}> == </Button>
                  ) : (
                    <Button style={buttonStyle} onClick={copyKategori}>
                      =>
                    </Button>
                  )}
                </Grid>
              </FormGroup>
              <FormGroup>
                <Grid item>
                  <TextField
                    id="import-lang"
                    label="Språk"
                    value={props.data.languages[0].lang}
                    margin="normal"
                    disabled
                  />
                  {langIsEqual ? (
                    <Button style={buttonStyle}> == </Button>
                  ) : (
                    <Button style={buttonStyle} onClick={copyLang}>
                      =>
                    </Button>
                  )}
                </Grid>
              </FormGroup>
              <FormGroup>
                <Grid item>
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
                  />
                  <Button style={buttonStyle}> => </Button>
                </Grid>
              </FormGroup>
              <FormGroup>
                <Button disabled> Disabled </Button>
              </FormGroup>
            </Form>
          </Grid>
          <Grid container item xs={12} sm={4}>
            <Form>
              <h3> Cristinpublikasjon </h3>
              <FormGroup>
                <TextField
                  id="import-kilde"
                  label="Kilde"
                  value={kilde}
                  onChange={event => handleChangeKilde(event)}
                  margin="normal"
                  required
                />
              </FormGroup>
              <FormGroup>
                <TextField
                  id="import-doi"
                  label="Doi"
                  value={doi}
                  onChange={event => handleChangeDoi(event)}
                  margin="normal"
                  required
                />
              </FormGroup>
              <FormGroup>
                <TextField
                  id="import-tittel"
                  label="Tittel"
                  name="Tittel"
                  value={tittel}
                  onChange={event => handleChangeTittel(event)}
                  margin="normal"
                />
              </FormGroup>
              <FormGroup>
                <TextField
                  id="import-aarstall"
                  label="Årstall"
                  value={aarstall.substring(
                    aarstall.length - 4,
                    aarstall.length
                  )}
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
                  required
                />
              </FormGroup>
              <FormGroup>
                <Button color="primary" onClick={handleSubmit}>
                  Submit
                </Button>
              </FormGroup>
            </Form>
          </Grid>
        </Grid>
      </ModalBody>
    </Modal>
  );
}

InnerModal.defaultProps = {
  data: {
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

export default withSnackbar(InnerModal);
