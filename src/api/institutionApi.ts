import { authenticatedApiRequest } from './api';
import { CRIST_REST_API } from '../utils/constants';
import { AxiosResponse } from 'axios';
import { Institution } from '../types/institutionTypes';

export async function getInstitutions(): Promise<AxiosResponse<Institution[]>> {
  return authenticatedApiRequest({
    url: `${CRIST_REST_API}/institutions?cristin_institution=true&per_page=500&lang=nb,en`,
    method: 'GET',
  });
}
