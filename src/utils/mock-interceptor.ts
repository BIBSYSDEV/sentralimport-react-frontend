import Axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { CRIST_REST_API, PIA_REST_API } from './constants';
import {
  mockCristinIdForbiddenPerson,
  cristinIDWithoutActiveAffiliation,
  mockCristinIDWithoutAffiliationAttribute,
  mockAllCategories,
  mockAllJournals,
  mockCristinPersonNotFoundResponse,
  mockForbiddenPerson,
  mockImportPublication1,
  mockInstitutions,
  mockIssnChannel,
  mockNotAuthorizedForThisPersonDetailResponse,
  mockPerson,
  mockPersonDetailed,
  mockPersonDetailedWithoutActiveAffiliations,
  mockPersonDetailedWithoutAffiliationAttribute,
  mockPersonWithoutActiveAffiliation,
  mockPersonWithoutAffiliationAttribute,
  mockPublicationCount,
  mockSavedPublication,
  mockSaveErrorResponse,
  mockSimpleUnitResponse,
  mockUnits,
  responseCountryInstitutionCN,
  responseCountryInstitutionIT,
  resultInstitutionNTNU,
  mockDoiForEmptyCristinSearch,
  mockTitleForEmptyCristinSearch,
  mockCristinPersonNotFound,
  mockInstitutionSearchByName,
} from './mockdata';

import mockImportData from './mockImportData.json';
import mockCristinPublications from './mockCristinPublications.json';
import mockCristinContributors from './mockCristinContributors.json';
import { PostPublication } from '../types/PublicationTypes';

// AXIOS INTERCEPTOR
export const interceptRequestsOnMock = () => {
  const urlSearchParams = new URLSearchParams();
  urlSearchParams.set('doi', mockImportPublication1.doi);
  const mock = new MockAdapter(Axios);

  mock
    .onGet(new RegExp(`${PIA_REST_API}/sentralimport/publications.*${urlSearchParams.toString()}.*`))
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
  mock.onPatch(new RegExp(`${PIA_REST_API}/sentralimport/publication.*`)).reply(204);

  //get cristin institutions by id
  mock.onGet(new RegExp(`${CRIST_REST_API}/institutions/([1-9][0-9]*).*`)).reply(200, resultInstitutionNTNU);
  //crisrest-utv.dataporten-api.no/institutions/7492?lang=en

  //get institution by name
  mock
    .onGet(new RegExp(`${CRIST_REST_API}/institutions\\?cristin_institution=false&lang=en&name.*`))
    .reply(200, mockInstitutionSearchByName);

  //get country institutions
  mock.onGet(new RegExp(`${CRIST_REST_API}/institutions/country/CN.*`)).reply(200, [responseCountryInstitutionCN]);
  mock.onGet(new RegExp(`${CRIST_REST_API}/institutions/country/IT.*`)).reply(200, [responseCountryInstitutionIT]);
  mock.onGet(new RegExp(`${CRIST_REST_API}/institutions/country/.*`)).reply(200, [responseCountryInstitutionIT]);
  //get cristin institutions
  mock.onGet(new RegExp(`${CRIST_REST_API}/institutions\\?cristin_institution=true.*`)).reply(200, mockInstitutions);

  //get institution units
  mock.onGet(new RegExp(`${CRIST_REST_API}/units/.*`)).reply(200, mockUnits);
  mock.onGet(new RegExp(`${CRIST_REST_API}/units\\?parent_unit_id=.*`)).reply(200, mockSimpleUnitResponse);

  //save publication
  mock
    .onPost(new RegExp(`${CRIST_REST_API}/results`), {
      asymmetricMatch: (actual: PostPublication) => actual.pub_id === mockImportData[1].pubId,
    })
    .reply(400, mockSaveErrorResponse);
  mock.onPost(new RegExp(`${CRIST_REST_API}/results`)).reply(200, mockSavedPublication);

  //update publication
  mock.onPatch(new RegExp(`${CRIST_REST_API}/results`)).reply(200, mockSavedPublication);

  //get all categories
  mock.onGet(new RegExp(`${CRIST_REST_API}/results/categories.*`)).reply(200, mockAllCategories);

  //get all journals
  mock.onGet(new RegExp(`${CRIST_REST_API}/results/channels\\?type=journal&query=title.*`)).reply(200, mockAllJournals);

  //Get journal for issn
  mock.onGet(new RegExp(`${CRIST_REST_API}/results/channels\\?type=journal&query=issn.*`)).reply(200, mockIssnChannel);

  //doi-search
  mock
    .onGet(new RegExp(`${CRIST_REST_API}/results.*doi=${mockImportData[0].doi}`))
    .reply(200, [mockCristinPublications[0]], {
      'x-total-count': 1,
    });
  mock.onGet(new RegExp(`${CRIST_REST_API}/results.*doi=${mockDoiForEmptyCristinSearch}`)).reply(200, [], {
    'x-total-count': 0,
  });
  mock.onGet(new RegExp(`${CRIST_REST_API}/results.*doi=.*`)).reply(200, mockCristinPublications, {
    'x-total-count': 999,
  });

  mock.onGet(new RegExp(`${CRIST_REST_API}/results&.*`)).reply(200, mockCristinPublications);

  //search for title
  mock.onGet(new RegExp(`${CRIST_REST_API}/results.*title=${mockTitleForEmptyCristinSearch}.*`)).reply(200, [], {
    'x-total-count': 0,
  });
  mock.onGet(new RegExp(`${CRIST_REST_API}/results.*title=.*`)).reply(200, mockCristinPublications, {
    'x-total-count': 32,
  });

  //get contributors for publication
  mock.onGet(new RegExp(`${CRIST_REST_API}/results/\\d+/contributors.*`)).reply(200, mockCristinContributors, {
    'x-total-count': 32,
  });

  //search with yearspan
  mock
    .onGet(new RegExp(`${CRIST_REST_API}/results.*published_since=.*&published_before=.*&category=ARTICLE`))
    .reply(200, mockCristinPublications, {
      'x-total-count': 32,
    });

  //search persons by name
  mock
    .onGet(new RegExp(`${CRIST_REST_API}/persons/\\?name.*`))
    .reply(200, [
      mockPerson,
      mockPersonWithoutActiveAffiliation,
      mockPersonWithoutAffiliationAttribute,
      mockForbiddenPerson,
    ]);

  //get person-details by id
  mock
    .onGet(new RegExp(`${CRIST_REST_API}/persons/${mockCristinIdForbiddenPerson}`))
    .reply(403, mockNotAuthorizedForThisPersonDetailResponse);
  mock
    .onGet(new RegExp(`${CRIST_REST_API}/persons/${mockCristinPersonNotFound}`))
    .reply(404, mockCristinPersonNotFoundResponse);
  mock
    .onGet(new RegExp(`${CRIST_REST_API}/persons/${cristinIDWithoutActiveAffiliation}`))
    .reply(200, mockPersonDetailedWithoutActiveAffiliations);
  mock
    .onGet(new RegExp(`${CRIST_REST_API}/persons/${mockCristinIDWithoutAffiliationAttribute}`))
    .reply(200, mockPersonDetailedWithoutAffiliationAttribute);
  mock.onGet(new RegExp(`${CRIST_REST_API}/persons/\\d+`)).reply(200, mockPersonDetailed);

  //search persons by id
  mock.onGet(new RegExp(`${CRIST_REST_API}/persons/\\?id.*`)).reply(200, [mockPerson]);

  mock.onAny().reply(function (config) {
    throw new Error('Could not find mock for ' + config.url + ', with method: ' + config.method);
  });
};
