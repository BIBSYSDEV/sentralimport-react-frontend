import React, { useEffect } from 'react';
import { Result } from './Result';
import axios from "axios";
import {
    Radio,
    RadioGroup,
    FormControl,
    FormControlLabel
} from "@material-ui/core";
import {
    ListGroup,
    ListGroupItem,
    ListGroupItemHeading,
    ListGroupItemText
} from "reactstrap";

export function Duplicates(props) {

    const [data, setdata] = React.useState([]);
    let searchString = "";

    useEffect(() => {
        async function fetch() {
            let registered = parseInt(props.publication.registered.substr(7,10));
            console.log("registered: " + registered);
            if (props.publication.hasOwnProperty('doi')) {
                console.log("DOI exists. Looking for duplicates");
                searchString = "?doi=" + props.publication.doi;
            } else {
                console.log("DOI does not exist. Searching by name, year and issn");

                let title = props.publication.languages[0].title.length > 20 ? props.publication.languages[0].title.substr(0, 20) : props.publication.languages[0].title;
                searchString = "/channels?type=result&query=(" + title + " AND year_published:[" + (registered-1) + " TO " + registered + "]";

                if (props.publication.hasOwnProperty('channel')) {
                    let issns = props.publication.channel.issns.length > 1 ? props.publication.channel.issns.join(" OR ") : props.publication.channel.issns[0];
                    searchString += " AND (" + issns + ")";
                }

                searchString += ")&per_page=5";
                console.log(searchString);
            }
            await fetchDuplicates(searchString)
                .then(response => setdata(response));
        }
        fetch();
    }, []);

    return (
        <div>
            <ul className={`no-padding`}>
                <RadioGroup name="test" >
                    <ListGroupItem>
                { data.length > 0 ?
                    data.map((item, i) => <Result data={item.data} key={i} />) :
                    <p>Det finnes ingen Cristinpublikasjoner som matcher importpublikasjonen</p>
                }
                    </ListGroupItem>
                    <ListGroupItem>
                        <FormControlLabel
                            value="false"
                            control={<Radio />}
                            label="Ikke importer"
                        />
                        <FormControlLabel
                            value="true"
                            control={<Radio />}
                            label="Opprett ny cristin-publikasjon basert på importpublikasjon"
                        />
                    </ListGroupItem>
                </RadioGroup>
            </ul>
        </div>
    );
}

async function fetchDuplicates(searchTerms) {
    let results = [];
    console.log("fething...");
    const searchResults = await axios.get("http://localhost:8080/crisrest/results" + searchTerms);
    //const searchResults = await axios.get("https://api.cristin-utv.uio.no/v2/results" + searchTerms);

    if (searchTerms.includes('doi')) {
        results.push({
            data: searchResults.data[0]
        });
    } else {
        for (let i = 0; i < searchResults.data.length; i++) {
            //let res = await axios.get("https://api.cristin-utv.uio.no/v2/results/" + searchResults.data[i].id);
            let res = await axios.get("http://localhost:8080/crisrest/results/" + searchResults.data[i].id);
            results.push(res);
        }
    }

    for (let i = 0; i < results.length; i++) {
        let authors = await axios.get("http://localhost:8080/crisrest/results/" + results[i].data.cristin_result_id + "/contributors");
        results[i].data.authors = authors.data;
    }

    return results;
}