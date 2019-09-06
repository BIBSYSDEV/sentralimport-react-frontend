import React from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import {
  TextField,
  FormGroup,
  Button,
  Grid,
  FormControl,
  IconButton,
  FormControlLabel,
  FormLabel
} from "@material-ui/core";
import { Form } from "reactstrap";
import { withSnackbar } from "notistack";
import TrendingFlatIcon from "@material-ui/icons/TrendingFlat";
import DragHandleIcon from "@material-ui/icons/DragHandle";
import Select from "react-select";

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

  const [journalIsEqual, setJournalIsEqual] = React.useState(true);

  const [selectedJournal, setSelectedJournal] = React.useState({
    value: " ",
    label: "Ingen tidsskrift funnet"
  });

  const journals = [
    { value: " ", label: "Ingen tidsskrift funnet" },
    {
      value: "Journal of Clinical Oncology",
      label: "Journal of Clinical Oncology"
    }
  ];

  const buttonStyle = {
    marginTop: "20px",
    marginLeft: "50px"
  };

  const tittelButtonStyle = {
    marginTop: props.data.languages[0].title.length / 2 + 10,
    marginLeft: "50px"
  };

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

  function copyJournal() {
    setSelectedJournal(
      props.data.channel.journalName
        ? {
            value: props.data.channel.journalName,
            label: props.data.channel.journalName
          }
        : { value: " ", label: "Ingen tidsskrift funnet" }
    );
    setJournalIsEqual(true);
  }

  function onChangeJournal(option) {
    if (option.value !== props.data.channel.journalName) {
      setJournalIsEqual(false);
    } else {
      setJournalIsEqual(true);
    }
    setSelectedJournal(option);
  }

  return (
    <Modal isOpen={props.open} size="xl">
      <ModalHeader toggle={handleClose}>Import av publikasjon</ModalHeader>
      <ModalBody>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          sm={12}
        >
          <Grid container item xs={12} sm={4}>
            <Form>
              <h3>Importpublikasjon</h3>
              <FormGroup>
                <Grid item>
                  <TextField
                    id="import-id"
                    label="Pubid"
                    value={props.data.pubId}
                    margin="normal"
                    disabled
                  />
                </Grid>
              </FormGroup>
              <FormGroup>
                <Grid item>
                  <TextField
                    id="import-registrert"
                    label="Dato registrert"
                    value={props.data.registered}
                    margin="normal"
                    disabled
                  />
                </Grid>
              </FormGroup>
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
                    <IconButton style={buttonStyle}>
                      <DragHandleIcon />
                    </IconButton>
                  ) : (
                    <IconButton style={buttonStyle} onClick={copyKilde}>
                      <TrendingFlatIcon />
                    </IconButton>
                  )}
                </Grid>
              </FormGroup>
              <FormGroup>
                <Grid item>
                  <TextField
                    id="import-tidsskrift"
                    label="Tidsskrift"
                    value={
                      props.data.channel.journalName ||
                      "Ingen tidsskrift funnet"
                    }
                    margin="normal"
                    disabled
                  />
                  {journalIsEqual ? (
                    <IconButton style={buttonStyle}>
                      <DragHandleIcon />
                    </IconButton>
                  ) : (
                    <IconButton style={buttonStyle} onClick={copyJournal}>
                      <TrendingFlatIcon />
                    </IconButton>
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
                    <IconButton style={buttonStyle}>
                      <DragHandleIcon />
                    </IconButton>
                  ) : (
                    <IconButton style={buttonStyle} onClick={copyDoi}>
                      <TrendingFlatIcon />
                    </IconButton>
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
                    multiline
                  />
                  {tittelIsEqual ? (
                    <IconButton style={tittelButtonStyle}>
                      <DragHandleIcon />
                    </IconButton>
                  ) : (
                    <IconButton style={tittelButtonStyle} onClick={copyTittel}>
                      <TrendingFlatIcon />
                    </IconButton>
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
                    <IconButton style={buttonStyle}>
                      <DragHandleIcon />
                    </IconButton>
                  ) : (
                    <IconButton style={buttonStyle} onClick={copyAarstall}>
                      <TrendingFlatIcon />
                    </IconButton>
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
                    <IconButton style={buttonStyle}>
                      <DragHandleIcon />
                    </IconButton>
                  ) : (
                    <IconButton style={buttonStyle} onClick={copyKategori}>
                      <TrendingFlatIcon />
                    </IconButton>
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
                    <IconButton style={buttonStyle}>
                      <DragHandleIcon />
                    </IconButton>
                  ) : (
                    <IconButton style={buttonStyle} onClick={copyLang}>
                      <TrendingFlatIcon />
                    </IconButton>
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
                </Grid>
              </FormGroup>
              <FormGroup>
                <Button disabled> Disabled </Button>
              </FormGroup>
            </Form>
          </Grid>

          <Form>
            <h3> Cristinpublikasjon </h3>
            <FormGroup>
              <TextField
                id="cristin-id"
                label="Cristinid"
                margin="normal"
                disabled
              />
            </FormGroup>
            <FormGroup>
              <TextField
                id="import-opprettet"
                label="Dato opprettet"
                margin="normal"
                disabled
              />
            </FormGroup>
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
              <FormLabel> Tidsskrift </FormLabel>
              <Select
                placeholder="Søk på tidsskrift"
                name="journalSelect"
                options={journals}
                value={selectedJournal}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={onChangeJournal}
              />
            </FormGroup>
            <FormGroup>
              <FormControl required>
                <TextField
                  id="import-doi"
                  label="Doi"
                  value={doi}
                  onChange={event => handleChangeDoi(event)}
                  margin="normal"
                  required
                />
              </FormControl>
            </FormGroup>
            <FormGroup>
              <TextField
                id="import-tittel"
                label="Tittel"
                name="Tittel"
                value={tittel}
                onChange={event => handleChangeTittel(event)}
                margin="normal"
                required
                multiline
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
  },
  crispub: {
    crisId: "1234",
    registered: "300",
    category: "Cat2",
    languages: [
      {
        lang: "EN",
        title: "Lengre tittel"
      }
    ],
    channel: {
      volume: "350",
      pageFrom: "22",
      pageTo: "34"
    }
  }
};

export default withSnackbar(InnerModal);
