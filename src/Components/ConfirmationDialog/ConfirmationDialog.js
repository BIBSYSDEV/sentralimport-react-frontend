import React from "react";
import {
    Dialog,
    Button,
    DialogTitle,
    DialogActions,
    DialogContent,
    DialogContentText
} from "@material-ui/core";
import {Context} from "../../Context";
import axios from "axios";

export default function ConfirmationDialog(props) {
    let {dispatch} = React.useContext(Context);

    let emptyArray = [];

    async function post() {
        // let id = await postPublication();
        let id = 1605973;
        await putContributors(id);
        dispatch({type: "setFormErrors", payload: emptyArray});
    }

    async function postPublication() {
        let publication = createPublication();
        console.log(publication);
        try {
            let response = await axios.post("http://localhost:8080/crisrest-2.5-SNAPSHOT/results", publication,
                JSON.parse(localStorage.getItem("config")));
            return response.data.cristin_result_id;
        } catch (e) {
            console.log("There was an error while posting publication:", e);
        }
    }

    async function putContributors(id) {
        let a = localStorage.getItem("tempContributors");
        console.log(JSON.parse(a));
        // let response = await axios.put("http://localhost:8080/crisrest-2.5-SNAPSHOT/results/" + id + "/contributors");
    }

    function createPublication() {
        const temp = JSON.parse(localStorage.getItem("tempPublication"));

        let title = {};
        for (let i = 0; i < temp.publication.languages.length; i++) {
            title[temp.publication.languages[i].lang.toLowerCase()] = temp.publication.languages[i].title;
        }

        let journal = {
            name: temp.publication.channel.title,
            journal_id: temp.publication.channel.cristinTidsskriftNr !== 0 ? temp.publication.channel.cristinTidsskriftNr : null,
            international_standard_numbers: [
                {
                    type: "printed",
                    value: temp.publication.channel.issn ? temp.publication.channel.issn : null
                },
                {
                    type: "online",
                    value: temp.publication.channel.eissn ? temp.publication.channel.eissn : null
                }
            ],
            pia_journal_number: temp.publication.channel.cristinTidsskriftNr
        };
        return {
            category: {
                code: temp.publication.category
            },
            journal: journal,
            original_language: temp.publication.languages.filter(l => l.original)[0].lang.toLowerCase(),
            title: title,
            pubId: temp.publication.pubId,
            year_published: temp.publication.registered,
            import_sources: temp.publication.import_sources,
            volume: temp.publication.channel.volume,
            issue: temp.publication.channel.issue,
            links: [
                {
                    url_type: "doi",
                    url_value: temp.publication.doi
                }
            ],
            pages: {
                from: temp.publication.channel.pageFrom,
                to: temp.publication.channel.pageTo,
                count: temp.publication.channel.pageTo - temp.publication.channel.pageFrom
            }
        };
    }

    return (
        <Dialog
            open={props.open}
            onClose={props.handleClose}
            disableBackdropClick
            disableEscapeKeyDown
        >
            <DialogTitle>Bekreft import</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Er du sikker på at du vil importere denne publikasjonen?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button color="secondary" onClick={props.handleCloseDialog}>
                    Avbryt
                </Button>
                <Button
                    color="primary"
                    onClick={() => {
                        props.handleClose();
                        post();
                    }}
                >
                    Importer
                </Button>
            </DialogActions>
        </Dialog>
    );
}
