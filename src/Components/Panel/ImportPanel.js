import React, { useEffect } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import axios from "axios";
import { Context } from "../../Context";

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  body: {
    fontSize: 14
  }
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.background.default
    }
  }
}))(TableRow);

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(3),
    overflowX: "auto",
    marginRight: "10px"
  }
}));

export default function CustomizedTables() {
  const classes = useStyles();
  const [prevYear, setPrevYear] = React.useState(0);
  const [data, setData] = React.useState([]);
  let { state } = React.useContext(Context);

  useEffect(() => {
    getNumbers();
  }, [state.currentImportYear]);

  function getNumbers() {
    if (state.currentImportYear.value !== prevYear) {
      axios
        .get(
          "http://localhost:8080/piarest/sentralimport/publicationCount/" +
            state.currentImportYear.value
        )
        .then(response => {
          setData(response.data);
        });
      setPrevYear(state.currentImportYear.value);
    }
  }

  return (
    <div>
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <StyledTableCell> Kilde</StyledTableCell>
              <StyledTableCell align="right">Antall&nbsp;</StyledTableCell>
              <StyledTableCell align="right">Importert&nbsp;</StyledTableCell>
              <StyledTableCell align="right">
                Ikke importert&nbsp;
              </StyledTableCell>
              <StyledTableCell align="right">
                Ikke aktuelle&nbsp;
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <StyledTableRow>
              <StyledTableCell component="th" scope="row">
                SCOPUS
              </StyledTableCell>
              <StyledTableCell align="right">{data.totalCount}</StyledTableCell>
              <StyledTableCell align="right">
                {data.importedCount}
              </StyledTableCell>
              <StyledTableCell align="right">
                {data.notImportedCount}
              </StyledTableCell>
              <StyledTableCell align="right">
                {data.notRelevantCount}
              </StyledTableCell>
            </StyledTableRow>
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}
