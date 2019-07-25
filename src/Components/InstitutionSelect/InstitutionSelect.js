import React from "react";

import Select from "react-select";

const institutions = [
  { value: "UIO", label: "Universitetet i Oslo" },
  { value: "UIB", label: "Universitetet i Bergen" },
  { value: "UIS", label: "Universitetet i Stavanger" },
  { value: "OsloMet", label: "Oslo Metropolitan University" }
];

export default function InstitutionSelect(props) {
  return (
    <Select
      placeholder="Søk på sampublikasjoner"
      isMulti
      name="institutionSelect"
      options={institutions}
      className="basic-multi-select"
      classNamePrefix="select"
      isDisabled={props.disabled}
    />
  );
}
