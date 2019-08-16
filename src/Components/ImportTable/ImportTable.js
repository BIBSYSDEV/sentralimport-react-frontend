import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { lighten, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import axios from "axios";
import { Context } from "../../Context";

import ResultModal from "../ResultModal/ResultModal";

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === "desc"
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy);
}

const headRows = [
  {
    id: "Publikasjon",
    numeric: false,
    disablePadding: true,
    label: "Publikasjon"
  },
  { id: "Kategori", numeric: true, disablePadding: false, label: "Kategori" },
  { id: "Kilde", numeric: true, disablePadding: false, label: "Kilde" },
  {
    id: "Dato registrert",
    numeric: true,
    disablePadding: false,
    label: "Dato registrert"
  },
  {
    id: "Eierinstitusjon",
    numeric: true,
    disablePadding: false,
    label: "Eierinstitusjon"
  }
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox" />
        {headRows.map(row => (
          <TableCell
            key={row.id}
            align={row.numeric ? "right" : "left"}
            padding={row.disablePadding ? "none" : "default"}
            sortDirection={orderBy === row.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === row.id}
              direction={order}
              onClick={createSortHandler(row.id)}
            >
              {row.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};

const useToolbarStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1)
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85)
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark
        },
  spacer: {
    flex: "1 1 100%"
  },
  actions: {
    color: theme.palette.text.secondary
  },
  title: {
    flex: "0 0 auto"
  }
}));

const EnhancedTableToolbar = props => {
  const classes = useToolbarStyles();

  return (
    <div className={classes.title}>
      <Typography variant="h6" id="tableTitle">
        Importer
      </Typography>

      <div className={classes.spacer} />
      <div className={classes.actions} />
    </div>
  );
};

const divStyle = {
  fontWeight: "bold"
};
const useStyles = makeStyles(theme => ({
  root: {
    width: "99%",
    marginTop: theme.spacing(3)
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2)
  },
  table: {
    minWidth: 750
  },
  tableWrapper: {
    overflowX: "auto"
  }
}));

export default function EnhancedTable() {
  const classes = useStyles();
  const [modalData, setModalData] = React.useState();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("Dato registrert");
  const [page, setPage] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = React.useState([]);
  let { state } = React.useContext(Context);

  useEffect(() => {
    getRows();
  }, [
    state.currentImportYear,
    state.isSampublikasjon,
    state.currentImportStatus,
    state.currentInstitution
  ]);

  async function getRows() {
    var fetchString =
      "https://w3utv-jb-cris02/criswsinta/sentralimport/publications?year_published=" +
      state.currentImportYear.value +
      "&per_page=5";

    if (
      state.currentInstitution.value === null ||
      state.currentInstitution.value === " "
    ) {
      if (state.currentImportStatus !== "ikke aktuelle") {
        fetchString = fetchString + ("&imported=" + state.currentImportStatus);
      } else {
        fetchString = fetchString + "&aktuell=false";
      }
    } else {
      fetchString =
        fetchString +
        ("&institution=" +
          state.currentInstitution.value +
          "&copublication=" +
          state.isSampublikasjon);
      if (state.currentImportStatus !== "ikke aktuelle") {
        fetchString = fetchString + ("&imported=" + state.currentImportStatus);
      } else {
        fetchString = fetchString + "&aktuell=false";
      }
    }
    console.log(fetchString);
    const temp = await axios.get(fetchString);
    console.log(temp);
    handleRows(temp.data);
  }

  function handleRows(temp) {
    setRows(temp);
  }

  function handleRequestSort(event, property) {
    const isDesc = orderBy === property && order === "desc";
    setOrder(isDesc ? "asc" : "desc");
    setOrderBy(property);
  }

  function handleClose() {
    setOpen(false);
  }

  function handleClick(event, row) {
    setOpen(true);
    setModalData(row.row);
  }

  function handleKeyPress(event, row) {
    if (event.keyCode === 13) {
      setOpen(true);
      setModalData(row.row);
    }
  }

  function handleChangePage(event, newPage) {
    setPage(newPage);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(event.target.value);
    setPage(0);
  }

  function handleFocus(event) {
    event.target.focus();
  }

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, rows != null ? rows.length - page * rowsPerPage : 0);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar />
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows != null ? rows.length : 0}
            />
            <TableBody>
              {stableSort(rows, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const labelId = index;

                  return (
                    <TableRow
                      hover
                      id={labelId}
                      onClick={event => handleClick(event, { row })}
                      role="checkbox"
                      tabIndex={0}
                      key={labelId}
                      onKeyDown={event => handleKeyPress(event, { row })}
                      onChange={event => handleFocus(event)}
                    >
                      <TableCell component="th" scope="row" padding="none" />

                      <TableCell>
                        {row.authors.slice(0, 5).map(author => (
                          <div style={divStyle} key={author.sequenceNr}>
                            {author.authorName};
                          </div>
                        ))}
                        {row.languages[0].title}
                      </TableCell>
                      <TableCell align="right">
                        <div>{row.category}</div>
                      </TableCell>
                      <TableCell align="right">{row.sourceName}</TableCell>
                      <TableCell align="right">{row.registered}</TableCell>
                      <TableCell align="right">
                        {row.authors[0].institutions &&
                        row.authors[0].institutions[0].institutionName ? (
                          <p>
                            {row.authors[0].institutions[0].institutionName}
                          </p>
                        ) : (
                          <p>{}</p>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            "aria-label": "Previous Page"
          }}
          nextIconButtonProps={{
            "aria-label": "Next Page"
          }}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>

      <ResultModal
        open={open}
        data={modalData}
        handleClose={handleClose.bind(this)}
      />
    </div>
  );
}
