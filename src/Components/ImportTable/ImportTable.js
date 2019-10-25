import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { lighten, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import ResultIcon from "../../assets/icons/result-active.svg";
import Paper from "@material-ui/core/Paper";
import axios from "axios";
import { Context } from "../../Context";
import IconButton from "@material-ui/core/IconButton";
import PeopleIcon from "@material-ui/icons/People";
import ResultModal from "../ResultModal/ResultModal";
import AuthorListModal from "../AuthorListModal/AuthorListModal";
import Pagination from "../Pagination/Pagination";
import "../../assets/styles/Results.scss";
import "../../assets/styles/Imports.css";

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
  { id: "category", numeric: true, disablePadding: false, label: "Kategori" },
  { id: "source", numeric: true, disablePadding: false, label: "Kilde" },
  {
    id: "date",
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
    label: "Forfatterliste"
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
                !(
                  row.id !== "Eierinstitusjon" &&
                  row.id !== "Publikasjon" &&
                  row.id !== "Forfattere"
                )
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
  const [page] = React.useState(state.currentPageNr);
  const [open, setOpen] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(
    state.currentPerPage.value
  );
  const [rows, setRows] = React.useState([]);
  const [authorList, setAuthorList] = React.useState(false);
  const [authorData, setAuthorData] = React.useState();

  const getMainImage = () => {
    return ResultIcon;
  };

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
    console.log(rows);
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
      "&sort=" +
      state.currentSortValue +
      " " +
      state.currentSortOrder +
      "&per_page=" +
      state.currentPerPage.value +
      "&page=" +
      (state.currentPageNr + 1);

    await axios.get(fetchString).then(response => {
      console.log(fetchString);
      console.log(response.headers["x-total-count"]);
      getJournals(response.data);

      dispatch({
        type: "setTotalCount",
        payload: response.headers["x-total-count"]
      });
    });

    async function getJournals(data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].hasOwnProperty("channel")) {
          var journal = await axios.get(
            "https://api.cristin-utv.uio.no/v2/results/channels?type=journal&id=" +
              data[i].channel.id
          );

          if (journal.data.length !== 0 && journal.hasOwnProperty("data")) {
            data[i].channel.journal = journal.data[0].hasOwnProperty("title")
              ? journal.data[0].title
              : "";
          } else {
            data[i].channel.journal = "";
          }
        }
      }
      handleRows(data);
    }
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
    dispatch({ type: "setSelected", payload: "false" });
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

  function handleAuthorPress(event, row) {
    if (authorList !== true) {
      if (event.keyCode === 13 || event.keyCode === 32) {
        setAuthorList(true);
        setAuthorData(row);
      }
    }
  }

  function handleClick(event, row) {
    setOpen(true);
    setModalData(row.row);
  }

  function handleKeyPress(event, row) {
    if (event.keyCode === 13 || event.keyCode === 32) {
      setOpen(true);
      setModalData(row.row);
    }
  }

  function handleOnFocus(event, row) {
    event.target.className = event.target.className + " focused";
    console.log(event.target.className);
  }

  function handleOnBlur(event, row) {
    event.target.className = event.target.className.split(" focused")[0];
    console.log(event.target.className);
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
        if (inst[i] === authorList[h].institutions[0].acronym) {
          check++;
        }
      }
      if (check === 0) {
        if (authorList[h].institutions[0].acronym !== "") {
          inst.push(authorList[h].institutions[0].acronym);
        }
      }
    }
    return (
      <div>
        {inst.map((ins, i) => (
          <div key={i}>
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
                .map(row => {
                  const labelId = row.pubId;

                  return (
                    <TableRow
                      hover
                      id={labelId}
                      onClick={event => handleClick(event, { row })}
                      role="checkbox"
                      key={labelId}
                      onKeyDown={event => handleKeyPress(event, { row })}
                      className={`card-horiz basic-background result`}
                      tabIndex="0"
                      onFocus={event => handleOnFocus(event, { row })}
                      onBlur={event => handleOnBlur(event, { row })}
                    >
                      <TableCell component="th" scope="row" padding="none" />

                      <TableCell>
                        <div className="image-wrapper">
                          <img src={getMainImage("result")} alt="result" />
                        </div>
                        <div className="content-wrapper">
                          <h6 className={`result-title`}>
                            {row.languages[0].title}
                          </h6>
                          <div className={`metadata`}>
                            {row.authors
                              .slice(0, 5)
                              .map(author => author.authorName + "; ")}
                            {row.authors.length > 5 ? " et al " : ""}
                            {" (" + row.authors.length + ") "}
                            <p className={`journal-name`}>
                              {row.hasOwnProperty("channel")
                                ? row.channel.journal + " "
                                : ""}
                            </p>
                            {row.registered.substring(
                              row.registered.length - 4,
                              row.registered.length
                            ) + ";"}
                            {row.hasOwnProperty("channel") &&
                            row.channel.hasOwnProperty("volume")
                              ? "Volum " + row.channel.volume + ";"
                              : ""}
                            {row.hasOwnProperty("channel") &&
                            row.channel.hasOwnProperty("pageFrom")
                              ? row.channel.pageFrom + "-"
                              : ""}
                            {row.hasOwnProperty("channel")
                              ? row.channel.pageTo
                              : ""}
                            {row.hasOwnProperty("doi") ? " doi:" + row.doi : ""}
                          </div>
                        </div>
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
                          onKeyDown={e => {
                            handleAuthorPress(e, row);
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
        {/*<TablePagination
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
        /> */}
      </Paper>
      <Pagination data={rows} />

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
