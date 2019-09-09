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
import Button from '@material-ui/core/Button';

function ContributorModal(props) {

    const [data, setdata] = React.useState([]);
    let {state} = React.useContext(Context);
    console.log(props);

    useEffect(() => {
        async function fetch() {
            if (props.open) {
                const imported = await fetchContributors(props.data);

                let contributors = [];
                let cristinAuthors = [];

                if (props.duplicate) {
                    cristinAuthors = state.selectedPublication.data.authors;
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
                                    first_name: imported[i].hasOwnProperty('firstname') ? imported[i].firstname : imported[i].authorName.split(',')[1],
                                    surname: imported[i].hasOwnProperty('surname') ? imported[i].surname : imported[i].authorName.split(',')[0],
                                    order: imported[i].sequenceNr,
                                    affiliations: imported[i].institutions,
                                } : defaultAuthor,
                            cristin: state.selectedPublication.data.authors.length > i ? state.selectedPublication.data.authors[i] : defaultAuthor
                        };
                    }
                } else {

                }
                setdata(contributors);
                state.chosenAuthor = new Array(Math.max(cristinAuthors.length, imported.length));
                console.log("data:");
                console.log(data);
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
        // document.getElementById("auth_" + (author.order - 1)).value = author.first_name + " " + author.surname;
    }

    function handleChange(event, rowNr) {
        console.log(rowNr);
        state.chosenAuthor[rowNr] = event.target.value;
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
                                            <h6>{ (row.imported.surname && row.imported.first_name) ? row.imported.surname + ", " + row.imported.first_name : "" }</h6>
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
                                    <a className={`result contributor`} href={"https://app.cristin.no/persons/show.jsf?id=" + row.cristin.cristin_person_id} target="_blank">
                                        <div className='image-wrapper person'>
                                            <img src={getMainImage()} />
                                        </div>
                                        <div className='content-wrapper'>
                                            <h6>{ (row.cristin.surname && row.cristin.first_name) ? row.cristin.surname + ", " + row.cristin.first_name : "" }</h6>
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

    if (result.authors.length > 10) {
        // TODO må lages ett endepunkt i WSINT som henter alle forfattere fra pia_publikasjon
        authors = await axios.get("/results/" + result.pubId + "/contributors");
    }
    return authors;
}

async function fetchInstitutionName(institutionId) {
    if (institutionId === "0")
        return " ";
    let institution = await axios.get("https://api.cristin-utv.uio.no/v2/institutions/" + institutionId);
    return institution.data.institution_name.hasOwnProperty("nb") ? institution.data.institution_name.nb : institution.data.institution_name.en;
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
