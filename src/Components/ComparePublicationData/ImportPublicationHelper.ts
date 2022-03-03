import {
  ImportPublication,
  Journal,
  PatchPublication,
  PostPublication,
  SavedPublicationLogLine,
} from '../../types/PublicationTypes';
import { CompareFormJournalType, CompareFormValuesType } from './CompareFormTypes';
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

const generateTitleObjectForCristinPublication = (values: CompareFormValuesType) => {
  const title: any = {};
  values.titles.forEach((titleObj) => {
    if (titleObj.title) {
      title[titleObj.langCode.toLowerCase()] = titleObj.title;
    }
  });
  return title;
};

const generateJournalObject = (journal: CompareFormJournalType): Journal => {
  return journal.cristinTidsskriftNr && journal.cristinTidsskriftNr !== '0'
    ? {
        cristin_journal_id: journal.cristinTidsskriftNr,
      }
    : {
        name: journal.title,
        international_standard_numbers: [
          {
            type: 'printed',
            value: journal.issn,
          },
          {
            type: 'electronic',
            value: journal.eissn,
          },
        ],
      };
};

export const createCristinPublicationForSaving = (
  values: CompareFormValuesType,
  importPublication: ImportPublication,
  contributors: ContributorWrapper[],
  annotation: string
) => {
  const publication: PostPublication = {
    category: {
      code: values.category.value,
    },
    journal: generateJournalObject(values.journal),
    original_language: values.originalLanguage.toLowerCase() ?? '',
    title: generateTitleObjectForCristinPublication(values),
    pub_id: importPublication.pubId,
    year_published: values.year?.toString() ?? '',
    import_sources: [
      {
        source_name: importPublication.sourceName,
        source_reference_id: importPublication.externalId,
      },
    ],
    volume: values.volume ?? '',
    issue: values.issue ?? '',
    links: [
      {
        url_type: 'doi',
        url_value: values.doi ?? '',
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
    publication.annotation = annotation;
  }
  return publication;
};

export const createCristinPublicationForUpdating = (
  values: CompareFormValuesType,
  importPublication: ImportPublication,
  cristinResultId: string,
  annotation: string
) => {
  const publication: PatchPublication = {
    cristinResultId,
    original_language: values.originalLanguage.toLowerCase() ?? '',
    title: generateTitleObjectForCristinPublication(values),
    pub_id: importPublication.pubId,
    import_sources: [
      {
        source_name: importPublication.sourceName,
        source_reference_id: importPublication.externalId,
      },
    ],
    volume: values.volume ?? '',
    issue: values.issue ?? '',
    links: [
      {
        url_type: 'doi',
        url_value: values.doi ?? '',
      },
    ],
  };
  const numPages = getNumberOfPages(values.pageFrom, values.pageTo);
  if (numPages !== '0' && values.pageFrom && values.pageTo) {
    publication.pages = {
      from: values.pageFrom,
      to: values.pageTo,
      count: numPages,
    };
  }
  if (annotation) {
    publication.annotation = annotation;
  }
  return publication;
};

export async function handleCreatePublication(
  formValues: CompareFormValuesType,
  importPublication: ImportPublication,
  contributors: ContributorWrapper[],
  annotation: string
) {
  const publication = createCristinPublicationForSaving(formValues, importPublication, contributors, annotation);
  try {
    const postPublicationResponse = await postPublication(publication);
    const cristinResultId = postPublicationResponse.data.cristin_result_id;
    await patchPiaPublication(cristinResultId, publication.pub_id);
    addToLog(publication, cristinResultId);
    return {
      result: { id: cristinResultId, title: publication.title[publication.original_language.toLowerCase()] },
      status: 200,
    };
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
    title: publication.title[publication.original_language.toLowerCase()],
    authorsPresentation: generateAuthorPresentation(publication),
  });
  localStorage.setItem('log', JSON.stringify(log));
};

export async function handleUpdatePublication(
  formValues: CompareFormValuesType,
  importPublication: ImportPublication,
  cristinResultId: string,
  annotation: string
) {
  const publication = createCristinPublicationForUpdating(formValues, importPublication, cristinResultId, annotation);
  try {
    await patchPublication(publication);
    await patchPiaPublication(cristinResultId, publication.pub_id);
  } catch (error) {
    handlePotentialExpiredSession(error);
    return generateErrorMessage(error);
  }
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
