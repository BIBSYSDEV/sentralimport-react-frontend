import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { Context } from '../../Context';
import { useHistory } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import { patchPiaPublication, patchPublication, postPublication } from '../../api/publicationApi';

export default function ConfirmationDialog(props) {
  let { dispatch } = React.useContext(Context);
  let history = useHistory();
  const [annotation, setAnnotation] = React.useState(null);
  const [importDisabled, setImportDisabled] = React.useState(false);

  async function post() {
    let publication = createPublicationObject();
    let id = 0;
    setImportDisabled(true);
    try {
      id = (await postPublication(publication)).data.cristin_result_id;
      await patchPiaPublication(id, publication.pub_id);
      dispatch({ type: 'setFormErrors', payload: [] });
    } catch (e) {
      console.log('There was an error while importing the publication', e);
      if (!e.hasOwnProperty('response') || e.response.status === 401 || e.response.status === 403) {
        localStorage.setItem('authorized', 'false');
        history.push('/login');
      }
      return { result: null, status: e.response !== undefined ? e.response.status : 500 };
    }
    let title = publication.title[publication.original_language];
    title = title.length > 50 ? title.substr(0, 49) : title;
    let log = JSON.parse(localStorage.getItem('log'));
    if (log === null) log = [];
    else if (log.length > 15) log.shift();
    log.push({ id: id, title: title });
    localStorage.setItem('log', JSON.stringify(log));
    dispatch({ type: 'setContributorsLoaded', payload: false });
    return { result: { id: id, title: title }, status: 200 };
  }

  async function patch() {
    let publication = createPublicationObject();
    //bugfix (if patch is used, all 3 properties must have a value)
    if (publication.pages.count === 0 && !(publication.pages.from && publication.pages.to)) {
      delete publication.pages;
    }
    setImportDisabled(true);
    try {
      await patchPublication(publication);
      await patchPiaPublication(publication.cristinResultId, publication.pub_id);
    } catch (e) {
      console.log('There was an error while updating the publication', e);
      if (!e.hasOwnProperty('response') || e.response.status === 401 || e.response.status === 403) {
        localStorage.setItem('authorized', 'false');
        history.push('/login');
      }
      return { result: null, status: e.response !== undefined ? e.response.status : 500 };
    }
    let title =
      publication.title.en.length > 14 || publication.title.nb.length > 14
        ? publication.title.hasOwnProperty('en')
          ? publication.title.en.substr(0, 15)
          : publication.title.nb.substr(0, 15)
        : publication.title.hasOwnProperty('en')
        ? publication.title.en
        : publication.title.nb;
    dispatch({ type: 'setContributorsLoaded', payload: false });
    return { result: { id: publication.cristinResultId, title: title }, status: 200 };
  }

  function createPublicationObject() {
    const publication = JSON.parse(localStorage.getItem('tempPublication')).publication;
    let title = {};
    for (let i = 0; i < publication.languages.length; i++) {
      title[publication.languages[i].lang.toLowerCase()] = publication.languages[i].title;
    }
    let cristinPublication = {
      category: {
        code: publication.category,
      },
      journal:
        publication.channel.cristinTidsskriftNr && publication.channel.cristinTidsskriftNr !== '0'
          ? {
              cristin_journal_id: publication.channel.cristinTidsskriftNr,
            }
          : {
              name: publication.channel.title,
              international_standard_numbers: [
                {
                  type: 'printed',
                  value: publication.channel.issn ? publication.channel.issn : null,
                },
                {
                  type: 'electronic',
                  value: publication.channel.eissn ? publication.channel.eissn : null,
                },
              ],
            },
      original_language: publication.languages.filter((l) => l.original)[0].lang.toLowerCase(),
      title: title,
      pub_id: publication.pubId,
      year_published: publication.yearPublished.toString(),
      import_sources: publication.import_sources,
      volume: publication.channel.volume,
      issue: publication.channel.issue,
      links: [
        {
          url_type: 'doi',
          url_value: publication.doi,
        },
      ],
      pages: {
        from: publication.channel.pageFrom,
        to: publication.channel.pageTo,
        count:
          publication.channel.pageTo !== null &&
          publication.channel.pageFrom !== null &&
          !isNaN(publication.channel.pageTo) &&
          !isNaN(publication.channel.pageFrom)
            ? (publication.channel.pageTo - publication.channel.pageFrom).toString()
            : '0',
      },
      contributors: {
        list: createContributorObject(),
      },
    };
    if (props.duplicate) cristinPublication.cristinResultId = publication.cristinResultId;
    if (annotation !== null) cristinPublication.annotation = annotation;
    return cristinPublication;
  }

  function createContributorObject() {
    let temp = JSON.parse(localStorage.getItem('tempContributors'));
    let contributors = [];
    for (let i = 0; i < temp.contributors.length; i++) {
      let affiliations = [];
      for (let j = 0; j < temp.contributors[i].toBeCreated.affiliations.length; j++) {
        let count = 0;
        if (!temp.contributors[i].toBeCreated.affiliations[j].hasOwnProperty('units')) {
          affiliations[j + count] = {
            role_code:
              temp.contributors[i].imported.role_code === 'FORFATTER'
                ? 'AUTHOR'
                : temp.contributors[i].imported.role_code,
            institution: temp.contributors[i].toBeCreated.affiliations[j].hasOwnProperty('institution')
              ? {
                  ...temp.contributors[i].toBeCreated.affiliations[j].institution,
                  role_code: temp.contributors[i].imported.role_code,
                }
              : {
                  cristin_institution_id:
                    temp.contributors[i].toBeCreated.affiliations[j].hasOwnProperty('cristinInstitutionNr') &&
                    (temp.contributors[i].toBeCreated.affiliations[j].cristinInstitutionNr !== undefined ||
                      temp.contributors[i].toBeCreated.affiliations[j].cristinInstitutionNr !== null)
                      ? temp.contributors[i].toBeCreated.affiliations[j].cristinInstitutionNr.toString()
                      : '0',
                },
          };
        } else {
          for (let h = 0; h < temp.contributors[i].toBeCreated.affiliations[j].units.length; h++) {
            affiliations[j + count] = {
              role_code:
                temp.contributors[i].imported.role_code === 'FORFATTER'
                  ? 'AUTHOR'
                  : temp.contributors[i].imported.role_code,
              unit: {
                cristin_unit_id:
                  temp.contributors[i].toBeCreated.affiliations[j].units[h].hasOwnProperty('unitNr') &&
                  (temp.contributors[i].toBeCreated.affiliations[j].units[h].unitNr !== undefined ||
                    temp.contributors[i].toBeCreated.affiliations[j].units[h].unitNr !== null)
                    ? temp.contributors[i].toBeCreated.affiliations[j].units[h].unitNr.toString()
                    : '0',
              },
            };
            count++;
          }
        }
      }
      contributors[i] = {
        ...temp.contributors[i].toBeCreated,
        affiliations: affiliations,
        cristin_person_id: temp.contributors[i].toBeCreated.cristin_person_id.toString(),
      };
    }

    // filtrerer vekk institusjoner om samme institusjon kommer flere ganger på samme person. f.eks ANDREINST
    contributors = contributors.map((item) => ({
      ...item,
      affiliations: item.affiliations.filter(
        (v, i, a) =>
          a.findIndex((t) => {
            if (t.hasOwnProperty('institution') && v.hasOwnProperty('institution')) {
              return t.institution.cristin_institution_id === v.institution.cristin_institution_id;
            } else if (t.hasOwnProperty('unit') && v.hasOwnProperty('unit')) {
              return t.unit.cristin_unit_id === v.unit.cristin_unit_id;
            }
            return false;
          }) === i
      ),
    }));

    return contributors;
  }

  function handleChange(event) {
    setAnnotation(event.target.value);
  }

  return (
    <Dialog open={props.open} onClose={props.handleClose} disableBackdropClick disableEscapeKeyDown>
      <DialogTitle>Bekreft import</DialogTitle>
      <DialogContent>
        <TextField
          placeholder="Om du ønsker å legge ved en merknad, skriv den inn her før du importerer"
          multiline
          minRows={3}
          maxRows={6}
          margin="normal"
          onChange={handleChange}
          fullWidth
          inputProps={{ maxLength: 250 }}
        />
        <DialogContentText>Er du sikker på at du vil importere denne publikasjonen?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={props.handleCloseDialog} variant="outlined">
          Avbryt
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={() => {
            props.duplicate
              ? patch().then((response) => props.handleClose(response))
              : post().then((response) => props.handleClose(response));
          }}
          disabled={importDisabled}>
          Importer
        </Button>
      </DialogActions>
    </Dialog>
  );
}
