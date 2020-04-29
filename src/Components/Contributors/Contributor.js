import React, { useEffect } from "react";
import { Button, FormGroup, TextField, Collapse, Card } from "@material-ui/core";
import InstitutionCountrySelect from "../InstitutionSelect/InstitutionCountrySelect";
import ContributorSearchPanel from "./ContributorSearchPanel";
import { Form } from "reactstrap";
import { Context } from "../../Context";
import axios from "axios";
import { withSnackbar } from "notistack";
import "../../assets/styles/common.scss"

function Contributor(props) {
  
  let {state} = React.useContext(Context);

  useEffect(() => {
    setRowIndex(props.index);
    setData(props.author);
  }, [props.author]);

  useEffect(() => {
    setSelectedUnit("");
    setSetSelectedInstitution("");
  }, [state.contributorPage]);

  const [data, setData] = React.useState(props.author);

  const [rowIndex, setRowIndex] = React.useState(props.index);

  const [selectedInstitution, setSetSelectedInstitution] = React.useState({
    value: "",
    cristinInstitutionNr: 0
  });

  const [selectedUnit, setSelectedUnit] = React.useState("");

  const [searchResults, setSearchResults] = React.useState("");

  const [open, setOpen] = React.useState(false);

  const unitStyle = {
    marginLeft: "0px"
  };

  function updateEditing() {
    let temp = data;
    temp.isEditing = true;

    props.updateData(temp, rowIndex);
  }

  function handleSubmit() {
    let temp = data;
    temp.isEditing = false;

    props.updateData(temp, rowIndex);
    setSetSelectedInstitution({
      value: "",
      cristinInstitutionNr: 0
    });
  }

  function handleUnitChange(unit) {
    setSelectedUnit(unit);
  }

  function handleInstitutionChange(institution) {
    console.log(institution);
    setSetSelectedInstitution(institution);
    setSelectedUnit("");
  }

  function removeInstitution(index) {
    let affiliationCopy = [...data.toBeCreated.affiliations];
    affiliationCopy.splice(index, 1);
    let temp = data;
    temp.toBeCreated.affiliations = affiliationCopy;

    props.updateData(temp, rowIndex);
  }

  function removeUnit(instIndex, unitIndex) {
    let affiliationCopy = [...data.toBeCreated.affiliations];
    affiliationCopy[instIndex].units.splice(unitIndex, 1);
    let temp = data;
    temp.toBeCreated.affiliations = affiliationCopy;

    props.updateData(temp, rowIndex);
  }

  function checkForUnit() {
    let affiliationCopy = [...data.toBeCreated.affiliations];
    let duplicate = 0;
    if(selectedUnit){
      for(let i = 0; i < affiliationCopy.length; i++) {
        if(affiliationCopy[i].hasOwnProperty("units")) {
          for(let h = 0; h < affiliationCopy[i].units.length; h++) {
            if(affiliationCopy[i].units[h].unitNr === selectedUnit.value) {
              duplicate++;
            }
          }
        }
      }

      return duplicate > 0;
    }
  }

  async function addInstitution() {
    let affiliationCopy = [...data.toBeCreated.affiliations];
    let fetchedInstitution = await axios.get(process.env.REACT_APP_CRISREST_GATEKEEPER_URL + "/institutions/" + selectedInstitution.cristinInstitutionNr + "?lang=nb", JSON.parse(localStorage.getItem("config")));
    
    let duplicate = 0;
    for(let i = 0; i < affiliationCopy.length; i++){
      if(affiliationCopy[i].cristinInstitutionNr === selectedInstitution.cristinInstitutionNr || affiliationCopy[i].cristinInstitutionNr === selectedInstitution.cristinInstitutionNr){
        duplicate++;
        
        if(affiliationCopy[i].unitName !== fetchedInstitution.data.institution_name.nb) {
          affiliationCopy[i].unitName = fetchedInstitution.data.institution_name.nb;
          
        }
      }
    }
    if(duplicate < 1){
      affiliationCopy.push({
        countryCode: "test",
        institutionName: selectedInstitution.label,
        cristinInstitutionNr: selectedInstitution.cristinInstitutionNr,
        isCristinInstitution: true
      });
    }

    if(selectedUnit) {
      affiliationCopy = addUnit(affiliationCopy);
    }

    let temp = data;
    temp.toBeCreated.affiliations = affiliationCopy;

    props.updateData(temp, rowIndex);
  }

  function addUnit(affiliationCopy) {
    for(var i = 0; i < affiliationCopy.length; i++){
    if(affiliationCopy[i].cristinInstitutionNr === selectedInstitution.cristinInstitutionNr || affiliationCopy[i].cristinInstitutionNr === selectedInstitution.cristinInstitutionNr) {
      if(affiliationCopy[i].hasOwnProperty("units")) {
        affiliationCopy[i].units.push({
          unitName: selectedUnit.label,
          unitNr: selectedUnit.value
        });
      } else {
        affiliationCopy[i].units = [];
        affiliationCopy[i].units.push({
          unitName: selectedUnit.label,
          unitNr: selectedUnit.value
        });
      }
    }
  }
    return affiliationCopy;
  }

  function handleChange(event, obj, property) {
    if(!obj.hasOwnProperty("authorName")) {
      obj.authorName = "";
    }
    
    const firstName =
      property === "first" ? event.target.value : obj.toBeCreated.first_name;
    const lastName =
      property === "last" ? event.target.value : obj.toBeCreated.surname;
    const authorName =
      property === "authorName"
        ? event.target.value
        : obj.toBeCreated.authorname;

    if (property === "first") {
      obj.toBeCreated.first_name = firstName;
    } else if (property === "last") {
      obj.toBeCreated.surname = lastName;
    } else {
      obj.toBeCreated.authorName = authorName;
    }

    props.updateData(obj, rowIndex);
  }

  async function retrySearch(data) {
    try {
    let authorResults = await axios.get(process.env.REACT_APP_CRISREST_GATEKEEPER_URL + "/persons/" +
                                        (data.imported.cristin_person_id !== 0 ? "?id=" + data.imported.cristin_person_id : "?name=" + data.imported.first_name.substr(0, 1) + " " + data.imported.surname)
                                        , JSON.parse(localStorage.getItem("config"))); 
                  
    if(authorResults.data.length > 0) {   
        let fetchedAuthors = [];
        for(var i = 0; i < authorResults.data.length; i++) {
          let fetchedAuthor = await axios.get(process.env.REACT_APP_CRISREST_GATEKEEPER_URL + "/persons/" + authorResults.data[i].cristin_person_id, JSON.parse(localStorage.getItem("config")));
          let fetchedAffilations = [];
          for(var h = 0; h < fetchedAuthor.data.affiliations.length; h++) {
            let fetchedAffilation = await axios.get(process.env.REACT_APP_CRISREST_GATEKEEPER_URL + "/institutions/" + fetchedAuthor.data.affiliations[h].institution.cristin_institution_id + "?lang=nb", JSON.parse(localStorage.getItem("config")))
            let tempAffiliation = new Object();
            tempAffiliation.institutionName = fetchedAffilation.data.institution_name.en ||  fetchedAffilation.data.institution_name.nb;
            tempAffiliation.cristinInstitutionNr = fetchedAffilation.data.cristin_institution_id;
            tempAffiliation.isCristinInstitution = true;
            fetchedAffilations.push(tempAffiliation);
          }
          fetchedAuthor.data.affiliations = fetchedAffilations;
          fetchedAuthors.push(fetchedAuthor.data);
        }
        props.enqueueSnackbar("Fant " + fetchedAuthors.length + " bidragsytere", {variant: "success"});
        setSearchResults(fetchedAuthors);
        handleOpen();
      } else {
        props.enqueueSnackbar("Fant ingen bidragsytere", { variant: "error" });
      }
    }
  
    catch {
      props.enqueueSnackbar("Noe gikk galt med søket, prøv igjen", {variant: "error"});
    }
  }

  function handleOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    if(searchResults !== "") {
      setSearchResults("");
    }
  }

  function handleSelect(author) {
    let temp = data;
            
    temp.cristin = author;
    temp.cristin.isEditing = false;
    temp.cristin.order = rowIndex + 1;

    temp.toBeCreated = author;
    temp.toBeCreated.isEditing = false;
    temp.toBeCreated.order = rowIndex + 1;

    temp.isEditing = false;

   
    setOpen(false);
    props.updateData(temp, rowIndex);
  }

  function editInstitution(inst) {
    console.log(inst);
    let tempInst = {
      value: inst.cristinInstitutionNr,
      label: inst.institutionName,
      cristinInstitutionNr: inst.cristinInstitutionNr
    };
    handleInstitutionChange(tempInst);
  }

  function createEditButton(inst) {
    if(inst.hasOwnProperty("isCristinInstitution") && inst.isCristinInstitution === true) {
      return <Button size="small" onClick={() => editInstitution(inst)}> Rediger tilknytning </Button>
    } else {
      return "";
    }
  }

  function displayAuthorForm() {
    return (
      <div>
        <div>
          <Form>
            <FormGroup>
              <TextField
                id={"firstName" + props.index}
                label="Fornavn"
                value={data.toBeCreated.first_name}
                margin="normal"
                onChange={e => handleChange(e, data, "first")}
                required
              />
            </FormGroup>
            <FormGroup>
              <TextField
                id={"lastName" + props.index}
                label="Etternavn"
                value={data.toBeCreated.surname}
                margin="normal"
                onChange={e => handleChange(e, data, "last")}
                required
              />
            </FormGroup>
            <FormGroup>
              <TextField
                id={"authorName" + props.index}
                label="Forfatternavn"
                value={data.toBeCreated.hasOwnProperty("authorName") ? data.toBeCreated.authorName : data.toBeCreated.surname + ", " + data.toBeCreated.first_name}
                margin="normal"
                onChange={e => handleChange(e, data, "authorName")}
                required
              />
            </FormGroup>
            <div className={`metadata`}>
              {data.toBeCreated.affiliations.filter((item, index) =>
                  data.toBeCreated.affiliations.indexOf(item) === index).map((inst, j) => (
                <div key={j}>
                <p className={`italic`}>
                  {inst.hasOwnProperty("unitName") ? inst.unitName : inst.institutionName}
                  {createEditButton(inst)}
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => removeInstitution(j)}
                  >
                    Fjern tilknytning
                  </Button>
                </p>
                { inst.hasOwnProperty("units") ? inst.units.map((unit, g) => <p className={'italic'} style={unitStyle} key={g}> &bull; {unit.unitName} <Button onClick={() => removeUnit(j, g)}> Fjern enhet </Button></p>) : ""}
                </div>
                
              ))}
            </div>
            <InstitutionCountrySelect onChange={handleInstitutionChange} handleChange={handleUnitChange} aria-label={"Institusjonsvelger " + props.index} institution={selectedInstitution} unit={selectedUnit}/>
            <Button
              onClick={() => addInstitution()}
              disabled={
                selectedInstitution.cristinInstitutionNr === 0 ||
                (data.toBeCreated.affiliations.filter(instNr => {
                  return (
                    selectedInstitution.cristinInstitutionNr === instNr.cristinInstitutionNr
                  );
                }).length > 0 && (!selectedUnit)) || (selectedUnit !== "" ? checkForUnit() : null)
              }
            >
              Add
            </Button>

            <Button
              color="secondary"
              onClick={() => props.deleteContributor(rowIndex)}
            >
              Slett person
            </Button>

            <Button color="primary" onClick={() => handleSubmit()}>
              Lagre endringer
            </Button>

            {data.imported.cristin_person_id === 0 ?
                <Button onClick={() => retrySearch(data)}>
                  Søk igjen
                </Button>
                : ""
            }

            <ContributorSearchPanel collapsed={open} data={searchResults} handleChoose={handleSelect} handleAbort={handleClose} />

          </Form>
        </div>
      </div>
    );
  }

  return (
    <div className="content-wrapper">
      {data.isEditing === false ? (
        <div>
          <h6>
            {data.toBeCreated.surname + ", " + data.toBeCreated.first_name}
          </h6>
          <div className={`metadata`}>
            {data.toBeCreated.affiliations.map((inst, j) => (
              <div key={j}>
              <p className={`italic`} key={j}>
                {inst.hasOwnProperty("unitName") ? inst.unitName : inst.institutionName}
              </p>
              { inst.hasOwnProperty("units") ? inst.units.map((unit, g) => <p className={'italic'} style={unitStyle} key={g}> &bull; {unit.unitName} </p>) : ""}
              </div>
            ))}
          </div>
          <Button onClick={() => updateEditing()}>Rediger</Button>

          <Button
            color="secondary"
            onClick={() => props.deleteContributor(rowIndex)}
          >
            Slett person
          </Button>
        </div>
      ) : (
        displayAuthorForm()
      )}
    </div>
  );
}

export default withSnackbar(Contributor);
