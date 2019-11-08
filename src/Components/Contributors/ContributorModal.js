import React, { useEffect } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import axios from "axios";
import { withSnackbar } from "notistack";
import "../../assets/styles/Results.scss";
import { Context } from "../../Context";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import PersonIcon from "../../assets/icons/person-active.svg";
import ArrowUpIcon from "../../assets/icons/arrowhead-up3.svg";
import ArrowDownIcon from "../../assets/icons/arrowhead-down3.svg";
import { Button, TableFooter } from "@material-ui/core";

import ContributorPagination from "../ContributorPagination/ContributorPagination";
import Contributor from "./Contributor";

function ContributorModal(props) {

    const { useRef, useLayoutEffect } = React;
    const [data, setData] = React.useState([]);
    const [selectedInstitution, setSetSelectedInstitution] = React.useState(defaultInstitution);
    let {state, dispatch} = React.useContext(Context);

    const firstUpdate = useRef(true);
    useLayoutEffect(() => {
        console.log("layoutEffect");
        console.log(firstUpdate);
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }
        handleTempSave();
    }, [data]);

    useEffect(() => {
        async function fetch() {
            if (props.open) {
                const imported = await fetchContributors(props.data);

                let contributors = [];
                let cristinAuthors = [];

                let temp = JSON.parse(localStorage.getItem("tempContributors"));
                if (temp !== null && temp.publication.pubId === props.data.pubId) {
                    contributors = temp.contributors;
                } else {
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

          for (var l = 0; l < contributors.length; l++) {
            if (
              contributors[l].cristin.surname &&
              contributors[l].cristin.first_name
            ) {
              contributors[l].isEditing = false;
            } else {
              contributors[l].isEditing = true;
            }
          }

          let copy =
            contributors[i].cristin === defaultAuthor
              ? Object.assign({}, contributors[i].imported)
              : Object.assign({}, contributors[i].cristin);
          contributors[i].toBeCreated =
            contributors[i].cristin === defaultAuthor ? copy : copy;
        }

        setData(contributors);
      }
    }
    fetch();
  }, [props.data, props.open, state.selectedPublication]);

  function handleClose() {
    props.enqueueSnackbar("Endringer er ikke blitt lagret.", {
      variant: "warning"
    });
    props.toggle();
    dispatch({ type: "setContributorPage", payload: 0 });
  }

  function handleSave() {
    props.enqueueSnackbar("Bidragsyterliste har blitt oppdatert.", {
      variant: "success"
    });
    props.toggle();
    dispatch({ type: "setContributorPage", payload: 0 });
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
            publication: props.data,
            contributors: data
        };
        localStorage.setItem("tempContributors", JSON.stringify(temp));
    }

    function displayAuthorForm(author) {
        return (
            <div>
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
                        <FormGroup>
                            <TextField
                                id="authorName"
                                label="Forfatternavn"
                                value={author.toBeCreated.authorname}
                                margin="normal"
                                onChange={handleChange(author, "authorName")}
                                required
                            />
                        </FormGroup>
                        <div className={`metadata`}>
                            { author.toBeCreated.affiliations.map((inst, j)=> (
                                    <p className={`italic`} key={j}>
                                        {inst.institutionName}<Button size="small" color="primary" onClick={() => removeInstitution(author, j)}>Fjern tilknytning</Button>
                                    </p>
                                    )) }
                        </div>
                        <InstitutionSelect onChange={handleInstitutionChange} />
                        <Button
                            onClick={() => addInstitution(author)}
                            disabled={
                                selectedInstitution.institutionNr === 0 ||
                                author.toBeCreated.affiliations.filter(instNr => {return selectedInstitution.institutionNr === instNr.institutionNr}).length > 0
                            }>Add</Button>
                        <Button color="primary" onClick={() => handleSubmit(author)}>Opprett person</Button>
                    </Form>
                </div>
            </div>
        )
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
        var temp = [...data];
        temp[rowIndex] = author;
        setData(temp);
    };

    function handleInstitutionChange(institution) {
        setSetSelectedInstitution(institution);
    }

    // Ved sletting av en bidragsyter, sjekk om indeksering skal bli beholdt / oppdatert for alle andre elementer i bidragsyterlisten
    //TODO skriv om funksjonen slik at den blir enklere å lese
    //TODO Sjekk om alle edge-cases blir håndtert korrekt med tanke på rekkefølge i toBeCreated og imported (Sørg for at rekkefølgenummer på en gitt bidragsyter aldri blir mindre enn 1)
    const removeContributor = rowIndex => {
        var temp = [...data];
        temp.splice(rowIndex, 1);
        for (var i = rowIndex; i < temp.length; i++) {
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
        for (var j = 0; j < rowIndex; j++) {
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

    function removeInstitution(author, index) {
        let affiliationCopy = [...author.toBeCreated.affiliations];
        affiliationCopy.splice(index, 1);
        setData(prevObjs => (prevObjs.map((o) => {
            if (o === author) {
                return {...author, toBeCreated:
                        {
                            ...author.toBeCreated, affiliations: affiliationCopy
                        }
                }
            }
            return o;
        })));
    }

    function addInstitution(author) {
        let affiliationCopy = [...author.toBeCreated.affiliations];
        affiliationCopy.push({countryCode: "test", institutionName: selectedInstitution.label, institutionNr: selectedInstitution.institutionNr, isCristinInstitution: true});
        setData(prevObjs => (prevObjs.map((o) => {
            if (o === author) {
                return {...author, toBeCreated:
                        {
                            ...author.toBeCreated, affiliations: affiliationCopy
                        }
                }
            }
            return o;
        })));

    }

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

    function handleChange(obj, property) {
        return (event) => {
            const firstName = property === "first" ? event.target.value : obj.toBeCreated.first_name;
            const lastName = property === "last" ? event.target.value : obj.toBeCreated.surname;
            const authorName = property === "authorName" ? event.target.value : obj.toBeCreated.authorname;
            setData(prevObjs => (prevObjs.map((o) => {
                if (o === obj) {
                    return {...obj, toBeCreated:
                            {
                                first_name: firstName,
                                surname: lastName,
                                cristin_person_id: obj.toBeCreated.cristin_person_id,
                                authorname: authorName,
                                order: obj.toBeCreated.order,
                                affiliations: obj.toBeCreated.affiliations
                            }};
                }
                return o;
            })));
        };
    }

    async function retrySearch(author, rowIndex) {
        console.log(author);
        let authorName = author.hasOwnProperty("first_name")
            ? author.first_name.substr(0, 1) + " " + author.surname
            : author.authorName;
        let searchedAuthors = await axios.get(
            "https://api.cristin-utv.uio.no/v2/persons?name=" +
            authorName +
            "&institution=" +
            (author.affiliations[0].hasOwnProperty("acronym")
                ? author.affiliations[0].acronym
                : author.affiliations[0].institutionName)
        );
        console.log(searchedAuthors);
        findBestMatch(author, searchedAuthors.data, rowIndex);
    }

    async function findBestMatch(author, potentialAuthors, rowIndex) {
        let bestMatch = "";
        let maxCharsMatched = 0;
        for (var i = 0; i < potentialAuthors.length; i++) {
            let charsMatched = 0;

            for (var h = 0; h < author.first_name.length; h++) {
                if (
                    author.first_name.substr(h, h + 1) ===
                    potentialAuthors[i].first_name.substr(h, h + 1)
                ) {
                    charsMatched++;
                }
            }
            for (var h = 0; h < author.surname.length; h++) {
                if (
                    author.surname.substr(h, h + 1) ===
                    potentialAuthors[i].surname.substr(h, h + 1)
                ) {
                    charsMatched++;
                }
            }
            if (charsMatched > maxCharsMatched) {
                bestMatch = potentialAuthors[i];
                maxCharsMatched = charsMatched;
            }
        }
        if (bestMatch !== "") {
            var tempAuthor = await axios.get(
                "https://api.cristin-utv.uio.no/v2/persons/" +
                bestMatch.cristin_person_id
            );
            console.log(tempAuthor.data);
            var tempAffliations = [];
            for (var j = 0; j < tempAuthor.data.affiliations.length; j++) {
                var tempInstitution = [];
                var tempdata = await axios.get(
                    "https://api.cristin-utv.uio.no/v2/institutions/" +
                    tempAuthor.data.affiliations[j].institution.cristin_institution_id
                );
                console.log(tempdata);
                tempInstitution.acronym = tempdata.data.acronym;
                tempInstitution.countryCode = tempdata.data.country;
                tempInstitution.institutionName = tempdata.data.institution_name.hasOwnProperty(
                    "nb"
                )
                    ? tempdata.data.institution_name.nb
                    : tempdata.data.institution_name.en;
                tempInstitution.institutionNr = tempdata.data.cristin_institution_id;
                tempInstitution.isCristinInstitution =
                    tempdata.data.cristin_user_institution;
                tempAffliations.push(tempInstitution);
            }
            var temp = [...data];
            bestMatch.affiliations = tempAffliations;

            temp[rowIndex].cristin = bestMatch;
            temp[rowIndex].cristin.isEditing = false;
            temp[rowIndex].cristin.order = rowIndex + 1;

            temp[rowIndex].toBeCreated = bestMatch;
            temp[rowIndex].toBeCreated.order = rowIndex + 1;
            console.log(temp);
            setData(temp);
        }
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
                  <TableCell>
                    <div className={`result contributor`}>
                      <div className="image-wrapper person">
                        <img src={getMainImage()} alt="person" />
                      </div>
                      <div className="content-wrapper">
                        <h6>
                          {row.imported.surname && row.imported.first_name
                            ? row.imported.surname +
                              ", " +
                              row.imported.first_name
                            : row.imported.authorName
                            ? row.imported.authorName
                            : ""}
                        </h6>
                        <div className={`metadata`}>
                          {row.imported.affiliations.map((inst, j) => (
                            <p className={`italic`} key={j}>
                              {inst.institutionName}
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
                    ) : (
                      ""
                    )}
                  </TableCell>
                  <TableCell>
                    <div className={`result contributor`}>
                      <div className="image-wrapper person">
                        <img src={getMainImage()} alt="person" />
                      </div>
                      <div className={`orderButtons`}>
                        {row.toBeCreated.order > 1 &&
                        row.toBeCreated.order < data.length ? (
                          <div>
                            <div>
                              <Button onClick={() => handleOrder(row, true)}>
                                <img src={getArrowUpImage()} alt="up-arrow" />
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
                            <img src={getArrowUpImage()} alt="up-arrow" />
                          </Button>
                        ) : row.toBeCreated.order < data.length ? (
                          <Button onClick={() => handleOrder(row, false)}>
                            <img src={getArrowDownImage()} alt="down-arrow" />
                          </Button>
                        ) : (
                          ""
                        )}
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
                <TableCell> + </TableCell>
                <TableCell></TableCell>
                <TableCell>
                  <Button onClick={() => addContributor()}>
                    {" "}
                    Legg til bidragsyter{" "}
                  </Button>
                </TableCell>
              </TableRow>
            ) : (
              ""
            )}
            <ContributorPagination totalCount={data.length} />
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
        suggestedAuthors[i].order = i + 1;
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

const defaultInstitution = {
    value: " ",
    label: "Ingen institusjon" ,
    institutionNr: 0
};

export default withSnackbar(ContributorModal);
