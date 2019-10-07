import React, {useEffect} from "react";
import {Modal, ModalBody, ModalHeader} from "reactstrap";
import {
    TextField,
    FormGroup,
    Button,
    Grid,
    FormControl,
    IconButton,
    FormLabel
} from "@material-ui/core";
import {Form} from "reactstrap";
import {withSnackbar} from "notistack";
import TrendingFlatIcon from "@material-ui/icons/TrendingFlat";
import DragHandleIcon from "@material-ui/icons/DragHandle";
import Select from "react-select";
import ConfirmationDialog from "../ConfirmationDialog/ConfirmationDialog";
import ClosingDialog from "../ClosingDialog/ClosingDialog";
import Validation from "../Validation/Validation";
import {Context} from "../../Context";
import axios from "axios";
import '../../assets/styles/buttons.scss'
import ContributorModal from "../Contributors/ContributorModal";
import { green, red } from "@material-ui/core/colors";
import './style.css';

//TODO: erstatt react-select med ny funksjon for oppretting av tidsskrifter (react-creatable) og sett opp select for valg av kategori via dropdown
//TODO: skill mellom import og cristin felter med farge/styling

function InnerModal(props) {

    let {state, dispatch} = React.useContext(Context);

    useEffect(() => {
        function setFields() {
        console.log(props.duplicate);
        setKilde(props.duplicate ? (state.selectedPublication.hasOwnProperty("import_sources") ? state.selectedPublication.import_sources[0].source_name : "Ingen kilde funnet" ): props.data.sourceName);
        setKildeId(props.duplicate ? (state.selected.publication.hasOwnProperty("externalId") ? state.publication.externalId : "Ingen kildeId funnet") : props.data.externalId)
        setSelectedJournal(props.duplicate ? {
            value: state.selectedPublication.journal.name,
            label: state.selectedPublication.journal.name
        } : {
            value: " ",
            label: "Ingen tidsskrift funnet"
        });
        setTittel(props.duplicate ? state.selectedPublication.title.en : props.data.languages[0].title);
        setAarstall(props.duplicate ? state.selectedPublication.year_published : 
            props.data.registered.substring(
                props.data.registered.length - 4,
                props.data.registered.length
            ));
        setKategori(props.duplicate ? state.selectedPublication.category.code : props.data.category);
        setLang(props.duplicate ? state.selectedPublication.original_language : props.data.languages[0].lang);
        setDoi(props.duplicate ? state.selectedPublication.links[state.selectedPublication.links.length - 1].url.substring(
            16,
            state.selectedPublication.links[0].url.length + 1
          ) :(
            props.data.doi ? props.data.doi : "Ingen DOI funnet"));
        setUtgivelse(props.duplicate ? ( state.selectedPublication.hasOwnProperty("volume") ? "Volum " +
        state.selectedPublication.volume +
        " (" +
        state.selectedPublication.pages.from +
        "-" +
        state.selectedPublication.pages.to +
        ") " : "Ingen utgivelsesdata funnet") : (
        props.data.channel
            ? "Volum " +
            props.data.channel.volume +
            " (" +
            props.data.channel.pageFrom +
            "-" +
            props.data.channel.pageTo +
            ") "
            : "Ingen utgivelsesdata funnet"));
        }
        
        setFields();
    }, [props.duplicate, state.selectedPublication])
     
    const [kilde, setKilde] = React.useState("");

    const [kildeId, setKildeId] = React.useState("");

    const [contributorModal, setContributorModal] = React.useState(false);

    const [tittel, setTittel] = React.useState("");

    const [aarstall, setAarstall] = React.useState("");

    const [kategori, setKategori] = React.useState("");

    const [lang, setLang] = React.useState("");

    const [doi, setDoi] = React.useState("");

    const [utgivelse, setUtgivelse] = React.useState("");

    const [kildeIsEqual, setKildeIsEqual] = React.useState(true);

    const [kildeIdIsEqual, setKildeIdIsEqual] = React.useState(true);

    const [tittelIsEqual, setTittelIsEqual] = React.useState(true);

    const [aarstallIsEqual, setAarstallIsEqual] = React.useState(true);

    const [kategoriIsEqual, setKategoriIsEqual] = React.useState(true);

    const [langIsEqual, setLangIsEqual] = React.useState(true);

    const [doiIsEqual, setDoiIsEqual] = React.useState(true);

    const [journalIsEqual, setJournalIsEqual] = React.useState(true);

    const [utgivelseIsEqual, setUtgivelseIsEqual] = React.useState(true);

    const [selectedJournal, setSelectedJournal] = React.useState(props.duplicate ? {
        value: state.selectedPublication.journal.name,
        label: state.selectedPublication.journal.name
    } : {
        value: " ",
        label: "Ingen tidsskrift funnet"
    });

    const [dialogOpen, setDialogOpen] = React.useState(false);

    const [dialogAbortOpen, setDialogAbortOpen] = React.useState(false);

    const equalButtonStyle = {
        marginTop: "20px",
        marginLeft: "50px"
    };

    const arrowButtonStyle = {
        marginTop: "20px",
        marginLeft: "50px"
    };

    const selectStyle = {
        marginTop: "15px"
    };

    const tittelButtonStyle = {
        marginTop: "20px",
        marginLeft: "68px",
        color: red
    };

    const tittelEqualButtonStyle = {
        marginTop: "20px",
        marginLeft: "68px",
        color: green
    };

    const [journals, setJournals] = React.useState();

    useEffect(() => {
        async function getJournals() {
            await axios
                .get("https://api.cristin-utv.uio.no/v2/results/channels?type=journal")
                .then(response => {
                    console.log(response);
                    updateJournals(response.data);
                });
        }
        getJournals();
    }, []);

    function updateJournals(data) {
        var tempArray = [];
        for (var i = 0; i < data.length; i++) {
            tempArray.push({value: data[i].id, label: data[i].title});
        }
        setJournals(tempArray);
    }

    function handleChangeKilde(event) {
        if (event.target.value !== props.data.sourceName) {
            setKildeIsEqual(false);
        } else {
            setKildeIsEqual(true);
        }
        setKilde(event.target.value);
        dispatch({type: "setSelectedField", payload: "kilde"});
        dispatch({type: "setValidation", payload: event.target.value});
    }

    function handleChangeTittel(event) {
        if (event.target.value !== props.data.languages[0].title) {
            setTittelIsEqual(false);
        } else {
            setTittelIsEqual(true);
        }
        setTittel(event.target.value);
        dispatch({type: "setSelectedField", payload: "tittel"});
        dispatch({type: "setValidation", payload: event.target.value});
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
        dispatch({type: "setSelectedField", payload: "aarstall"});
        dispatch({type: "setValidation", payload: event.target.value});
    }

    function handleChangeKategori(event) {
        if (event.target.value !== props.data.category) {
            setKategoriIsEqual(false);
        } else {
            setKategoriIsEqual(true);
        }
        setKategori(event.target.value);
        dispatch({type: "setSelectedField", payload: "kategori"});
        dispatch({type: "setValidation", payload: event.target.value});
    }

    function handleChangeLang(event) {
        if (event.target.value !== props.data.languages[0].lang) {
            setLangIsEqual(false);
        } else {
            setLangIsEqual(true);
        }
        setLang(event.target.value);
        dispatch({type: "setSelectedField", payload: "spraak"});
        dispatch({type: "setValidation", payload: event.target.value});
    }

    function handleChangeDoi(event) {
        if (event.target.value !== props.data.doi) {
            setDoiIsEqual(false);
        } else {
            setDoiIsEqual(true);
        }
        setDoi(event.target.value);
        dispatch({type: "setSelectedField", payload: "doi"});
        dispatch({type: "setValidation", payload: event.target.value});
    }

    function handleChangeUtgivelse(event) {
        var utgivelse = props.data.channel
            ? "Volum " +
            props.data.channel.volume +
            " (" +
            props.data.channel.pageFrom +
            "-" +
            props.data.channel.pageTo +
            ") "
            : "Ingen utgivelsesdata funnet";
        if (event.target.value !== utgivelse) {
            setUtgivelseIsEqual(false);
        } else {
            setUtgivelseIsEqual(true);
        }
        setUtgivelse(event.target.value);
        dispatch({type: "setSelectedField", payload: "utgivelse"});
        dispatch({type: "setValidation", payload: event.target.value});
    }

    function handleChangeKildeId(event) {
        if(event.target.value !== props.data.externalId) {
            setKildeIdIsEqual(false);
        } else {
            setKildeIdIsEqual(true);
        }
    }

    function handleSubmit() {
        setDialogOpen(true);
    }

    function handleClose() {
        setDialogAbortOpen(true);
    }

    function handleContributorClose() {
        setContributorModal(false);
    }

    function copyKilde() {
        setKilde(props.data.sourceName);
        setKildeIsEqual(true);
        dispatch({type: "setSelectedField", payload: "kilde"});
        dispatch({type: "setValidation", payload: props.data.sourceName});
    }

    function copyKildeId() {
        setKildeId(props.data.externalId);
        setKildeIdIsEqual(true);
    }

    function copyTittel() {
        setTittel(props.data.languages[0].title);
        setTittelIsEqual(true);
        dispatch({type: "setSelectedField", payload: "tittel"});
        dispatch({type: "setValidation", payload: props.data.languages[0].title});
    }

    function copyAarstall() {
        setAarstall(
            props.data.registered.substring(
                props.data.registered.length - 4,
                props.data.registered.length
            )
        );
        setAarstallIsEqual(true);
        dispatch({type: "setSelectedField", payload: "aarstall"});
        dispatch({
            type: "setValidation",
            payload: props.data.registered.substring(
                props.data.registered.length - 4,
                props.data.registered.length
            )
        });
    }

    function copyKategori() {
        setKategori(props.data.category);
        setKategoriIsEqual(true);
        dispatch({type: "setSelectedField", payload: "kategori"});
        dispatch({type: "setValidation", payload: props.data.category});
    }

    function copyLang() {
        setLang(props.data.languages[0].lang);
        setLangIsEqual(true);
        dispatch({type: "setSelectedField", payload: "spraak"});
        dispatch({type: "setValidation", payload: props.data.languages[0].lang});
    }

    function copyDoi() {
        setDoi(props.data.doi ? props.data.doi : "Ingen DOI funnet");
        setDoiIsEqual(true);
        dispatch({type: "setSelectedField", payload: "doi"});
        dispatch({
            type: "setValidation",
            payload: props.data.doi ? props.data.doi : "Ingen doi funnet"
        });
    }

    function copyJournal() {
        setSelectedJournal(
            props.data.channel
                ? {
                    value: "x",
                    label: "Ingen tidsskrift funnet"
                }
                : {value: "x", label: "Ingen tidsskrift funnet"}
        );
        setJournalIsEqual(true);
        dispatch({type: "setSelectedField", payload: "tidsskrift"});
        dispatch({
            type: "setValidation",
            payload: {value: "x", label: "Ingen tidsskrift funnet"}
        });
    }

    function copyUtgivelse() {
        var utgivelse = props.data.channel
            ? "Volum " +
            props.data.channel.volume +
            " (" +
            props.data.channel.pageFrom +
            "-" +
            props.data.channel.pageTo +
            ") "
            : "Ingen utgivelsesdata funnet";
        setUtgivelse(utgivelse);
        setUtgivelseIsEqual(true);
        dispatch({type: "setSelectedField", payload: "utgivelse"});
        dispatch({
            type: "setValidation",
            payload: utgivelse
        });
    }

    function onChangeJournal(option) {
        if (option.value !== " ") {
            setJournalIsEqual(false);
        } else {
            setJournalIsEqual(true);
        }
        setSelectedJournal(option);
        console.log(option.label);
        dispatch({type: "setSelectedField", payload: "tidsskrift"});
        dispatch({type: "setValidation", payload: option.value});
    }

    function toggle() {
        setDialogOpen(false);
        props.toggle();
        props.enqueueSnackbar(
            "Importerte ny publikasjon med id: " + props.data.pubId,
            {
                variant: "success"
            }
        );
    }

    function abortToggle() {
        setDialogAbortOpen(false);
        props.toggle();
        props.enqueueSnackbar(
            "Lukket publikasjon. Endringer har ikke blitt lagret.",
            {
                variant: "warning"
            }
        );
    }

    function toggleDialog() {
        setDialogOpen(false);
    }

    function toggleAbortDialog() {
        setDialogAbortOpen(false);
    }

    function openContributorModal() {
        setContributorModal(true);
    }

    return (
        <div>
            <Modal isOpen={props.open} size="xl">
                <ModalHeader toggle={handleClose}>Import av publikasjon</ModalHeader>
                <ModalBody>
                    <Grid
                        container
                        direction="row"
                        justify="center"
                        alignItems="center"
                        xs
                        sm
                    >
                        <Grid container item sm={4} xs={12} alignContent="center" alignItems="center" style={{ marginLeft: "150px"}}>
                            <Form>
                                <h3>Importpublikasjon</h3>
                                <FormGroup>
                                    <Grid item xs>
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
                                        <FormControl required={true}>
                                            <TextField
                                                id="import-kilde"
                                                label="Kilde"
                                                value={props.data.sourceName}
                                                margin="normal"
                                                disabled
                                            />
                                        </FormControl>
                                        {kildeIsEqual ? (
                                            <IconButton color="primary" style={equalButtonStyle}>
                                                <DragHandleIcon />
                                            </IconButton>
                                        ) : (
                                            <IconButton  color="secondary" style={arrowButtonStyle} onClick={copyKilde}>
                                                <TrendingFlatIcon />
                                            </IconButton>
                                        )}
                                    </Grid>
                                </FormGroup>
                                <FormGroup>
                                    <Grid item>
                                        <FormControl required={true}>
                                            <TextField
                                                id="import-kildeid"
                                                label="KildeId"
                                                value={props.data.externalId}
                                                margin="normal"
                                                disabled
                                            />
                                        </FormControl>
                                        {kildeIdIsEqual ? (
                                            <IconButton color="primary" style={equalButtonStyle}>
                                                <DragHandleIcon />
                                            </IconButton>
                                        ) : (
                                            <IconButton  color="secondary" style={arrowButtonStyle} onClick={copyKildeId}>
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
                                            value={"Ingen tidsskrift funnet"}
                                            margin="normal"
                                            disabled
                                        />
                                        {journalIsEqual ? (
                                            <IconButton color="primary" style={equalButtonStyle}>
                                                <DragHandleIcon />
                                            </IconButton>
                                        ) : (
                                            <IconButton color="secondary" style={arrowButtonStyle} onClick={copyJournal}>
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
                                            value={props.data.doi || "Ingen DOI funnet"}
                                            margin="normal"
                                            disabled
                                        />
                                        {doiIsEqual ? (
                                            <IconButton color="primary" style={equalButtonStyle}>
                                                <DragHandleIcon />
                                            </IconButton>
                                        ) : (
                                            <IconButton color="secondary" style={arrowButtonStyle} onClick={copyDoi}>
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
                                            <IconButton color="primary" style={equalButtonStyle}>
                                                <DragHandleIcon />
                                            </IconButton>
                                        ) : (
                                            <IconButton color="secondary" style={arrowButtonStyle} onClick={copyLang}>
                                                <TrendingFlatIcon />
                                            </IconButton>
                                        )}
                                    </Grid>
                                </FormGroup>
                                <FormGroup>
                                    <Grid item container sm>
                                        <TextField
                                            id="import-tittel"
                                            label="Tittel"
                                            value={props.data.languages[0].title}
                                            margin="normal"
                                            disabled
                                            multiline
                                        />

                                        {tittelIsEqual ? (
                                            <IconButton color="primary" style={tittelEqualButtonStyle}>
                                                <DragHandleIcon />
                                            </IconButton>
                                        ) : (
                                            <IconButton color="secondary" style={tittelButtonStyle} onClick={copyTittel}>
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
                                            <IconButton color="primary" style={equalButtonStyle}>
                                                <DragHandleIcon />
                                            </IconButton>
                                        ) : (
                                            <IconButton color="secondary" style={arrowButtonStyle} onClick={copyAarstall}>
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
                                            <IconButton color="primary" style={equalButtonStyle}>
                                                <DragHandleIcon />
                                            </IconButton>
                                        ) : (
                                            <IconButton color="secondary" style={arrowButtonStyle} onClick={copyKategori}>
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
                                        {utgivelseIsEqual ? (
                                            <IconButton color="primary" style={equalButtonStyle}>
                                                <DragHandleIcon />
                                            </IconButton>
                                        ) : (
                                            <IconButton color="secondary" style={arrowButtonStyle} onClick={copyUtgivelse}>
                                                <TrendingFlatIcon />
                                            </IconButton>
                                        )}
                                    </Grid>
                                </FormGroup>
                                <FormGroup>
                                    <Grid item>
                                    <Button variant="contained" disabled margin="auto"> Disabled </Button>
                                    </Grid>
                                </FormGroup>
                            </Form>
                        </Grid>
                        <Grid container item sm={4}>
                            <Form>
                                <h3> Cristinpublikasjon </h3>
                                <FormGroup>
                                    <TextField
                                        id="cristin-id"
                                        label="Cristinid"
                                        margin="normal"
                                        value={props.duplicate ? props.cristinpub.cristin_result_id : ""}
                                        disabled
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <TextField
                                        id="import-opprettet"
                                        label="Dato opprettet"
                                        margin="normal"
                                        value={props.duplicate ? props.cristinpub.created.date.substring(0, 10) : ""}
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
                                    <TextField
                                        id="import-kildeid"
                                        label="KildeId"
                                        value={kildeId}
                                        onChange={event => handleChangeKildeId(event)}
                                        margin="normal"
                                        required
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <FormLabel style={selectStyle}> Tidsskrift </FormLabel>
                                    <Select
                                        placeholder="Søk på tidsskrift"
                                        name="journalSelect"
                                        options={journals}
                                        value={selectedJournal}
                                        className="basic-select"
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
                                        id="import-lang"
                                        label="Språk"
                                        value={lang}
                                        onChange={handleChangeLang}
                                        margin="normal"
                                        required
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Grid item>
                                    <TextField
                                        id="import-tittel"
                                        label="Tittel"
                                        name="Tittel"
                                        value={tittel}
                                        onChange={event => handleChangeTittel(event)}
                                        margin="normal"
                                        required
                                        multiline
                                    /> </Grid>
                                </FormGroup>
                                <FormGroup>
                                    <TextField
                                        id="import-aarstall"
                                        label="Årstall"
                                        value={aarstall}
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
                                        id="import-utgivelsesdata"
                                        label="Utgivelsesdata"
                                        value={utgivelse}
                                        onChange={handleChangeUtgivelse}
                                        margin="normal"
                                        required
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Button
                                        disabled={state.formErrors.length >= 1}
                                        color="primary"
                                        onClick={handleSubmit}
                                        variant="contained"
                                    >
                                        Importer
                                    </Button>
                                </FormGroup>
                            </Form>
                        </Grid>
                    </Grid>
                    <Button className={`contributorButton`} onClick={openContributorModal}>Bidragsytere</Button>
                    <div>{state.formErrors.map(error => { return(
                        <div>{error + "; "}</div>
                    )})}</div>
                </ModalBody>
                <Validation publication={props.duplicate ? state.selectedPublication : props.data} duplicate={props.duplicate} />
            </Modal>
            <ClosingDialog
                open={dialogAbortOpen}
                handleClose={abortToggle}
                handleCloseDialog={toggleAbortDialog}
            />
            <ConfirmationDialog
                open={dialogOpen}
                handleClose={toggle}
                handleCloseDialog={toggleDialog}
            />
            <ContributorModal
                open={contributorModal}
                toggle={handleContributorClose.bind(this)}
                data={props.data}
                duplicate={props.data.duplicate}
            />
        </div>
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
            journalName: "Ingen tidsskrift funnet",
            volume: "100",
            pageFrom: "1",
            pageTo: "10"
        }
    }
};

export default withSnackbar(InnerModal);
