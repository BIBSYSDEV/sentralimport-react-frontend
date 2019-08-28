import React, { useEffect, Fragment } from "react";
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
import IconButton from "@material-ui/core/IconButton";
import PeopleIcon from "@material-ui/icons/People";
import ResultModal from "../ResultModal/ResultModal";
import AuthorListModal from "../AuthorListModal/AuthorListModal";
import Pagination from "../Pagination/Pagination";

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
    disablePadding: false,
    label: "Publikasjon"
  },
  { id: "kategori", numeric: true, disablePadding: false, label: "Kategori" },
  { id: "kilde", numeric: true, disablePadding: false, label: "Kilde" },
  {
    id: "dato_opprettet",
    numeric: true,
    disablePadding: false,
    label: "Dato opprettet"
  },
  {
    id: "Eierinstitusjon",
    numeric: true,
    disablePadding: false,
    label: "Eierinstitusjon"
  },
  {
    id: "Forfattere",
    numeric: true,
    disablePadding: false,
    label: ""
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
              disabled={
                row.id !== "Eierinstitusjon" &&
                row.id !== "Publikasjon" &&
                row.id !== "Forfattere"
                  ? false
                  : true
              }
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
  let { state, dispatch } = React.useContext(Context);
  const [modalData, setModalData] = React.useState();
  const [order, setOrder] = React.useState(state.currentSortOrder);
  const [orderBy, setOrderBy] = React.useState(state.currentSortValue);
  const [page, setPage] = React.useState(state.currentPageNr);
  const [open, setOpen] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(
    state.currentPerPage.value
  );
  const [rows, setRows] = React.useState([]);
  const [authorList, setAuthorList] = React.useState(false);
  const [authorData, setAuthorData] = React.useState();

  useEffect(() => {
    resetPageNr();
  }, [
    state.currentImportYear,
    state.isSampublikasjon,
    state.currentImportStatus,
    state.currentInstitution,
    state.currentPerPage,
    state.currentSortOrder,
    state.currentSortValue
  ]);

  useEffect(() => {
    getRows();
  }, [
    state.currentImportYear,
    state.isSampublikasjon,
    state.currentImportStatus,
    state.currentInstitution,
    state.currentPerPage,
    state.currentPageNr,
    state.currentSortOrder,
    state.currentSortValue
  ]);

  useEffect(() => {
    handleChangeRowsPerPage(state.currentPerPage);
  }, [state.currentPerPage]);

  async function getRows() {
    var fetchString =
      "http://localhost:8080/criswsint/sentralimport/publications?year_published=" +
      state.currentImportYear.value;

    if (
      state.currentInstitution.value === null ||
      state.currentInstitution.value === " "
    ) {
      if (state.currentImportStatus !== "ikke aktuelle") {
        fetchString = fetchString + ("&imported=" + state.currentImportStatus);
      } else {
        fetchString = fetchString + "&relevant=false";
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
        fetchString = fetchString + "&relevant=false";
      }
    }
    fetchString =
      fetchString +
      "&per_page=" +
      state.currentPerPage.value +
      "&page=" +
      (state.currentPageNr + 1);

    console.log(fetchString);
    const temp = await axios.get(fetchString);
    console.log(temp);
    handleRows(temp.data);
  }

  function handleChangeRowsPerPage() {
    setRowsPerPage(state.currentPerPage);
  }

  function resetPageNr() {
    dispatch({ type: "setPageNr", payload: 0 });
  }

  function handleRows(temp) {
    setRows(temp);
  }

  function handleRequestSort(event, property) {
    const isDesc = orderBy === property && order === "desc";
    setOrder(isDesc ? "asc" : "desc");
    dispatch({ type: "setSortOrder", payload: isDesc ? "asc" : "desc" });
    setOrderBy(property);
    dispatch({ type: "setSortValue", payload: property });
  }

  function handleClose() {
    setOpen(false);
  }

  function handleCloseList() {
    setAuthorList(false);
  }

  function handleAuthorClick(event, row) {
    if (authorList !== true) {
      setAuthorList(true);
      setAuthorData(row);
    }
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

  function handleChangeRowsPerPage(option) {
    setRowsPerPage(option.value);
  }

  function handleOwnerInstitutions(row) {
    var inst = [];
    var authorList = row.authors;
    for (var h = 0; h < authorList.length; h++) {
      var check = 0;
      for (var i = 0; i < inst.length; i++) {
        if (inst[i] === authorList[h].institutions[0].institutionName) {
          check++;
        }
      }
      if (check === 0) {
        if (authorList[h].institutions[0].institutionName !== "") {
          inst.push(authorList[h].institutions[0].institutionName);
        }
      }
    }
    return (
      <div>
        {inst.map(ins => (
          <div>
            <div> &nbsp; </div>
            <div>{ins}</div>
          </div>
        ))}
      </div>
    );
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
                      id={labelId}
                      onClick={event => handleClick(event, { row })}
                      role="checkbox"
                      key={labelId}
                      onKeyDown={event => handleKeyPress(event, { row })}
                    >
                      <TableCell component="th" scope="row" padding="none" />

                      <TableCell>
                        {row.authors.slice(0, 5).map(author => (
                          <div style={divStyle} key={author.sequenceNr}>
                            {author.authorName};
                          </div>
                        ))}
                        {row.authors.length > 5 ? " et al " : ""}
                        {" (" + row.authors.length + ") "}
                        {row.languages[0].title}
                      </TableCell>
                      <TableCell align="right">
                        <div>{row.category}</div>
                      </TableCell>
                      <TableCell align="right">{row.sourceName}</TableCell>
                      <TableCell align="right">{row.registered}</TableCell>
                      <TableCell align="right">
                        {handleOwnerInstitutions(row)}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={e => {
                            handleAuthorClick(e, row);
                            e.stopPropagation();
                          }}
                        >
                          <PeopleIcon />
                        </IconButton>
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
          hidden={true}
          rowsPerPageOptions={[5, 10]}
          component="div"
          rowsPerPage={rowsPerPage}
          count={rows.length}
          backIconButtonProps={{
            "aria-label": "Previous Page"
          }}
          nextIconButtonProps={{
            "aria-label": "Next Page"
          }}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      <Pagination />

      <ResultModal
        open={open}
        data={modalData}
        handleClose={handleClose.bind(this)}
      />
      <AuthorListModal
        open={authorList}
        data={authorData}
        handleClose={handleCloseList}
      />
    </div>
  );
}
