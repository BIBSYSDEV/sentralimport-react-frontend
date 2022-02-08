import { ImportPublication, Language, SavedPublicationLogLine } from '../../types/PublicationTypes';
import { CompareFormValuesType } from './CompareFormTypes';
import { patchPiaPublication, patchPublication, postPublication } from '../../api/publicationApi';
import { handlePotentialExpiredSession } from '../../api/api';
import { ContributorWrapper } from '../../types/ContributorTypes';

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

const generateTitleObjectForCristinPublication = (publicationLanguages: Language[]) => {
  const title: any = {};
  publicationLanguages.forEach((language) => {
    title[language.lang.toLowerCase()] = language.title;
  });
  return title;
};

export const createCristinPublicationForSaving = (
  values: CompareFormValuesType,
  importPublication: ImportPublication,
  contributors: ContributorWrapper[],
  publicationLanguages: Language[],
  annotation: string
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
    title: generateTitleObjectForCristinPublication(publicationLanguages),
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
      list: createContributorObject(contributors),
    },
  };
  if (annotation) {
    cristinPublication.annotation = annotation;
  }
  return cristinPublication;
};

export const createCristinPublicationForUpdating = (
  values: CompareFormValuesType,
  importPublication: ImportPublication,
  cristinResultId: string,
  publicationLanguages: Language[],
  annotation: string
) => {
  const cristinPublication: any = {
    cristinResultId,
    original_language: publicationLanguages.filter((language: Language) => language.original)[0].lang.toLowerCase(),
    title: generateTitleObjectForCristinPublication(publicationLanguages),
    pub_id: importPublication.pubId,
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
  };
  const numPages = getNumberOfPages(values.pageFrom, values.pageTo);
  if (numPages !== '0' && values.pageFrom && values.pageTo) {
    cristinPublication.pages = {
      from: values.pageFrom,
      to: values.pageTo,
      count: numPages,
    };
  }
  if (annotation) {
    cristinPublication.annotation = annotation;
  }
  return cristinPublication;
};

export async function handleCreatePublication(
  formValues: CompareFormValuesType,
  importPublication: ImportPublication,
  contributors: ContributorWrapper[],
  publicationLanguages: Language[],
  annotation: string,
  dispatch: any
) {
  const publication = createCristinPublicationForSaving(
    formValues,
    importPublication,
    contributors,
    publicationLanguages,
    annotation
  );
  try {
    const postPublicationResponse = await postPublication(publication);
    const cristinResultId = postPublicationResponse.data.cristin_result_id;
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

const generateAuthorPresentation = (publication: any) => {
  return publication.contributors.list
    .slice(0, 5)
    .map((author: any) => [author.surname, author.first_name].join(', '))
    .join('; ')
    .concat(publication.contributors.list.length > 5 ? ' et al.' : '');
};

const addToLog = (publication: any, cristinResultId: any) => {
  const log: SavedPublicationLogLine[] = JSON.parse(localStorage.getItem('log') || '[]') ?? [];
  if (log.length > 15) log.shift();
  log.push({
    id: cristinResultId,
    title: publication.title[publication.original_language],
    authorsPresentation: generateAuthorPresentation(publication),
  });
  localStorage.setItem('log', JSON.stringify(log));
};

export async function handleUpdatePublication(
  formValues: CompareFormValuesType,
  importPublication: ImportPublication,
  cristinResultId: string,
  publicationLanguages: Language[],
  annotation: string,
  dispatch: any
) {
  const publication = createCristinPublicationForUpdating(
    formValues,
    importPublication,
    cristinResultId,
    publicationLanguages,
    annotation
  );
  try {
    await patchPublication(publication);
    await patchPiaPublication(cristinResultId, publication.pub_id);
  } catch (error) {
    handlePotentialExpiredSession(error);
    return generateErrorMessage(error);
  }
  dispatch({ type: 'setContributorsLoaded', payload: false });
  dispatch({ type: 'setFormErrors', payload: [] });
  return {
    result: { id: cristinResultId, title: publication.title.en ?? publication.title.no },
    status: 200,
  };
}

interface SubmitAffiliation {
  role_code: string;
  institution?: any;
  unit?: any;
}

export const createContributorObject = (contributors: ContributorWrapper[]) => {
  const submitContributors: any = [];
  contributors?.forEach((contributor: ContributorWrapper) => {
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
