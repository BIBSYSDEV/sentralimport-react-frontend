import React from "react";
import { Button, Input, Paper } from "@material-ui/core";
import { Context } from "../../Context";
import Select from "react-select";
import AuthorListModal from "../AuthorListModal/AuthorListModal";

export default function Pagination() {
  let { state, dispatch } = React.useContext(Context);

  const rowsPerPage = [
    { value: 5, label: "5" },
    { value: 10, label: "10" },
    { value: 15, label: "15" }
  ];

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

  function onChangePerPage(option) {
    dispatch({ type: "setPerPage", payload: option });
  }

  return (
    <Paper>
      <span>
        <Select
          style={{ width: "auto" }}
          name="rowsPerPageSelect"
          options={rowsPerPage}
          className="basic-multi-select"
          classNamePrefix="select"
          onChange={onChangePerPage}
          defaultValue={rowsPerPage[0]}
        />
        {state.currentPageNr * state.currentPerPage.value + 1} -{" "}
        {(state.currentPageNr + 1) * state.currentPerPage.value}, side:{" "}
        <Input value={state.currentPageNr} onChange={e => changePage(e)} />
        &nbsp;
        <Button
          onClick={decrementPage}
          disabled={state.currentPageNr > 0 ? false : true}
        >
          {"< "}Forrige
        </Button>
        &nbsp;
        <Button onClick={incrementPage}> Neste {" >"}</Button>
      </span>
    </Paper>
  );
}
