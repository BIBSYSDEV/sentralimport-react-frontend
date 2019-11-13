import React from "react";
import Select from "react-select";
import {Context} from "../../Context";

export default function DropdownSelect() {
    let {state, dispatch} = React.useContext(Context);

    let years = [];
    let currentYear = new Date().getFullYear();

    for (let i = currentYear - 10; i <= currentYear; i++) {
        years.push({value: i, label: i.toString()})
    }

    function handleChange(option) {
        dispatch({type: "setImportYear", payload: option});
    }

    return (
        <Select
            options={years}
            value={state.currentImportYear}
            onChange={handleChange}
        />
    );
}
