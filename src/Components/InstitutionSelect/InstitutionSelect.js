import React from "react";

import Select from "react-select";

const institutions = [
  { value: " ", label: "Ingen institusjon" , institutionNr: 0},
  { value: "UIO", label: "Universitetet i Oslo", institutionNr: 185 },
  { value: "UIB", label: "Universitetet i Bergen", institutionNr: 184 },
  { value: "UIS", label: "Universitetet i Stavanger", institutionNr: 217 },
  { value: "OsloMet", label: "Oslo Metropolitan University", institutionNr: 215 }
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
