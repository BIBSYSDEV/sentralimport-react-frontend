import React from "react";

let Context = React.createContext();

let initialState = {
  currentImportStatus: "Ikke importert",
  currentInstitution: "Ingen filtrering"
};

let reducer = (state, action) => {
  switch (action.type) {
    case "reset":
      return initialState;
    case "setImportStatus":
      return { ...state, currentImportStatus: action.payload };
    case "setInstitution":
      return { ...state, currentInstitution: action.payload };
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
