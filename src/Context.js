import React from "react";

let Context = React.createContext();

let initialState = {
  currentImportYear: { value: 2018, label: "2018" },
  currentImportStatus: "false",
  currentInstitution: { value: null, label: "Ingen filtrering" },
  isSampublikasjon: false,
  currentPageNr: 0,
  currentPerPage: { value: 5, label: "5" },
  currentSortValue: "date",
  currentSortOrder: "desc"
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
