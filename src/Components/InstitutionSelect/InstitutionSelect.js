import React, { Component } from "react";

import Select from "react-select";

const institutions = [
  { value: "UIO", label: "Universitetet i Oslo" },
  { value: "UIB", label: "Universitetet i Bergen" },
  { value: "UIS", label: "Universitetet i Stavanger" },
  { value: "OsloMet", label: "Oslo Metropolitan University" }
];

class institutionSelect extends Component {
  render() {
    return (
      <Select
        placeholder="Søk på sampublikasjoner"
        isMulti
        name="institutionSelect"
        options={institutions}
        className="basic-multi-select"
        classNamePrefix="select"
        isDisabled={this.props.disabled}
      />
    );
  }
}

export default institutionSelect;
