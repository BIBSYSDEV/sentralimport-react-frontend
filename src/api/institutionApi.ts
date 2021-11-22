import { authenticatedApiRequest } from './api';
import { CRIST_REST_API } from '../utils/constants';
import { AxiosResponse } from 'axios';
import { Institution, InstitutionCountryInformation } from '../types/institutionTypes';
import { SearchLanguage } from './contributorApi';

export async function getInstitutions(): Promise<AxiosResponse<Institution[]>> {
  return authenticatedApiRequest({
    url: `${CRIST_REST_API}/institutions?cristin_institution=true&per_page=500&lang=nb,en`,
    method: 'GET',
  });
}

export async function getInstitutionsByCountryCodes(
  countryCode: string,
  searchLanguage: SearchLanguage
): Promise<AxiosResponse<InstitutionCountryInformation[]>> {
  return authenticatedApiRequest({
    url: encodeURI(`${CRIST_REST_API}/institutions/country/${countryCode}?lang=${searchLanguage}`),
    method: 'GET',
  });
}
