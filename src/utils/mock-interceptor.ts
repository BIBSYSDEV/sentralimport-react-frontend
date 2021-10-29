import Axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { CRIST_REST_API, PIA_REST_API } from './constants';
import {
  mockAllCategories,
  mockAllJournals,
  mockCountryInstitutions,
  mockImportData,
  mockInstitutions,
  mockPerson,
  mockPersonDetailed,
  mockPublicationCount,
  mockSavedPublication,
} from './mockdata';

// AXIOS INTERCEPTOR
export const interceptRequestsOnMock = () => {
  const mock = new MockAdapter(Axios);

  //get imported
  mock.onGet(new RegExp(`${PIA_REST_API}/sentralimport/publications.*`)).reply(200, mockImportData, {
    'x-total-count': 100,
  });

  //get publication-count
  mock.onGet(new RegExp(`${PIA_REST_API}/sentralimport/publicationCount.*`)).reply(200, mockPublicationCount);

  //patching the publication
  mock.onPatch(new RegExp(`${PIA_REST_API}/sentralimport/publication.*`)).reply(200);

  //get cristin institutions
  mock.onGet(new RegExp(`${CRIST_REST_API}/institutions\\?cristin_institution=true.*`)).reply(200, mockInstitutions);

  //save publication
  mock.onPost(new RegExp(`${CRIST_REST_API}/results`)).reply(200, mockSavedPublication);

  //get all categories
  mock.onGet(new RegExp(`${CRIST_REST_API}/results/categories.*`)).reply(200, mockAllCategories);

  //get country institutions
  mock.onGet(new RegExp(`${CRIST_REST_API}/institutions/country/.*`)).reply(200, mockCountryInstitutions);

  //doi-search
  mock.onGet(new RegExp(`${CRIST_REST_API}/results\\?doi.*`)).reply(200, []);

  //get all journals
  mock.onGet(new RegExp(`${CRIST_REST_API}/results/channels\\?type=journal&query=title.*`)).reply(200, mockAllJournals);

  //search for title
  mock.onGet(new RegExp(`${CRIST_REST_API}/results\\?title=.*`)).reply(200, []);

  //search with yearspan
  mock
    .onGet(new RegExp(`${CRIST_REST_API}/results\\?published_since=.*&published_before=.*&category=ARTICLE`))
    .reply(200, []);

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
