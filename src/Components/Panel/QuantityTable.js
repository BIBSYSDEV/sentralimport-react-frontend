import React, { useEffect } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import axios from 'axios';
import { Context } from '../../Context';
import { useHistory } from 'react-router-dom';
import { PIA_REST_API } from '../../utils/constants';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
}))(TableRow);

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(3),
    overflowX: 'auto',
    marginRight: '10px',
  },
}));

const QuantityTable = () => {
  const classes = useStyles();
  const [prevYear, setPrevYear] = React.useState(0);
  const [data, setData] = React.useState([]);
  let { state } = React.useContext(Context);
  const [prevCount, setPrevCount] = React.useState(state.totalCount);
  let history = useHistory();

  useEffect(() => {
    async function getNumbers() {
      if (
        state.currentImportYear.value !== prevYear ||
        (state.totalCount !== prevCount && localStorage.getItem('config'))
      ) {
        await axios
          .get(
            PIA_REST_API + '/sentralimport/publicationCount/' + state.currentImportYear.value,
            JSON.parse(localStorage.getItem('config'))
          )
          .then((response) => {
            setData(response.data);
          })
          .catch(function (error) {
            console.log(error);
            if (!error.hasOwnProperty('response') || error.response.status === 401 || error.response.status === 403) {
              localStorage.setItem('authorized', 'false');
              alert('Din sesjon har utgått. Vennligst logg inn på nytt');
              history.push('/login');
            } else {
              history.push('/error');
            }
          });
        setPrevYear(state.currentImportYear.value);
        setPrevCount(state.totalCount);
      }
    }
    getNumbers().then();
  }, [state.currentImportYear, state.totalCount]);

  return (
    <div className={classes.root} data-testid="quantity-table-panel">
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <StyledTableCell> Kilde</StyledTableCell>
            <StyledTableCell align="right">Antall</StyledTableCell>
            <StyledTableCell align="right">Importert</StyledTableCell>
            <StyledTableCell align="right">Ikke importert</StyledTableCell>
            <StyledTableCell align="right">Ikke aktuelle</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <StyledTableRow>
            <StyledTableCell component="th" scope="row">
              SCOPUS
            </StyledTableCell>
            <StyledTableCell data-testid="quantity-table-total" align="right">
              {data.totalCount}
            </StyledTableCell>
            <StyledTableCell data-testid="quantity-table-imported" align="right">
              {data.importedCount}
            </StyledTableCell>
            <StyledTableCell data-testid="quantity-table-not-imported" align="right">
              {data.notImportedCount}
            </StyledTableCell>
            <StyledTableCell data-testid="quantity-table-not-relevant" align="right">
              {data.notRelevantCount}
            </StyledTableCell>
          </StyledTableRow>
        </TableBody>
      </Table>
    </div>
  );
};
export default QuantityTable;
