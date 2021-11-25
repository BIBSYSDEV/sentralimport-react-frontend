import { AxiosResponse } from 'axios';
import { authenticatedApiRequest } from './api';
import { CRIST_REST_API, PIA_REST_API } from '../utils/constants';
import {
  CategoryItem,
  ChannelLight,
  CristinPublication,
  ImportPublication,
  Order,
  PatchPublication,
  PostPublication,
  PublicationCount,
} from '../types/PublicationTypes';
import { SearchLanguage } from './contributorApi';
import { SortValue } from '../types/ContextType';

export async function getCristinPublicationsBySearchTerm(
  searchTerms: string
): Promise<AxiosResponse<CristinPublication[]>> {
  return authenticatedApiRequest({
    url: encodeURI(`${CRIST_REST_API}/results?${searchTerms}`),
  });
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

export async function getCategories(searchLanguage: SearchLanguage): Promise<AxiosResponse<CategoryItem[]>> {
  return authenticatedApiRequest({
    url: encodeURI(`${CRIST_REST_API}/results/categories?lang=${searchLanguage}`),
    method: 'GET',
  });
}

export async function postPublication(publication: PostPublication): Promise<AxiosResponse<PostPublication>> {
  return authenticatedApiRequest({ url: encodeURI(`${CRIST_REST_API}/results`), method: 'POST', data: publication });
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

export const NOT_RELEVANT = 'ikke aktuelle';

function generateSearchParams(
  sortValue: SortValue,
  sortOrder: Order,
  resultPerPage: number,
  pageNumber: number,
  cristinInstitutionNr: string | null,
  year: number,
  doiFilter: string | null,
  importStatus: string,
  isSamPublikasjon: boolean
) {
  const searchParams = new URLSearchParams();
  searchParams.set(ImportDataSearchParams.SORT, `${sortValue} ${sortOrder}`);
  searchParams.set(ImportDataSearchParams.PER_PAGE, `${resultPerPage}`);
  searchParams.set(ImportDataSearchParams.PAGE, `${pageNumber}`);
  searchParams.set(ImportDataSearchParams.YEAR, `${year}`);
  if (cristinInstitutionNr && cristinInstitutionNr !== '') {
    searchParams.set(ImportDataSearchParams.INSTITUTION, cristinInstitutionNr);
  }
  if (doiFilter) {
    searchParams.set(ImportDataSearchParams.DOI, doiFilter);
  }
  searchParams.set(ImportDataSearchParams.CO_PUBLICATION, `${isSamPublikasjon}`);
  importStatus === NOT_RELEVANT
    ? searchParams.set(ImportDataSearchParams.RELEVANT, 'false')
    : searchParams.set(ImportDataSearchParams.IMPORTED, importStatus);
  return searchParams;
}

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
): Promise<AxiosResponse<ImportPublication[]>> {
  const searchParams = generateSearchParams(
    sortValue,
    sortOrder,
    resultPerPage,
    pageNumber,
    cristinInstitutionNr,
    year,
    doiFilter,
    importStatus,
    isSamPublikasjon
  );
  return authenticatedApiRequest({
    url: `${PIA_REST_API}/sentralimport/publications?${searchParams.toString()}`,
    method: 'GET',
  });
}
