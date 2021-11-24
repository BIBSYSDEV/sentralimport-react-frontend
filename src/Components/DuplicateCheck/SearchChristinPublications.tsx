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
  yearPublished: number | undefined,
  issn: string | undefined,
  contributor?: string | undefined
) {
  const searchParams = new URLSearchParams();
  if (doi) {
    searchParams.set(SearchChristinPublicationsSearchParams.doi, doi);
  }
  if (title) {
    searchParams.set(SearchChristinPublicationsSearchParams.title, title);
  }
  if (yearPublished) {
    searchParams.set(SearchChristinPublicationsSearchParams.publishedSince, `${yearPublished - 1}`);
    searchParams.set(SearchChristinPublicationsSearchParams.publishedBefore, `${yearPublished}`);
  }
  if (issn) {
    searchParams.set(SearchChristinPublicationsSearchParams.issn, issn);
  }
  if (contributor) {
    searchParams.set(SearchChristinPublicationsSearchParams.contributor, contributor);
  }
  searchParams.set(SearchChristinPublicationsSearchParams.perPage, perPage);
  searchParams.set(SearchChristinPublicationsSearchParams.fields, 'all');
  searchParams.set(SearchChristinPublicationsSearchParams.lang, SearchLanguage.Nb);

  return searchParams;
}

export async function searchChristinPublications(
  perPage: string,
  doi: string | undefined,
  title: string | undefined,
  yearPublished: number | undefined,
  issn: string | undefined,
  contributor?: string | undefined
) {
  const searchParams = generateSearchParams(
    perPage,
    doi,
    title,
    yearPublished,
    issn,
    contributor ? contributor : undefined
  );
  console.log(searchParams.toString());
  const response = await getCristinPublicationsBySearchTerm(searchParams.toString());
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
