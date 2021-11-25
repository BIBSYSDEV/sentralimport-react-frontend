import { getCristinPublicationsBySearchTerm } from '../../api/publicationApi';
import { getContributorsByPublicationCristinResultId, SearchLanguage } from '../../api/contributorApi';

enum SearchChristinPublicationsSearchParams {
  doi = 'doi',
  title = 'title',
  publishedSince = 'published_since',
  publishedBefore = 'published_before',
  issn = 'issn',
  perPage = 'per_page',
  fields = 'fields',
  lang = 'lang',
  contributor = 'contributor',
}

function generateSearchParams(
  perPage: string,
  doi: string | undefined,
  title: string | undefined,
  yearPublished: string | undefined,
  issn: string | undefined,
  contributor?: string | undefined
): string {
  const searchParams = new URLSearchParams();
  searchParams.set(SearchChristinPublicationsSearchParams.perPage, perPage);
  searchParams.set(SearchChristinPublicationsSearchParams.fields, 'all');
  searchParams.set(SearchChristinPublicationsSearchParams.lang, SearchLanguage.Nb);
  if (doi) {
    return `${searchParams.toString()}&doi=${doi}`; //DOI må spesialbehandles som string siden den inneholder '/'
  } else {
    if (title) {
      searchParams.set(SearchChristinPublicationsSearchParams.title, title);
    }
    if (yearPublished) {
      searchParams.set(SearchChristinPublicationsSearchParams.publishedSince, `${+yearPublished - 1}`);
      searchParams.set(SearchChristinPublicationsSearchParams.publishedBefore, `${yearPublished}`);
    }
    if (issn) {
      searchParams.set(SearchChristinPublicationsSearchParams.issn, issn);
    }
    if (contributor) {
      searchParams.set(SearchChristinPublicationsSearchParams.contributor, contributor);
    }
    return searchParams.toString();
  }
}

export async function searchChristinPublications(
  perPage: string,
  doi: string | undefined,
  title: string | undefined,
  yearPublished: string | undefined,
  issn: string | undefined,
  contributor?: string
) {
  const searchParams = generateSearchParams(
    perPage,
    doi,
    title,
    yearPublished,
    issn,
    contributor ? contributor : undefined
  );
  const response = await getCristinPublicationsBySearchTerm(searchParams);
  const cristinPublications = response.data;
  for (let i = 0; i < cristinPublications.length; i++) {
    const response = await getContributorsByPublicationCristinResultId(
      cristinPublications[i].cristin_result_id,
      1,
      10,
      SearchLanguage.Nb
    );
    cristinPublications[i].authors = response.data;
    cristinPublications[i].authorTotalCount = response.headers['x-total-count'];
  }

  return cristinPublications;
}
