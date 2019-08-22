import React from "react";
import { Button, Input } from "@material-ui/core";
import { Context } from "../../Context";

export default function Pagination() {
  let { state, dispatch } = React.useContext(Context);

  function decrementPage() {
    dispatch({ type: "setPageNr", payload: state.currentPageNr - 1 });
  }

  function incrementPage() {
    dispatch({ type: "setPageNr", payload: state.currentPageNr + 1 });
  }

  function changePage(event) {
    if (event.target.value > 0) {
      console.log(event.target.value);
      dispatch({ type: "setPageNr", payload: parseInt(event.target.value) });
    } else {
      console.log(event.target.value);
    }
  }

  return (
    <div>
      Paginering, side:{" "}
      <Input value={state.currentPageNr} onChange={e => changePage(e)} />
      &nbsp;
      <Button
        onClick={decrementPage}
        disabled={state.currentPageNr > 1 ? false : true}
      >
        {"< "}Forrige
      </Button>{" "}
      &nbsp;
      <Button onClick={incrementPage}> Neste {" >"}</Button>
    </div>
  );
}
