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
import {properties} from "../../properties.js"

export default function ConfirmationDialog(props) {
    let {dispatch} = React.useContext(Context);
    let history = useHistory();

    let emptyArray = [];

    async function post() {
        let publication = createPublicationObject();
        try {
            let id = await postPublication(publication);
            await putContributors(id);
            await patchPiaPublication(id, publication.pub_id);
            dispatch({type: "setFormErrors", payload: emptyArray});
        } catch (e) {
            console.log("There was an error while importing the publication", e);
            localStorage.setItem("authorized", "false");
            if (e.response && (e.response.status === 401 || e.response.status === 403)) {
                history.push("/login");
            } else {
                history.push("/error");
            }
            return e.response.status;
        }
        return 200;
    }

    async function patch() {
        let publication = createPublicationObject();
        try {
            await patchPublication(publication);
            await putContributors(publication.cristinResultId);
            await patchPiaPublication(publication.cristinResultId, publication.pubId);
        } catch (e) {
            console.log("There was an error while updating the publication", e);
            localStorage.setItem("authorized", "false");
            if (e.response && (e.response.status === 401 || e.response.status === 403)) {
                history.push("/login");
            } else {
                history.push("/error");
            }
            return e.response.status;
        }
        return 200;
    }

    async function postPublication(publication) {
        let response = await axios.post(properties.crisrest_gatekeeper_url + "/results", publication,
            JSON.parse(localStorage.getItem("config")));
        return response.data.cristin_result_id;
    }

    async function patchPublication(publication) {
        await axios.patch(properties.crisrest_gatekeeper_url + "/results/" + publication.cristinResultId, publication,
            JSON.parse(localStorage.getItem("config")));
    }

    async function putContributors(id) {
        let contributors = createContributorObject();
        await axios.put(properties.crisrest_gatekeeper_url + "/results/" + id + "/contributors", contributors,
            JSON.parse(localStorage.getItem("config")));
    }

    async function patchPiaPublication(id, pubId) {
        await axios.patch(
            properties.piarest_gatekeeper_url + "/sentralimport/publication/" + pubId,
            JSON.stringify({ cristin_id: id }), JSON.parse(localStorage.getItem("config")));
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
            cristinResultId: props.duplicate ? temp.publication.cristinResultId : "",
            category: {
                code: temp.publication.category
            },
            journal: journal,
            original_language: temp.publication.languages.filter(l => l.original)[0].lang.toLowerCase(),
            title: title,
            pub_id: temp.publication.pubId,
            year_published: temp.publication.yearPublished,
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
                let count = 0;
                if(!temp.contributors[i].toBeCreated.affiliations[j].hasOwnProperty("units")) { 
                affiliations[j + count] = {
                    role_code: temp.contributors[i].imported.role_code,
                    institution: temp.contributors[i].toBeCreated.affiliations[j].hasOwnProperty("institution") ?
                        {...temp.contributors[i].toBeCreated.affiliations[j].institution, role_code: temp.contributors[i].imported.role_code}
                        :
                        {
                            cristin_institution_id: temp.contributors[i].toBeCreated.affiliations[j].cristinInstitutionNr.toString(),
                        },
                     }
                } else { 
                    for(var h = 0; h < temp.contributors[i].toBeCreated.affiliations[j].units.length; h++) {
                        affiliations[j + count] = {
                            role_code: temp.contributors[i].imported.role_code,
                            unit: 
                                {
                                    cristin_unit_id: temp.contributors[i].toBeCreated.affiliations[j].units[h].unitNr.toString(),
                                },
                        }
                     count++;
                    }
                }
                
            }
            contributors[i] = {
                ...temp.contributors[i].toBeCreated,
                affiliations: affiliations,
                cristin_person_id: temp.contributors[i].toBeCreated.cristin_person_id.toString()
            };
        }

        // filtrerer vekk institusjoner om samme institusjon kommer flere ganger på samme person. f.eks ANDREINST
        contributors = contributors.map(item => ({
            ...item,
            affiliations: item.affiliations.filter((v, i, a) => a.findIndex(t => (t.institution.cristin_institution_id === v.institution.cristin_institution_id)) === i)
        }));

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
                        props.duplicate ? patch().then(response => props.handleClose(response)) : post().then(response => props.handleClose(response));
                    }}
                >
                    Importer
                </Button>
            </DialogActions>
        </Dialog>
    );
}
