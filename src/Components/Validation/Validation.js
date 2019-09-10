import React from "react";

export default function Validation(props) {
  const formErrors = [];

  var doiRegEx = /^([0-9]+)[.]([0-9]{4})[/]([\w-.]{1,})/i;
  var utgivelseRegEx = /^(Volum)[ ]([0-9]{1,})[ ]([(]([0-9]{1,4})[-]([0-9]{1,4})[)])/i;

  function validateField() {
    switch (fieldName) {
      case "tittel":
        var tittelValid = value.length >= 6;
        // something
        break;
      case "doi":
        var doiValid = value.match(/^([0-9]+)[.]([0-9]{4})[/]([\w-.]{1,})/i);
        // dersom doi har galt format skriv error
        break;
      case "utgivelse":
        var utgivelseValid = value.match(
          /^(Volum)[ ]([0-9]{1,})[ ]([(]([0-9]{1,4})[-]([0-9]{1,4})[)])([\w-., ]{0,})/i
        );
        // dersom utgivelse har feil format skriv error
        break;
      case "kilde":
        var kildeValid = value.length >= 3;
        // dersom kilde er for kort skriv error
        break;
      case "tidsskrift":
        var tidsskriftValid = value !== "";
        // dersom tidsskrift er tom skriv error
        break;
      case "aarstall":
        var aarstallValid = value.length === 4 && value <= "2019";
        // dersom aarstall er galt skriv error
        break;
      case "kategori":
        var kategoriValid = value.length > 3;
        // dersom kategori er for kort skriv error
        break;
      case "spraak":
        var spraakValid = value.length == 2;
        // dersom spraak er galt skriv error
        break;
      default:
        break;
    }
  }
  return (
    <div>
      <p>Errors in form</p>
      {formErrors.map(error => {
        <span>{error}</span>;
      })}
    </div>
  );
}
