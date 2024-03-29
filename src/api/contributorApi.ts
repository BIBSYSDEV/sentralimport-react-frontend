import axios, { AxiosPromise, AxiosResponse } from 'axios';
import { CRIST_REST_API, PIA_REST_API } from '../utils/constants';
import { authenticatedApiRequest, handlePotentialExpiredSession } from './api';
import { Affiliation, UnitResponse } from '../types/InstitutionTypes';
import { ContributorPiaIdUpdate, ContributorStatus, ContributorType } from '../types/ContributorTypes';

export enum SearchLanguage {
  En = 'en',
  Nb = 'nb',
}

export const ForbiddenPersonErrorMessage = 'Client lacks authorization.';

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
    handlePotentialExpiredSession(error);
    unitName = `Fant ikke ${institutionUnitId}`;
  } finally {
    cachedUnitResult.set(institutionUnitId, unitName);
  }
  return { unitName, cachedUnitResult: cachedUnitResult };
}

export async function getInstitutionUnitNameBasedOnIDAndInstitutionStatus(
  affiliation: Affiliation,
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

export async function getPersonDetailById(person: ContributorType): Promise<ContributorType> {
  try {
    const personDetailResponse = (await authenticatedApiRequest({
      url: encodeURI(`${CRIST_REST_API}/persons/${person.cristin_person_id}`),
    })) as AxiosResponse<ContributorType>;
    return personDetailResponse.data;
  } catch (error) {
    //Intentionally ignore persons that return forbidden error. See jira task SMILE-1142 for details.
    //It seems regular forbidden users receive error.response.data.errors[0]: 'User dataporten-piarest does not have role PIAREST_CAN_GET'
    if (axios.isAxiosError(error) && error.response && error.response.status === 403) {
      const axiosErrorResponse: any = error.response;
      if (axiosErrorResponse.data.errors[0] === ForbiddenPersonErrorMessage) {
        return {
          cristin_person_id: person.cristin_person_id,
          first_name: person.first_name,
          surname: person.surname,
          identified_cristin_person: true,
          require_higher_authorization: true,
          badge_type: ContributorStatus.Unknown,
        };
      }
    }
    //hvis man har en cristinId allerede og søker på det, kan man få tilbake persondata med tom cristinId
    if (axios.isAxiosError(error) && error.response && error.response.status === 404) {
      return {
        cristin_person_id: 0,
        first_name: person.first_name,
        surname: person.surname,
        badge_type: ContributorStatus.Verified,
      };
    }
    throw error;
  }
}

export async function searchPersonDetailByName(name: string): Promise<AxiosResponse<ContributorType[]>> {
  return authenticatedApiRequest({
    url: encodeURI(`${CRIST_REST_API}/persons/?name=${name}&per_page=20`),
  }) as AxiosPromise<ContributorType[]>;
}

export async function searchPersonDetailById(personId: number) {
  return authenticatedApiRequest({
    url: encodeURI(`${CRIST_REST_API}/persons/?id=${personId}`),
  }) as AxiosPromise<ContributorType[]>;
}

export async function getContributorsByPublicationCristinResultId(
  publicationResultCristinId: string,
  page: number,
  resultsPerPage: number,
  searchLanguage: SearchLanguage
): Promise<AxiosResponse<ContributorType[]>> {
  return authenticatedApiRequest({
    url: encodeURI(
      `${CRIST_REST_API}/results/${publicationResultCristinId}/contributors?page=${page}&per_page=${resultsPerPage}&lang=${searchLanguage}`
    ),
    method: 'GET',
  });
}

export async function updateCristinIdAndExternalIdToPia(contributors: ContributorPiaIdUpdate[]) {
  return authenticatedApiRequest({
    url: encodeURI(`${PIA_REST_API}/sentralimport/authors`),
    method: 'POST',
    data: contributors,
  });
}
