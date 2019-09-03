import React from "react";
import Select from "react-select";
import { Context } from "../../Context";

export default function DropdownSelect() {
  let { state, dispatch } = React.useContext(Context);

  var years = [
      { value: 2004, label: "2004" },
      { value: 2014, label: "2014" },
      { value: 2016, label: "2016" },
      { value: 2017, label: "2017" },
      { value: 2018, label: "2018" },
      { value: 2019, label: "2019" }
  ];

  function handleChange(option) {
    console.log(option);
    dispatch({ type: "setImportYear", payload: option });
  }

  return (
    <Select
      options={years}
      value={state.currentImportYear}
      onChange={handleChange}
    />
  );
}
