import React, {useEffect} from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import axios from "axios";
import { withSnackbar } from "notistack";
import '../../assets/styles/Results.scss'
import {Context} from "../../Context";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import PersonIcon from "../../assets/icons/person-active.svg";
import { TextField, FormGroup, Button } from "@material-ui/core";
import { Form } from "reactstrap";

function ContributorModal(props) {

    const [data, setdata] = React.useState([]);
    let {state} = React.useContext(Context);

    useEffect(() => {
        async function fetch() {
            if (props.open) {
                const imported = await fetchContributors(props.data);

                let contributors = [];
                let cristinAuthors = [];

                if (props.duplicate) {
                    cristinAuthors = state.selectedPublication.data.authors;
                } else {
                    cristinAuthors = await searchContributors(props.data.authors);
                }

                for (let i = 0; i < Math.max(cristinAuthors.length, imported.length); i++) {
                    let currentAuthor = cristinAuthors.length > i ? cristinAuthors[i] : defaultAuthor;
                    for (let j = 0; j < currentAuthor.affiliations.length; j++) {
                        currentAuthor.affiliations[j].institutionName = await fetchInstitutionName(currentAuthor.affiliations[j].institution.cristin_institution_id);
                    }

                    contributors[i] = {
                        imported: imported.length > i
                            ?
                            {
                                cristin_person_id: 0,
                                first_name: imported[i].hasOwnProperty('firstname') ? imported[i].firstname : imported[i].authorName.split(' ')[1],
                                surname: imported[i].hasOwnProperty('surname') ? imported[i].surname : imported[i].authorName.split(' ')[0],
                                authorname: imported[i].hasOwnProperty('authorName') ? imported[i].authorName : "",
                                order: imported[i].sequenceNr,
                                affiliations: imported[i].institutions,
                            } : defaultAuthor,
                        cristin: cristinAuthors.length > i ? cristinAuthors[i] : defaultAuthor
                    };
                }

                setdata(contributors);
            }
        }
        fetch();
    }, [props.open]);

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

    function handleChooseAuthor(event, author) {
        state.chosenAuthor[author.order - 1] = author.first_name + " " + author.surname;
    }

    function createAuthor(author, order) {
        data[order].cristin = author;
        return (
            <div>
                <Form>
                    <FormGroup>
                        <TextField
                            id="firstName"
                            label="Fornavn"
                            value={data[order].cristin.first_name}
                            margin="normal"
                            onChange={(e) => handleChangeAuthor(order, e)}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <TextField
                            id="lastName"
                            label="Etternavn"
                            value={data[order].cristin.surname}
                            margin="normal"
                            onChange={(e) => handleChangeAuthor(order, e)}
                            required
                        />
                    </FormGroup>
                </Form>
            </div>)
    }

    function handleChangeAuthor(order, event){
        data[order].cristin.first_name = event.target.value;
        console.log(data[1]);
    }

    const getMainImage = () => {return PersonIcon};

    return (
        <Modal
            isOpen={props.open}
            className={`contributorModal`}
        >
            <ModalHeader toggle={handleClose}>Bidragsytere</ModalHeader>
            <ModalBody>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Rekkefølge nummer</TableCell>
                            <TableCell>Import-Forfatter</TableCell>
                            <TableCell>Cristin-Forfatter</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row, i) => (
                            <TableRow key={i} hover>
                                <TableCell>{row.cristin.order === row.imported.order ?
                                    row.imported.order :
                                    row.imported.order + " (" + row.cristin.order + ")"}
                                </TableCell>
                                <TableCell>
                                    <a className={`result contributor`}>
                                        <div className='image-wrapper person'>
                                            <img src={getMainImage()} />
                                        </div>
                                        <div className='content-wrapper'>
                                            <h6>{ (row.imported.surname && row.imported.first_name) ? row.imported.surname + ", " + row.imported.first_name :
                                                (row.imported.authorName ? row.imported.authorName : "") }</h6>
                                            <div className={`metadata`}>
                                                { row.imported.affiliations.map((inst, j) => (<p className={`italic`} key={j}>{inst.institutionName}</p>)) }
                                            </div>
                                        </div>
                                    </a>
                                    {(row.imported.surname && row.imported.first_name) ?
                                        <Button color="primary" onClick={event => handleChooseAuthor(event, row.imported)} >
                                            Velg denne
                                        </Button> : ""
                                    }
                                </TableCell>
                                <TableCell>
                                    <a className={`result contributor`} >
                                        <div className='image-wrapper person'>
                                            <img src={getMainImage()} />
                                        </div>
                                        <div className='content-wrapper'>
                                            <h6>{ (row.cristin.surname && row.cristin.first_name) ? row.cristin.surname + ", " + row.cristin.first_name : createAuthor(row.imported, i) }</h6>
                                            <div className={`metadata`}>
                                                { row.cristin.affiliations.map((inst, j)=> (<p className={`italic`} key={j}>{inst.institutionName}</p>)) }
                                            </div>
                                        </div>
                                    </a>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </ModalBody>
        </Modal>
    );
}

async function fetchContributors(result) {
    let authors = result.authors;

    if (result.authors.length > 10 && result.authors[10].sequenceNr !== 11) {
        console.log("?");
        authors = await axios.get("http://localhost:8080/criswsint/sentralimport/publication/" + result.pubId + "/contributors");
        authors = authors.data;
    }
    return authors;
}

async function fetchInstitutionName(institutionId) {
    if (institutionId === "0")
        return " ";
    let institution = await axios.get("https://api.cristin-utv.uio.no/v2/institutions/" + institutionId);
    return institution.data.institution_name.hasOwnProperty("nb") ? institution.data.institution_name.nb : institution.data.institution_name.en;
}


//TODO søket i crisRest må kanskje endres til å gi muligheten til å returnere personer som ikke er identified?
//TODO også mulighet til å sende med flere intitusjoner og søke med OR i stedet for AND
async function searchContributors(authors) {
    let suggestedAuthors = [];
    for (let i = 0; i < authors.length; i++) {
        let authorName = authors[i].hasOwnProperty("firstname") ? authors[i].firstname.substr(0, 1) + " " + authors[i].surname : authors[i].authorName;
        let searchedAuthors = await axios.get("https://api.cristin-utv.uio.no/v2/persons?name=" + authorName + "&institution=" +
            (authors[i].institutions[0].hasOwnProperty("acronym") ?
                authors[i].institutions[0].acronym :
                authors[i].institutions[0].institutionName));

        if (searchedAuthors.data.length > 0) {
            let authorSuggestion = await axios.get(searchedAuthors.data[0].url);
            suggestedAuthors[i] = authorSuggestion.data;
        } else {
            suggestedAuthors[i] = defaultAuthor;
        }
    }

    return suggestedAuthors;
}

const defaultAuthor = {
    cristin_person_id: null,
    first_name: "",
    surname: "",
    order: 0,
    affiliations: [],
    url: null
};

export default withSnackbar(ContributorModal);
