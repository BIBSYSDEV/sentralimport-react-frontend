import { authenticatedApiRequest } from './api';
import { CRIST_REST_API } from '../utils/constants';
import { AxiosResponse } from 'axios';
import { Institution, InstitutionCountryInformation, SimpleUnitResponse } from '../types/InstitutionTypes';
import { SearchLanguage } from './contributorApi';

const UIOInstitutionNumber = '185';

export async function getInstitutions(): Promise<AxiosResponse<Institution[]>> {
  return authenticatedApiRequest({
    url: `${CRIST_REST_API}/institutions?cristin_institution=true&per_page=500&lang=nb,en`,
    method: 'GET',
  });
}

export async function getCountryInformationByCountryCode(
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
  const parentUnitId =
    cristinInstitutionNr.toString() !== UIOInstitutionNumber
      ? `${cristinInstitutionNr}.0.0.0`
      : `${UIOInstitutionNumber}.90.0.0`;
  return authenticatedApiRequest({
    url: encodeURI(`${CRIST_REST_API}/units?parent_unit_id=${parentUnitId}&per_page=900&lang=en,nb`),
    method: 'GET',
  });
}

export async function searchForInstitutionsByName(
  institutionName: string,
  searchLanguage: SearchLanguage
): Promise<AxiosResponse<Institution[]>> {
  return authenticatedApiRequest({
    url: encodeURI(
      `${CRIST_REST_API}/institutions?cristin_institution=false&lang=${searchLanguage}&name=${institutionName}`
    ),
    method: 'GET',
  });
}
