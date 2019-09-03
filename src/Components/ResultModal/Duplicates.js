import React, { useEffect } from 'react';
import { Result } from './Result';
import axios from "axios";
import { Context } from "../../Context";
import {
    Radio,
    RadioGroup,
    FormControlLabel
} from "@material-ui/core";
import {
    ListGroupItem
} from "reactstrap";

export function Duplicates(props) {

    const [data, setdata] = React.useState([]);
    let { state } = React.useContext(Context);
    const [selected, setSelected] = React.useState("false");
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

    function handleChange(event) {
        state.selectedValue = event.target.value;
        setSelected(event.target.value);
        state.selectedPublication = data.find(element => element.data.cristin_result_id === event.target.value);
    }

    return (
        <div>
            <ul className={`no-padding`}>
                <RadioGroup onChange={handleChange} value={selected} >
                { data.length > 0 ?
                    data.map((item, i) => <Result data={item.data} key={i} />) :
                    <p>Det finnes ingen Cristinpublikasjoner som matcher importpublikasjonen</p>
                }
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
    const searchResults = await axios.get("https://api.cristin-utv.uio.no/v2/results" + searchTerms);

    if (searchTerms.includes('doi')) {
        for (let i = 0; i < searchResults.data.length; i++) {
            results.push({
                data: searchResults.data[i]
            });
        }

    } else {
        for (let i = 0; i < searchResults.data.length; i++) {
            let res = await axios.get("https://api.cristin-utv.uio.no/v2/results/" + searchResults.data[i].id);
            results.push(res);
        }
    }

    for (let i = 0; i < results.length; i++) {
        let authors = await axios.get("https://api.cristin-utv.uio.no/v2/results/" + results[i].data.cristin_result_id + "/contributors");
        results[i].data.authors = authors.data;
    }

    return results;
}