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
import {useHistory} from "react-router-dom";

export default function ConfirmationDialog(props) {
    let {dispatch} = React.useContext(Context);
    let history = useHistory();

    let emptyArray = [];
    // let url = "https://crisrest-utv.dataporten-api.no";
    let url = "http://localhost:8080/crisrest-2.5-SNAPSHOT";

    async function post() {
        // let publication = await postPublication();
        let publication = {
            cristin_result_id: 1605975,
            pubId: 19088
        };
        await putContributors(publication.cristin_result_id);
        await patchPiaPublication(publication);
        dispatch({type: "setFormErrors", payload: emptyArray});
    }

    async function postPublication() {
        let publication = createPublicationObject();
        console.log(publication);
        try {
            let response = await axios.post(url + "/results", publication,
                JSON.parse(localStorage.getItem("config")));
            return response.data;
        } catch (e) {
            console.log("There was an error while posting publication:", e);
        }
    }

    async function putContributors(id) {
        let contributors = createContributorObject();
        try {
            let response = await axios.put(url + "/results/" + id + "/contributors", contributors,
                JSON.parse(localStorage.getItem("config")));
        } catch (e) {
            console.log("There was an error while putting contributors:", e);
        }
    }

    async function patchPiaPublication(publication) {
        try {
            await axios.patch(
                "https://piarest-utv.dataporten-api.no/sentralimport/publication/" + publication.pubId,
                JSON.stringify({ cristin_id: publication.cristin_result_id }), JSON.parse(localStorage.getItem("config")));
        } catch (e) {
            console.log("There was an error while patching piaPublication:", e);
        }
    }

    function createPublicationObject() {
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

    function createContributorObject() {
        let temp = JSON.parse(localStorage.getItem("tempContributors"));
        let contributors = [];
        for (let i = 0; i < temp.contributors.length; i++) {
            let affiliations = [];
            for (let j = 0; j < temp.contributors[i].toBeCreated.affiliations.length; j++) {
                affiliations[j] = {
                    role_code: temp.contributors[i].imported.role_code,
                    institution: temp.contributors[i].toBeCreated.affiliations[j].hasOwnProperty("institution") ?
                        {...temp.contributors[i].toBeCreated.affiliations[j].institution, role_code: temp.contributors[i].imported.role_code}
                        :
                        {
                            cristin_institution_id: temp.contributors[i].toBeCreated.affiliations[j].cristinInstitutionNr.toString(),
                        }
                }
            }
            contributors[i] = {
                ...temp.contributors[i].toBeCreated,
                affiliations: affiliations,
                cristin_person_id: temp.contributors[i].toBeCreated.cristin_person_id.toString()
            };
        }

        return contributors;
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
