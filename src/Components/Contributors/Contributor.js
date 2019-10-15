import React, { useEffect } from "react";
import { Button, FormGroup, TextField } from "@material-ui/core";
import InstitutionSelect from "../InstitutionSelect/InstitutionSelect";
import { Form } from "reactstrap";
export default function Contributor(props) {
  useEffect(() => {
    setIsEditing(
      props.author.cristin.surname !== "" &&
        props.author.cristin.first_name !== ""
    );
  }, [props.author]);

  const [isEditing, setIsEditing] = React.useState("");

  function updateEditing() {
    setIsEditing(false);
  }

  function handleSubmit() {
    setIsEditing(true);
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
                /* onChange={handleChange(author, "first") } */
                required
              />
            </FormGroup>
            <FormGroup>
              <TextField
                id="lastName"
                label="Etternavn"
                value={author.toBeCreated.surname}
                margin="normal"
                /* onChange={ handleChange(author, "last") } */
                required
              />
            </FormGroup>
            <FormGroup>
              <TextField
                id="authorName"
                label="Forfatternavn"
                value={author.toBeCreated.authorname}
                margin="normal"
                /* onChange={  handleChange(author, "authorName") } */
                required
              />
            </FormGroup>
            <div className={`metadata`}>
              {author.toBeCreated.affiliations.map((inst, j) => (
                <p className={`italic`} key={j}>
                  {inst.institutionName}
                  <Button
                    size="small"
                    color="primary"
                    /* onClick={() => removeInstitution(author, j)} */
                  >
                    Fjern tilknytning
                  </Button>
                </p>
              ))}
            </div>
            <InstitutionSelect /* onChange={handleInstitutionChange} */ />
            <Button
            /* onClick={() => addInstitution(author)} */
            /* disabled={
                selectedInstitution.institutionNr === 0 ||
                author.toBeCreated.affiliations.filter(instNr => {
                  return (
                    selectedInstitution.institutionNr === instNr.institutionNr
                  );
                }).length > 0
              } */
            >
              Add
            </Button>
            <Button color="primary" onClick={() => handleSubmit()}>
              Opprett person
            </Button>
          </Form>
        </div>
      </div>
    );
  }

  return (
    <div className="content-wrapper">
      {isEditing === true ? (
        <div>
          <h6>
            {props.author.cristin.surname +
              ", " +
              props.author.cristin.first_name}
          </h6>
          <div className={`metadata`}>
            {props.author.cristin.affiliations.map((inst, j) => (
              <p className={`italic`} key={j}>
                {inst.institutionName}
              </p>
            ))}
          </div>
          <Button /* onClick={ () => retrySearch(row.imported)} */>
            Søk igjen
          </Button>

          <Button onClick={() => updateEditing()}>Rediger</Button>
        </div>
      ) : (
        displayAuthorForm(props.author)
      )}
    </div>
  );
}
