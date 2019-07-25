import React from "react";
import Select from "react-select";

export default function DropdownSelect() {
  var years = [
    { value: 2016, label: "2016" },
    { value: 2017, label: "2017" },
    { value: 2018, label: "2018" },
    { value: 2019, label: "2019" }
  ];

  const beskrivelse = { value: "Velg publiseringsår", label: "Velg år..." };

  return <Select options={years} defaultValue={beskrivelse} />;
}
