import React, { useContext, useEffect, useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import axios from 'axios';
import { Context } from '../../Context';
import ResultModal from '../ResultModal/ResultModal';
import Pagination from '../Pagination/Pagination';
import '../../assets/styles/Results.scss';
import '../../assets/styles/Imports.css';
import { useHistory } from 'react-router-dom';
import ListModal from '../ListModal/ListModal';
import { PIA_REST_API } from '../../utils/constants';
import EnhancedTableHead from './EnhancedTableHead';
import { ImportData, Order } from '../../types/importTableTypes';
import ImportTableListItem from './ImportTableListItem';
import PlaceHolderListItem from './PlaceHolderListItem';
import AuthorList from './AuthorList';
import styled from 'styled-components';

const StyledRoot = styled.div`
  display: block;
  width: 100%;
  margin-top: 1.5rem;
`;

const StyledPaper = styled.div`
  width: 100%;
  margin-bottom: 1rem;
  margin-right: 10px;
`;

const StyledTableWrapper = styled.div`
  overflow-x: visible;
  overflow-y: visible;
`;

const StyledToolBarTitle = styled.div`
  flex: '0 0 auto';
`;

const StyledToolBarSpacer = styled.div`
  flex: '1 1 100%';
`;

const StyledToolBarActions = styled.div`
  color: rgba(0, 0, 0, 0.54);
`;

function desc(a: any, b: any, orderBy: any) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array: Array<any>, cmp: any) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function getSorting(order: Order, orderBy: string) {
  return order === 'desc' ? (a: any, b: any) => desc(a, b, orderBy) : (a: any, b: any) => -desc(a, b, orderBy);
}

const EnhancedTableToolbar = () => {
  return (
    <StyledToolBarTitle>
      <StyledToolBarSpacer />
      <StyledToolBarActions />
    </StyledToolBarTitle>
  );
};

export default function ImportTable(this: any) {
  const { state, dispatch } = useContext(Context);
  const [modalData, setModalData] = useState<ImportData>();
  const [order, setOrder] = useState(state.currentSortOrder);
  const [orderBy, setOrderBy] = useState(state.currentSortValue);
  const [page] = useState(state.currentPageNr);
  const [open, setOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(state.currentPerPage.value);
  const [rows, setRows] = useState<ImportData[]>([]);
  const [authorList, setAuthorList] = useState(false);
  const [authorData, setAuthorData] = useState<ImportData>();
  const [fetched, setFetched] = useState(false);
  const [checked, setChecked] = useState<boolean[]>([]);
  const [openSeveral, setOpenSeveral] = useState<string[]>([]);
  const history = useHistory();

  useEffect(() => {
    resetPageNr();
  }, [
    state.currentImportYear,
    state.isSampublikasjon,
    state.currentImportStatus,
    state.currentInstitution,
    state.currentPerPage,
    state.currentSortOrder,
    state.currentSortValue,
  ]);

  useEffect(() => {
    getRows().then();
    window.scroll({ top: 0, left: 0, behavior: 'smooth' });
  }, [
    state.currentImportYear,
    state.isSampublikasjon,
    state.currentImportStatus,
    state.currentInstitution,
    state.currentPerPage,
    state.currentPageNr,
    state.currentSortOrder,
    state.currentSortValue,
    state.doiFilter,
  ]);

  useEffect(() => {
    if (state.importDone === true) {
      setTimeout(function () {
        getRows().then();
      }, 500);
    }
  }, [state.importDone]);

  useEffect(() => {
    handleChangeRowsPerPage(state.currentPerPage);
  }, [state.currentPerPage]);

  async function getRows() {
    const checkedValues = [];
    for (let i = 0; i < state.currentPerPage.value; i++) {
      checkedValues.push(false);
    }
    setChecked(checkedValues);

    let url = PIA_REST_API + '/sentralimport/publications?year_published=' + state.currentImportYear.value;
    if (state.doiFilter !== null) {
      url += '&doi=' + state.doiFilter;
    }
    if (state.currentInstitution.value === null || state.currentInstitution.value === ' ') {
      if (state.isSampublikasjon) {
        url += '&copublication=' + state.isSampublikasjon;
      }
      if (state.currentImportStatus !== 'ikke aktuelle') {
        url = url + ('&imported=' + state.currentImportStatus);
      } else {
        url = url + '&relevant=false';
      }
    } else {
      url =
        url +
        ('&institution=' + state.currentInstitution.cristinInstitutionNr + '&copublication=' + state.isSampublikasjon);
      if (state.currentImportStatus !== 'ikke aktuelle') {
        url = url + ('&imported=' + state.currentImportStatus);
      } else {
        url = url + '&relevant=false';
      }
    }
    url =
      url +
      '&sort=' +
      state.currentSortValue +
      ' ' +
      state.currentSortOrder +
      '&per_page=' +
      state.currentPerPage.value +
      '&page=' +
      (state.currentPageNr + 1);

    setFetched(false);
    try {
      await axios.get(url, JSON.parse(localStorage.getItem('config') ?? '{}')).then((response) => {
        handleRows(response.data as ImportData[]);
        dispatch({
          type: 'setTotalCount',
          payload: response.headers['x-total-count'],
        });
      });
      setFetched(true);
    } catch (error: any) {
      console.log('ERROR', error);
      if (!error.response || error.response.status === 401 || error.response.status === 403) {
        localStorage.setItem('authorized', 'false');
        history.push('/login');
      } else {
        history.push('/error');
      }
    }
  }

  function resetPageNr() {
    dispatch({ type: 'setPageNr', payload: 0 });
  }

  function handleRows(temp: ImportData[]) {
    setRows(temp);
  }

  function handleRequestSort(property: string) {
    const isDesc = orderBy === property && order === 'desc';
    setOrder(isDesc ? 'asc' : 'desc');
    dispatch({ type: 'setSortOrder', payload: isDesc ? 'asc' : 'desc' });
    setOrderBy(property);
    dispatch({ type: 'setSortValue', payload: property });
  }

  function handleClose() {
    setOpen(false);
    if (openSeveral.length > 1) {
      dispatch({ type: 'setContributorsLoaded', payload: false });
      const index = rows.findIndex((id) => id.pubId === openSeveral[1]);
      const temp = [...openSeveral];
      temp.splice(0, 1);
      setOpenSeveral(temp);
      setModalData(rows[index]);
      setOpen(true);
    } else {
      dispatch({ type: 'setContributorsLoaded', payload: false });
      checkAll(false);
      dispatch({ type: 'allChecked', payload: false });
    }
  }

  function handleCloseList() {
    setAuthorList(false);
  }

  function handleAuthorClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, row: ImportData) {
    if (!authorList) {
      setAuthorList(true);
      setAuthorData(row);
    }
  }

  function handleAuthorPress(event: React.KeyboardEvent<HTMLButtonElement>, row: ImportData) {
    if (!authorList) {
      if (event.keyCode === 13 || event.keyCode === 32) {
        setAuthorList(true);
        setAuthorData(row);
      }
    }
  }

  function handleClick(event: any, row: { row: any }) {
    setOpen(true);
    if (openSeveral.length > 0) {
      const index = rows.findIndex((r) => r.pubId === openSeveral[0]);
      setModalData(rows[index]);
    } else setModalData(row.row);
  }

  function handleKeyPress(event: React.KeyboardEvent<HTMLButtonElement>, row: { row: any }) {
    if (event.keyCode === 13 || event.keyCode === 32) {
      setOpen(true);
      setModalData(row.row);
    }
  }

  function handleCheckBoxChange(event: React.ChangeEvent<HTMLInputElement>, importData: ImportData, index: number) {
    event.stopPropagation();
    const statuses = [...checked];
    statuses[index] = !statuses[index];
    let toOpen = [...openSeveral];
    if (statuses[index]) toOpen.push(importData.pubId);
    else toOpen = toOpen.filter((item) => item !== importData.pubId);
    setChecked(statuses);
    setOpenSeveral(toOpen);
  }

  function handleOnFocus(event: any) {
    event.target.className = event.target.className + ' focused';
  }

  function handleOnBlur(event: any) {
    event.target.className = event.target.className.split(' focused')[0];
  }

  function handleChangeRowsPerPage(option: any) {
    setRowsPerPage(option.value);
  }

  function checkAll(status: boolean) {
    const temp = [...checked];
    const ids = [];
    for (let i = 0; i < rows.length; i++) {
      temp[i] = status;
      if (status) ids.push(rows[i].pubId);
    }

    setOpenSeveral(ids);
    setChecked(temp);
  }

  function createTable(body: any) {
    return (
      <StyledRoot data-testid="import-table-panel">
        <StyledPaper>
          <EnhancedTableToolbar />
          <StyledTableWrapper>
            <Table>
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                checkAll={checkAll}
              />
              <TableBody>{body}</TableBody>
            </Table>
            <Pagination data={rows} openMore={openSeveral} handlePress={handleClick} />
          </StyledTableWrapper>
        </StyledPaper>
      </StyledRoot>
    );
  }

  if (!fetched) {
    const body = Array.from({ length: 5 }, (value, index) => <PlaceHolderListItem index={index} key={index} />);
    return createTable(body);
  } else {
    const body = stableSort(rows, getSorting(order, orderBy))
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map((row: ImportData, i) => {
        return (
          <ImportTableListItem
            key={row.pubId}
            importData={row}
            setOpen={setOpen}
            handleClick={handleClick}
            handleKeyPress={handleKeyPress}
            handleOnBlur={handleOnBlur}
            handleOnFocus={handleOnFocus}
            checked={checked[i]}
            handleCheckBoxChange={handleCheckBoxChange}
            index={i}
            handleAuthorClick={handleAuthorClick}
            handleAuthorPress={handleAuthorPress}
          />
        );
      });

    return rows.length > 0 ? (
      <div>
        {createTable(body)}
        <ResultModal open={open} data={modalData} handleClose={handleClose.bind(this)} />
        <ListModal
          title={'Forfatterliste'}
          open={authorList}
          body={<AuthorList authors={authorData?.authors} />}
          handleClose={handleCloseList}
        />
      </div>
    ) : (
      <div>
        <p>Fant ingen publikasjoner med følgende filter:</p>
        <p>År -{state.currentImportYear.value}</p>
        <p>
          Importstatus -
          {state.currentImportStatus === 'true'
            ? ' Importert'
            : state.currentImportStatus === 'false'
            ? ' Ikke importert'
            : ' Ikke aktuelle'}
        </p>
        {state.isSampublikasjon ? <p>Sampublikasjon - Ja</p> : ''}
        {state.currentInstitution.value !== null ? <p>Institusjon - {state.currentInstitution.label}</p> : ''}
        {state.doiFilter !== null ? <p>Doi - {state.doiFilter}</p> : ''}
      </div>
    );
  }
}
