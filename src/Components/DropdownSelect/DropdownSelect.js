import React, { Component } from "react";
import Select from "react-select";

class DropdownSelect extends Component {
  render() {
    var options = [
      { value: 2016, label: "2016" },
      { value: 2017, label: "2017" },
      { value: 2018, label: "2018" },
      { value: 2019, label: "2019" }
    ];

    var beskrivelse = [{ value: "Velg publiseringsår", label: "Velg år..." }];

    return <Select options={options} defaultValue={beskrivelse[0]} />;
  }
}

export default DropdownSelect;
