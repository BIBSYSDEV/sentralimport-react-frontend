import React from "react";

let Context = React.createContext();

let initialState = {
  currentImportYear: { value: 2018, label: "2018" },
  currentImportStatus: "Ikke importert",
  currentInstitution: "Ingen filtrering",
  isSampublikasjon: false
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
