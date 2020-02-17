import React, { useEffect } from "react";
import { Button, FormGroup, TextField } from "@material-ui/core";
import InstitutionCountrySelect from "../InstitutionSelect/InstitutionCountrySelect";
import { Form } from "reactstrap";
import { Context } from "../../Context";
export default function Contributor(props) {
  
  let {state} = React.useContext(Context);

  useEffect(() => {
    setRowIndex(props.index);
    setData(props.author);
  }, [props.author]);

  useEffect(() => {
    setSelectedUnit("");
    setSetSelectedInstitution("");
  }, [state.contributorPage])

  const [data, setData] = React.useState(props.author);

  const [rowIndex, setRowIndex] = React.useState(props.index);

  const [selectedInstitution, setSetSelectedInstitution] = React.useState({
    value: "",
    institutionNr: 0
  });

  const [selectedUnit, setSelectedUnit] = React.useState("");

  const unitStyle = {
    marginLeft: "0px"
  }

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
      institutionNr: 0
    });
  }

  function handleUnitChange(unit) {
    setSelectedUnit(unit);
  }

  function handleInstitutionChange(institution) {
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
    var duplicate = 0;
    if(selectedUnit){
    for(var i = 0; i < affiliationCopy.length; i++) {
      if(affiliationCopy[i].hasOwnProperty("units")) {
        for(var h = 0; h < affiliationCopy[i].units.length; h++) {
          if(affiliationCopy[i].units[h].unitNr === selectedUnit.value) {
            duplicate++;
          }
        }
      }
    }

    if(duplicate > 0) {
      return true;
    } else {
      return false;
    }
  }
  }

  function addInstitution() {
    let affiliationCopy = [...data.toBeCreated.affiliations];
    var duplicate = 0;
    for(var i = 0; i < affiliationCopy.length; i++){
      if(affiliationCopy[i].institutionNr === selectedInstitution.institutionNr){
        duplicate++;
      }
    }
    if(duplicate < 1){
      affiliationCopy.push({
        countryCode: "test",
        institutionName: selectedInstitution.label,
        institutionNr: selectedInstitution.institutionNr,
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
    if(affiliationCopy[i].institutionNr === selectedInstitution.institutionNr) {
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
                value={
                  data.toBeCreated.hasOwnProperty("authorname")
                    ? data.toBeCreated.authorname
                    : data.toBeCreated.surname +
                      " " +
                      data.toBeCreated.first_name.substr(0, 1) +
                      "."
                }
                margin="normal"
                onChange={e => handleChange(e, data, "authorName")}
                required
              />
            </FormGroup>
            <div className={`metadata`}>
              {data.toBeCreated.affiliations.map((inst, j) => (
                <div key={j}>
                <p className={`italic`} key={j}>
                  {inst.institutionName}
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
                selectedInstitution.institutionNr === 0 ||
                (data.toBeCreated.affiliations.filter(instNr => {
                  return (
                    selectedInstitution.institutionNr === instNr.institutionNr
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
                <Button onClick={() => props.searchAgain(data.imported, rowIndex)}>
                  Søk igjen
                </Button>
                : ""
            }

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
                {inst.institutionName}
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
