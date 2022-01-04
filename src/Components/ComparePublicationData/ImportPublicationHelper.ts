import { ImportPublication, Language } from '../../types/PublicationTypes';
import { CompareFormValuesType } from './CompareFormTypes';
import { patchPiaPublication, patchPublication, postPublication } from '../../api/publicationApi';
import { handlePotentialExpiredSession } from '../../api/api';
import { ContributorWrapper } from '../../types/ContributorTypes';

//TODO: fix types

const getNumberOfPages = (pageFrom?: string, pageTo?: string) => {
  //Dette har blitt lagt inn pga. edge-casen med sidetall med bokstaven "e" i seg.
  //pageTo 2086.e8, pageFrom: 2083
  const arabicNumberMatcher = /^[0-9]+$/i;
  if (!pageTo || !pageFrom || !pageFrom.match(arabicNumberMatcher) || !pageTo.match(arabicNumberMatcher)) {
    return '0';
    //Javascript håndterer 2^53 integers, SQL hånterer 2^31 for integers.
  } else if (+pageTo - +pageFrom > Math.pow(2, 31)) {
    return '0';
  } else {
    return (+pageTo - +pageFrom).toString();
  }
};

export const createCristinPublicationForSaving = (
  values: CompareFormValuesType,
  importPublication: ImportPublication,
  publicationLanguages: Language[],
  annotation: string,
  cristinResultId?: string
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
    original_language: publicationLanguages.filter((language: Language) => language.original)[0].lang.toLowerCase(),
    title: title,
    pub_id: importPublication.pubId,
    year_published: values.year.toString(),
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
      from: values.pageFrom ?? '',
      to: values.pageTo ?? '',
      count: getNumberOfPages(values.pageFrom, values.pageTo),
    },
    contributors: {
      list: createContributorObject(),
    },
  };
  console.log(createContributorObject());
  if (cristinResultId) {
    cristinPublication.cristinResultId = cristinResultId;
  }
  if (annotation) {
    cristinPublication.annotation = annotation;
  }
  return cristinPublication;
};

export async function handleCreatePublication(publication: any, dispatch: any) {
  try {
    const postPublicationResponse = (await postPublication(publication)).data;
    const cristinResultId = postPublicationResponse.cristin_result_id;
    await patchPiaPublication(cristinResultId, publication.pub_id);
    addToLog(publication, cristinResultId);
    dispatch({ type: 'setFormErrors', payload: [] });
    dispatch({ type: 'setContributorsLoaded', payload: false });
    return { result: { id: cristinResultId, title: publication.title[publication.original_language] }, status: 200 };
  } catch (error) {
    handlePotentialExpiredSession(error);
    return generateErrorMessage(error);
  }
}

const addToLog = (publication: any, cristinResultId: any) => {
  const log = JSON.parse(localStorage.getItem('log') || '[]') ?? [];
  if (log.length > 15) log.shift();
  let title = publication.title[publication.original_language];
  title = title.length > 50 ? title.substring(0, 49) : title;
  log.push({ id: cristinResultId, title: title });
  localStorage.setItem('log', JSON.stringify(log));
};

export async function handleUpdatePublication(publication: any, dispatch: any) {
  if (publication.pages.count === '0' && !(publication.pages.from && publication.pages.to)) {
    //bugfix (if patch is used, all 3 properties must have a value)
    delete publication.pages;
  }
  try {
    await patchPublication(publication);
    await patchPiaPublication(publication.cristinResultId, publication.pub_id);
  } catch (error) {
    handlePotentialExpiredSession(error);
    return generateErrorMessage(error);
  }
  dispatch({ type: 'setContributorsLoaded', payload: false });
  dispatch({ type: 'setFormErrors', payload: [] });
  return {
    result: { id: publication.cristinResultId, title: publication.title.en ?? publication.title.no },
    status: 200,
  };
}

interface SubmitAffiliation {
  role_code: string;
  institution?: any;
  unit?: any;
}

export const createContributorObject = () => {
  const temp = JSON.parse(localStorage.getItem('tempContributors') || '{}');
  let submitContributors: any = [];
  if (temp.contributors) {
    temp.contributors.forEach((contributor: ContributorWrapper) => {
      const affiliations: SubmitAffiliation[] = [];
      contributor.toBeCreated.affiliations?.forEach((affiliation) => {
        if (!affiliation.units) {
          affiliations.push({
            role_code: contributor.imported.role_code === 'FORFATTER' ? 'AUTHOR' : contributor.imported.role_code + '',
            institution: affiliation.institution
              ? {
                  cristin_institution_id: affiliation.institution.cristin_institution_id,
                  role_code: contributor.imported.role_code,
                }
              : {
                  cristin_institution_id: affiliation.cristinInstitutionNr
                    ? affiliation.cristinInstitutionNr.toString()
                    : '0',
                },
          });
        }
        affiliation.units?.forEach((unit: any) => {
          affiliations.push({
            role_code: contributor.imported.role_code === 'FORFATTER' ? 'AUTHOR' : contributor.imported.role_code + '',
            unit: {
              cristin_unit_id: unit.unitNr ? unit.unitNr.toString() : '0',
            },
          });
        });
      });
      submitContributors.push({
        ...contributor.toBeCreated,
        affiliations: affiliations,
        cristin_person_id: contributor.toBeCreated.cristin_person_id?.toString(),
      });
    });
  }
  return submitContributors;
};

const generateErrorMessage = (error: any) => {
  if (error.response) {
    return {
      result: null,
      errorMessage:
        error.response?.data &&
        `Feilkode: (${error.response.data.response_id}). Meldinger: ${
          error.response?.data?.errors && error.response.data.errors.toString()
        }`,
      status: error.response ? error.response.status : 500,
    };
  } else {
    return {
      result: null,
      errorMessage: error.message,
    };
  }
};
