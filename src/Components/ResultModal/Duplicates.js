import React, {useEffect} from "react";
import {Result} from "./Result";
import axios from "axios";
import {Context} from "../../Context";
import {Radio, RadioGroup, FormControlLabel, Button, Checkbox, FormGroup, Card, TextField, Grid} from "@material-ui/core";
import {ListGroupItem} from "reactstrap";
import {properties} from "../../properties";
import {Collapse} from "react-bootstrap";
import "../../assets/styles/Results.scss";
import { useSnackbar } from 'notistack';

export function Duplicates(props) {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const [duplicate, setDuplicate] = React.useState([]);
    const [isOpen, setIsOpen] = React.useState(false);
    const [doi, setDoi] = React.useState(props.publication.hasOwnProperty("doi") ? props.publication.doi : "");
    const [doiChecked, setDoiChecked] = React.useState(false);
    const [title, setTitle] = React.useState(props.publication.languages[0].title);
    const [titleChecked, setTitleChecked] = React.useState(false);
    const [publishedChecked, setPublishedChecked] = React.useState(false);
    const [published, setPublished] = React.useState(props.publication.yearPublished);
    const [issnChecked, setIssnChecked] = React.useState(false);
    const [issn, setIssn] = React.useState(props.publication.hasOwnProperty("channel") && props.publication.channel.hasOwnProperty("issns") ? props.publication.channel.issns[0] : "");
    const [authorChecked, setAuthorChecked] = React.useState(false);
    const [totalChecked, setTotalChecked] = React.useState(0);
    let {state, dispatch} = React.useContext(Context);
    let publication = props.publication;
    const relevantStatus = state.currentImportStatus !== "ikke aktuelle";

    useEffect(() => {
        async function fetch() {
            state.selected = "true";
            let searchString = "";
            let published = publication.yearPublished;
            if (publication.hasOwnProperty("doi")) {
                console.log("DOI exists. Looking for duplicates");
                searchString = "?doi=" + publication.doi;
            } else {
                console.log("DOI does not exist. Searching by name, year and issn");

                let title =
                    publication.languages[0].title.length > 20
                        ? publication.languages[0].title.substr(0, 20)
                        : publication.languages[0].title;
                searchString =
                    "?title=" +
                    title +
                    "&published_since=" +
                    (published - 1) +
                    "&published_before=" +
                    published;

                if (publication.hasOwnProperty("channel") && publication.channel.hasOwnProperty("issns")) {
                    let issn = props.publication.channel.issns[0];
                    searchString += "&issn=" + issn;
                }
            }
            searchString += "&per_page=5";
            console.log(searchString);
            await fetchDuplicates(searchString).then(response => setDuplicate(response));
        }

        fetch();
    }, [publication]);

    useEffect(() => {
       if (publication.hasOwnProperty("cristin_id") && duplicate.length > 0) {
           dispatch({type: "setSelected", payload: duplicate[0].data.cristin_result_id});
           dispatch({type: "setSelectedPublication", payload: duplicate[0].data});
       }
    }, [duplicate]);


    function handleChange(event) {
        console.log(event.target.value);
        dispatch({type: "setSelected", payload: event.target.value});
        event.target.value !== "true" && event.target.value !== "false"
            ? dispatch({
                type: "setSelectedPublication",
                payload: duplicate.find(
                    element => element.data.cristin_result_id === event.target.value
                ).data
            })
            : console.log();
    }

    function handleDoi() {
        if(!doiChecked){
            setTotalChecked(totalChecked + 1)
        } else {
            setTotalChecked(totalChecked - 1)
        }
        setDoiChecked(!doiChecked);
    }
    
    function handleTitle() {
        if(!titleChecked){
            setTotalChecked(totalChecked + 1)
        } else {
            setTotalChecked(totalChecked - 1)
            setAuthorChecked(false);
        }
        setTitleChecked(!titleChecked);
    }
    
    function handleIssn() {
        if(!issnChecked){
            setTotalChecked(totalChecked + 1)
        } else {
            setTotalChecked(totalChecked - 1)
        }
        setIssnChecked(!issnChecked);
    }
    
    function handlePublished() {
        if(!publishedChecked){
            setTotalChecked(totalChecked + 1)
        } else {
            setTotalChecked(totalChecked - 1)
        }
        setPublishedChecked(!publishedChecked);
    }

    function handleAuthor() {
        setAuthorChecked(!authorChecked);
    }

    function handleOpen() {
        setIsOpen(true);
    }

    function handleChangeDoi(event) {
        setDoi(event.target.value);
    }

    function handleChangeIssn(event) {
        setIssn(event.target.value);
    }

    function handleChangeTitle(event) {
        setTitle(event.target.value);
    }

    function handleChangePublished(event) {
        setPublished(event.target.value);
    }

    function handleSnackbar(response) {
        if(response.length === 0) {
            enqueueSnackbar("Fant ingen duplikater.", {
                variant: "error"
            });
        } else if (response.length === 1) {
            enqueueSnackbar("Fant " + response.length + " duplikat.", {
                variant: "success"
            });
        } else {
            enqueueSnackbar("Fant " + response.length + " duplikater.", {
                variant: "success"
            });  
        }
    }

    function handleClose() {
        setIsOpen(false);
        handleChecks();
        resetValues();
    }

    function handleChecks() {
        setDoiChecked(false);
        setTitleChecked(false);
        setAuthorChecked(false);
        setIssnChecked(false);
        setPublishedChecked(false);
    }

    function resetValues() {
        setDoi(props.publication.hasOwnProperty("doi") ? props.publication.doi : "");
        setTitle(props.publication.languages[0].title);
        setPublished(props.publication.yearPublished);
        setIssn(props.publication.hasOwnProperty("channel") && props.publication.channel.hasOwnProperty("issns") ? props.publication.channel.issns[0] : "");
    }

    async function retrySearch() {
        setIsOpen(false);
        console.log(props.publication);
        let searchString = "";
        let author = props.publication.authors[0].hasOwnProperty("authorName") ? props.publication.authors[0].authorName : props.publication.authors[0].surname + ", " + props.publication.authors[0].first_name.subStr(0, 1);
    
        searchString = (doiChecked ? ("?doi=" + doi) : "") +
                      
        (titleChecked ? ((doiChecked ? "&" : "?" ) + "title=" + title + (authorChecked ? "&contributor=" + author : "" )) : "") +
    
        (publishedChecked ? ((doiChecked || titleChecked ? "&" : "?" ) + "published_since=" + (published - 1) + "&published_before=" + published) : "") + 
    
        (issnChecked ? (doiChecked || publishedChecked || issnChecked ? "&" : "?" ) + "issn=" + issn : "") +
                
        "&per_page=5";
        
        handleChecks();
        resetValues();

        let results = await fetchDuplicates(searchString);
        handleSnackbar(results);
        setDuplicate(results);
    
    }

    return (
        <div>
            <ul className={`no-padding`}>
                <RadioGroup onChange={handleChange} value={state.selected}>
                {/* Ved bruk av egendefinerte radiobuttons i en radiogroup, husk FormControlLabels slik at aria fungerer korrekt */}
                    {duplicate.length > 0 ? (
                        duplicate.map((item, i) => 
                            <FormControlLabel key={i}
                                control={<Result data={item.data} />}
                            />
                        )
                    ) : (
                        <p>
                            Det finnes ingen Cristinpublikasjoner som matcher
                            importpublikasjonen
                        </p>
                    )}
                    <Button variant="contained" color="primary" hidden={isOpen} onClick={() => handleOpen()}> Søk på nytt </Button>

                        <Collapse in={isOpen}>
                            <Card className="card-search">
                                <p>Søk med parametre: </p>
                               
                                <FormGroup>
                                <Grid direction="column" alignContent="center" justify="space-evenly" spacing={6} className="duplicate-search-grid">
                                    <Grid item container direction="column">
                                    <FormControlLabel
                                        control={<Checkbox checked={doiChecked} onClick={() => handleDoi()} />}
                                        label="DOI"
                                    />
                                    {doiChecked ? 
                                    
                                    <TextField disabled={!doiChecked} multiline value={doi} onChange={e => handleChangeDoi(e)}></TextField>
                                    : ""}
                                    </Grid>

                                    <Grid item container direction="column">
                                        
                                    <FormControlLabel
                                        control={<Checkbox checked={titleChecked} onClick={() => handleTitle()} />}
                                        label="Tittel"
                                    />
                                    

                                    {titleChecked ? 
                                    <Grid item container direction="column">
                                        <TextField disabled={!titleChecked} multiline value={title} onChange={e => handleChangeTitle(e)}></TextField>
                                        <FormControlLabel
                                        control={<Checkbox checked={authorChecked} onClick={() => handleAuthor()} />}
                                        label="Søk med forfatter"
                                    />
                                    </Grid>
                                    : ""}
                                    </Grid>

                                    <Grid item container direction="column">
                                    {publication.hasOwnProperty("channel") && publication.channel.hasOwnProperty("issns") ?
                                    <div>
                                    <FormControlLabel
                                        control={<Checkbox checked={issnChecked} onClick={() => handleIssn()} />}
                                        label="ISSN"
                                    />
                                    {issnChecked ? 
                                    <TextField disabled={!issnChecked} value={issn} onChange={e => handleChangeIssn(e)}></TextField>
                                    : ""}
                                    </div> 
                                    : ""}
                                    </Grid>
                                    
                                    <Grid item container direction="column">
                                    <FormControlLabel
                                        control={<Checkbox checked={publishedChecked} onClick={() => handlePublished()} />}
                                        label="Publiseringsår"
                                    />
                                    {publishedChecked ? 
                                    <TextField disabled={!publishedChecked} value={published} onChange={e => handleChangePublished(e)}></TextField>
                                    : ""}
                                    </Grid>
                                </Grid>
                                </FormGroup>
                                
                                <Button variant="contained" disabled={!(totalChecked >= 1)} color="primary" onClick={() => retrySearch()}> Søk </Button> <Button onClick={() => handleClose()}> Avbryt </Button>
                            </Card>
                        </Collapse>
                    <ListGroupItem>
                        <FormControlLabel
                            value="false"
                            control={<Radio />}
                            label={relevantStatus ? "Marker som ikke aktuell" : "Marker som aktuell"}
                            disabled={publication.hasOwnProperty("cristin_id")}
                        />
                        <FormControlLabel
                            value="true"
                            control={<Radio />}
                            label="Opprett ny cristin-publikasjon basert på importpublikasjon"
                            disabled={publication.hasOwnProperty("cristin_id")}
                        />
                    </ListGroupItem>
                </RadioGroup>
            </ul>
        </div>
    );
}

async function fetchDuplicates(searchTerms) {
    let results = [];
    console.log("fetching...");
    const searchResults = await axios.get(
        properties.crisrest_gatekeeper_url + "/results" + searchTerms + "&fields=all&lang=nb", JSON.parse(localStorage.getItem("config"))
    );
    console.log("Found " + searchResults.data.length + " results");
    for (let i = 0; i < searchResults.data.length; i++) {
        results.push({
            data: searchResults.data[i]
        });
    }

    for (let i = 0; i < results.length; i++) {
        let authors = await axios.get(
            properties.crisrest_gatekeeper_url + "/results/" +
            results[i].data.cristin_result_id +
            "/contributors"
        , JSON.parse(localStorage.getItem("config")));
        results[i].data.authors = authors.data;
    }

    return results;
}
