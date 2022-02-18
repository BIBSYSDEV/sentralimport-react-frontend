import React, { Dispatch } from 'react';
import { BooleanString, ContextType, SortValue } from './types/ContextType';
import { Order } from './types/PublicationTypes';

const currentYear = new Date().getFullYear();
const currentDate = new Date();
const initialState: ContextType = {
  currentImportYear:
    currentDate.getMonth() < 3
      ? { value: currentYear.valueOf() - 1, label: (currentYear - 1).toString() }
      : { value: currentYear, label: currentYear.toString() },
  currentImportStatus: 'false' as BooleanString,
  currentInstitution: { value: null, label: 'Ingen filtrering' },
  isSampublikasjon: false,
  currentPageNr: 0,
  currentPerPage: { value: 5, label: '5' },
  currentSortValue: SortValue.Date,
  currentSortOrder: Order.desc,
  totalCount: 0,
  institutions: null,
  allChecked: false,
  doiFilter: null,
  triggerImportDataSearch: false,
  globalInstitutions: [],
};

const Context = React.createContext<{ state: ContextType; dispatch: Dispatch<any> }>({
  state: initialState,
  dispatch: () => null,
});

const reducer = (state: ContextType, action: { type: string; payload: any }) => {
  switch (action.type) {
    case 'reset':
      return initialState;
    case 'setImportYear':
      return { ...state, currentImportYear: action.payload };
    case 'setImportStatus':
      return { ...state, currentImportStatus: action.payload };
    case 'setInstitution':
      return { ...state, currentInstitution: action.payload };
    case 'setSampublikasjon':
      return { ...state, isSampublikasjon: action.payload };
    case 'setPageNr':
      return { ...state, currentPageNr: action.payload };
    case 'setPerPage':
      return { ...state, currentPerPage: action.payload };
    case 'setSortValue':
      return { ...state, currentSortValue: action.payload };
    case 'setSortOrder':
      return { ...state, currentSortOrder: action.payload };
    case 'setSelectedPublication':
      return { ...state, selectedPublication: action.payload };
    case 'setTotalCount':
      return { ...state, totalCount: action.payload };
    case 'institutions':
      return { ...state, institutions: action.payload };
    case 'allChecked':
      return { ...state, allChecked: action.payload };
    case 'doiFilter':
      return { ...state, doiFilter: action.payload };
    case 'triggerImportDataSearch':
      return { ...state, triggerImportDataSearch: action.payload };
    case 'globalInstitutions':
      return { ...state, globalInstitutions: action.payload };
    default:
      return state;
  }
};

const ContextProvider = (props: any) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return <Context.Provider value={{ state, dispatch }}> {props.children} </Context.Provider>;
};

const ContextConsumer = Context.Consumer;

export { Context, ContextProvider, ContextConsumer };
