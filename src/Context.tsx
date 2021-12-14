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
  selectedField: '',
  selectedPublication: {
    cristin_result_id: '0',
    journal: { name: 'none' },
    import_sources: [{ source_name: 'test' }],
    title: { en: 'title' },
    category: { code: 'test' },
    created: { date: '11223344556677889' },
  },
  validation: ' ',
  formErrors: ['Ingen tidsskrift valgt'],
  totalCount: 0,
  contributors: null,
  institutions: null,
  doSave: false,
  allChecked: false,
  param: null,
  doiFilter: null,
  contributorsLoaded: false,
  contributorErrors: [],
  identified: [],
  identifiedImported: [],
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
    case 'setSelectedField':
      return { ...state, selectedField: action.payload };
    case 'setSelectedPublication':
      return { ...state, selectedPublication: action.payload };
    case 'setValidation':
      return { ...state, validation: action.payload };
    case 'setFormErrors':
      return { ...state, formErrors: action.payload };
    case 'setTotalCount':
      return { ...state, totalCount: action.payload };
    case 'contributors':
      return { ...state, contributors: action.payload };
    case 'setContributorPage':
      return { ...state, contributorPage: action.payload };
    case 'setContributorPerPage':
      return { ...state, contributorPerPage: action.payload };
    case 'institutions':
      return { ...state, institutions: action.payload };
    case 'institutionsEnglish':
      return { ...state, institutionsEnglish: action.payload };
    case 'doSave':
      return { ...state, doSave: action.payload };
    case 'allChecked':
      return { ...state, allChecked: action.payload };
    case 'param':
      return { ...state, param: action.payload };
    case 'doiFilter':
      return { ...state, doiFilter: action.payload };
    case 'setContributorErrors':
      return { ...state, contributorErrors: action.payload };
    case 'setContributorsLoaded':
      return { ...state, contributorsLoaded: action.payload };
    case 'identified':
      return { ...state, identified: action.payload };
    case 'identifiedImported':
      return { ...state, identifiedImported: action.payload };
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
