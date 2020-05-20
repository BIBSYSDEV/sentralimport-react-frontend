import React, { useEffect } from "react";
import {Modal, ModalBody, ModalHeader} from "reactstrap";
import axios from "axios";
import {withSnackbar} from "notistack";
import "../../assets/styles/Results.scss";
import {Context} from "../../Context";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import PersonIcon from "../../assets/icons/person-active.svg";
import InactivePersonIcon from "../../assets/icons/person-inactive.svg";
import ArrowUpIcon from "../../assets/icons/arrowhead-up3.svg";
import ArrowDownIcon from "../../assets/icons/arrowhead-down3.svg";
import {Button, TableFooter} from "@material-ui/core";

import ContributorPagination from "../ContributorPagination/ContributorPagination";
import Contributor from "./Contributor";
import Skeleton from "@material-ui/lab/Skeleton";
import ClosingDialog from "../Dialogs/ClosingDialog";

function ContributorModal(props) {
    const {useRef, useLayoutEffect} = React;
    const [data, setData] = React.useState([]);
    const [searchResults, setSearchResults] = React.useState(null);
    const [fetched, setFetched] = React.useState(false);
    const [dialog, setDialog] = React.useState(false);

    let {state, dispatch} = React.useContext(Context);

    let countries = {};

    const firstUpdate = useRef(true);
    useLayoutEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }
        handleTempSave();
    }, [data]);

    useEffect(() => {
       
    }, [state.contributorPage]);

    // const updatePersons = useRef(true);
    useLayoutEffect(() => {
        async function fetch() {
            setFetched(false);

            let contributors = [];
            let cristinAuthors = [];

            let temp = JSON.parse(localStorage.getItem("tempContributors"));
            if (temp !== null && temp.pubId === props.data.pubId && temp.duplicate === props.duplicate) {
                contributors = temp.contributors;
            } else {
                if (props.duplicate === true) {
                    cristinAuthors = state.selectedPublication.authors;
                } else if (props.duplicate === false) {
                    cristinAuthors = await searchContributors(props.data.authors);
                }

                const imported = props.data.authors;

                for (let i = 0; i < Math.max(cristinAuthors.length, imported.length); i++) {
                    if (props.duplicate && state.doSave) {
                        cristinAuthors[i].affiliations = await getDuplicateAffiliations(state.selectedPublication.authors[i]);
                    }
                    contributors[i] = {
                        imported:
                            imported.length > i
                                ? {
                                    cristin_person_id: imported[i].cristinId,
                                    first_name: imported[i].hasOwnProperty("firstname")
                                        ? imported[i].firstname
                                        : imported[i].authorName.split(" ")[1],
                                    surname: imported[i].hasOwnProperty("surname")
                                        ? imported[i].surname
                                        : imported[i].authorName.split(" ")[0],
                                    authorname: imported[i].hasOwnProperty("authorName")
                                        ? imported[i].authorName
                                        : "",
                                    order: imported[i].sequenceNr,
                                    affiliations: imported[i].institutions,
                                    role_code: imported[i].hasOwnProperty("roleCode") ? imported[i].roleCode : "FORFATTER"
                                }
                                : defaultAuthor,
                        cristin:
                            cristinAuthors.length > i ? cristinAuthors[i] : defaultAuthor,      
                        toBeCreated: defaultAuthor
                    };

                    contributors[i].isEditing = (contributors[i].cristin.cristin_person_id === null);

                    let copy =
                        contributors[i].cristin === defaultAuthor
                            ? Object.assign({}, contributors[i].imported)
                            : Object.assign({}, contributors[i].cristin);
                    contributors[i].toBeCreated = cristinAuthors[i].cristin_person_id !== null ? cristinAuthors[i] : {
                        ...copy, affiliations: await fetchInstitutions(props.duplicate ? cristinAuthors[i].affiliations : imported[i].institutions)
                    };
                    
                }
            }
            setData(contributors);
            setFetched(true);
        }

        fetch();
        handleTempSave();
    }, [props.data, props.open, state.selectedPublication]);

    function checkContributorErrors(contributors) {
        let errors = 0;

        for(var i = 0; i < contributors.length; i++) {
            console.log(contributors[i].toBeCreated);
            if(!contributors[i].toBeCreated.hasOwnProperty("first_name") || !contributors[i].toBeCreated.hasOwnProperty("surname") || !contributors[i].toBeCreated.hasOwnProperty("authorname") || contributors[i].toBeCreated.affiliations.length < 1) {
                errors++;
            }
        }

        dispatch({type: "setContributorErrors", payload: errors});
    }

    function handleClose() {
        props.enqueueSnackbar("Endringer er blitt lagret midlertidig. (Ved åpning av ny publikasjon vil endringer bli mistet)", {
            variant: "warning"
        });
        props.toggle();
        dispatch({type: "setContributorPage", payload: 0});
        dispatch({type: "setContributorPerPage", payload: 5});
        checkContributorErrors(data);
    }

    async function getDuplicateAffiliations(author) {
        let affiliations = [];
        for (let i = 0; i < author.affiliations.length; i++) {
            affiliations.push({
                cristinInstitutionNr: author.affiliations[i].institution.cristin_institution_id,
                institutionName: await fetchInstitutionName(author.affiliations[i].institution.cristin_institution_id),
                isCristinInstitution: (author.affiliations[i].institution.hasOwnProperty("isCristinInstitution") && author.affiliations[i].institution.isCristinInstitution === true ? true : false)
            });
        }
        return affiliations;

    }

    function handleSave() {
        props.enqueueSnackbar("Bidragsyterliste har blitt oppdatert.", {
            variant: "success"
        });
        props.toggle();
        dispatch({type: "setContributorPage", payload: 0});
        dispatch({type: "setContributorPerPage", payload: 5});
        dispatch({type: "contributors", payload: data});
        checkContributorErrors(data);
    }

    async function handleChooseAuthor(author) {
        const toBeCreatedOrder = author.toBeCreated.order;
        
        let copiedAffiliations = JSON.parse(JSON.stringify(author.imported.affiliations));
        let cleanedAffiliations = await handleChosenAuthorAffiliations(copiedAffiliations);

        let temp = [...data];
        temp[toBeCreatedOrder - 1].toBeCreated.affiliations =
            cleanedAffiliations;
        temp[toBeCreatedOrder - 1].toBeCreated.first_name =
            author.imported.first_name;
        temp[toBeCreatedOrder - 1].toBeCreated.surname = author.imported.surname;
        temp[toBeCreatedOrder - 1].toBeCreated.authorname =
            author.imported.authorname;
        temp[toBeCreatedOrder - 1].toBeCreated.cristin_person_id = author.cristin.hasOwnProperty("cristin_person_id") && author.cristin.cristin_person_id !== null ? author.cristin.cristin_person_id : 
            author.imported.cristin_person_id;
        temp[toBeCreatedOrder - 1].isEditing = false;

        setData(temp);
    }

    async function handleChosenAuthorAffiliations(affil) {
        let tempArr = [];
        for(var i = 0; i < affil.length; i++) {
            let tempInst = affil[i];
            if(countries[tempInst.countryCode] === undefined) {
                if((!affil[i].hasOwnProperty("cristinInstitutionNr")) || affil[i].cristinInstitutionNr === 0 || affil[i].countryCode !== "NO" || affil[i].isCristinInstitution === false) {
                    let response = await axios.get(process.env.REACT_APP_CRISREST_GATEKEEPER_URL + "/institutions/country/" + affil[i].countryCode + "?lang=nb",
                        JSON.parse(localStorage.getItem("config")));
                    if(response.data.length > 0) {
                        tempInst.institutionName = (response.data[0].institution_name.hasOwnProperty("nb") ? response.data[0].institution_name.nb : response.data[0].institution_name.en) + " (Ukjent institusjon)"
                        tempInst.unitName = (response.data[0].institution_name.hasOwnProperty("nb") ? response.data[0].institution_name.nb : response.data[0].institution_name.en) + " (Ukjent institusjon)"
                    }
                }
                countries[tempInst.countryCode] = tempInst;
            } else {
                tempInst = countries[tempInst.countryCode];
            }
            tempArr.push(tempInst);
            
        }
        return tempArr;
    }

    function handleTempSave() {
        let temp = {
            pubId: props.data.pubId,
            contributors: data,
            duplicate: props.duplicate
        };
        if (state.doSave) {
            localStorage.setItem("tempContributors", JSON.stringify(temp));
        }
    }

    function handleOrder(author, up) {
        let copy = [...data];
        let index = author.toBeCreated.order - 1;
        let movedToOrder;
        if (up) {
            copy[index] = copy[index - 1];
            copy[index - 1] = author;

            movedToOrder = index;

            setData(prevObjs =>
                prevObjs.map((o, i) => {
                    if (i === index) {
                        return {
                            ...copy[i],
                            toBeCreated: {
                                ...copy[i].toBeCreated,
                                order: index + 1
                            }
                        };
                    }
                    if (i === index - 1) {
                        return {
                            ...copy[i],
                            toBeCreated: {
                                ...copy[i].toBeCreated,
                                order: movedToOrder
                            }
                        };
                    }
                    return copy[i];
                })
            );
            if(index / state.contributorPerPage === state.contributorPage) {
                dispatch({ type: "setContributorPage", payload: state.contributorPage - 1});
            }
        } else {
            copy[index] = copy[index + 1];
            copy[index + 1] = author;

            movedToOrder = index + 2;

            setData(prevObjs =>
                prevObjs.map((o, i) => {
                    if (i === index) {
                        return {
                            ...copy[i],
                            toBeCreated: {
                                ...copy[i].toBeCreated,
                                order: index + 1
                            }
                        };
                    }
                    if (i === index + 1) {
                        return {
                            ...copy[i],
                            toBeCreated: {
                                ...copy[i].toBeCreated,
                                order: movedToOrder
                            }
                        };
                    }
                    return copy[i];
                })
            );
            if(index + 1 % state.contributorPerPage === 0) {
                dispatch({ type: "setContributorPage", payload: state.contributorPage + 1});
            }
        }
    }

    const updateContributor = (author, rowIndex) => {
        let temp = [...data];
        temp[rowIndex] = author;
        setData(temp);
    };

    // Ved sletting av en bidragsyter, sjekk om indeksering skal bli beholdt / oppdatert for alle andre elementer i bidragsyterlisten
    //TODO skriv om funksjonen slik at den blir enklere å lese
    //TODO Sjekk om alle edge-cases blir håndtert korrekt med tanke på rekkefølge i toBeCreated og imported (Sørg for at rekkefølgenummer på en gitt bidragsyter aldri blir mindre enn 1)
    const removeContributor = rowIndex => {
        let temp = [...data];
        temp.splice(rowIndex, 1);
        for (let i = rowIndex; i < temp.length; i++) {
            if (
                temp[i].imported.order === temp[i].toBeCreated.order &&
                temp[i].imported.order >= rowIndex
            ) {
                temp[i].imported.order = temp[i].imported.order - 1;
                temp[i].toBeCreated.order = temp[i].toBeCreated.order - 1;
            } else {
                if (temp[i].imported.order === rowIndex) {
                } else if (temp[i].imported.order > rowIndex) {
                    if (temp[i].imported.order > 0) {
                        if (temp[i].imported.order < temp[i].toBeCreated.order) {
                            temp[i].toBeCreated.order = temp[i].toBeCreated.order - 1;
                        }
                    } else {
                        temp[i].toBeCreated.order = temp[i].toBeCreated.order - 1;
                    }
                }
            }
        }
        for (let j = 0; j < rowIndex; j++) {
            console.log("rowIndex: " + rowIndex);
            if (
                temp[j].imported.order === rowIndex &&
                temp[j].imported.order !== temp[j].toBeCreated.order
            ) {
                temp[j].imported.order = temp[j].imported.order - 1;
            } else if (temp[j].imported.order > rowIndex) {
                temp[j].imported.order = temp[j].imported.order - 1;
            }
        }
        setData(temp);
    };

    const toggle = rowIndex => {
        dispatch({type: "param", payload: rowIndex});
        setDialog(!dialog);
    };

    const getMainImage = () => {
        return PersonIcon;
    };
    const getArrowDownImage = () => {
        return ArrowDownIcon;
    };
    const getArrowUpImage = () => {
        return ArrowUpIcon;
    };
    const getInactiveImage = () => {
        return InactivePersonIcon;
    };

    function addContributor() {
        var temp = [...data];
        var newContributor = {
            imported: {
                order: temp.length + 1,
                affiliations: [],
                first_name: "",
                surname: ""
            },
            cristin: {
                order: temp.length + 1,
                affiliations: [],
                first_name: "",
                surname: ""
            },
            toBeCreated: {
                order: temp.length + 1,
                affiliations: [],
                first_name: "",
                surname: ""
            }
        };
        temp.push(newContributor);

        if((data.length / state.contributorPerPage) === state.contributorPage + 1) {
            dispatch({ type: "setContributorPage", payload: state.contributorPage + 1});
        }
        
        setData(temp);
    }

    function createBody() {
        if(fetched) {
            return (
                <TableBody>
                    {data
                        .slice(
                            state.contributorPage * state.contributorPerPage,
                            (state.contributorPage + 1) * state.contributorPerPage
                        )
                        .map((row, i) => (
                            <TableRow key={i} hover>
                                <TableCell>
                                    {row.toBeCreated.order === row.imported.order
                                        ? row.imported.order
                                        : row.imported.order + " (" + row.toBeCreated.order + ")"}
                                </TableCell>
                                <TableCell style={{width: '40%'}}>
                                    <div className={`result contributor`}>
                                        <div className="image-wrapper person">
                                            <img src={row.cristin.hasOwnProperty("cristin_person_id") && row.cristin.cristin_person_id !== null ? getMainImage() : getInactiveImage()} alt="person"/>
                                        </div>
                                        <div className="content-wrapper">
                                            <h6>
                                                {row.imported.surname && row.imported.first_name
                                                    ? row.imported.surname +
                                                    ", " +
                                                    row.imported.first_name
                                                    : row.imported.authorName
                                                        ? row.imported.authorName
                                                        : null}
                                            </h6>
                                            <div className={`metadata`}>
                                                {row.imported.affiliations.map((inst, j) => (
                                                    <p className={`italic`} key={j}>
                                                        {inst.unitName}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    {row.imported.surname && row.imported.first_name ? (
                                        <Button
                                            color="primary"
                                            onClick={() => handleChooseAuthor(row)}
                                        >
                                            Velg denne
                                        </Button>
                                    ) : null}
                                </TableCell>
                                <TableCell>
                                    <div className={`result contributor`}>
                                        <div className="image-wrapper person">
                                            {row.toBeCreated.hasOwnProperty("cristin_person_id") && row.toBeCreated.cristin_person_id ?
                                                <img src={getMainImage()} alt="person"/> :
                                                <img src={getInactiveImage()} alt="inaktiv person"/>}
                                        </div>
                                        <div className={`orderButtons`}>
                                            {row.toBeCreated.order > 1 &&
                                            row.toBeCreated.order < data.length ? (
                                                <div>
                                                    <div>
                                                        <Button onClick={() => handleOrder(row, true)}>
                                                            <img src={getArrowUpImage()} alt="up-arrow"/>
                                                        </Button>
                                                    </div>
                                                    <div>
                                                        <Button onClick={() => handleOrder(row, false)}>
                                                            <img
                                                                src={getArrowDownImage()}
                                                                alt="down-arrow"
                                                            />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : row.toBeCreated.order === data.length &&
                                            data.length > 1 ? (
                                                <Button onClick={() => handleOrder(row, true)}>
                                                    <img src={getArrowUpImage()} alt="up-arrow"/>
                                                </Button>
                                            ) : row.toBeCreated.order < data.length ? (
                                                <Button onClick={() => handleOrder(row, false)}>
                                                    <img src={getArrowDownImage()} alt="down-arrow"/>
                                                </Button>
                                            ) : null}
                                        </div>
                                        <Contributor
                                            author={row}
                                            index={
                                                i + state.contributorPage * state.contributorPerPage
                                            }
                                            updateData={updateContributor}
                                            isOpen={props.open}
                                            deleteContributor={toggle}
                                            handleSubmitAffiliations={handleChosenAuthorAffiliations}
                                        />
                                        <ClosingDialog
                                            doFunction={removeContributor}
                                            title={"Slett bidragsyter"}
                                            text={"Er du sikker på at du vil slette denne bidragsyteren?"}
                                            open={dialog}
                                            handleClose={toggle}
                                            handleCloseDialog={toggle}
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    {state.contributorPage + 1 >= data.length / state.contributorPerPage ? (
                        <TableRow>
                            <TableCell>+</TableCell>
                            <TableCell></TableCell>
                            <TableCell>
                                <Button onClick={() => addContributor()}>
                                    Legg til bidragsyter
                                </Button>
                            </TableCell>
                        </TableRow>
                    ) : null}
                    <ContributorPagination totalCount={data.length}/>
                </TableBody>
            );
        } else {
            return (
                <TableBody>
                    {Array.from({length:5}, (value, index) =>
                    <TableRow
                        hover
                        id={'skeleton'+index}
                        key={index}
                        tabIndex="0"
                    >
                        <TableCell>
                            <Skeleton variant="rect" width={40} height={20}/>
                        </TableCell>
                        <TableCell>
                            <Skeleton variant="rect" width='auto' height={118}/>
                        </TableCell>
                        <TableCell>
                            <Skeleton variant="rect" width='auto' height={118}/>
                        </TableCell>
                    </TableRow>
                )}
                </TableBody>
            );
        }
    }


    return (
        <Modal isOpen={props.open} className={`contributorModal`}>
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
                    {createBody()}
                    <TableFooter>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell></TableCell>

                            <TableCell align="right">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleSave()}
                                >
                                    Lagre
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </ModalBody>
        </Modal>
    );
}

async function fetchPerson(personId) {
    if (personId === 0)
        return;

    return await axios.get(process.env.REACT_APP_CRISREST_GATEKEEPER_URL + "/persons/" + personId, JSON.parse(localStorage.getItem("config")));
}

let institutionNames = {};
async function fetchInstitutionName(institutionId) {
    if (institutionId === "0") return " ";
    if (institutionNames[institutionId] === undefined) {
        let institution = await axios.get(
            process.env.REACT_APP_CRISREST_GATEKEEPER_URL + "/institutions/" + institutionId + "?lang=nb", JSON.parse(localStorage.getItem("config"))
        );
        institutionNames[institutionId] = institution.data.institution_name.hasOwnProperty("nb")
            ? institution.data.institution_name.nb
            : institution.data.institution_name.en;
    }
    return institutionNames[institutionId];
}

let countries = {};
async function fetchInstitutions(affiliations) {
    let arr = [];
    for (let i = 0; i < affiliations.length; i++) {
        let inst = affiliations[i];
        if ((inst.cristinInstitutionNr === 9127 || inst.cristinInstitutionNr === 9126 || inst.cristinInstitutionNr === 0) && inst.hasOwnProperty("countryCode")) {
            if (countries[inst.countryCode] === undefined) {
                let response = await axios.get(process.env.REACT_APP_CRISREST_GATEKEEPER_URL + "/institutions/country/" + inst.countryCode + "?lang=nb",
                    JSON.parse(localStorage.getItem("config")));
                if (response.data.length > 0) {
                    inst = {
                        cristinInstitutionNr: response.data[0].cristin_institution_id,
                        institutionName: (response.data[0].institution_name.hasOwnProperty("nb") ? response.data[0].institution_name.nb : response.data[0].institution_name.en) + " (Ukjent institusjon)",
                        countryCode: response.data[0].country,
                        isCristinInstitution: response.data[0].isCristinInstitution
                    };
                } else {
                    console.log(affiliations[i]);
                }
                countries[inst.countryCode] = inst;
            } else {
                inst = countries[inst.countryCode];
            }
        }
        arr.push(inst);
    }
    return arr;
}


async function searchContributors(authors) {
    let suggestedAuthors = [];
    for (let i = 0; i < authors.length; i++) {
        let person = defaultAuthor;
        let affiliations = [];
        if (authors[i].cristinId !== 0) {
            person = await fetchPerson(authors[i].cristinId);
            person = person.data;
            if (person.hasOwnProperty("affiliations")) {
                for (let j = 0; j < person.affiliations.length; j++) {
                    affiliations[j] = {
                        cristinInstitutionNr: person.affiliations[j].institution.cristin_institution_id,
                        institutionName: await fetchInstitutionName(person.affiliations[j].institution.cristin_institution_id),
                        isCristinInstitution: true
                    }
                }
            } else {
                affiliations = await fetchInstitutions(authors[i].institutions);
            }
            person = {
                cristin_person_id: person.cristin_person_id,
                first_name: person.first_name,
                surname: person.surname,
                affiliations: affiliations.filter((item, index) => affiliations.indexOf(item) === index),
                url: process.env.REACT_APP_CRISREST_GATEKEEPER_URL + "/persons/" + person.cristin_person_id + "?lang=nb",
                isEditing: false,
                order: i + 1
            };
        }
        suggestedAuthors[i] = person;
    }

    return suggestedAuthors;
}

const defaultAuthor = {
    cristin_person_id: null,
    first_name: "",
    surname: "",
    order: 0,
    affiliations: [],
    url: null,
    isEditing: true
};

export default withSnackbar(ContributorModal);
