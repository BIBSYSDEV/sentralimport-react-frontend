import { CristinPublication, ImportPublication, Language } from '../../types/PublicationTypes';
import { CompareFormValuesType } from './CompareFormTypes';

export const createCristinPublicationForSaving = (
  values: CompareFormValuesType,
  importPublication: ImportPublication,
  selectedPublication: CristinPublication,
  publicationLanguages: Language[],
  annotation: string,
  isDuplicate: boolean
) => {
  const title: any = {};
  for (let i = 0; i < publicationLanguages.length; i++) {
    title[publicationLanguages[i].lang.toLowerCase()] = publicationLanguages[i].title;
  }
  const cristinPublication: any = {
    category: {
      code: values.category.value,
    },
    journal:
      values.journal.cristinTidsskriftNr && values.journal.cristinTidsskriftNr !== '0'
        ? {
            cristin_journal_id: values.journal.cristinTidsskriftNr,
          }
        : {
            name: values.journal.title,
            international_standard_numbers: [
              {
                type: 'printed',
                value: values.journal.issn ? values.journal.issn : null, //nødvendig ?
              },
              {
                type: 'electronic',
                value: values.journal.eissn ? values.journal.eissn : null,
              },
            ],
          },
    original_language: publicationLanguages.filter((l: any) => l.original)[0].lang.toLowerCase(),
    title: title,
    pub_id: importPublication.pubId,
    year_published: values.year,
    import_sources: [
      {
        source_name: importPublication.sourceName,
        source_reference_id: importPublication.externalId,
      },
    ],
    volume: values.volume,
    issue: values.issue,
    links: [
      {
        url_type: 'doi',
        url_value: values.doi,
      },
    ],
    pages: {
      from: values.pageFrom,
      to: values.pageTo,
      count: null, //TODO: merges
    },
    contributors: {
      list: createContributorObject(),
    },
  };
  if (isDuplicate) {
    cristinPublication.cristinResultId = cristinPublication.cristin_result_id;
  }
  if (annotation) {
    cristinPublication.annotation = annotation;
  }
  return cristinPublication;
};

const createContributorObject = () => {
  const temp = JSON.parse(localStorage.getItem('tempContributors') || '{}');
  let contributors = [];
  if (temp.contributors) {
    for (let i = 0; i < temp.contributors.length; i++) {
      const affiliations = [];
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
        (v: any, i: any, a: any) =>
          a.findIndex((t: any) => {
            if (t.hasOwnProperty('institution') && v.hasOwnProperty('institution')) {
              return t.institution.cristin_institution_id === v.institution.cristin_institution_id;
            } else if (t.hasOwnProperty('unit') && v.hasOwnProperty('unit')) {
              return t.unit.cristin_unit_id === v.unit.cristin_unit_id;
            }
            return false;
          }) === i
      ),
    }));
  }
  return contributors;
};
