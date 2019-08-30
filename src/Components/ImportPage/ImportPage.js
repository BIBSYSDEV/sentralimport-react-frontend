import React from "react";
import { Button } from "react-bootstrap";

function ImportPage(props) {
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

  return <div>Hello page</div>;
}

export default ImportPage;
