import React, { useEffect } from 'react';
import { Button, Grid, Typography } from '@material-ui/core';
import { Context } from '../../Context';
import Select from 'react-select';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import styled from 'styled-components';

const StyledGrid = styled(Grid)`
  background-color: #f3eff6;
`;

const StyledButton = styled(Button)`
  &.MuiButton-root {
    margin-left: 1rem;
  }
`;

export default function Pagination(props) {
  let { state, dispatch } = React.useContext(Context);

  const [pageValues, setPageValues] = React.useState([]);

  useEffect(() => {
    const values = [];
    for (let i = 0; i < state.totalCount / state.currentPerPage.value; i++) {
      values.push({ value: i, label: i + 1 });
    }
    setPageValues(values);
  }, [state.totalCount, state.currentPerPage]);

  const rowsPerPage = [
    { value: 5, label: '5' },
    { value: 10, label: '10' },
    { value: 15, label: '15' },
    { value: 25, label: '25' },
    { value: 50, label: '50' },
  ];

  function decrementPage() {
    dispatch({ type: 'setPageNr', payload: state.currentPageNr - 1 });
  }

  function incrementPage() {
    dispatch({ type: 'setPageNr', payload: state.currentPageNr + 1 });
  }

  function changePage(option) {
    dispatch({ type: 'setPageNr', payload: option.value });
  }

  function onChangePerPage(option) {
    dispatch({ type: 'setPerPage', payload: option });
  }

  return (
    <StyledGrid container justifyContent="space-between" alignItems="baseline">
      <Grid item>
        {props.openMore.length > 0 && (
          <StyledButton variant="contained" color="primary" onClick={(event) => props.handlePress(event, null)}>
            {props.openMore.length === 1 ? `Importer publikasjon` : `Importer ${props.openMore.length} publikasjoner`}
          </StyledButton>
        )}
      </Grid>
      <Grid item>
        <Grid
          style={{ marginTop: '0.2rem', marginBottom: '0.2rem' }}
          container
          spacing={3}
          justifyContent="flex-end"
          alignItems="baseline">
          <Grid item>
            <Typography display="inline">Viser publikasjon: </Typography>
            <Typography display="inline">
              {state.currentPageNr * state.currentPerPage.value + 1} -{' '}
              {(state.currentPageNr + 1) * state.currentPerPage.value < state.totalCount
                ? (state.currentPageNr + 1) * state.currentPerPage.value
                : state.totalCount}
            </Typography>
            <Typography display="inline"> av {state.totalCount}</Typography>
          </Grid>
          <Grid item>
            <Grid container alignItems="baseline" spacing={1}>
              <Grid item>
                <Typography>Publikasjoner per side:</Typography>
              </Grid>
              <Grid item>
                <Select
                  id="rowsPerPageSelector"
                  name="rowsPerPageSelect"
                  options={rowsPerPage}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  onChange={onChangePerPage}
                  defaultValue={rowsPerPage[0]}
                  aria-label="Publikasjoner per side"
                  value={state.currentPerPage}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container alignItems="baseline" spacing={1}>
              <Grid item>
                <Typography>side:</Typography>
              </Grid>
              <Grid item>
                <Select
                  value={{
                    label: state.currentPageNr + 1,
                    value: state.currentPageNr,
                  }}
                  options={pageValues}
                  onChange={changePage}
                  aria-label="Sidetall"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Button startIcon={<NavigateBeforeIcon />} onClick={decrementPage} disabled={state.currentPageNr <= 0}>
              Forrige
            </Button>
          </Grid>
          <Grid item>
            <Button
              onClick={incrementPage}
              endIcon={<NavigateNextIcon />}
              disabled={(state.currentPageNr + 1) * state.currentPerPage.value >= state.totalCount}>
              Neste
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </StyledGrid>
  );
}
