import React, { useEffect } from "react";
import { TableRow, TableCell, Button } from "@material-ui/core";
import { Context } from "../../Context";
import Select from "react-select";

function ContributorPagination(props) {
  let { state, dispatch } = React.useContext(Context);

  useEffect(() => {
    console.log(props.totalCount);
    var values = [];
    for (var i = 0; i < props.totalCount / state.contributorPerPage; i++) {
      values.push({ value: i, label: i + 1 });
    }
    setPageValues(values);
  }, [props.totalCount]);

  const [pageValues, setPageValues] = React.useState([]);

  function incrementPage() {
    dispatch({
      type: "setContributorPage",
      payload: state.contributorPage + 1
    });
  }

  function decrementPage() {
    dispatch({
      type: "setContributorPage",
      payload: state.contributorPage - 1
    });
  }

  function handleChangePage(option) {
    dispatch({ type: "setContributorPage", payload: option.value });
  }

  return (
    <TableRow>
      <TableCell align="right">
        {" "}
        Antall per side: {state.contributorPerPage}
      </TableCell>
      <TableCell align="justify">
        Bidragsytere{" "}
        {state.contributorPage * state.contributorPerPage + 1 + " - "}
        {(state.contributorPage + 1) * state.contributorPerPage <=
        props.totalCount
          ? (state.contributorPage + 1) * state.contributorPerPage
          : props.totalCount}
        , sidetall:{" "}
        <Select
          value={{
            label: state.contributorPage + 1,
            value: state.contributorPage
          }}
          options={pageValues}
          onChange={handleChangePage}
        />
      </TableCell>
      <TableCell align="right">
        <Button
          disabled={state.contributorPage > 0 ? false : true}
          onClick={decrementPage}
        >
          {"< Forrige"}
        </Button>
        <Button
          disabled={
            (state.contributorPage + 1) * state.contributorPerPage >=
            props.totalCount
          }
          onClick={incrementPage}
        >
          {"Neste >"}
        </Button>
      </TableCell>
    </TableRow>
  );
}
export default ContributorPagination;
