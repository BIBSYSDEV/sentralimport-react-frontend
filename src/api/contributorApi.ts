import { AxiosPromise, AxiosResponse } from 'axios';
import { CRIST_REST_API } from '../utils/constants';
import { authenticatedApiRequest } from './api';
import { Institution, UnitResponse } from '../types/institutionTypes';
import { AffiliationResponse, PersonDetailResponse, PersonSearchResponse } from '../types/contributorTypes';

export enum SearchLanguage {
  Eng = 'en',
  No = 'no',
}

export async function getInstitutionName(
  institutionId: string | undefined,
  searchLanguage: SearchLanguage,
  cachedInstitutionResult: Map<string, string>
): Promise<{ institutionName: string; cachedInstitutionResult: Map<string, string> }> {
  if (!institutionId) return { institutionName: '', cachedInstitutionResult };
  if (institutionId === '0') return { institutionName: '', cachedInstitutionResult };
  if (cachedInstitutionResult.get(institutionId))
    return { institutionName: cachedInstitutionResult.get(institutionId) ?? '', cachedInstitutionResult };
  const institution = await (authenticatedApiRequest({
    url: encodeURI(`${CRIST_REST_API}/institutions/${institutionId}?lang=${searchLanguage}`),
    method: 'GET',
  }) as AxiosPromise<Institution>);
  const institutionName = institution.data.institution_name.en || institution.data.institution_name.nb;
  cachedInstitutionResult.set(institutionId, institutionName);
  return {
    institutionName,
    cachedInstitutionResult: cachedInstitutionResult,
  };
}

export async function getInstitutionUnitName(
  institutionUnitId: string,
  searchLanguage: SearchLanguage,
  cachedUnitResult: Map<string, string>
): Promise<{ unitName: string; cachedUnitResult: Map<string, string> }> {
  console.log('institutionUnitId', institutionUnitId);
  if (institutionUnitId === '0') return { unitName: '', cachedUnitResult };
  let unitName = '';
  try {
    const unit = await (authenticatedApiRequest({
      url: encodeURI(`${CRIST_REST_API}/units/${institutionUnitId}?lang=${searchLanguage}`),
      method: 'GET',
    }) as AxiosPromise<UnitResponse>);
    unitName = unit.data.unit_name.en || unit.data.unit_name.nb;
  } catch (error) {
    unitName = `Fant ikke ${institutionUnitId}`;
  } finally {
    cachedUnitResult.set(institutionUnitId, unitName);
  }
  return { unitName, cachedUnitResult: cachedUnitResult };
}

export async function getInstitutionUnitNameBasedOnIDAndInstitutionStatus(
  affiliation: AffiliationResponse,
  cache: Map<string, string>
): Promise<{ unitName: string; cache: Map<string, string> }> {
  if (affiliation.unit && cache.get(affiliation.unit?.cristin_unit_id ?? ''))
    return { unitName: cache.get(affiliation.unit?.cristin_unit_id ?? '') ?? '', cache };
  if (!affiliation.active && affiliation.unit?.cristin_unit_id) {
    cache.set(affiliation.unit.cristin_unit_id, `${affiliation.unit.cristin_unit_id} er ikke lengre aktiv`);
    return { unitName: `${affiliation.unit.cristin_unit_id} er ikke lengre aktiv`, cache };
  }
  const unitNameWithCache = await getInstitutionUnitName(
    affiliation.unit?.cristin_unit_id ?? '0',
    SearchLanguage.Eng,
    cache
  );
  return {
    unitName: unitNameWithCache.unitName,
    cache: unitNameWithCache.cachedUnitResult,
  };
}

export async function getPersonDetailById(personId: number): Promise<AxiosResponse<PersonDetailResponse>> {
  return authenticatedApiRequest({
    url: encodeURI(`${CRIST_REST_API}/persons/${personId}`),
  }) as AxiosPromise<PersonDetailResponse>;
}

export async function searchPersonDetailByName(name: string): Promise<AxiosResponse<PersonSearchResponse[]>> {
  return authenticatedApiRequest({
    url: encodeURI(`${CRIST_REST_API}/persons/?name=${name}`),
  }) as AxiosPromise<PersonSearchResponse[]>;
}

export async function searchPersonDetailById(personId: number) {
  return authenticatedApiRequest({
    url: encodeURI(`${CRIST_REST_API}/persons/?id=${personId}`),
  }) as AxiosPromise<PersonSearchResponse[]>;
}
