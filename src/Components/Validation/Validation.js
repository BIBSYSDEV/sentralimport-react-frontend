import React, { useEffect } from "react";
import { Context } from "../../Context";

export default function Validation(props) {
  let { state, dispatch } = React.useContext(Context);

  useEffect(() => {
    validateField();
  }, [state.selectedField, state.validation]);

  useEffect(() => {
    checkAllFields();
  }, [props.publication]);

  function updateErrors(error) {
    if (state.formErrors.indexOf(error) > -1) {
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
    } else if (state.formErrors.indexOf(error) > -1) {
      var newErrors = state.formErrors;
      newErrors.splice(newErrors.indexOf(error), 1);
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
          /^([0-9]{2})[.]([0-9]{4,5})[/]([\w-.]{1,})/i
        );
        var doiError = "Doi har galt format";

        doiValid ? removeError(doiError) : updateErrors(doiError);

        break;
      case "kilde":
        var kildeValid = state.validation.length >= 3;
        var kildeError = "Kilde mangler/ har feil";

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
          state.validation > 999 && state.validation <= new Date().getFullYear();
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
      {
        name: "tidsskrift",
        value: props.duplicate
          ? props.publication.journal.name
          : (props.publication.hasOwnProperty("channel") ? props.publication.channel.title : "")
      },
      {
        name: "doi",
        value: (props.duplicate && props.publication.hasOwnProperty("links"))
          ? props.publication.links[
              props.publication.links.length - 1
            ].url.substring(
              16,
              props.publication.links[props.publication.links.length - 1].url
                .length + 1
            )
          : props.publication.doi
          ? props.publication.doi
          : "Ingen DOI funnet"
      },
      {
        name: "tittel",
        value: props.duplicate
          ? props.publication.title.en
          : props.publication.languages[0].title
      },
      {
        name: "aarstall",
        value: props.duplicate
          ? props.publication.year_published
          : props.publication.yearPublished
      },
      {
        name: "kategori",
        value: props.duplicate
          ? props.publication.category.code
          : props.publication.category
      },
      {
        name: "spraak",
        value: props.duplicate
          ? props.publication.original_language
          : props.publication.languages[0].lang
      }
    ];
    for (var i = 0; i < data.length; i++) {
      switch (data[i].name) {
        case "tittel":
          var tittelValid = data[i].value.length >= 6;
          var tittelError = "Tittelen er for kort/mangler";

          !tittelValid ? fieldErrors.push(tittelError) : fieldErrors.push();

          break;
        case "doi":
          var doiValid = data[i].value.match(
            /^([0-9]{2})[.]([0-9]{4,5})[/]([a-z0-9-.]{1,})/i
          );
          var doiError = "Doi har galt format";

          !doiValid ? fieldErrors.push(doiError) : fieldErrors.push();

          break;
        case "utgivelse":
          var utgivelseValid = data[i].value.match(
            /^(Volum)[ ]([0-9a-z-:]{1,})[ ]([(]([0-9]{1,6})[-]([0-9]{1,6})[)])([\w-., ]{0,})/i
          );
          var utgivelseError = "Utgivelsesdata har galt format";

          !utgivelseValid
            ? fieldErrors.push(utgivelseError)
            : fieldErrors.push();

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
            data[i].value > 999 && data[i].value <= new Date().getFullYear();
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
  return <p></p>;
}

Validation.defaultProps = {
  publication: {
    pubId: "1234",
    languages: [
      {
        title: "title",
        lang: "en"
      }
    ]
  }
};
