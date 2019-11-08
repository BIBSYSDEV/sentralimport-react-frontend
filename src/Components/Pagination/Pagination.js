import React, { useEffect } from "react";
import { Button, Paper, Grid, TableRow, TableCell } from "@material-ui/core";
import { Context } from "../../Context";
import Select from "react-select";

export default function Pagination(props) {
  let { state, dispatch } = React.useContext(Context);

  const [pageValues, setPageValues] = React.useState([]);

  useEffect(() => {
    var values = [];
    for (var i = 0; i < state.totalCount / state.currentPerPage.value; i++) {
      values.push({ value: i, label: i + 1 });
    }
    setPageValues(values);
  }, [state.totalCount, state.currentPerPage]);

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

  function changePage(option) {
    dispatch({ type: "setPageNr", payload: option.value });
  }

  function onChangePerPage(option) {
    dispatch({ type: "setPerPage", payload: option });
  }

  return (
    <TableRow overflow="visible">
      <TableCell></TableCell>
      <TableCell align="left" overflow="visible">
        <div>Publikasjoner per side: &nbsp;</div>

        <Select
          name="rowsPerPageSelect"
          options={rowsPerPage}
          className="basic-multi-select"
          classNamePrefix="select"
          onChange={onChangePerPage}
          defaultValue={rowsPerPage[0]}
        />
      </TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell align="right" overflow="visible">
        {state.currentPageNr * state.currentPerPage.value + 1} -{" "}
        {(state.currentPageNr + 1) * state.currentPerPage.value <
        state.totalCount
          ? (state.currentPageNr + 1) * state.currentPerPage.value
          : state.totalCount}
        , side:
        <Select
          value={{
            label: state.currentPageNr + 1,
            value: state.currentPageNr
          }}
          options={pageValues}
          onChange={changePage}
        />
      </TableCell>

      <TableCell align="right">
        <Button
          onClick={decrementPage}
          disabled={state.currentPageNr > 0 ? false : true}
        >
          {"< Forrige"}
        </Button>
      </TableCell>
      <TableCell align="right">
        <Button
          onClick={incrementPage}
          disabled={
            (state.currentPageNr + 1) * state.currentPerPage.value >=
            state.totalCount
          }
        >
          {"Neste >"}
        </Button>
      </TableCell>
    </TableRow>
  );
}
