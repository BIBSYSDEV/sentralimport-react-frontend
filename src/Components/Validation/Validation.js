import React, { useEffect } from "react";
import { Context } from "../../Context";

export default function Validation(props) {
  var formErrors = [];
  let { state } = React.useContext(Context);

  useEffect(() => {
    validateField();
    console.log(formErrors);
  }, [state.validation, state.selectedField]);

  function updateErrors(error) {
    formErrors.push(error);
    console.log("here");
  }

  function removeError(error) {
    formErrors.splice(formErrors.indexOf(error), 1);
    console.log("there");
  }

  function validateField() {
    switch (state.selectedField) {
      case "tittel":
        var tittelValid = state.validation.length >= 6;
        var tittelError = "Tittel er for kort er mangler";
        {
          !tittelValid ? updateErrors(tittelError) : removeError(tittelError);
        }
        break;
      case "doi":
        var doiValid = state.validation.match(
          /^([0-9]+)[.]([0-9]{4})[/]([\w-.]{1,})/i
        );
        var doiError = "Doi har feil format";
        {
          doiValid ? removeError(doiError) : updateErrors(doiError);
        }
        break;
      case "utgivelse":
        var utgivelseValid = state.validation.match(
          /^(Volum)[ ]([0-9]{1,})[ ]([(]([0-9]{1,4})[-]([0-9]{1,4})[)])([\w-., ]{0,})/i
        );
        var utgivelseError = "Utgivelsesdata har galt format";
        {
          utgivelseValid
            ? removeError(utgivelseError)
            : updateErrors(utgivelseError);
        }
        break;
      case "kilde":
        var kildeValid = state.validation.length >= 3;
        var kildeError = "Kilde er for kort";
        {
          kildeValid ? removeError(utgivelseError) : updateErrors(kildeError);
        }
        break;
      case "tidsskrift":
        var tidsskriftValid = state.validation.length > 3;
        var tidsskriftError = "Ingen tidsskrift valgt";
        {
          tidsskriftValid
            ? removeError(tidsskriftError)
            : updateErrors(tidsskriftError);
        }
        break;
      case "aarstall":
        var aarstallValid =
          state.validation.length === 4 && state.validation <= "2019";
        var aarstallError = "Årstall er galt/over grensen";
        {
          aarstallValid
            ? removeError(aarstallError)
            : updateErrors(aarstallError);
        }
        break;
      case "kategori":
        var kategoriValid = state.validation.length > 3;
        var kategoriError = "Kategori er for kort";
        {
          kategoriValid
            ? removeError(kategoriError)
            : updateErrors(kategoriError);
        }
        break;
      case "spraak":
        var spraakValid = state.validation.length == 2;
        var spraakError = "Språkkode er i galt format";
        {
          spraakValid ? removeError(spraakError) : updateErrors(spraakError);
        }
        break;
      default:
        break;
    }
  }
  return (
    <div>
      <p>Errors in form: {formErrors[0]}</p>
    </div>
  );
}
