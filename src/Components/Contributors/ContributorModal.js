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
import InstitutionSelect from "../InstitutionSelect/InstitutionSelect";

function ContributorModal(props) {

    const [data, setData] = React.useState([]);
    const [selectedInstitution, setSetSelectedInstitution] = React.useState(defaultInstitution);
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
                                affiliations: imported[i].institutions
                            } : defaultAuthor,
                        cristin: cristinAuthors.length > i ? cristinAuthors[i] : defaultAuthor,
                        toBeCreated: defaultAuthor
                    };

                    contributors[i].toBeCreated = contributors[i].cristin === defaultAuthor ? contributors[i].imported : contributors[i].cristin;
                }

                setData(contributors);
            }
        }
        fetch();
    }, [props, state.selectedPublication]);


    function handleSubmit(author) {
        console.log(author)
    }

    function handleClose() {
        props.enqueueSnackbar("Endringer er ikke blitt lagret.", {
            variant: "warning"
        });
        props.toggle();
    }

    function handleChooseAuthor(event, author) {

    }

    function displayAuthorForm(author) {
        return (
            <div>
                <Form>
                    <FormGroup>
                        <TextField
                            id="firstName"
                            label="Fornavn"
                            value={author.toBeCreated.first_name}
                            margin="normal"
                            onChange={handleChange(author, "first")}
                            required
                        />
                    </FormGroup>
                    <FormGroup>
                        <TextField
                            id="lastName"
                            label="Etternavn"
                            value={author.toBeCreated.surname}
                            margin="normal"
                            onChange={handleChange(author, "last")}
                            required
                        />
                    </FormGroup>
                    <div className={`metadata`}>
                        { author.toBeCreated.affiliations.map((inst, j)=> (
                                <p className={`italic`} key={j}>
                                    {inst.institutionName}<Button size="small" color="primary" onClick={() => removeInstitution(author.toBeCreated, j)}>Fjern tilknytning</Button>
                                </p>
                                )) }
                    </div>
                    <InstitutionSelect onChange={handleInstitutionChange} />
                    <Button
                        onClick={() => addInstitution(author.toBeCreated)}
                        disabled={
                            selectedInstitution.institutionNr === 0 ||
                            author.toBeCreated.affiliations.filter(instNr => {return selectedInstitution.institutionNr === instNr.institutionNr}).length > 0
                        }>Add</Button>
                    <Button color="primary" onClick={() => handleSubmit(author)}>Opprett person</Button>
                </Form>
            </div>
        )
    }

    function handleInstitutionChange(institution) {
        setSetSelectedInstitution(institution);
        console.log(selectedInstitution);
    }

    function removeInstitution(author, index) {
        author.affiliations.splice(index, 1);
        setData(prevObjs => (prevObjs.map((o) => {
            if (o === author) {
                return {...author, affiliations: author.affiliations }
            }
            return o;
        })))
    }

    function addInstitution(author) {
        console.log(selectedInstitution);
        author.affiliations.push({countryCode: "test", institutionName: selectedInstitution.label, institutionNr: selectedInstitution.institutionNr, isCristinInstitution: true});
        setData(prevObjs => (prevObjs.map((o) => {
            if (o === author) {
                return {...author, affiliations: author.affiliations }
            }
            return o;
        })))

    }

    function handleChange(obj, property) {
        return (event) => {
            const firstName = property === "first" ? event.target.value : obj.toBeCreated.first_name;
            const lastName = property === "last" ? event.target.value : obj.toBeCreated.surname;
            setData(prevObjs => (prevObjs.map((o) => {
                if (o === obj) {
                    return {...obj, toBeCreated:
                            {
                                first_name: firstName,
                                surname: lastName,
                                cristin_person_id: obj.toBeCreated.cristin_person_id,
                                authorname: obj.toBeCreated.authorName,
                                order: obj.toBeCreated.order,
                                affiliations: obj.toBeCreated.affiliations
                            }};
                }
                return o;
            })))
        };
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
                                    <div className={`result contributor`}>
                                        <div className='image-wrapper person'>
                                            <img src={getMainImage()} alt="person" />
                                        </div>
                                        <div className='content-wrapper'>
                                            <h6>{ (row.imported.surname && row.imported.first_name) ? row.imported.surname + ", " + row.imported.first_name :
                                                (row.imported.authorName ? row.imported.authorName : "") }</h6>
                                            <div className={`metadata`}>
                                                { row.imported.affiliations.map((inst, j) => (<p className={`italic`} key={j}>{inst.institutionName}</p>)) }
                                            </div>
                                        </div>
                                    </div>
                                    {(row.imported.surname && row.imported.first_name) ?
                                        <Button color="primary" onClick={event => handleChooseAuthor(event, row.imported)} >
                                            Velg denne
                                        </Button> : ""
                                    }
                                </TableCell>
                                <TableCell>
                                    <div className={`result contributor`} >
                                        <div className='image-wrapper person'>
                                            <img src={getMainImage()} alt="person" />
                                        </div>
                                        <div className='content-wrapper'>
                                            { (row.cristin.surname && row.cristin.first_name)
                                                ?
                                                <div><h6>{row.cristin.surname + ", " + row.cristin.first_name}</h6>
                                                    <div className={`metadata`}>
                                                        { row.cristin.affiliations.map((inst, j)=> (<p className={`italic`} key={j}>{inst.institutionName}</p>)) }
                                                    </div>
                                                </div>
                                                :
                                                displayAuthorForm(row) }
                                        </div>
                                    </div>
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
        authors = await axios.get("https://api.cristin-utv.uio.no/criswsinta/sentralimport/publication/" + result.pubId + "/contributors");
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

const defaultInstitution = {
    value: " ",
    label: "Ingen institusjon" ,
    institutionNr: 0
};

export default withSnackbar(ContributorModal);
