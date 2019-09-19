import React, { useEffect } from "react";
import { Context } from "../../Context";

export default function Validation(props) {
  let { state, dispatch } = React.useContext(Context);

  // Ved oppdatering av ett felt sjekk at det er blitt fylt inn/formatert korrekt
  useEffect(() => {
    validateField();
    console.log(state.selectedField);
  }, [state.selectedField, state.validation]);

  // Ved åpning av ny publikasjon sjekk alle felter for feil
  useEffect(() => {
    checkAllFields();
    console.log(props.publication.pubId);
  }, [props.publication.pubId]);

  function updateErrors(error) {
    if (state.formErrors.includes(error)) {
    } else {
      var erray = [];
      erray.push(error);
      var tempArr = state.formErrors.concat(erray);
      dispatch({
        type: "setFormErrors",
        payload: tempArr
      });
    }
  }

  function removeError(error) {
    if (state.formErrors.length === 1 && state.formErrors[0] === error) {
      var emptyArr = state.formErrors;
      emptyArr.pop();
      dispatch({ type: "setFormErrors", payload: emptyArr });
    } else if (state.formErrors.includes(error)) {
      var newErrors = state.formErrors;
      newErrors.splice(newErrors.indexOf(error), 1);
      console.log(newErrors);
      dispatch({
        type: "setFormErrors",
        payload: newErrors
      });
    }
  }

  function validateField() {
    switch (state.selectedField) {
      case "tittel":
        var tittelValid = state.validation.length >= 6;
        var tittelError = "Tittel er for kort/mangler";

        tittelValid ? removeError(tittelError) : updateErrors(tittelError);

        break;
      case "doi":
        var doiValid = state.validation.match(
          /^([0-9]{2})[.]([0-9]{4})[/]([\w-.]{1,})/i
        );
        var doiError = "Doi har galt format";

        doiValid ? removeError(doiError) : updateErrors(doiError);

        break;
      case "utgivelse":
        var utgivelseValid = state.validation.match(
          /^(Volum)[ ]([0-9-]{1,})[ ]([(]([a-z0-9]{1,6})[-]([a-z0-9]{1,6})[)])([\w-., ]{0,})/i
        );
        var utgivelseError = "Utgivelsesdata har galt format";

        utgivelseValid
          ? removeError(utgivelseError)
          : updateErrors(utgivelseError);

        break;
      case "kilde":
        var kildeValid = state.validation.length >= 3;
        console.log(kildeValid);
        var kildeError = "Kilde er for kort";

        kildeValid ? removeError(kildeError) : updateErrors(kildeError);

        break;
      case "tidsskrift":
        var tidsskriftValid = state.validation.length > 3;
        var tidsskriftError = "Ingen tidsskrift valgt";

        tidsskriftValid
          ? removeError(tidsskriftError)
          : updateErrors(tidsskriftError);

        break;
      case "aarstall":
        var aarstallValid =
          state.validation.length === 4 && state.validation <= "2019";
        var aarstallError = "Årstall er galt/over grensen";

        aarstallValid
          ? removeError(aarstallError)
          : updateErrors(aarstallError);

        break;
      case "kategori":
        var kategoriValid = state.validation.length > 3;
        var kategoriError = "Kategori er for kort";

        kategoriValid
          ? removeError(kategoriError)
          : updateErrors(kategoriError);

        break;
      case "spraak":
        var spraakValid = state.validation.length === 2;
        var spraakError = "Språkkode har galt format";

        spraakValid ? removeError(spraakError) : updateErrors(spraakError);

        break;
      default:
        break;
    }
  }

  function checkAllFields() {
    var fieldErrors = [];
    var data = [
      { name: "kilde", value: props.publication.sourceName },
      { name: "tidsskrift", value: "x" },
      {
        name: "doi",
        value: props.publication.doi
          ? props.publication.doi
          : "Ingen doi funnet"
      },
      { name: "tittel", value: props.publication.languages[0].title },
      {
        name: "aarstall",
        value: props.publication.registered.substring(
          props.publication.registered.length - 4,
          props.publication.registered.length
        )
      },
      { name: "kategori", value: props.publication.category },
      { name: "spraak", value: props.publication.languages[0].lang },
      {
        name: "utgivelse",
        value: props.publication.channel
          ? "Volum " +
            props.publication.channel.volume +
            " (" +
            props.publication.channel.pageFrom +
            "-" +
            props.publication.channel.pageTo +
            ") "
          : "Ingen utgivelsesdata funnet"
      }
    ];
    for (var i = 0; i < data.length; i++) {
      console.log(data[i].value);
      switch (data[i].name) {
        case "tittel":
          var tittelValid = data[i].value.length >= 6;
          var tittelError = "Tittel er for kort/mangler";

          !tittelValid ? fieldErrors.push(tittelError) : fieldErrors.push();

          break;
        case "doi":
          var doiValid = data[i].value.match(
            /^([0-9]{2})[.]([0-9]{4})[/]([\w-.]{1,})/i
          );
          var doiError = "Doi har galt format";

          !doiValid ? fieldErrors.push(doiError) : fieldErrors.push();

          break;
        case "utgivelse":
          var utgivelseValid = data[i].value.match(
            /^(Volum)[ ]([0-9-]{1,})[ ]([(]([a-z0-9]{1,6})[-]([a-z0-9]{1,6})[)])([\w-., ]{0,})/i
          );
          var utgivelseError = "Utgivelsesdata har galt format";

          !utgivelseValid
            ? fieldErrors.push(utgivelseError)
            : fieldErrors.push();

          break;
        case "kilde":
          var kildeValid = data[i].value.length >= 3;
          var kildeError = "Kilde er for kort";

          !kildeValid ? fieldErrors.push(kildeError) : fieldErrors.push();

          break;
        case "tidsskrift":
          var tidsskriftValid = data[i].value.length > 3;
          var tidsskriftError = "Ingen tidsskrift valgt";

          !tidsskriftValid
            ? fieldErrors.push(tidsskriftError)
            : fieldErrors.push();

          break;
        case "aarstall":
          var aarstallValid =
            data[i].value.length === 4 && data[i].value <= "2019";
          var aarstallError = "Årstall er galt/over grensen";

          !aarstallValid ? fieldErrors.push(aarstallError) : fieldErrors.push();

          break;
        case "kategori":
          var kategoriValid = data[i].value.length > 3;
          var kategoriError = "Kategori er for kort";

          !kategoriValid ? fieldErrors.push(kategoriError) : fieldErrors.push();

          break;
        case "spraak":
          var spraakValid = data[i].value.length === 2;
          var spraakError = "Språkkode har galt format";

          !spraakValid ? fieldErrors.push(spraakError) : fieldErrors.push();

          break;
        default:
          break;
      }
    }
    dispatch({ type: "setFormErrors", payload: fieldErrors });
  }
  return (
    <div>
      <div>
        Feil i form:
        {state.formErrors.length >= 1 ? (
          <p>{state.formErrors.join(", ")}</p>
        ) : (
          <p>Ingen feil i form</p>
        )}
      </div>
    </div>
  );
}

Validation.defaultProps = {
  publication: {
    pubId: "1234"
  }
};
