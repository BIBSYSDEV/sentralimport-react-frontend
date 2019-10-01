import React, { useEffect } from "react";
import { Button, Input, Paper, Grid } from "@material-ui/core";
import { Context } from "../../Context";
import Select from "react-select";

export default function Pagination(props) {
  let { state, dispatch } = React.useContext(Context);

  const [pageValues, setPageValues] = React.useState([]);

  useEffect(() => {
    console.log(state.totalCount);
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
    <Paper>
      <div>
        <Grid container direction="row">
          <Grid item xs={2}>
            <div>Publikasjoner per side: &nbsp;</div>
          </Grid>

          <Grid item xs>
            <Select
              name="rowsPerPageSelect"
              options={rowsPerPage}
              className="basic-multi-select"
              classNamePrefix="select"
              onChange={onChangePerPage}
              defaultValue={rowsPerPage[0]}
            />
          </Grid>
          <Grid container item direction="row" xs>
            <Grid item xs>
              {state.currentPageNr * state.currentPerPage.value + 1} -{" "}
              {(state.currentPageNr + 1) * state.currentPerPage.value <
              state.totalCount
                ? (state.currentPageNr + 1) * state.currentPerPage.value
                : state.totalCount}
              , side:
            </Grid>
            <Grid item xs>
              <div style={{ width: "150px" }}>
                <Select
                  value={{
                    label: state.currentPageNr + 1,
                    value: state.currentPageNr
                  }}
                  options={pageValues}
                  onChange={changePage}
                />
              </div>
            </Grid>
          </Grid>
          <Grid item xs={2}>
            <div>
              <Button
                onClick={decrementPage}
                disabled={state.currentPageNr > 0 ? false : true}
              >
                {"< "}Forrige
              </Button>
              &nbsp;
              <Button
                onClick={incrementPage}
                disabled={props.data.length < state.currentPerPage.value}
              >
                {" "}
                Neste {" >"}
              </Button>
            </div>
          </Grid>
        </Grid>
      </div>
    </Paper>
  );
}
