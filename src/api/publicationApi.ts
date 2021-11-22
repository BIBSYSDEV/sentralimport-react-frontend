import { AxiosPromise, AxiosResponse } from 'axios';
import { authenticatedApiRequest } from './api';
import { CRIST_REST_API, PIA_REST_API } from '../utils/constants';
import { ChannelLight, CristinPublication, PublicationCount } from '../types/PublicationTypes';
import { SearchLanguage } from './contributorApi';

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

interface CategoryResponseItem {
  code: string;
  name: {
    nb?: string;
    en?: string;
  };
}

export async function getCategories(searchLanguage: SearchLanguage): Promise<AxiosResponse<CategoryResponseItem[]>> {
  return authenticatedApiRequest({
    url: encodeURI(`${CRIST_REST_API}/results/categories?lang=${searchLanguage}`),
    method: 'GET',
  });
}
