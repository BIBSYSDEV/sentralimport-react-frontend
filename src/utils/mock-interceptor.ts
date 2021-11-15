import Axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { CRIST_REST_API, PIA_REST_API } from './constants';
import {
  mockAllCategories,
  mockAllJournals,
  mockImportPublication1,
  mockInstitutions,
  mockPerson,
  mockPersonDetailed,
  mockPublicationCount,
  mockSavedPublication,
  mockUnits,
  responseCountryInstitutionCN,
  responseCountryInstitutionIT,
  resultInstitutionNTNU,
} from './mockdata';

import mockImportData from './mockImportData.json';
import mockCristinPublications from './mockCristinPublications.json';
import mockCristinContributors from './mockCristinContributors.json';

export const mockDoiForEmptyCristinSearch = '123456789';
export const mockTitleForEmptyCristinSearch = 'this_is_a_mocked_title';

// AXIOS INTERCEPTOR
export const interceptRequestsOnMock = () => {
  const mock = new MockAdapter(Axios);

  mock
    .onGet(new RegExp(`${PIA_REST_API}/sentralimport/publications.*&doi=${mockImportPublication1.doi}.*`))
    .reply(200, [mockImportPublication1], {
      'x-total-count': 1,
    });

  //get imported
  mock.onGet(new RegExp(`${PIA_REST_API}/sentralimport/publications.*`)).reply(200, mockImportData, {
    'x-total-count': 100,
  });

  //get publication-count
  mock.onGet(new RegExp(`${PIA_REST_API}/sentralimport/publicationCount.*`)).reply(200, mockPublicationCount);

  //patching the publication
  mock.onPatch(new RegExp(`${PIA_REST_API}/sentralimport/publication.*`)).reply(200);

  //get cristin institutions by id
  mock.onGet(new RegExp(`${CRIST_REST_API}/institutions/([1-9][0-9]*).*`)).reply(200, resultInstitutionNTNU);
  //crisrest-utv.dataporten-api.no/institutions/7492?lang=en

  //get country institutions
  mock.onGet(new RegExp(`${CRIST_REST_API}/institutions/country/CN.*`)).reply(200, [responseCountryInstitutionCN]);
  mock.onGet(new RegExp(`${CRIST_REST_API}/institutions/country/IT.*`)).reply(200, [responseCountryInstitutionIT]);
  mock.onGet(new RegExp(`${CRIST_REST_API}/institutions/country/.*`)).reply(200, [responseCountryInstitutionIT]);
  //get cristin institutions
  mock.onGet(new RegExp(`${CRIST_REST_API}/institutions\\?cristin_institution=true.*`)).reply(200, mockInstitutions);

  //get institution units
  mock.onGet(new RegExp(`${CRIST_REST_API}/units/.*`)).reply(200, mockUnits);

  //save publication
  mock.onPost(new RegExp(`${CRIST_REST_API}/results`)).reply(200, mockSavedPublication);

  //get all categories
  mock.onGet(new RegExp(`${CRIST_REST_API}/results/categories.*`)).reply(200, mockAllCategories);

  //get all journals
  mock.onGet(new RegExp(`${CRIST_REST_API}/results/channels\\?type=journal&query=title.*`)).reply(200, mockAllJournals);

  //doi-search
  mock.onGet(new RegExp(`${CRIST_REST_API}/results\\?doi=${mockDoiForEmptyCristinSearch}`)).reply(200, []);
  mock.onGet(new RegExp(`${CRIST_REST_API}/results\\?doi.*`)).reply(200, mockCristinPublications);

  //search with error //TODO
  //supports this https://crisrest-utv.dataporten-api.no/results&per_page=5&category=ARTICLE&fields=all&lang=nb
  mock.onGet(new RegExp(`${CRIST_REST_API}/results&.*`)).reply(200, mockCristinPublications);

  //search for title
  mock.onGet(new RegExp(`${CRIST_REST_API}/results\\?title=${mockTitleForEmptyCristinSearch}.*`)).reply(200, []);
  mock.onGet(new RegExp(`${CRIST_REST_API}/results\\?title=.*`)).reply(200, mockCristinPublications);

  //get contributors for publication
  mock.onGet(new RegExp(`${CRIST_REST_API}/results/\\d+/contributors.*`)).reply(200, mockCristinContributors, {
    'x-total-count': 32,
  });

  //search with yearspan
  mock
    .onGet(new RegExp(`${CRIST_REST_API}/results\\?published_since=.*&published_before=.*&category=ARTICLE`))
    .reply(200, mockCristinPublications);

  //search persons by name
  mock.onGet(new RegExp(`${CRIST_REST_API}/persons/\\?name.*`)).reply(200, [mockPerson]);

  //get person-details by id
  mock.onGet(new RegExp(`${CRIST_REST_API}/persons/\\d+`)).reply(200, mockPersonDetailed);

  //search persons by id
  mock.onGet(new RegExp(`${CRIST_REST_API}/persons/\\?id.*`)).reply(200, [mockPerson]);

  mock.onAny().reply(function (config) {
    throw new Error('Could not find mock for ' + config.url + ', with method: ' + config.method);
  });
};
