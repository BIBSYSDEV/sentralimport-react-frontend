import Axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { CRIST_REST_API, PIA_REST_API } from './constants';
import {
  cristinIDWithoutActiveAffiliation,
  cristinIDWithoutActiveAffiliation2,
  mockAllCategories,
  mockAllJournals,
  mockCristinIdForbiddenPerson,
  mockCristinIDWithoutAffiliationAttribute,
  mockCristinPersonNotFound,
  mockCristinPersonNotFoundResponse,
  mockCristinPublicationWithDoi,
  mockDoiForMonsterPublication,
  mockDoiForPublicationWithoutDoi,
  mockForbiddenPerson,
  mockImportPublication1,
  mockImportPublicationWithoutDoi,
  mockInstitutions,
  mockInstitutionSearchByName,
  mockIssnChannel,
  mockNotAuthorizedForThisPersonDetailResponse,
  mockPerson,
  mockPerson5,
  mockPerson6,
  mockPersonDetailed,
  mockPersonDetailed5,
  mockPersonDetailed6,
  mockPersonDetailed7,
  mockPersonDetailedDuplicate,
  mockPersonDetailedWithoutActiveAffiliations,
  mockPersonDetailedWithoutActiveAffiliations2,
  mockPersonDetailedWithoutAffiliationAttribute,
  mockPersonWithoutActiveAffiliation,
  mockPersonWithoutAffiliationAttribute,
  mockPublicationCount,
  mockSavedPublication,
  mockSaveErrorResponse,
  mockSearchTitleForCristinPubWithDoi,
  mockSimpleUnitResponse,
  mockTitleForEmptyCristinSearch,
  mockUnits,
  responseCountryInstitutionCN,
  responseCountryInstitutionIT,
  resultInstitutionNTNU,
} from './mockdata';

import mockImportData from './mockImportData.json';
import mockMonsterImportPost from './mockMonsterImportPost.json';
import mockCristinPublications from './mockCristinPublications.json';
import mockCristinContributors from './mockCristinContributors.json';
import { PostPublication } from '../types/PublicationTypes';

// AXIOS INTERCEPTOR
export const interceptRequestsOnMock = () => {
  const mock = new MockAdapter(Axios);

  //get imported by doi
  const urlSearchParams1 = new URLSearchParams(); //use URLSearchParams because doi needs encoding
  urlSearchParams1.set('doi', mockDoiForPublicationWithoutDoi);
  mock
    .onGet(new RegExp(`${PIA_REST_API}/sentralimport/publications.*${urlSearchParams1.toString()}.*`))
    .reply(200, [mockImportPublicationWithoutDoi], {
      'x-total-count': 1,
    });

  const urlSearchParams2 = new URLSearchParams();
  urlSearchParams2.set('doi', mockImportPublication1.doi);
  mock
    .onGet(new RegExp(`${PIA_REST_API}/sentralimport/publications.*${urlSearchParams2.toString()}.*`))
    .reply(200, [mockImportPublication1], {
      'x-total-count': 1,
    });

  const urlSearchParams3 = new URLSearchParams();
  urlSearchParams3.set('doi', mockDoiForMonsterPublication);
  mock
    .onGet(new RegExp(`${PIA_REST_API}/sentralimport/publications.*${urlSearchParams3.toString()}.*`))
    .reply(200, [mockMonsterImportPost], {
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
  //mock.onGet(new RegExp(`${CRIST_REST_API}/institutions/1234567.*`)).networkError();

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
  mock.onGet(new RegExp(`${CRIST_REST_API}/units\\?parent_unit_id=6228`)).reply(200, []);
  mock.onGet(new RegExp(`${CRIST_REST_API}/units\\?parent_unit_id=.*`)).reply(200, mockSimpleUnitResponse);
  mock.onGet(new RegExp(`${CRIST_REST_API}/units/.*`)).reply(200, mockUnits);

  //save publication
  mock
    .onPost(new RegExp(`${CRIST_REST_API}/results`), {
      asymmetricMatch: (actual: PostPublication) => actual.pub_id === mockImportData[6].pubId,
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
  mock.onGet(new RegExp(`${CRIST_REST_API}/results/channels\\?type=journal&query=issn:1234-1234`)).reply(200, {});
  mock.onGet(new RegExp(`${CRIST_REST_API}/results/channels\\?type=journal&query=issn.*`)).reply(200, mockIssnChannel);

  //doi-search
  mock.onGet(new RegExp(`${CRIST_REST_API}/results.*doi=.*`)).reply(200, [], {
    'x-total-count': 0,
  });

  mock.onGet(new RegExp(`${CRIST_REST_API}/results&.*`)).reply(200, mockCristinPublications);

  //search for title
  mock.onGet(new RegExp(`${CRIST_REST_API}/results.*title=${mockTitleForEmptyCristinSearch}.*`)).reply(200, [], {
    'x-total-count': 0,
  });
  mock
    .onGet(new RegExp(`${CRIST_REST_API}/results.*title=${mockSearchTitleForCristinPubWithDoi}.*`))
    .reply(200, [mockCristinPublicationWithDoi], {
      'x-total-count': 1,
    });

  mock.onGet(new RegExp(`${CRIST_REST_API}/results.*title=.*`)).reply(200, mockCristinPublications, {
    'x-total-count': 2,
  });

  //get contributors for publication
  mock.onGet(new RegExp(`${CRIST_REST_API}/results/\\d+/contributors.*`)).reply(200, mockCristinContributors, {
    'x-total-count': 2,
  });

  //search with yearspan
  mock
    .onGet(new RegExp(`${CRIST_REST_API}/results.*published_since=.*&published_before=.*&category=ARTICLE`))
    .reply(200, mockCristinPublications, {
      'x-total-count': 32,
    });

  //search persons by name
  mock
    .onGet(new RegExp(`${CRIST_REST_API}/persons/\\?name=Mockfirstname.*`))
    .reply(
      200,
      [
        mockPerson,
        mockPersonWithoutActiveAffiliation,
        mockPersonWithoutAffiliationAttribute,
        mockForbiddenPerson,
        mockPerson5,
        mockPerson6,
      ],
      {
        'x-total-count': 6,
      }
    );

  mock.onGet(new RegExp(`${CRIST_REST_API}/persons/\\?name=${mockPersonDetailed7.first_name}*.`)).reply(200, [], {
    'x-total-count': 0,
  });

  mock
    .onGet(new RegExp(`${CRIST_REST_API}/persons/\\?name.*`))
    .reply(
      200,
      [mockPerson, mockPersonWithoutActiveAffiliation, mockPersonWithoutAffiliationAttribute, mockForbiddenPerson],
      {
        'x-total-count': 4,
      }
    );

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
    .onGet(new RegExp(`${CRIST_REST_API}/persons/${cristinIDWithoutActiveAffiliation2}`))
    .reply(200, mockPersonDetailedWithoutActiveAffiliations2);
  mock
    .onGet(new RegExp(`${CRIST_REST_API}/persons/${mockCristinIDWithoutAffiliationAttribute}`))
    .reply(200, mockPersonDetailedWithoutAffiliationAttribute);
  mock
    .onGet(new RegExp(`${CRIST_REST_API}/persons/${mockPersonDetailed5.cristin_person_id}`))
    .reply(200, mockPersonDetailed5);

  mock
    .onGet(new RegExp(`${CRIST_REST_API}/persons/${mockPersonDetailed7.cristin_person_id}`))
    .reply(200, mockPersonDetailed7);

  mock
    .onGet(new RegExp(`${CRIST_REST_API}/persons/${mockPersonDetailed6.cristin_person_id}`))
    .reply(200, mockPersonDetailed6);
  mock.onGet(new RegExp(`${CRIST_REST_API}/persons/666666`)).reply(200, mockPersonDetailedDuplicate);
  mock.onGet(new RegExp(`${CRIST_REST_API}/persons/\\d+`)).reply(200, mockPersonDetailed);

  //search persons by id
  mock.onGet(new RegExp(`${CRIST_REST_API}/persons/\\?id.*`)).reply(200, [mockPerson]);

  mock.onAny().reply(function (config) {
    throw new Error('Could not find mock for ' + config.url + ', with method: ' + config.method);
  });
};
