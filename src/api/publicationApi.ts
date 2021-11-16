import { AxiosPromise } from 'axios';
import { authenticatedApiRequest } from './api';
import { CRIST_REST_API } from '../utils/constants';
import { CristinPublication } from '../types/PublicationTypes';
import { SearchLanguage } from './contributorApi';

export async function getCristinPublicationsBySearchTerm(
  searchTerms: string
): Promise<AxiosPromise<CristinPublication[]>> {
  return authenticatedApiRequest({
    url: encodeURI(`${CRIST_REST_API}/results${searchTerms}&fields=all&lang=${SearchLanguage.Nb}`),
  }) as AxiosPromise<CristinPublication[]>;
}

export async function getCristinAuthorsByPublicationId(cristinId: string): Promise<AxiosPromise<CristinPublication[]>> {
  return authenticatedApiRequest({
    url: encodeURI(`${CRIST_REST_API}/results/${cristinId}/contributors?per_page=10&lang=${SearchLanguage.Nb}`),
  }) as AxiosPromise<CristinPublication[]>;
}
