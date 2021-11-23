import { AxiosPromise, AxiosResponse } from 'axios';
import { authenticatedApiRequest } from './api';
import { CRIST_REST_API, PIA_REST_API } from '../utils/constants';
import { ChannelLight, CristinPublication, ImportData, Order, PublicationCount } from '../types/PublicationTypes';
import { SearchLanguage } from './contributorApi';
import { SortValue } from '../types/ContextType';

export async function getCristinPublicationsBySearchTerm(
  searchTerms: string
): Promise<AxiosPromise<CristinPublication[]>> {
  return authenticatedApiRequest({
    url: encodeURI(`${CRIST_REST_API}/results${searchTerms}&fields=all&lang=${SearchLanguage.Nb}`),
  }) as AxiosPromise<CristinPublication[]>;
}

export async function getImportStatisticsByYear(year: number): Promise<AxiosResponse<PublicationCount>> {
  return authenticatedApiRequest({
    url: encodeURI(`${PIA_REST_API}/sentralimport/publicationCount/${year}`),
    method: 'GET',
  });
}

export enum QueryMethod {
  title = 'title_general',
  issn = 'issn',
}

export async function getJournalsByQuery(
  query: string,
  queryMethod: QueryMethod
): Promise<AxiosResponse<ChannelLight[]>> {
  return authenticatedApiRequest({
    url: encodeURI(`${CRIST_REST_API}/results/channels?type=journal&query=${queryMethod}:${query}`),
    method: 'GET',
  });
}

interface CategoryItem {
  code: string;
  name?: {
    nb?: string;
    en?: string;
  };
}

export async function getCategories(searchLanguage: SearchLanguage): Promise<AxiosResponse<CategoryItem[]>> {
  return authenticatedApiRequest({
    url: encodeURI(`${CRIST_REST_API}/results/categories?lang=${searchLanguage}`),
    method: 'GET',
  });
}

interface PostPublication {
  category: CategoryItem;
  journal: Journal;
  original_language: string;
  title: any;
  pub_id: string | number;
  year_published: string;
  import_sources: any;
  volume: string;
  issue: string;
  links: Link[];
  pages: Pages;
  contributor: any[];
  cristin_result_id: string | number;
  cristinResultId?: string | number;
  annotation?: string;
}

interface InternationalStandardNumber {
  type: string;
  value?: string | number;
}

interface Link {
  url_type: string;
  url_value: string;
}

interface Journal {
  cristin_journal_id: string;
  name: string;
  international_standard_numbers: InternationalStandardNumber[];
  pia_journal_number?: string | number;
}

interface Pages {
  from: string | number;
  to: string | number;
  count: string;
}

export async function postPublication(publication: PostPublication): Promise<AxiosResponse<PostPublication>> {
  return authenticatedApiRequest({ url: encodeURI(`${CRIST_REST_API}/results`), method: 'POST', data: publication });
}

interface PatchPublication {
  category?: CategoryItem;
  journal?: Journal;
  original_language?: string;
  title?: any;
  pub_id?: string | number;
  year_published?: string;
  import_sources?: any;
  volume?: string;
  issue?: string;
  links?: Link[];
  pages?: Pages;
  contributor?: any[];
  cristin_result_id?: string | number;
  cristinResultId: string | number;
  annotation?: string;
}

export async function patchPublication(publication: PatchPublication): Promise<AxiosResponse<PatchPublication>> {
  return authenticatedApiRequest({
    url: encodeURI(`${CRIST_REST_API}/results/${publication.cristinResultId}`),
    method: 'PATCH',
    data: publication,
  });
}

export async function patchPiaPublication(
  cristinResultId: string | number,
  pubId: string | number
): Promise<AxiosResponse<null>> {
  return authenticatedApiRequest({
    url: encodeURI(`${PIA_REST_API}/sentralimport/publication/${pubId}`),
    method: 'PATCH',
    data: { cristin_id: cristinResultId },
  });
}

export async function changePublicationImportStatus(
  pubId: string | number,
  isNotRelevant: boolean
): Promise<AxiosResponse<null>> {
  return authenticatedApiRequest({
    url: encodeURI(`${PIA_REST_API}/sentralimport/publication/${pubId}`),
    method: 'PATCH',
    data: { not_relevant: isNotRelevant },
  });
}

enum ImportDataSearchParams {
  SORT = 'sort',
  PER_PAGE = 'per_page',
  PAGE = 'page',
  YEAR = 'year_published',
  INSTITUTION = 'institution',
  DOI = 'doi',
  CO_PUBLICATION = 'copublication',
  RELEVANT = 'relevant',
  IMPORTED = 'imported',
}

function getSortAndPageSearchParams(sortValue: SortValue, sortOrder: Order, resultPerPage: number, pageNumber: number) {
  const searchParams = new URLSearchParams();
  searchParams.set(ImportDataSearchParams.SORT, `${sortValue} ${sortOrder}`);
  searchParams.set(ImportDataSearchParams.PER_PAGE, `${resultPerPage}`);
  searchParams.set(ImportDataSearchParams.PAGE, `${pageNumber}`);
  return searchParams;
}

const not_relevant = 'ikke aktuelle';

export async function getImportData(
  year: number,
  cristinInstitutionNr: string | null,
  isSamPublikasjon: boolean,
  importStatus: string,
  sortValue: SortValue,
  sortOrder: Order,
  resultPerPage: number,
  pageNumber: number,
  doiFilter: string | null
): Promise<AxiosResponse<ImportData[]>> {
  const searchParams = getSortAndPageSearchParams(sortValue, sortOrder, resultPerPage, pageNumber);
  searchParams.set(ImportDataSearchParams.YEAR, `${year}`);
  if (cristinInstitutionNr && cristinInstitutionNr !== '') {
    searchParams.set(ImportDataSearchParams.INSTITUTION, cristinInstitutionNr);
  }
  if (doiFilter) {
    searchParams.set(ImportDataSearchParams.DOI, doiFilter);
  }
  searchParams.set(ImportDataSearchParams.CO_PUBLICATION, `${isSamPublikasjon}`);
  importStatus === not_relevant
    ? searchParams.set(ImportDataSearchParams.RELEVANT, 'false')
    : searchParams.set(ImportDataSearchParams.IMPORTED, importStatus);
  return authenticatedApiRequest({
    url: `${PIA_REST_API}/sentralimport/publications?${searchParams.toString()}`,
    method: 'GET',
  });
}
