import { authenticatedApiRequest } from './api';
import { CRIST_REST_API } from '../utils/constants';
import { AxiosResponse } from 'axios';
import { Institution, InstitutionCountryInformation, SimpleUnitResponse } from '../types/InstitutionTypes';
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

export async function getParentsUnitName(
  cristinInstitutionNr: string | number
): Promise<AxiosResponse<SimpleUnitResponse[]>> {
  return authenticatedApiRequest({
    url: encodeURI(`${CRIST_REST_API}/units?parent_unit_id=${cristinInstitutionNr}.0.0.0&per_page=900&lang=en,nb`),
    method: 'GET',
  });
}

export async function searchForInstitutionsByName(
  institutionName: string,
  searchLanguage: SearchLanguage
): Promise<
  AxiosResponse<{ acronym: string; cristin_institution_id: string; institution_name: { en?: string; nb: string } }[]>
> {
  return authenticatedApiRequest({
    url: encodeURI(
      `${CRIST_REST_API}/institutions?cristin_institution=false&lang=${searchLanguage}&name=${institutionName}`
    ),
    method: 'GET',
  });
}
