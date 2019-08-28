import React from "react";

import Select from "react-select";

const institutions = [
  { value: " ", label: "Ingen institusjon" },
  { value: "UIO", label: "Universitetet i Oslo" },
  { value: "UIB", label: "Universitetet i Bergen" },
  { value: "UIS", label: "Universitetet i Stavanger" },
  { value: "NTNU", label: "Norges Teknisk-Naturvitenskapelige Universitet" }
];

export default function InstitutionSelect(props) {
  return (
    <Select
      placeholder="Søk på institusjoner"
      name="institutionSelect"
      options={institutions}
      className="basic-multi-select"
      classNamePrefix="select"
      onChange={props.onChange}
    />
  );
}
