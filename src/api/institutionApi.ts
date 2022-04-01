import { authenticatedApiRequest } from './api';
import { CRIST_REST_API } from '../utils/constants';
import axios, { AxiosPromise, AxiosResponse } from 'axios';
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

export async function searchForInstitutionsByNameAndCountry(
  institutionName: string,
  searchLanguage: SearchLanguage,
  countryCode: string
): Promise<AxiosResponse<Institution[]>> {
  return authenticatedApiRequest({
    url: encodeURI(
      `${CRIST_REST_API}/institutions?lang=${searchLanguage}&name=${institutionName}&country=${countryCode}`
    ),
    method: 'GET',
  });
}

export async function getInstitutionNameWithCache(
  institutionId: string | undefined,
  searchLanguage: SearchLanguage,
  cachedInstitutionResult: Map<string, string>
): Promise<{ institutionName: string; cachedInstitutionResult: Map<string, string> }> {
  if (!institutionId) return { institutionName: '', cachedInstitutionResult };
  if (institutionId === '0') return { institutionName: '', cachedInstitutionResult };
  if (cachedInstitutionResult.get(institutionId))
    return { institutionName: cachedInstitutionResult.get(institutionId) ?? '', cachedInstitutionResult };
  const institutionName = await getInstitutionName(institutionId, searchLanguage);
  cachedInstitutionResult.set(institutionId, institutionName);
  return {
    institutionName,
    cachedInstitutionResult: cachedInstitutionResult,
  };
}

export async function getInstitutionName(
  institutionId: string | undefined,
  searchLanguage: SearchLanguage
): Promise<string> {
  if (!institutionId || institutionId === '0') return '';
  try {
    const institution = await (authenticatedApiRequest({
      url: encodeURI(`${CRIST_REST_API}/institutions/${institutionId}?lang=${searchLanguage}`),
      method: 'GET',
    }) as AxiosPromise<Institution>);
    return institution.data.institution_name.en || institution.data.institution_name.nb;
  } catch (error) {
    if (axios.isAxiosError(error) && error.message === 'Network Error') {
      return `NAVN IKKE FUNNET FOR KODE: ${institutionId}`;
    } else throw error;
  }
}
