import React, { useContext, useEffect, useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import { Context } from '../../Context';
import DuplicateCheckModal from '../DuplicateCheck/DuplicateCheckModal';
import Pagination from './Pagination';
import ListModal from '../ListModal/ListModal';
import EnhancedTableHead from './EnhancedTableHead';
import { emptyImportPublication, ImportPublication, Order } from '../../types/PublicationTypes';
import ImportTableListItem from './ImportTableListItem';
import AuthorList from './AuthorList';
import styled from 'styled-components';
import { SortValue } from '../../types/ContextType';
import { getImportData } from '../../api/publicationApi';
import { handlePotentialExpiredSession } from '../../api/api';
import { Chip, CircularProgress, Typography } from '@material-ui/core';
import axios from 'axios';

const StyledRoot = styled.div`
  display: block;
  width: 100%;
  margin-top: 4rem;
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

const StyledNoResultsWrapper = styled.div`
  margin-top: 4rem;
`;

const StyledFilterWrapper = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 1rem;
`;

const StyledToolBarTitle = styled.div`
  flex: 0 0 auto;
`;

const StyledToolBarSpacer = styled.div`
  flex: 1 1 100%;
`;

const StyledToolBarActions = styled.div`
  color: rgba(0, 0, 0, 0.54);
`;

const CircularProgressWrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  height: 4rem;
  margin-top: 6rem;
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
  const [modalData, setModalData] = useState<ImportPublication>(emptyImportPublication);
  const [order, setOrder] = useState(state.currentSortOrder);
  const [orderBy, setOrderBy] = useState(state.currentSortValue);
  const [page] = useState(state.currentPageNr);
  const [isDuplicateCheckModalOpen, setIsDuplicateCheckModalOpen] = useState(false);
  const [resultsPerPage, setResultsPerPage] = useState(state.currentPerPage.value);
  const [importPublications, setImportPublications] = useState<ImportPublication[]>([]);
  const [authorList, setAuthorList] = useState(false);
  const [authorData, setAuthorData] = useState<ImportPublication>();
  const [isSearchingForImportData, setIsSearchingForImportData] = useState(false);
  const [checked, setChecked] = useState<boolean[]>([]);
  const [openSeveral, setOpenSeveral] = useState<string[]>([]);
  const [getImportDataError, setGetImportDataError] = useState<Error | undefined>();

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
    state.doiFilter,
  ]);

  const resetSelectedPublications = () => {
    setChecked(new Array(state.currentPerPage.value).fill(false));
    setOpenSeveral([]);
  };

  useEffect(() => {
    async function doSearch(abortController: AbortController) {
      resetSelectedPublications();
      setIsSearchingForImportData(true);
      setGetImportDataError(undefined);
      try {
        const importDataResponse = await getImportData(
          state.currentImportYear.value,
          state.currentInstitution.cristinInstitutionNr,
          state.isSampublikasjon,
          state.currentImportStatus,
          state.currentSortValue,
          state.currentSortOrder,
          state.currentPerPage.value,
          state.currentPageNr + 1,
          state.doiFilter,
          abortController
        );
        setImportPublications(importDataResponse.data as ImportPublication[]);
        dispatch({
          type: 'setTotalCount',
          payload: importDataResponse.headers['x-total-count'],
        });
        setIsSearchingForImportData(false);
      } catch (error: any) {
        if (axios.isCancel(error)) {
          setIsSearchingForImportData(true);
        } else {
          handlePotentialExpiredSession(error);
          setImportPublications([]);
          dispatch({
            type: 'setTotalCount',
            payload: 0,
          });
          setGetImportDataError(error as Error);
          setIsSearchingForImportData(false);
        }
      }
    }
    const controller = new AbortController();
    doSearch(controller).then();
    window.scroll({ top: 0, left: 0, behavior: 'smooth' });
    return () => {
      controller.abort();
    };
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
    state.triggerImportDataSearch,
  ]);

  useEffect(() => {
    setResultsPerPage(state.currentPerPage.value);
  }, [state.currentPerPage.value]);

  function resetPageNr() {
    dispatch({ type: 'setPageNr', payload: 0 });
  }

  function handleRequestSort(property: SortValue) {
    const isDesc = orderBy === property && order === 'desc';
    setOrder(isDesc ? Order.asc : Order.desc);
    dispatch({ type: 'setSortOrder', payload: isDesc ? Order.asc : Order.desc });
    setOrderBy(property as SortValue);
    dispatch({ type: 'setSortValue', payload: property });
  }

  function handleClose() {
    setIsDuplicateCheckModalOpen(false);
    if (openSeveral.length > 1) {
      const index = importPublications.findIndex((id) => id.pubId === openSeveral[1]);
      const temp = [...openSeveral];
      temp.splice(0, 1);
      setOpenSeveral(temp);
      setModalData(importPublications[index]);
      setIsDuplicateCheckModalOpen(true);
    } else {
      checkAll(false);
      dispatch({ type: 'allChecked', payload: false });
    }
  }

  function handleCloseList() {
    setAuthorList(false);
  }

  function handleAuthorClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, row: ImportPublication) {
    if (!authorList) {
      setAuthorList(true);
      setAuthorData(row);
    }
  }

  function handleAuthorPress(event: React.KeyboardEvent<HTMLButtonElement>, row: ImportPublication) {
    if (!authorList) {
      if (event.key === 'Enter' || event.key === 'Space') {
        setAuthorList(true);
        setAuthorData(row);
      }
    }
  }

  const openImportModal = (event: any, row: { row: any }) => {
    setIsDuplicateCheckModalOpen(true);
    if (openSeveral.length > 0) {
      const index = importPublications.findIndex((r) => r.pubId === openSeveral[0]);
      setModalData(importPublications[index]);
    } else setModalData(row.row);
  };

  const openImportModalByKeyPress = (event: React.KeyboardEvent<HTMLButtonElement>, row: { row: any }) => {
    if (event.key === 'Enter' || event.key === 'Space') {
      setIsDuplicateCheckModalOpen(true);
      setModalData(row.row);
    }
  };

  function handleCheckBoxChange(
    event: React.ChangeEvent<HTMLInputElement>,
    importData: ImportPublication,
    index: number
  ) {
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

  function checkAll(status: boolean) {
    const temp = [...checked];
    const ids = [];
    for (let i = 0; i < importPublications.length; i++) {
      temp[i] = status;
      if (status) ids.push(importPublications[i].pubId);
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
              {getImportDataError && (
                <Typography color="error">Klarte ikke å hente inn resultat {getImportDataError.message}</Typography>
              )}
              <TableBody>{body}</TableBody>
            </Table>
            <Pagination data={importPublications} openMore={openSeveral} handlePress={openImportModal} />
          </StyledTableWrapper>
        </StyledPaper>
      </StyledRoot>
    );
  }

  if (isSearchingForImportData) {
    return (
      <CircularProgressWrapper>
        <CircularProgress />
      </CircularProgressWrapper>
    );
  } else {
    const body = stableSort(importPublications, getSorting(order, orderBy))
      .slice(page * resultsPerPage, page * resultsPerPage + resultsPerPage)
      .map((row: ImportPublication, i) => {
        return (
          <ImportTableListItem
            key={row.pubId}
            importData={row}
            setOpen={setIsDuplicateCheckModalOpen}
            handleClick={openImportModal}
            handleKeyPress={openImportModalByKeyPress}
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

    return importPublications.length > 0 ? (
      <div>
        {createTable(body)}
        <DuplicateCheckModal
          isDuplicateCheckModalOpen={isDuplicateCheckModalOpen}
          importPublication={modalData}
          handleDuplicateCheckModalClose={handleClose.bind(this)}
        />
        <ListModal
          title={'Forfatterliste'}
          open={authorList}
          body={<AuthorList authors={authorData?.authors} />}
          handleClose={handleCloseList}
        />
      </div>
    ) : (
      <StyledNoResultsWrapper>
        <Typography variant="h6">Fant ingen publikasjoner</Typography>
        <Typography>Følgende filter er aktive:</Typography>
        <StyledFilterWrapper>
          <Chip color="primary" label={`Publiseringsår: ${state.currentImportYear.value}`} />
          <Chip
            color="primary"
            label={
              state.currentImportStatus === 'true'
                ? ' Importert'
                : state.currentImportStatus === 'false'
                ? ' Ikke importert'
                : ' Ikke aktuelle'
            }
          />
          {state.isSampublikasjon && <Chip color="primary" label="Sampublikasjon: Ja" />}
          {state.currentInstitution.value && (
            <Chip color="primary" label={`Institusjon: ${state.currentInstitution.label}`} />
          )}
          {state.doiFilter && <Chip color="primary" label={`DOI: ${state.doiFilter}`} />}
        </StyledFilterWrapper>
      </StyledNoResultsWrapper>
    );
  }
}
