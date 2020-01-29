import React, { useEffect } from "react";
import { Button, FormGroup, TextField } from "@material-ui/core";
import InstitutionCountrySelect from "../InstitutionSelect/InstitutionCountrySelect";
import { Form } from "reactstrap";
export default function Contributor(props) {
  useEffect(() => {
    setRowIndex(props.index);
    setData(props.author);
  }, [props.author]);

  const [data, setData] = React.useState(props.author);

  const [rowIndex, setRowIndex] = React.useState(props.index);

  const [selectedInstitution, setSetSelectedInstitution] = React.useState({
    value: "",
    institutionNr: 0
  });

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

  function handleInstitutionChange(institution) {
    setSetSelectedInstitution(institution);
  }

  function removeInstitution(index) {
    let affiliationCopy = [...data.toBeCreated.affiliations];
    affiliationCopy.splice(index, 1);
    let temp = data;
    temp.toBeCreated.affiliations = affiliationCopy;
    console.log(affiliationCopy);
    console.log(temp);

    props.updateData(temp, rowIndex);
  }

  function addInstitution() {
    let affiliationCopy = [...data.toBeCreated.affiliations];
    affiliationCopy.push({
      countryCode: "test",
      institutionName: selectedInstitution.label,
      institutionNr: selectedInstitution.institutionNr,
      isCristinInstitution: true
    });
    let temp = data;
    temp.toBeCreated.affiliations = affiliationCopy;

    props.updateData(temp, rowIndex);
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
              ))}
            </div>
            <InstitutionCountrySelect onChange={handleInstitutionChange} aria-label={"Institusjonsvelger " + props.index}/>
            <Button
              onClick={() => addInstitution()}
              disabled={
                selectedInstitution.institutionNr === 0 ||
                data.toBeCreated.affiliations.filter(instNr => {
                  return (
                    selectedInstitution.institutionNr === instNr.institutionNr
                  );
                }).length > 0
              }
            >
              Add
            </Button>
            <Button color="primary" onClick={() => handleSubmit()}>
              Opprett person
            </Button>

            <Button
              color="secondary"
              onClick={() => props.deleteContributor(rowIndex)}
            >
              Slett person
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
              <p className={`italic`} key={j}>
                {inst.institutionName}
              </p>
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
