import React from "react";

let Context = React.createContext();
let currentYear = new Date().getFullYear();
let initialState = {
  currentImportYear: { value: currentYear, label: currentYear.toString() },
  currentImportStatus: "false",
  currentInstitution: { value: null, label: "Ingen filtrering" },
  isSampublikasjon: false,
  currentPageNr: 0,
  currentPerPage: { value: 5, label: "5" },
  currentSortValue: "date",
  currentSortOrder: "desc",
  selectedField: "",
  selected: "false",
  selectedPublication: {
    journal: { name: "none" },
    import_sources: [{ source_name: "test" }],
    title: { en: "title" },
    category: { code: "test" },
    created: { date: "11223344556677889" }
  },
  validation: " ",
  formErrors: ["Ingen tidsskrift valgt"],
  totalCount: 0
};

let reducer = (state, action) => {
  switch (action.type) {
    case "reset":
      return initialState;
    case "setImportYear":
      return { ...state, currentImportYear: action.payload };
    case "setImportStatus":
      return { ...state, currentImportStatus: action.payload };
    case "setInstitution":
      return { ...state, currentInstitution: action.payload };
    case "setSampublikasjon":
      return { ...state, isSampublikasjon: action.payload };
    case "setPageNr":
      return { ...state, currentPageNr: action.payload };
    case "setPerPage":
      return { ...state, currentPerPage: action.payload };
    case "setSortValue":
      return { ...state, currentSortValue: action.payload };
    case "setSortOrder":
      return { ...state, currentSortOrder: action.payload };
    case "setSelectedField":
      return { ...state, selectedField: action.payload };
    case "setSelected":
      return { ...state, selected: action.payload };
    case "setSelectedPublication":
      return { ...state, selectedPublication: action.payload };
    case "setValidation":
      return { ...state, validation: action.payload };
    case "setFormErrors":
      return { ...state, formErrors: action.payload };
    case "setTotalCount":
      return { ...state, totalCount: action.payload };
    default:
      return state;
  }
};

const ContextProvider = props => {
  let [state, dispatch] = React.useReducer(reducer, initialState);
  let value = { state, dispatch };

  return <Context.Provider value={value}>{props.children}</Context.Provider>;
};

let ContextConsumer = Context.Consumer;

export { Context, ContextProvider, ContextConsumer };
