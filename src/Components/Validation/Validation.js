import React from "react";

export default function Validation(props) {
  const formErrors = [];

  var doiRegEx = /^([0-9]+)[.]([0-9]{4})[/]([\w-.]{1,})/i;
  var utgivelseRegEx = /^(Volum)[ ]([0-9]{1,})[ ]([(]([0-9]{1,4})[-]([0-9]{1,4})[)])/i;

  function validateField() {
    switch (fieldName) {
      case "tittel":
        var tittelValid = value.length >= 6;
        var tittelError = "Tittel er for kort er mangler";
        {
          tittelValid ? " " : formErrors.push(tittelError);
        }
        break;
      case "doi":
        var doiValid = value.match(/^([0-9]+)[.]([0-9]{4})[/]([\w-.]{1,})/i);
        var doiError = "Doi har feil format";
        {
          doiValid ? " " : formErrors.push(doiError);
        }
        break;
      case "utgivelse":
        var utgivelseValid = value.match(
          /^(Volum)[ ]([0-9]{1,})[ ]([(]([0-9]{1,4})[-]([0-9]{1,4})[)])([\w-., ]{0,})/i
        );
        var utgivelseError = "Utgivelsesdata har galt format";
        {
          utgivelseValid ? " " : formErrors.push(utgivelseError);
        }
        break;
      case "kilde":
        var kildeValid = value.length >= 3;
        var kildeError = "Kilde er for kort";
        {
          kildeValid ? " " : formErrors.push(kildeError);
        }
        break;
      case "tidsskrift":
        var tidsskriftValid = value !== "";
        var tidsskriftError = "Ingen tidsskrift valgt";
        {
          tidsskriftValid ? " " : formErrors.push(tidsskriftError);
        }
        break;
      case "aarstall":
        var aarstallValid = value.length === 4 && value <= "2019";
        var aarstallError = "Årstall er galt/over grensen";
        {
          aarstallValid ? " " : formErrors.push(aarstallError);
        }
        break;
      case "kategori":
        var kategoriValid = value.length > 3;
        var kategoriError = "Kategori er for kort";
        {
          kategoriValid ? " " : formErrors.push(kategoriError);
        }
        break;
      case "spraak":
        var spraakValid = value.length == 2;
        var spraakError = "Språkkode er i galt format";
        {
          spraakValid ? " " : formErrors.push(spraakError);
        }
        break;
      default:
        break;
    }
  }
  return (
    <div>
      <p>Errors in form</p>
    </div>
  );
}
