import React, {useEffect} from "react";
import {Modal, ModalBody, ModalHeader, ModalFooter} from "reactstrap";
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
import { red } from "@material-ui/core/colors";
import './style.css';
import '../../assets/styles/buttons.scss'
import ButtonGroup from "@material-ui/core/ButtonGroup/ButtonGroup";
import cloneDeep from 'lodash/cloneDeep';
import CreateJournalPanel from "../CreateJournalPanel/CreateJournalPanel";
import {properties} from "../../properties";
import {makeStyles} from "@material-ui/styles";

const useStyles = makeStyles({
    doi: {
        cursor: 'pointer'
    }
});

//TODO: erstatt react-select med ny funksjon for oppretting av tidsskrifter (react-creatable) og sett opp select for valg av kategori via dropdown
//TODO: skill mellom import og cristin felter med farge/styling
//TODO: tidsskrift id er ikke med i duplikat. må derfor matche på issn i stedet?

function InnerModal(props) {

    const classes = useStyles();
    const { useRef, useLayoutEffect } = React;
    let {state, dispatch} = React.useContext(Context);
    const languageCopy = cloneDeep(props.data.languages.sort((a, b) => a.original - b.original).reverse());

    useEffect(() => {
        async function setFields() {
            let temp = JSON.parse(localStorage.getItem("tempPublication"));
            let workedOn = false;
            if (temp !== null && temp.publication.pubId === props.data.pubId && temp.publication.duplicate === props.duplicate)
                workedOn = true;

            setKilde(props.duplicate ? (state.selectedPublication.hasOwnProperty("import_sources") ? state.selectedPublication.import_sources[0].source_name : "Ingen kilde funnet") : props.data.sourceName);
            setKildeId(props.duplicate ? (state.selectedPublication.hasOwnProperty("import_sources") ? state.selectedPublication.import_sources[0].source_reference_id : "Ingen kildeId funnet") : props.data.externalId);

            setSelectedJournal(workedOn ?
                {
                    value: temp.publication.channel.cristinTidsskriftNr.toString(),
                    label: temp.publication.channel.title
                } :
                (props.duplicate ?
                    {
                        value: await getJournalId(state.selectedPublication.journal.international_standard_numbers),
                        label: state.selectedPublication.journal.name
                    }
                    :
                    {
                        value: props.data.hasOwnProperty("channel") && props.data.channel.hasOwnProperty("cristinTidsskriftNr") ? props.data.channel.cristinTidsskriftNr.toString() : "0",
                        label: props.data.hasOwnProperty("channel") ? props.data.channel.title : "Ingen tidsskrift funnet"
                    }
                )
            );

            setSelectedCategory(workedOn ?
                {
                    value: temp.publication.category,
                    label: temp.publication.categoryName
                } :
                (props.duplicate ?
                    {
                        value: state.selectedPublication.category.code,
                        label: state.selectedPublication.category.name.nb
                    }
                    :
                    {
                        value: props.data.category,
                        label: props.data.categoryName
                    }
                )
            );

            setLanguages(workedOn ?
                temp.publication.languages :
                (props.duplicate ?
                    [
                        {
                            title: state.selectedPublication.title.hasOwnProperty("nb") ? state.selectedPublication.title.nb : state.selectedPublication.title.en,
                            lang: state.selectedPublication.title.hasOwnProperty("nb") ? "NB" : "EN",
                            langName: state.selectedPublication.title.hasOwnProperty("nb") ? "Norsk, bokmål" : "Engelsk",
                            original: true
                        }
                    ]
                    :
                        languageCopy
                )
            );

            setSelectedLang(workedOn ?
                temp.publication.languages.filter(l => l.original)[0] :
                (props.duplicate ?
                    {
                        title: state.selectedPublication.title.hasOwnProperty("nb") ? state.selectedPublication.title.nb : state.selectedPublication.title.en,
                        lang: state.selectedPublication.title.hasOwnProperty("nb") ? "NB" : "EN",
                        langName: state.selectedPublication.title.hasOwnProperty("nb") ? "Norsk, bokmål" : "Engelsk",
                        original: true
                    } :
                        props.data.languages.filter(l => l.original)[0]
                )
            );

            setAarstall(workedOn ? temp.publication.registered :
                (props.duplicate ? state.selectedPublication.year_published :
                    props.data.registered.substring(
                        props.data.registered.length - 4,
                        props.data.registered.length
                    )));

            setDoi(workedOn ? temp.publication.doi :
                (props.duplicate ? state.selectedPublication.links[state.selectedPublication.links.length - 1].url.substring(16, state.selectedPublication.links[0].url.length + 1) :
                    (props.data.doi ? props.data.doi : "Ingen DOI funnet")));

            setPublishingDetails(workedOn ? temp.publication.channel :
                (props.duplicate ?
                    {
                        ...state.selectedPublication.journal,
                        volume: state.selectedPublication.hasOwnProperty("volume") ? state.selectedPublication.volume : "",
                        pageFrom: state.selectedPublication.hasOwnProperty("pages") ? state.selectedPublication.pages.from : "",
                        pageTo: state.selectedPublication.hasOwnProperty("pages") ? state.selectedPublication.pages.to : "",
                        issue: state.selectedPublication.hasOwnProperty("issue") ? state.selectedPublication.issue : ""
                    }
                    :
                        props.data.channel
                )
            );
        }
        
        setFields();
    }, [props.duplicate, state.selectedPublication]);

    const [kilde, setKilde] = React.useState("");

    const [kildeId, setKildeId] = React.useState("");

    const [contributorModal, setContributorModal] = React.useState(false);

    const [contributors] = React.useState(props.duplicate ? state.selectedPublication.authors : props.data.authors);

    const [aarstall, setAarstall] = React.useState("");

    const [categories, setCategories] = React.useState();

    const [languages, setLanguages] = React.useState(languageCopy);

    const [selectedLang, setSelectedLang] = React.useState(props.data.languages.filter(l => l.original)[0]);

    const [doi, setDoi] = React.useState("");

    const [publishingDetails, setPublishingDetails] = React.useState(props.data.channel);

    const [selectedJournal, setSelectedJournal] = React.useState(props.duplicate ? {
        value: state.selectedPublication.journal.name,
        label: state.selectedPublication.journal.name
    } : (props.data.hasOwnProperty("channel") && props.data.channel.hasOwnProperty("cristinTidsskriftNr") ? {
        value: props.data.channel.cristinTidsskriftNr.toString(),
        label: props.data.channel.title 
        } : {
        value: "0",
        label: "Ingen tidsskrift/journal funnet"
        })
    );

    const [selectedCategory, setSelectedCategory] = React.useState(props.duplicate ? {
        value: state.selectedPublication.category,
        label: state.selectedPublication.categoryName
    } : {
        value: " ",
        label: "Ingen kategori funnet"
    });

    const [dialogOpen, setDialogOpen] = React.useState(false);

    const [dialogAbortOpen, setDialogAbortOpen] = React.useState(false);

    const [journals, setJournals] = React.useState();

    const firstUpdate = useRef(true);
    useLayoutEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }
        handleTempSave();
    }, [selectedCategory, selectedJournal, doi, aarstall, selectedLang, publishingDetails]);

    useEffect(() => {
        async function fetch() {
            await getCategories();
            await getJournals(null);
        }
        fetch();
    }, []);

    function handleTempSave() {
        let temp = {
            publication: {
                cristinResultId: props.duplicate ? props.cristinpub.cristin_result_id : "",
                category: selectedCategory.value,
                categoryName: selectedCategory.label,
                channel: {
                    ...publishingDetails,
                    cristinTidsskriftNr: selectedJournal.value,
                    title: selectedJournal.label,
                    issn: selectedJournal.issn,
                    eissn: selectedJournal.eissn
                },
                doi: doi,
                languages: languages,
                pubId: props.data.pubId,
                registered: aarstall,
                duplicate: props.duplicate,
                import_sources: [
                    {
                        source_name: kilde,
                        source_reference_id: kildeId
                    }
                ],
                // authors: props.data.authors
            }
        };
        if (state.doSave)
            localStorage.setItem("tempPublication", JSON.stringify(temp));
    }

    function handleChangeJournal(option) {
        setSelectedJournal(option);
        dispatch({type: "setSelectedField", payload: "tidsskrift"});
        dispatch({type: "setValidation", payload: option.label});
    }

    function handleChangeTittel(event) {
        let index = languages.map(l => l.lang).indexOf(selectedLang.lang);
        setSelectedLang({...selectedLang, title: event.target.value});
        languages[index].title = event.target.value;
        setLanguages(languages);
    }

    function handleChangeAarstall(event) {
        setAarstall(event.target.value);
        dispatch({type: "setSelectedField", payload: "aarstall"});
        dispatch({type: "setValidation", payload: event.target.value});
    }

    function handleChangeCategory(option) {
        setSelectedCategory(option);
    }

    function handleSelectedLang(lang) {
        setSelectedLang(lang);
    }

    function handleChangeDoi(event) {
        setDoi(event.target.value);
        dispatch({type: "setSelectedField", payload: "doi"});
        dispatch({type: "setValidation", payload: event.target.value});
    }

    function handleChangeVolume(event) {
        setPublishingDetails({...publishingDetails, volume: event.target.value})
    }

    function handleChangeIssue(event) {
        setPublishingDetails({...publishingDetails, issue: event.target.value})
    }

    function handleChangePageFrom(event) {
        setPublishingDetails({...publishingDetails, pageFrom: event.target.value})
    }

    function handleChangePageTo(event) {
        setPublishingDetails({...publishingDetails, pageTo: event.target.value})
    }

    function handleSubmit() {
        if (state.contributors === null) {
            dispatch({type: "contributors", payload: contributors});
        }
        setDialogOpen(true);
    }

    function handleClose() {
        setDialogAbortOpen(true);
    }

    function handleContributorClose() {
        setContributorModal(false);
    }

    function copyTittel() {
        let originalTitle = props.data.languages.filter(lang => lang.lang === selectedLang.lang)[0].title;
        setSelectedLang({...selectedLang, title: originalTitle});
        let index = languages.map(l => l.lang).indexOf(selectedLang.lang);
        languages[index].title = props.data.languages.filter(lang => lang.lang === selectedLang.lang)[0].title;
        setLanguages(languages);
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
        dispatch({type: "setSelectedField", payload: "aarstall"});
        dispatch({
            type: "setValidation",
            payload: props.data.registered.substring(
                props.data.registered.length - 4,
                props.data.registered.length
            )
        });
    }

    function copyCategory() {
        setSelectedCategory({value: props.data.category, label: props.data.categoryName});
    }

    function copyDoi() {
        setDoi(props.data.doi ? props.data.doi : "Ingen DOI funnet");
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
                    value: props.data.channel.cristinTidsskriftNr.toString(),
                    label: props.data.channel.title,
                    issn: props.data.channel.issn,
                    eissn: props.data.channel.eissn
                }
                : {value: "x", label: "Ingen tidsskrift funnet"}
        );
        dispatch({type: "setSelectedField", payload: "tidsskrift"});
        dispatch({
            type: "setValidation",
            payload: props.data.channel.title
        });
    }

    function copyPages() {
        setPublishingDetails({...publishingDetails, pageFrom: props.data.channel.pageFrom, pageTo: props.data.channel.pageTo})
    }

    function copyVolume() {
        setPublishingDetails({...publishingDetails, volume: props.data.channel.volume})
    }

    function copyIssue() {
        setPublishingDetails({...publishingDetails, issue: props.data.channel.issue})
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

    function searchJournals(searchString) {
        getJournals(searchString);
    }

    const handleNewJournal = (newJournal) => {
        setSelectedJournal({label: newJournal.title, value: 0, issn: newJournal.issn, eissn: newJournal.eissn });
       
    };

    async function getJournals(name) {
        if (name === null || name === "")
            name = "*";
        await axios
            .get(properties.crisrest_gatekeeper_url + "/results/channels?type=journal&query=title_general:" + name, JSON.parse(localStorage.getItem("config")))
            .then(response => {
                updateJournals(response.data);
            });
    }

    async function getJournalId(issn) {
        if (issn === null || issn === "")
            return null;
        
        let journal = await axios.get(properties.crisrest_gatekeeper_url + "/results/channels?type=journal&query=issn:" + issn[0].value, JSON.parse(localStorage.getItem("config")));
        return journal.data[0].id;
    }

    async function getCategories() {
        let fetchedCategories = await axios.get(properties.crisrest_gatekeeper_url + "/results/categories?lang=nb", JSON.parse(localStorage.getItem("config")));

        let tempArray = [];
        for (let i = 0; i < fetchedCategories.data.length; i++) {
            tempArray.push({value: fetchedCategories.data[i].code, label: fetchedCategories.data[i].name.nb});
        }
        setCategories(tempArray);
    }

    function updateJournals(data) {
        let tempArray = [];
        for (let i = 0; i < data.length; i++) {
            tempArray.push({value: data[i].id, label: data[i].title, issn: data[i].issn, eissn: data[i].eissn});
        }
        setJournals(tempArray);
    }

    const equalButtonStyle = {
        marginTop: "20px",
        marginLeft: "50px"
    };

    const selectStyle = {
        marginTop: "10px",
        fontSize: 12
    };

    const labelStyle = {
        fontSize: 12,
        color: "rgba(0, 0, 0, 0.38)",
        paddingRight: "60px"
    };

    const tittelButtonStyle = {
        marginTop: "20px",
        marginLeft: "68px",
        color: red
    };

    const pageStyle = {
        maxWidth: "90px",
        margin: "3px",
        marginTop: "0px"
    };

    const modalContent = {
        justifyContent: 'center',
            alignItems: 'center',
            padding: 0
    };

    return (
        <div>
            <Modal isOpen={props.open} size="lg" style={modalContent}>
                <ModalHeader toggle={handleClose}>Import av publikasjon</ModalHeader>
                <ModalBody>
                    <Grid item
                        container
                        direction="row"
                        justify="center"
                        alignItems="center"
                        xs
                        sm
                    >
                        <Grid container item md={5} xs={12} alignContent="center" alignItems="center">
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
                                    </Grid>
                                </FormGroup>
                                <FormGroup>
                                    <Grid item>
                                        <TextField
                                            id="import-tidsskrift"
                                            label="Tidsskrift"
                                            value={props.data.hasOwnProperty("channel") ? props.data.channel.title : ""}
                                            margin="normal"
                                            disabled
                                        />
                                        {props.data.hasOwnProperty("channel") && selectedJournal.value === (props.data.channel.hasOwnProperty("cristinTidsskriftNr") ? props.data.channel.cristinTidsskriftNr.toString() : "") ? (
                                            <IconButton color="primary" style={equalButtonStyle}> <div hidden={true}> Lik </div>
                                                <DragHandleIcon />
                                            </IconButton>
                                        ) : (
                                            <IconButton color="secondary" style={equalButtonStyle} onClick={copyJournal}> <div hidden={true}> Ulik </div>
                                                <TrendingFlatIcon />
                                            </IconButton>
                                        )}
                                    </Grid>
                                </FormGroup>
                                <FormGroup>
                                    <Grid item>
                                        <a href={"https://doi.org/" + props.data.doi} target="_blank" rel="noopener noreferrer">
                                            <TextField
                                                id="import-doi"
                                                label="Doi"
                                                value={props.data.doi || "Ingen DOI funnet"}
                                                margin="normal"
                                                InputProps={{classes: { input: classes.doi} }}
                                                disabled
                                            />
                                        </a>
                                        {doi === props.data.doi ? (
                                            <IconButton color="primary" style={equalButtonStyle}> <div hidden={true}> Lik </div>
                                                <DragHandleIcon />
                                            </IconButton>
                                        ) : (
                                            <IconButton color="secondary" style={equalButtonStyle} onClick={copyDoi}> <div hidden={true}> Ulik </div>
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
                                            value={selectedLang.lang}
                                            margin="normal"
                                            disabled
                                        />
                                    </Grid>
                                </FormGroup>
                                <FormGroup>
                                    <Grid item container>
                                        <TextField
                                            aria-label="Import-tittel"
                                            id="Import-tittel"
                                            label="Tittel"
                                            value={languageCopy.filter(lang => lang.lang === selectedLang.lang)[0].title}
                                            margin="normal"
                                            disabled
                                            multiline
                                            aria-multiline="true"
                                            rowsMax="10"
                                        />

                                        {languageCopy.filter(lang => lang.lang === selectedLang.lang)[0].title === selectedLang.title ? (
                                            <IconButton color="primary" style={tittelButtonStyle}> <div hidden={true}> Lik </div>
                                                <DragHandleIcon />
                                            </IconButton>
                                        ) : (
                                            <IconButton color="secondary" style={tittelButtonStyle} onClick={copyTittel}> <div hidden={true}> Ulik </div>
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
                                        {aarstall === props.data.registered.substring(
                                            props.data.registered.length - 4,
                                            props.data.registered.length
                                        ) ? (
                                            <IconButton color="primary" style={equalButtonStyle}> <div hidden={true}> Lik </div>
                                                <DragHandleIcon />
                                            </IconButton>
                                        ) : (
                                            <IconButton color="secondary" style={equalButtonStyle} onClick={copyAarstall}> <div hidden={true}> Ulik </div>
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
                                            value={props.data.categoryName}
                                            margin="normal"
                                            disabled
                                        />
                                        {selectedCategory.label === props.data.categoryName ? (
                                            <IconButton color="primary" style={equalButtonStyle}> <div hidden={true}> Lik </div>
                                                <DragHandleIcon />
                                            </IconButton>
                                        ) : (
                                            <IconButton color="secondary" style={equalButtonStyle} onClick={copyCategory}> <div hidden={true}> Ulik </div>
                                                <TrendingFlatIcon />
                                            </IconButton>
                                        )}
                                    </Grid>
                                </FormGroup>
                                <FormGroup>
                                    <Grid item>
                                        <TextField
                                            id="import-utgivelsesdata"
                                            label="Volum"
                                            value={
                                                props.data.hasOwnProperty("channel") ? props.data.channel.volume
                                                    : "Ingen utgivelsesdata funnet"
                                            }
                                            margin="normal"
                                            disabled
                                        />
                                        {props.data.hasOwnProperty("channel") && props.data.channel.volume === publishingDetails.volume ? (
                                            <IconButton color="primary" style={equalButtonStyle}> <div hidden={true}> Lik </div>
                                                <DragHandleIcon />
                                            </IconButton>
                                        ) : (
                                            <IconButton color="secondary" style={equalButtonStyle} onClick={copyVolume}> <div hidden={true}> Ulik </div>
                                                <TrendingFlatIcon />
                                            </IconButton>
                                        )}
                                    </Grid>
                                    <Grid item>
                                        <TextField
                                            id="import-hefte"
                                            label="Hefte"
                                            value={
                                                props.data.hasOwnProperty("channel") ? props.data.channel.issue
                                                    : ""
                                            }
                                            margin="normal"
                                            disabled
                                        />
                                        {props.data.hasOwnProperty("channel") && props.data.channel.issue === publishingDetails.issue ? (
                                            <IconButton color="primary" style={equalButtonStyle}> <div hidden={true}> Lik </div>
                                                <DragHandleIcon />
                                            </IconButton>
                                        ) : (
                                            <IconButton color="secondary" style={equalButtonStyle} onClick={copyIssue}> <div hidden={true}> Ulik </div>
                                                <TrendingFlatIcon />
                                            </IconButton>
                                        )}
                                    </Grid>
                                    <Grid item container sm>
                                        <div>
                                        <label style={labelStyle} htmlFor="pageFrom">Side fra</label>
                                        <label style={labelStyle} htmlFor="pageTo">Side til</label>
                                        <div>
                                            <input
                                                id="pageFrom"
                                                value={props.data.hasOwnProperty("channel") ? props.data.channel.pageFrom : ""}
                                                style={pageStyle}
                                                disabled
                                            />
                                            <input
                                                id="pageTo"
                                                value={props.data.hasOwnProperty("channel") ? props.data.channel.pageTo : ""}
                                                style={pageStyle}
                                                disabled
                                            />
 </div>  </div>
                                        {props.data.hasOwnProperty("channel") && props.data.channel.pageFrom === publishingDetails.pageFrom && props.data.channel.pageTo === publishingDetails.pageTo ? (
                                            <IconButton color="primary" style={equalButtonStyle}> <div hidden={true}> Lik </div>
                                                <DragHandleIcon />
                                            </IconButton>
                                        ) : (
                                            <IconButton color="secondary" style={equalButtonStyle} onClick={copyPages}> <div hidden={true}> Ulik </div>
                                                <TrendingFlatIcon />
                                            </IconButton>
                                        )}
                                       
                                    </Grid>
                                </FormGroup>
                            </Form>
                        </Grid>
                        <Grid container item md={4} sm={12}>
                            <Form>
                                <h3> Cristinpublikasjon </h3>
                                <FormGroup>
                                    <TextField
                                        id="Cristin-id"
                                        label="Cristinid"
                                        margin="normal"
                                        value={props.duplicate ? props.cristinpub.cristin_result_id : ""}
                                        disabled
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <TextField
                                        id="Cristin-opprettet"
                                        label="Dato opprettet"
                                        margin="normal"
                                        value={props.duplicate ? props.cristinpub.created.date.substring(0, 10) : ""}
                                        disabled
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <TextField
                                        id="Cristin-kilde"
                                        label="Kilde"
                                        value={kilde}
                                        margin="normal"
                                        required
                                        disabled
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <TextField
                                        id="Cristin-kildeid"
                                        label="KildeId"
                                        value={kildeId}
                                        margin="normal"
                                        required
                                        disabled
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <FormLabel style={selectStyle}> Tidsskrift </FormLabel>
                                    <Select
                                    aria-label="Tidsskrift-select"
                                        placeholder="Søk på tidsskrift"
                                        name="journalSelect"
                                        options={journals}
                                        value={selectedJournal}
                                        className="basic-select"
                                        classNamePrefix="select"
                                        onChange={handleChangeJournal}
                                        onInputChange={searchJournals}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <FormControl required>
                                        <TextField
                                            id="Cristin-doi"
                                            label="Doi"
                                            value={doi}
                                            onChange={event => handleChangeDoi(event)}
                                            margin="normal"
                                            required
                                        />
                                    </FormControl>
                                </FormGroup>
                                <FormGroup>
                                    <label style={labelStyle}>Språk</label>
                                    <ButtonGroup className={`buttonGroup`} variant="contained" size="sm all" aria-label="small contained button group">
                                    {languages.map((lang, i) =>
                                        <Button key={i} className={selectedLang === lang ? `selected` : ``} onClick={() => handleSelectedLang(lang)}>{lang.lang}</Button>
                                    )}
                                    </ButtonGroup>
                                </FormGroup>
                                <FormGroup>
                                    <Grid item>
                                    <TextField
                                        id="Cristin-tittel"
                                        label="Tittel"
                                        name="Tittel"
                                        value={selectedLang.title}
                                        onChange={event => handleChangeTittel(event)}
                                        margin="normal"
                                        required
                                        multiline
                                        defaultValue=""
                                    /> </Grid>
                                </FormGroup>
                                <FormGroup>
                                    <TextField
                                        id="Cristin-aarstall"
                                        label="Årstall"
                                        value={aarstall}
                                        onChange={handleChangeAarstall}
                                        margin="normal"
                                        required
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <FormLabel style={selectStyle}> Kategori </FormLabel>
                                    <Select
                                        aria-label="Kategori"
                                        placeholder="Søk på kategori"
                                        name="categorySelect"
                                        options={categories}
                                        value={selectedCategory}
                                        className="basic-select"
                                        classNamePrefix="select"
                                        onChange={handleChangeCategory}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Grid item>
                                        <TextField
                                            id="Cristin-utgivelsesdata"
                                            label="Volum"
                                            value={publishingDetails ? publishingDetails.volume : ""}
                                            margin="normal"
                                            onChange={handleChangeVolume}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <TextField
                                            id="Cristin-hefte"
                                            label="Hefte"
                                            value={publishingDetails ? publishingDetails.issue : ""}
                                            margin="normal"
                                            onChange={handleChangeIssue}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <label style={labelStyle} htmlFor="pageFromCristin">Side fra</label>
                                        <label style={labelStyle} htmlFor="pageToCristin">Side til</label>
                                        <div>
                                            <input
                                                id="pageFromCristin"
                                                value={publishingDetails ? publishingDetails.pageFrom : ""}
                                                style={pageStyle}
                                                onChange={handleChangePageFrom}
                                            />
                                            <input
                                                id="pageToCristin"
                                                value={publishingDetails ? publishingDetails.pageTo : ""}
                                                style={pageStyle}
                                                onChange={handleChangePageTo}
                                            />
                                        </div>
                                    </Grid>
                                </FormGroup>                             
                            </Form>
                        </Grid>
                    </Grid> 
                    <div className={"createJournalPanel"}> {/* TODO: Flytt CreateJournalPanel opp til tidsskrift. Overflow-y i forhold til grid/form? */}
                    <CreateJournalPanel handleCreateJournal={handleNewJournal}/>
                    </div>
                    <div>{state.formErrors.map((error, i) => { return(
                        <div key={i}>{error + "; "}</div>
                    )})}</div>
                     <Button className={`contributorButton`} onClick={openContributorModal} variant="contained">Bidragsytere</Button>
                </ModalBody>
                <Validation publication={props.duplicate ? state.selectedPublication : props.data} duplicate={props.duplicate} />
                <ModalFooter>
                <Button onClick={handleClose} variant="contained" color="secondary">Avbryt</Button>
                <Button
                    disabled={state.formErrors.length >= 1}
                    color="primary"
                    onClick={handleSubmit}
                    variant="contained"
                >
                Importer
                </Button>
                </ModalFooter>
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
                data={props.data}
                duplicate={props.duplicate}
            />
            <ContributorModal
                open={contributorModal}
                toggle={handleContributorClose.bind(this)}
                data={props.data}
                duplicate={props.duplicate}
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
        },
        authors: [
            {
                name: "test"
            }
        ]
    }
};

export default withSnackbar(InnerModal);
