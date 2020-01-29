import React from "react";
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
import ArrowUpIcon from "../../assets/icons/arrowhead-up3.svg";
import ArrowDownIcon from "../../assets/icons/arrowhead-down3.svg";
import {Button, TableFooter} from "@material-ui/core";
import {properties} from "../../properties.js"

import ContributorPagination from "../ContributorPagination/ContributorPagination";
import Contributor from "./Contributor";

function ContributorModal(props) {
    const {useRef, useLayoutEffect} = React;
    const [data, setData] = React.useState([]);
    const [searchResults, setSearchResults] = React.useState(null);

    let {state, dispatch} = React.useContext(Context);

    const firstUpdate = useRef(true);
    useLayoutEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }
        handleTempSave();
    }, [data]);

    const updatePersons = useRef(true);
    useLayoutEffect(() => {
        async function fetch() {

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
                        console.log(state.selectedPublication.authors);
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
        }

        // if (updatePersons.current) {
        //     updatePersons.current = false;
        //     fetch();
        //     handleTempSave();
        // }
        fetch();
        handleTempSave();
    }, [props.data, props.open, state.selectedPublication]);

    function handleClose() {
        props.enqueueSnackbar("Endringer er ikke blitt lagret.", {
            variant: "warning"
        });
        props.toggle();
        dispatch({type: "setContributorPage", payload: 0});
        dispatch({type: "setContributorPerPage", payload: 5});
    }

    async function getDuplicateAffiliations(author) {
        let affiliations = [];
        for (let i = 0; i < author.affiliations.length; i++) {
            affiliations.push({
                cristinInstitutionNr: author.affiliations[i].institution.cristin_institution_id,
                institutionName: await fetchInstitutionName(author.affiliations[i].institution.cristin_institution_id)
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
    }

    function handleChooseAuthor(author) {
        const toBeCreatedOrder = author.toBeCreated.order;

        let temp = [...data];
        temp[toBeCreatedOrder - 1].toBeCreated.affiliations =
            author.imported.affiliations;
        temp[toBeCreatedOrder - 1].toBeCreated.first_name =
            author.imported.first_name;
        temp[toBeCreatedOrder - 1].toBeCreated.surname = author.imported.surname;
        temp[toBeCreatedOrder - 1].toBeCreated.authorname =
            author.imported.authorname;
        temp[toBeCreatedOrder - 1].toBeCreated.cristin_person_id =
            author.imported.cristin_person_id;
        temp[toBeCreatedOrder - 1].isEditing = false;

        setData(temp);
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
        console.log("order changed");
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
                console.log(rowIndex);
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

    const getMainImage = () => {
        return PersonIcon;
    };
    const getArrowDownImage = () => {
        return ArrowDownIcon;
    };
    const getArrowUpImage = () => {
        return ArrowUpIcon;
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
        setData(temp);
    }


    async function retrySearch(author, rowIndex) {
        let results = searchResults;
        console.log(results);
        if (searchResults === null || searchResults.order !== rowIndex) {
            let authorName = author.hasOwnProperty("first_name")
                ? author.first_name.substr(0, 1) + " " + author.surname
                : author.authorName;
            let searchedAuthors = await axios.get(
                properties.crisrest_gatekeeper_url + "/persons?name=" +
                authorName +
                "&institution=" +
                (author.affiliations[0].hasOwnProperty("acronym")
                    ? author.affiliations[0].acronym
                    : author.affiliations[0].institutionName)
                , JSON.parse(localStorage.getItem("config")));
            if (author.cristin_person_id !== 0) {
                searchedAuthors.data.push(author);
            }
            if (searchedAuthors.data.length > 0) {
                props.enqueueSnackbar("Fant " + searchedAuthors.data.length + " forfattere med søk.", {variant: "success"});
            } else {
                props.enqueueSnackbar("Fant ingen forfattere med søk.", {variant: "warning"});
            }
            results = { order: rowIndex, authors: searchedAuthors.data, current: 0 };
            setSearchResults(results);
        }

        await nextSearchResult(results, results.current);
    }


    async function nextSearchResult(results, current) {
        if (results.authors.length > 0 && current < results.authors.length) {
            let tempAuthor = await axios.get(
                properties.crisrest_gatekeeper_url + "/persons/" +
                results.authors[current].cristin_person_id
                , JSON.parse(localStorage.getItem("config")));
            let tempAffliations = [];
            for (let j = 0; j < tempAuthor.data.affiliations.length; j++) {
                let tempdata = await axios.get(
                    properties.crisrest_gatekeeper_url + "/institutions/" +
                    tempAuthor.data.affiliations[j].institution.cristin_institution_id
                    , JSON.parse(localStorage.getItem("config")));
                let tempInstitution = {
                    acronym: tempdata.data.acronym,
                    countryCode: tempdata.data.country,
                    institutionName: tempdata.data.institution_name.hasOwnProperty("nb") ?
                        tempdata.data.institution_name.nb :
                        tempdata.data.institution_name.en,
                    institutionNr: tempdata.data.cristin_institution_id,
                    isCristinInstitution: tempdata.data.cristin_user_institution
                };
                console.log(tempInstitution);
                tempAffliations.push(tempInstitution);
            }
            let temp = [...data];
            results.authors[current].affiliations = tempAffliations;

            temp[results.order].cristin = results.authors[current];
            temp[results.order].cristin.isEditing = false;
            temp[results.order].cristin.order = results.order + 1;

            temp[results.order].toBeCreated = results.authors[current];
            temp[results.order].toBeCreated.isEditing = false;
            temp[results.order].toBeCreated.order = results.order + 1;


            setSearchResults({ ...results, current: current + 1, order: results.order });
            // setData(temp);
        } else {
            let temp = [...data];

            temp[results.order].cristin = temp[results.order].imported;
            temp[results.order].cristin.isEditing = true;
            temp[results.order].cristin.order = results.order + 1;

            temp[results.order].toBeCreated = temp[results.order].imported;
            temp[results.order].toBeCreated.isEditing = true;
            temp[results.order].toBeCreated.order = results.order + 1;
            setSearchResults({ ...results, current: 0 })
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
                                                <img src={getMainImage()} alt="person"/>
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
                                                <img src={getMainImage()} alt="person"/>
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
                                                searchAgain={retrySearch}
                                                deleteContributor={removeContributor}
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        {state.contributorPage + 1 >= data.length / 5 ? (
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

async function fetchContributors(result) {
    let authors = result.authors;

    return authors;
}

async function fetchPerson(personId) {
    if (personId === 0)
        return;

    return await axios.get(properties.crisrest_gatekeeper_url + "/persons/" + personId, JSON.parse(localStorage.getItem("config")));
}

let institutionNames = {};
async function fetchInstitutionName(institutionId) {
    if (institutionId === "0") return " ";
    if (institutionNames[institutionId] === undefined) {
        let institution = await axios.get(
            properties.crisrest_gatekeeper_url + "/institutions/" + institutionId, JSON.parse(localStorage.getItem("config"))
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
                let response = await axios.get(properties.crisrest_gatekeeper_url + "/institutions/country/" + inst.countryCode + "?lang=nb",
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
                    }
                }
            }
            person = {
                cristin_person_id: person.cristin_person_id,
                first_name: person.first_name,
                surname: person.surname,
                affiliations: affiliations,
                url: properties.crisrest_gatekeeper_url + "/persons/" + person.cristin_person_id,
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
