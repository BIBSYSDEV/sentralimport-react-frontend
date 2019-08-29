import React from "react";

function ImportPage(props) {
  let { state } = React.useContext(Context);
  const [importType, setImportType] = React.useState(0);
  const [isEqual, setIsEqual] = React.useState(false);

  function checkEquality() {
    /* checks if a field in import publication and */
    /* CRISTIN publication are equal*/
    if (isEqual) {
      /* if they are, render an = */
      return <Button disabled={true}> == </Button>;
    } else {
      /* if they aren't render an => button */
      /* which, when pressed, sets the value in the corresponding */
      /* field in CRISTIN publication to be equal to the value in */
      /* import publication */
      return <Button onClick={setIsEqual(true)}> => </Button>;
    }
  }

  function handleImportType() {
    /* checks if a new publication is being imported */
    /* or if an import is being merged with an already */
    /* existing CRISTIN publication */
    if (statement) {
      /* if props contains a dataset from an already existing CRISTIN publication, set values accordingly */
    } else {
      /* else do not set fields id and date_created (generate them on form submit?) */
    }
  }

  return <div>Page goes here</div>;
}

export default ImportPage;
