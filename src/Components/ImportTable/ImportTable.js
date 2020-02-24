import React, {useEffect} from "react";
import PropTypes from "prop-types";
import {lighten, makeStyles} from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import ResultIcon from "../../assets/icons/result-active.svg";
import Paper from "@material-ui/core/Paper";
import axios from "axios";
import {Context} from "../../Context";
import IconButton from "@material-ui/core/IconButton";
import PeopleIcon from "@material-ui/icons/People";
import ResultModal from "../ResultModal/ResultModal";
import Pagination from "../Pagination/Pagination";
import "../../assets/styles/Results.scss";
import "../../assets/styles/Imports.css";
import {TableFooter} from "@material-ui/core";
import {useHistory} from "react-router-dom";
import {properties} from "../../properties";
import Skeleton from '@material-ui/lab/Skeleton';
import Checkbox from '@material-ui/core/Checkbox';
import ListModal from "../ListModal/ListModal";

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
    {id: "category", numeric: true, disablePadding: false, label: "Kategori"},
    {id: "source", numeric: true, disablePadding: false, label: "Kilde"},
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
    const {order, orderBy, onRequestSort} = props;
    const createSortHandler = property => event => {
        onRequestSort(event, property);
    };
    let {state, dispatch} = React.useContext(Context);

    return (
        <TableHead>
            <TableRow>
            <TableCell component="td" scope="row" padding="checkbox" >
                <Checkbox key='allPubs' checked={state.allChecked}
                    onClick={(e) => {
                        e.stopPropagation();
                        props.checkAll(!state.allChecked);
                    }}
                    onChange={(e) => {
                        e.stopPropagation();
                        let temp = !state.allChecked;
                        dispatch({type: "allChecked", payload: temp});
                    }}
                />
            </TableCell>
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

const useStyles = makeStyles(theme => ({
    root: {
        display: "block",
        width: "100%",
        marginTop: theme.spacing(3)
    },
    paper: {
        width: "100%",
        marginBottom: theme.spacing(2),
        marginRight: "10px"
    },
    tableWrapper: {
        overflowX: "visible",
        overflowY: "visible"
    }
}));

const monsterPostStyle = {
    fontWeight: "bolder",
    color: "#e30000"
}

export default function EnhancedTable() {
    const classes = useStyles();
    let {state, dispatch} = React.useContext(Context);
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
    const [fetched, setFetched] = React.useState(false);
    const [checked, setChecked] = React.useState([]);
    const [openSeveral, setOpenSeveral] = React.useState([]);
    let history = useHistory();

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
        let fetchString =
            properties.piarest_gatekeeper_url + "/sentralimport/publications?year_published=" +
            state.currentImportYear.value;

        if (
            state.currentInstitution.value === null ||
            state.currentInstitution.value === " "
        ) {
            if (state.isSampublikasjon) {
                fetchString += "&copublication=" + state.isSampublikasjon;
            }
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

        let checkedValues = [];
        for (let i = 0; i < state.currentPerPage.value; i ++) {
            checkedValues.push(false);
        }
        setChecked(checkedValues);

        if (localStorage.getItem("config")) {
            setFetched(false);
            try {
                await axios.get(fetchString, JSON.parse(localStorage.getItem("config"))).then(response => {
                    handleRows(response.data);

                    dispatch({
                        type: "setTotalCount",
                        payload: response.headers["x-total-count"]
                    });
                });
                setFetched(true);
            } catch(e) {
                localStorage.setItem("authorized", "false");
                if (e.response && (e.response.status === 401 || e.response.status === 403)) {
                    alert("Din sesjon har utgått. Vennligst logg inn på nytt");
                    history.push("/login");
                } else {
                    history.push("/error");
                }
            }
        }
    }

    function resetPageNr() {
        dispatch({type: "setPageNr", payload: 0});
    }

    function handleRows(temp) {
        setRows(temp);
    }

    function handleRequestSort(event, property) {
        const isDesc = orderBy === property && order === "desc";
        setOrder(isDesc ? "asc" : "desc");
        dispatch({type: "setSortOrder", payload: isDesc ? "asc" : "desc"});
        setOrderBy(property);
        dispatch({type: "setSortValue", payload: property});
    }

    function handleClose() {
        setOpen(false);
        if (openSeveral.length > 1) {
            let index = rows.findIndex(id => id.pubId === openSeveral[1]);
            let temp = [...openSeveral];
            temp.splice(0, 1);
            setOpenSeveral(temp);
            setModalData(rows[index]);
            setOpen(true);
        } else {
            checkAll(false);
            dispatch({type: "setSelected", payload: "false"});
            dispatch({type: "allChecked", payload: false});
        }
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
        if (openSeveral.length > 0) {
            let index = rows.findIndex(r => r.pubId === openSeveral[0]);
            setModalData(rows[index]);
        } else
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
    }

    function handleOnBlur(event, row) {
        event.target.className = event.target.className.split(" focused")[0];
    }

    function handleChangeRowsPerPage(option) {
        setRowsPerPage(option.value);
    }

    function handleOwnerInstitutions(row) {
        let inst = [];
        let authorList = row.authors;
        for (let h = 0; h < authorList.length; h++) {
            for (let i = 0; i < authorList[h].institutions.length; i++) {
                inst.push(authorList[h].institutions[i].acronym);
            }
        }
        inst = inst.filter(function (element, index) {
            return (element !== undefined && inst.indexOf(element) === index);
        });

        return inst.map((name, i) => {
            return (<p key={i}>{name}</p>);
        });
    }

    function removeFromList() {
        setTimeout(function () {
            getRows();
        }, 200);
    }

    function checkAll(status) {
        let temp = [...checked];
        let ids = [];
        for (let i = 0; i < rows.length; i++) {
            temp[i] = status;
            if (status)
                ids.push(rows[i].pubId);
        }

        setOpenSeveral(ids);
        setChecked(temp);
    }

    function createAuthorRows() {
        return authorData === undefined ? <div>Ingen forfattere funnet</div> : (
            <div style={{overflow: 'auto', height: authorData.authors.length < 5 ? authorData.authors.length * 70 : 350}}>
                {authorData.authors.map((author, i) => (<div style={{padding: '5px'}} key={i}><b>{author.sequenceNr + ". " + author.authorName}</b><br />
                    {author.institutions.map((inst, j) => (<p style={{margin: 0}} key={j}><i>{inst.unitName}</i></p>))}</div>))}
            </div>
        );
    }

    function createTable(body) {
        return (
            <div className={classes.root}>
                <Paper className={classes.paper}>
                    <EnhancedTableToolbar/>
                    <div className={classes.tableWrapper}>
                        <Table className={classes.table} >
                            <EnhancedTableHead
                                order={order}
                                orderBy={orderBy}
                                onRequestSort={handleRequestSort}
                                rowCount={rows != null ? rows.length : 0}
                                checkAll={checkAll.bind(this)}
                            />
                            <TableBody>
                                {body}
                            </TableBody>
                            <TableFooter>                        
                                <Pagination data={rows} openMore={openSeveral} handlePress={handleClick}/>                                
                            </TableFooter>
                        </Table>
                    </div>
                </Paper>
            </div>
        );
    }

    if (!fetched) {
        const body = Array.from({length:5}, (value, index) =>
                <TableRow
                    hover
                    id={'skeleton'+index}
                    role="checkbox"
                    key={index}
                    className={`card-horiz basic-background result`}
                    tabIndex="0"
                >
                    <TableCell component="td" scope="row" padding="none"/>
                    <TableCell>
                        <Skeleton variant="rect" width='auto' height={118}/>
                    </TableCell>
                    <TableCell>
                        <Skeleton variant="rect" width='auto' height={10}/>
                    </TableCell>
                    <TableCell>
                        <Skeleton variant="rect" width='auto' height={10}/>
                    </TableCell>
                    <TableCell>
                        <Skeleton variant="rect" width='auto' height={10}/>
                    </TableCell>
                    <TableCell>
                        <Skeleton variant="rect" width='auto' height={10}/>
                    </TableCell>
                    <TableCell>
                        <Skeleton variant="rect" width={40} height={40} style={{float:'right'}}/>
                    </TableCell>
                </TableRow>
            );
        return createTable(body);
    } else {
        let body =
            stableSort(rows, getSorting(order, orderBy))
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row, i) => {
                const labelId = row.pubId;

                return (
                    <TableRow
                        hover
                        id={labelId}
                        onClick={event => handleClick(event, {row})}
                        role="checkbox"
                        key={labelId}
                        onKeyDown={event => handleKeyPress(event, {row})}
                        className={`card-horiz basic-background result`}
                        tabIndex="0"
                        onFocus={event => handleOnFocus(event, {row})}
                        onBlur={event => handleOnBlur(event, {row})}
                    >
                        <TableCell component="td" scope="row" padding="none">
                            <Checkbox key={row.pubId}
                                checked={checked[i]}
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}
                                onChange={(e) => {
                                    e.stopPropagation();
                                    let statuses = [...checked];
                                    statuses[i] = !statuses[i];
                                    let toOpen = [...openSeveral];
                                    if (statuses[i])
                                        toOpen.push(labelId);
                                    else
                                        toOpen = toOpen.filter(item => item !== row.pubId);

                                    setChecked(statuses);
                                    setOpenSeveral(toOpen);
                                }}
                            />
                        </TableCell>

                        <TableCell>
                            <div>
                                <div className="image-wrapper">
                                    <img src={getMainImage("result")} alt="result"/>
                                </div>
                                <div className="content-wrapper">
                                    <h6 className={`result-title`}>
                                        {row.languages.filter(l => l.original)[0].title}
                                    </h6>
                                    <div className={`metadata`}>
                                        {row.authors
                                            .slice(0, 5)
                                            .map(author => author.authorName + "; ")}
                                        {row.authors.length > 5 ? " et al " : ""}
                                        { row.authors.length > 100 ? <div style={monsterPostStyle}> ({row.authors.length}) Stort antall bidragsytere </div> :" (" + row.authors.length + ") "}
                                        <p className={`journal-name`}>
                                            {row.hasOwnProperty("channel") &&
                                            row.channel.hasOwnProperty("title")
                                                ? row.channel.title + " "
                                                : ""}
                                        </p>
                                        {row.yearPublished + ";"}
                                        {row.hasOwnProperty("channel")
                                            ? row.channel.volume + ";"
                                            : ""}
                                        {row.hasOwnProperty("channel") &&
                                        row.channel.hasOwnProperty("pageFrom")
                                            ? row.channel.pageFrom + "-"
                                            : ""}
                                        {row.hasOwnProperty("channel") && row.channel.hasOwnProperty("pageTo")
                                            ? row.channel.pageTo
                                            : ""}
                                        {row.hasOwnProperty("doi") ? " doi:" + row.doi : ""}
                                    </div>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell align="right">
                            <div>{row.categoryName}</div>
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
                                alt="Forfatterliste"
                            >
                                <div hidden={true}> Forfatterliste</div>
                                <PeopleIcon/>
                            </IconButton>
                        </TableCell>
                    </TableRow>
                );
            });

        return (
            <div>
                {createTable(body)}
                <ResultModal
                    open={open}
                    data={modalData}
                    handleClose={handleClose.bind(this)}
                    removeFromList={removeFromList.bind(this)}
                />
                <ListModal
                    title={"Forfatterliste"}
                    open={authorList}
                    body={createAuthorRows()}
                    handleClose={handleCloseList}
                />
            </div>
        );
    }
}
