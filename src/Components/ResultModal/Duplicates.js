import React, {useEffect} from "react";
import {Result} from "./Result";
import axios from "axios";
import {Context} from "../../Context";
import {Radio, RadioGroup, FormControlLabel, Button, Checkbox, FormGroup, Card} from "@material-ui/core";
import {ListGroupItem} from "reactstrap";
import {properties} from "../../properties";
import {Collapse} from "react-bootstrap";
import "../../assets/styles/Results.scss";

export function Duplicates(props) {
    const [duplicate, setDuplicate] = React.useState([]);
    const [isOpen, setIsOpen] = React.useState(false);
    const [doiChecked, setDoiChecked] = React.useState(false);
    const [titleChecked, setTitleChecked] = React.useState(false);
    const [publishedChecked, setPublishedChecked] = React.useState(false);
    const [issnChecked, setIssnChecked] = React.useState(false);
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
        setDoiChecked(!doiChecked);
    }
    
    function handleTitle() {
        setTitleChecked(!titleChecked);
    }
    
    function handleIssn() {
        setIssnChecked(!issnChecked);
    }
    
    function handlePublished() {
        setPublishedChecked(!publishedChecked);
    }

    function handleOpen() {
        console.log(isOpen);
        setIsOpen(true);
        console.log(isOpen);
    }

    async function retrySearch() {
        setIsOpen(false);
        let searchString = "";
    
        let published = props.publication.yearPublished;
        let title = (props.publication.languages[0].title.length > 20 ? props.publication.languages[0].title.substr(0, 20) : props.publication.languages[0].title);
        let issn = props.publication.hasOwnProperty("channel") && props.publication.channel.hasOwnProperty("issns") ? props.publication.channel.issns[0] : "";
        
        searchString = (doiChecked ? ("?doi=" + publication.doi) : "") +
                      
        (titleChecked ? ("?title=" + title) : "") +
    
        (publishedChecked ? ("&published_since=" + (published - 1) + "&published_before=" + published) : "") + 
    
        (issnChecked ? "&issn=" + issn : "") +
                
        "&per_page=5";
                
        console.log(searchString);

        setDoiChecked(false);
        setTitleChecked(false);
        setIssnChecked(false);
        setPublishedChecked(false);
                
        await fetchDuplicates(searchString).then(response => setDuplicate(response));
    
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

                            <Button hidden={isOpen} onClick={() => handleOpen()}> Søk på nytt </Button>

                            <Collapse in={isOpen}>
                                <Card className="card-search">
                                <p>Søk med parametre: </p>
                                <FormGroup>
                                <FormControlLabel
                                    control={<Checkbox checked={doiChecked} onClick={() => handleDoi()} />}
                                    label="DOI"
                                />

                                <FormControlLabel
                                    control={<Checkbox checked={titleChecked} onClick={() => handleTitle()} />}
                                    label="Tittel"
                                />

                                {props.publication.hasOwnProperty("channel") && props.publication.channel.hasOwnProperty("issns") ?
                                <FormControlLabel
                                    control={<Checkbox checked={issnChecked} onClick={() => handleIssn()} />}
                                    label="ISSN"
                                /> : ""}

                                <FormControlLabel
                                    control={<Checkbox checked={publishedChecked} onClick={() => handlePublished()} />}
                                    label="Publiseringsår"
                                />
                                </FormGroup>
                            
                                <Button onClick={() => retrySearch()}> Søk </Button>
                                </Card>
                            </Collapse>
                        </p>
                    )}
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
