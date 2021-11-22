import axios, { AxiosPromise, AxiosResponse } from 'axios';
import { CRIST_REST_API } from '../utils/constants';
import { authenticatedApiRequest } from './api';
import { Institution, UnitResponse } from '../types/institutionTypes';
import { mockNotAuthorizedForThisPersonDetail } from '../utils/mockdata';
import {
  AffiliationResponse,
  PersonDetailResponse,
  PersonSearchResponse,
  PublicationContributor,
} from '../types/contributorTypes';

export enum SearchLanguage {
  En = 'en',
  Nb = 'nb',
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
  if (institutionUnitId === '0') return { unitName: '', cachedUnitResult };
  let unitName = '';
  try {
    const unit = await (authenticatedApiRequest({
      url: encodeURI(`${CRIST_REST_API}/units/${institutionUnitId}?lang=${searchLanguage}`),
      method: 'GET',
    }) as AxiosPromise<UnitResponse>);
    unitName =
      searchLanguage === SearchLanguage.En ? unit.data.unit_name.en || unit.data.unit_name.nb : unit.data.unit_name.nb;
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

  const unitNameWithCache = await getInstitutionUnitName(
    affiliation.unit?.cristin_unit_id ?? '0',
    SearchLanguage.En,
    cache
  );
  return {
    unitName: unitNameWithCache.unitName,
    cache: unitNameWithCache.cachedUnitResult,
  };
}

export async function getPersonDetailById(person: PersonSearchResponse): Promise<PersonDetailResponse> {
  try {
    const personDetailResponse = (await authenticatedApiRequest({
      url: encodeURI(`${CRIST_REST_API}/persons/${person.cristin_person_id ?? person}`),
    })) as AxiosResponse<PersonDetailResponse>;
    return personDetailResponse.data;
  } catch (error) {
    //Intentionally ignore persons that return forbidden error. See jira task SMILE-1142 for details.
    //It seems regular forbidden users receive error.response.data.errors[0]: 'User dataporten-piarest does not have role PIAREST_CAN_GET'
    if (
      axios.isAxiosError(error) &&
      error.response &&
      error.response.status === 403 &&
      error.response.data.errors[0] === mockNotAuthorizedForThisPersonDetail.errors[0]
    ) {
      return {
        cristinId: person.cristin_person_id,
        cristin_person_id: person.cristin_person_id,
        first_name: person.first_name,
        surname: person.surname,
        identified_cristin_person: true,
        require_higher_authorization: true,
      };
    }
    throw error;
  }
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

export async function getContributorsByPublicationCristinResultId(
  publicationResultCristinId: string,
  page: number,
  resultsPerPage: number,
  searchLanguage: SearchLanguage
): Promise<AxiosResponse<PublicationContributor[]>> {
  return authenticatedApiRequest({
    url: encodeURI(
      `${CRIST_REST_API}/results/${publicationResultCristinId}/contributors?page=${page}&per_page=${resultsPerPage}&lang=${searchLanguage}`
    ),
    method: 'GET',
  });
}
