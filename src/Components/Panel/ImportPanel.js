import React from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

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

function createData(kilde, antall, importert, ikkeImportert, ikkeAktuelle) {
  return { kilde, antall, importert, ikkeImportert, ikkeAktuelle };
}

const rows = [
  createData("SCOPUS", 200, 100, 100, 30),
  createData("Wos", 70, 50, 20, 10)
];

const useStyles = makeStyles(theme => ({
  root: {
    width: "99%",
    marginTop: theme.spacing(3),
    overflowX: "auto"
  },
  table: {
    minWidth: 700
  }
}));

export default function CustomizedTables() {
  const classes = useStyles();

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
            {rows.map(row => (
              <StyledTableRow key={row.kilde}>
                <StyledTableCell component="th" scope="row">
                  {row.kilde}
                </StyledTableCell>
                <StyledTableCell align="right">{row.antall}</StyledTableCell>
                <StyledTableCell align="right">{row.importert}</StyledTableCell>
                <StyledTableCell align="right">
                  {row.ikkeImportert}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {row.ikkeAktuelle}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}
