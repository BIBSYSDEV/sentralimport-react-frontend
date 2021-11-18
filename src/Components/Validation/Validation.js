import React, { useEffect } from 'react';
import { Context } from '../../Context';

export const doiMatcher = /^$|^([0-9]{2})[.]([0-9]{4,5})[/]([a-z0-9-.]+)/i;
const utgivelseMatcher = /^(Volum)[ ]([0-9a-z-:]+)[ ]([(]([0-9]{1,6})[-]([0-9]{1,6})[)])([\w-., ]*)/i;

export default function Validation(props) {
  let { state, dispatch } = React.useContext(Context);

  useEffect(() => {
    validateField();
  }, [state.selectedField, state.validation]);

  useEffect(() => {
    checkAllFields();
  }, [props.publication]);

  function updateErrors(error) {
    if (state.formErrors.indexOf(error) < 0) {
      const erray = [];
      erray.push(error);
      const tempArr = state.formErrors.concat(erray);
      dispatch({
        type: 'setFormErrors',
        payload: tempArr,
      });
    }
  }

  function removeError(error) {
    if (state.formErrors.length === 1 && state.formErrors[0] === error) {
      const emptyArr = state.formErrors;
      emptyArr.pop();
      dispatch({ type: 'setFormErrors', payload: emptyArr });
    } else if (state.formErrors.indexOf(error) > -1) {
      const newErrors = state.formErrors;
      newErrors.splice(newErrors.indexOf(error), 1);
      dispatch({
        type: 'setFormErrors',
        payload: newErrors,
      });
    }
  }

  function validateField() {
    switch (state.selectedField) {
      case 'tittel':
        const tittelValid = state.validation.length >= 6;
        const tittelError = 'Tittel er for kort/mangler';
        tittelValid ? removeError(tittelError) : updateErrors(tittelError);
        break;
      case 'doi':
        const doiValid = state.validation.match(doiMatcher);
        const doiError = 'Doi har galt format';
        doiValid ? removeError(doiError) : updateErrors(doiError);
        break;
      case 'kilde':
        const kildeValid = state.validation.length >= 3;
        const kildeError = 'Kilde mangler/ har feil';
        kildeValid ? removeError(kildeError) : updateErrors(kildeError);
        break;
      case 'tidsskrift':
        const tidsskriftValid = state.validation.length > 3;
        const tidsskriftError = 'Ingen tidsskrift valgt';
        tidsskriftValid ? removeError(tidsskriftError) : updateErrors(tidsskriftError);
        break;
      case 'aarstall':
        const aarstallValid = state.validation > 999 && state.validation <= new Date().getFullYear();
        const aarstallError = 'Årstall er galt/over grensen';
        aarstallValid ? removeError(aarstallError) : updateErrors(aarstallError);
        break;
      case 'kategori':
        const kategoriValid = state.validation.length > 3;
        const kategoriError = 'Kategori er for kort';
        kategoriValid ? removeError(kategoriError) : updateErrors(kategoriError);
        break;
      case 'spraak':
        const spraakValid = state.validation.length === 2;
        const spraakError = 'Språkkode har galt format';
        spraakValid ? removeError(spraakError) : updateErrors(spraakError);
        break;
      default:
        break;
    }
  }

  function checkAllFields() {
    const fieldErrors = [];

    const data = [
      {
        name: 'tidsskrift',
        value: props.duplicate
          ? props.publication.hasOwnProperty('journal')
            ? props.publication.journal.name
            : ''
          : props.publication.hasOwnProperty('channel')
          ? props.publication.channel.title
          : '',
      },
      {
        name: 'doi',
        value:
          props.duplicate && props.publication.hasOwnProperty('links')
            ? props.publication.links[props.publication.links.length - 1].url.substring(
                16,
                props.publication.links[props.publication.links.length - 1].url.length + 1
              )
            : props.publication.doi
            ? props.publication.doi
            : '',
      },
      {
        name: 'tittel',
        value: props.duplicate
          ? props.publication.title[props.publication.original_language]
          : props.publication.languages[0].title,
      },
      {
        name: 'aarstall',
        value: props.duplicate ? props.publication.year_published : props.publication.yearPublished,
      },
      {
        name: 'kategori',
        value: props.duplicate ? props.publication.category.code : props.publication.category,
      },
      {
        name: 'spraak',
        value: props.duplicate ? props.publication.original_language : props.publication.languages[0].lang,
      },
    ];
    for (let i = 0; i < data.length; i++) {
      switch (data[i].name) {
        case 'tidsskrift':
          const tidsskriftValid = data[i].value.length > 3;
          const tidsskriftError = 'Ingen tidsskrift valgt';
          !tidsskriftValid ? fieldErrors.push(tidsskriftError) : fieldErrors.push();
          break;
        case 'tittel':
          const tittelValid = data[i].value.length >= 6;
          const tittelError = 'Tittelen er for kort/mangler';
          !tittelValid ? fieldErrors.push(tittelError) : fieldErrors.push();
          break;
        case 'doi':
          const doiValid = data[i].value.match(doiMatcher);
          const doiError = 'Doi har galt format';
          !doiValid ? fieldErrors.push(doiError) : fieldErrors.push();
          break;
        case 'utgivelse':
          //TODO: denne er vel ikke i bruk ? hva er evt utgivelse ?
          const utgivelseValid = data[i].value.match(utgivelseMatcher);
          const utgivelseError = 'Utgivelsesdata har galt format';
          !utgivelseValid ? fieldErrors.push(utgivelseError) : fieldErrors.push();
          break;
        case 'aarstall':
          const aarstallValid = data[i].value > 999 && data[i].value <= new Date().getFullYear();
          const aarstallError = 'Årstall er galt/over grensen';
          !aarstallValid ? fieldErrors.push(aarstallError) : fieldErrors.push();
          break;
        case 'kategori':
          const kategoriValid = data[i].value.length > 3;
          const kategoriError = 'Kategori er for kort';
          !kategoriValid ? fieldErrors.push(kategoriError) : fieldErrors.push();
          break;
        case 'spraak':
          const spraakValid = data[i].value.length === 2;
          const spraakError = 'Språkkode har galt format';
          !spraakValid ? fieldErrors.push(spraakError) : fieldErrors.push();
          break;
        default:
          break;
      }
    }
    dispatch({ type: 'setFormErrors', payload: fieldErrors });
  }

  return state.formErrors.length > 0 ? (
    <div> Kan ikke importere. Dobbeltsjekk alle påkrevde felter. {state.formErrors} </div>
  ) : (
    <span></span>
  );
}

Validation.defaultProps = {
  publication: {
    pubId: '1234',
    languages: [
      {
        title: 'title',
        lang: 'en',
      },
    ],
  },
};
