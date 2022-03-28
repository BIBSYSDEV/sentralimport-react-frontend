import { ChannelLight } from '../types/PublicationTypes';

export const mockInstitutions = [
  {
    cristin_institution_id: '5737',
    institution_name: {
      nb: 'Kreftregisteret - Institutt for populasjonsbasert kreftforskning',
      en: 'The Cancer Registry of Norway',
    },
    acronym: 'KREFTREG',
    country: 'NO',
    cristin_user_institution: true,
    url: 'https://api.cristin-test.uio.no/v2/institutions/5737',
  },
  {
    cristin_institution_id: '6228',
    institution_name: {
      nb: 'SINTEF Narvik',
      en: 'SINTEF Narvik',
    },
    acronym: 'SINTEF-NAR',
    country: 'NO',
    cristin_user_institution: true,
    url: 'https://api.cristin-test.uio.no/v2/institutions/6228',
  },
  {
    cristin_institution_id: '6281',
    institution_name: {
      nb: 'Valnesfjord Helsesportssenter',
      en: 'Valnesfjord Health Sport Center',
    },
    acronym: 'VHSS',
    country: 'NO',
    cristin_user_institution: true,
    url: 'https://api.cristin-test.uio.no/v2/institutions/6281',
  },
  {
    cristin_institution_id: '5931',
    institution_name: {
      nb: 'Nasjonalbiblioteket',
      en: 'The National Library of Norway',
    },
    acronym: 'NB',
    country: 'NO',
    cristin_user_institution: true,
    url: 'https://api.cristin-test.uio.no/v2/institutions/5931',
  },
  {
    cristin_institution_id: '5932',
    institution_name: {
      nb: 'Statistisk sentralbyrå',
      en: 'Statistics Norway',
    },
    acronym: 'SSB',
    country: 'NO',
    cristin_user_institution: true,
    url: 'https://api.cristin-test.uio.no/v2/institutions/5932',
  },
  {
    cristin_institution_id: '7403',
    institution_name: {
      nb: 'NTNU Samfunnsforskning AS',
      en: 'NTNU Social Research',
    },
    acronym: 'SAMFORSK',
    country: 'NO',
    cristin_user_institution: true,
    url: 'https://api.cristin.no/v2/institutions/7403',
  },
  {
    cristin_institution_id: '194',
    institution_name: {
      nb: 'Norges teknisk-naturvitenskapelige universitet',
      en: 'Norwegian University of Science and Technology',
    },
    acronym: 'NTNU',
    country: 'NO',
    cristin_user_institution: true,
    url: 'https://api.cristin.no/v2/institutions/194',
  },
  {
    cristin_institution_id: '3331',
    institution_name: {
      nb: 'ZZ-Denne institusjonen har kun norsk navn',
    },
    acronym: 'DIHKNN',
    country: 'NO',
    cristin_user_institution: true,
    url: 'https://api.cristin.no/v2/institutions/3331',
  },
];

export const resultInstitutionNTNU = {
  cristin_institution_id: '194',
  institution_name: {
    en: 'Norwegian University of Science and Technology',
  },
  acronym: 'NTNU',
  country: 'NO',
  cristin_user_institution: true,
  corresponding_unit: {
    cristin_unit_id: '194.0.0.0',
    url: 'https://api.cristin.no/v2/units/194.0.0.0',
  },
};

export const mockUnits = {
  cristin_unit_id: '194.67.40.0',
  unit_name: {
    en: 'Department of Psychology',
  },
  institution: {
    cristin_institution_id: '194',
    url: 'https://api.cristin.no/v2/institutions/194',
  },
  parent_unit: {
    cristin_unit_id: '194.67.0.0',
    unit_name: {
      en: 'Faculty of Social and Educational Sciences',
    },
    url: 'https://api.cristin.no/v2/units/194.67.0.0',
  },
  parent_units: [
    {
      cristin_unit_id: '194.0.0.0',
      unit_name: {
        en: 'Norwegian University of Science and Technology',
      },
      url: 'https://api.cristin.no/v2/units/194.0.0.0',
    },
    {
      cristin_unit_id: '194.67.0.0',
      unit_name: {
        en: 'Faculty of Social and Educational Sciences',
      },
      url: 'https://api.cristin.no/v2/units/194.67.0.0',
    },
  ],
};

export const mockImportPublication1 = {
  pubId: 591850,
  category: 'ARTICLE',
  categoryName: 'Vitenskapelig artikkel',
  registered: 'Oct 29, 2021',
  doi: '10.1038/s41467-021-25510-w',
  sourceName: 'Scopus',
  sourceCode: 'SCOPUS',
  externalId: '2-s2.0-85115431109',
  yearPublished: 2021,
  authors: [
    {
      cristinId: 0,
      roleCode: 'FORFATTER',
      sequenceNr: 1,
      surname: 'Capriolo',
      firstname: 'Manfredo',
      authorName: 'Capriolo M.',
      institutions: [
        {
          unitName: 'Department of Geosciences;University of Padova',
          countryCode: 'IT',
          institutionName: 'University of Padova',
          cristinInstitutionNr: 12300052,
          isCristinInstitution: false,
        },
        {
          unitName: 'Centre for Earth Evolution and Dynamics;University of Oslo',
          countryCode: 'NO',
          institutionName: 'University of Oslo',
          acronym: 'UiO',
          cristinInstitutionNr: 185,
          isCristinInstitution: true,
        },
      ],
    },
    {
      cristinId: 0,
      roleCode: 'FORFATTER',
      sequenceNr: 2,
      surname: 'Marzoli',
      firstname: 'Andrea',
      authorName: 'Marzoli A.',
      institutions: [
        {
          unitName: 'Department of Territory and Agro-Forestry Systems;University of Padova',
          countryCode: 'IT',
          institutionName: 'University of Padova',
          cristinInstitutionNr: 12300052,
          isCristinInstitution: false,
        },
      ],
    },
    {
      cristinId: 0,
      roleCode: 'FORFATTER',
      sequenceNr: 3,
      surname: 'Aradi',
      firstname: 'László E.',
      authorName: 'Aradi L.E.',
      institutions: [
        {
          unitName:
            'Lithosphere Fluid Research Lab;Research and Industrial Relations Center;Faculty of Science;Eötvös Loránd University',
          countryCode: 'HU',
          institutionName: 'Eötvös Loránd University',
          cristinInstitutionNr: 15200015,
          isCristinInstitution: false,
        },
      ],
    },
    {
      cristinId: 0,
      roleCode: 'FORFATTER',
      sequenceNr: 4,
      surname: 'Ackerson',
      firstname: 'Michael R.',
      authorName: 'Ackerson M.R.',
      institutions: [
        {
          unitName: 'Department of Mineral Sciences;National Museum of Natural History;Smithsonian Institution',
          countryCode: 'US',
          institutionName: 'Smithsonian Institution',
          cristinInstitutionNr: 9126,
          isCristinInstitution: false,
        },
      ],
    },
    {
      cristinId: 0,
      roleCode: 'FORFATTER',
      sequenceNr: 5,
      surname: 'Bartoli',
      firstname: 'Omar',
      authorName: 'Bartoli O.',
      institutions: [
        {
          unitName: 'Department of Geosciences;University of Padova',
          countryCode: 'IT',
          institutionName: 'University of Padova',
          cristinInstitutionNr: 12300052,
          isCristinInstitution: false,
        },
      ],
    },
    {
      cristinId: 0,
      roleCode: 'FORFATTER',
      sequenceNr: 6,
      surname: 'Callegaro',
      firstname: 'Sara',
      authorName: 'Callegaro S.',
      institutions: [
        {
          unitName: 'Centre for Earth Evolution and Dynamics;University of Oslo',
          countryCode: 'NO',
          institutionName: 'University of Oslo',
          acronym: 'UiO',
          cristinInstitutionNr: 185,
          isCristinInstitution: true,
        },
      ],
    },
    {
      cristinId: 0,
      roleCode: 'FORFATTER',
      sequenceNr: 7,
      surname: 'Dal Corso',
      firstname: 'Jacopo',
      authorName: 'Dal Corso J.',
      institutions: [
        {
          unitName: 'State Key Laboratory of Biogeology and Environmental Geology;China University of Geosciences',
          countryCode: 'CN',
          institutionName: 'China University of Geosciences',
          cristinInstitutionNr: 48400110,
          isCristinInstitution: false,
        },
      ],
    },
    {
      cristinId: 0,
      roleCode: 'FORFATTER',
      sequenceNr: 8,
      surname: 'Ernesto',
      firstname: 'Marcia',
      authorName: 'Ernesto M.',
      institutions: [
        {
          unitName:
            'Department of Geophysics;Institute of Astronomy;Geophysics and Atmospheric Sciences;University of São Paulo',
          countryCode: 'BR',
          institutionName: 'University of São Paulo',
          cristinInstitutionNr: 71501162,
          isCristinInstitution: false,
        },
      ],
    },
    {
      cristinId: 0,
      roleCode: 'FORFATTER',
      sequenceNr: 9,
      surname: 'Gouvêa Vasconcellos',
      firstname: 'Eleonora M.',
      authorName: 'Gouvea Vasconcellos E.M.',
      institutions: [
        {
          unitName: 'Geology Postgraduate Program of the Federal University of Paraná',
          countryCode: 'BR',
          institutionName: 'Geology Postgraduate Program of the Federal University of Paraná',
          cristinInstitutionNr: 71501102,
          isCristinInstitution: false,
        },
      ],
    },
    {
      cristinId: 0,
      roleCode: 'FORFATTER',
      sequenceNr: 10,
      surname: 'De Min',
      firstname: 'Angelo',
      authorName: 'De Min A.',
      institutions: [
        {
          unitName: 'Department of Mathematics and Geosciences;University of Trieste',
          countryCode: 'IT',
          institutionName: 'University of Trieste',
          cristinInstitutionNr: 12300068,
          isCristinInstitution: false,
        },
      ],
    },
    {
      cristinId: 0,
      roleCode: 'FORFATTER',
      sequenceNr: 11,
      surname: 'Newton',
      firstname: 'Robert J.',
      authorName: 'Newton R.J.',
      institutions: [
        {
          unitName: 'School of Earth and Environment;University of Leeds',
          countryCode: 'GB',
          institutionName: 'University of Leeds',
          cristinInstitutionNr: 13900159,
          isCristinInstitution: false,
        },
      ],
    },
    {
      cristinId: 0,
      roleCode: 'FORFATTER',
      sequenceNr: 12,
      surname: 'Szabó',
      firstname: 'Csaba',
      authorName: 'Szabo C.',
      institutions: [
        {
          unitName:
            'Lithosphere Fluid Research Lab;Research and Industrial Relations Center;Faculty of Science;Eötvös Loránd University',
          countryCode: 'HU',
          institutionName: 'Eötvös Loránd University',
          cristinInstitutionNr: 15200015,
          isCristinInstitution: false,
        },
      ],
    },
  ],
  languages: [
    {
      lang: 'EN',
      langName: 'Engelsk',
      title:
        'Massive methane fluxing from magma–sediment interaction in the end-Triassic Central Atlantic Magmatic Province',
      summary:
        'Exceptional magmatic events coincided with the largest mass extinctions throughout Earth’s history. Extensive degassing from organic-rich sediments intruded by magmas is a possible driver of the catastrophic environmental changes, which triggered the biotic crises. One of Earth’s largest magmatic events is represented by the Central Atlantic Magmatic Province, which was synchronous with the end-Triassic mass extinction. Here, we show direct evidence for the presence in basaltic magmas of methane, generated or remobilized from the host sedimentary sequence during the emplacement of this Large Igneous Province. Abundant methane-rich fluid inclusions were entrapped within quartz at the end of magmatic crystallization in voluminous (about 1.0 × 10\u003csup\u003e6\u003c/sup\u003e km\u003csup\u003e3\u003c/sup\u003e) intrusions in Brazilian Amazonia, indicating a massive (about 7.2 × 10\u003csup\u003e3\u003c/sup\u003e Gt) fluxing of methane. These micrometre-sized imperfections in quartz crystals attest an extensive release of methane from magma–sediment interaction, which likely contributed to the global climate changes responsible for the end-Triassic mass extinction.',
      original: true,
    },
  ],
  channel: {
    cristinTidsskriftNr: 1185296,
    title: 'Nature Communications',
    issn: '2041-1723',
    eissn: '2041-1723',
    isbns: [],
    volume: '12',
    issue: '1',
  },
};

export const mockContributorCristinIdThatTriggersServerError = 543534534;
export const mockImportPublication2 = {
  pubId: 591850,
  category: 'ARTICLE',
  categoryName: 'Vitenskapelig artikkel',
  registered: 'Oct 29, 2021',
  doi: '10.1038/s41467-021-243435510-w',
  sourceName: 'Scopus',
  sourceCode: 'SCOPUS',
  externalId: '2-s2.0-85115431109',
  yearPublished: 2021,
  authors: [
    {
      cristinId: mockContributorCristinIdThatTriggersServerError,
      roleCode: 'FORFATTER',
      sequenceNr: 1,
      surname: 'Capriolo',
      firstname: 'Manfredo',
      authorName: 'Capriolo M.',
      institutions: [
        {
          unitName: 'Department of Geosciences;University of Padova',
          countryCode: 'IT',
          institutionName: 'University of Padova',
          cristinInstitutionNr: 12300052,
          isCristinInstitution: false,
        },
      ],
    },
  ],
  languages: [
    {
      lang: 'EN',
      langName: 'Engelsk',
      title:
        'Massive methane fluxing from magma–sediment interaction in the end-Triassic Central Atlantic Magmatic Province',
      summary:
        'Exceptional magmatic events coincided with the largest mass extinctions throughout Earth’s history. Extensive degassing from organic-rich sediments intruded by magmas is a possible driver of the catastrophic environmental changes, which triggered the biotic crises. One of Earth’s largest magmatic events is represented by the Central Atlantic Magmatic Province, which was synchronous with the end-Triassic mass extinction. Here, we show direct evidence for the presence in basaltic magmas of methane, generated or remobilized from the host sedimentary sequence during the emplacement of this Large Igneous Province. Abundant methane-rich fluid inclusions were entrapped within quartz at the end of magmatic crystallization in voluminous (about 1.0 × 10\u003csup\u003e6\u003c/sup\u003e km\u003csup\u003e3\u003c/sup\u003e) intrusions in Brazilian Amazonia, indicating a massive (about 7.2 × 10\u003csup\u003e3\u003c/sup\u003e Gt) fluxing of methane. These micrometre-sized imperfections in quartz crystals attest an extensive release of methane from magma–sediment interaction, which likely contributed to the global climate changes responsible for the end-Triassic mass extinction.',
      original: true,
    },
  ],
};

export const mockDoiForMonsterPublication = '10.1038/s41467-021-25342423'; // easiest way to get the one publication
export const mockDoiForPublicationWithoutDoi = '10.1038/s41467-021-25510-wXXX';

export const mockImportPublicationWithoutDoi = {
  pubId: 591853,
  category: 'ARTICLE',
  categoryName: 'Vitenskapelig artikkel',
  registered: 'Oct 29, 2021',
  sourceName: 'Scopus',
  sourceCode: 'SCOPUS',
  externalId: '2-s2.0-85115431109',
  yearPublished: 2021,
  authors: [
    {
      cristinId: 0,
      roleCode: 'FORFATTER',
      sequenceNr: 1,
      surname: 'Capriolo',
      firstname: 'Manfredo',
      authorName: 'Capriolo M.',
      institutions: [
        {
          unitName: 'Department of Geosciences;University of Padova',
          countryCode: 'IT',
          institutionName: 'University of Padova',
          cristinInstitutionNr: 12300052,
          isCristinInstitution: false,
        },
      ],
    },
  ],
  languages: [
    {
      lang: 'EN',
      langName: 'Engelsk',
      title:
        'NODOI-Massive methane fluxing from magma–sediment interaction in the end-Triassic Central Atlantic Magmatic Province',
      summary:
        'Exceptional magmatic events coincided with the largest mass extinctions throughout Earth’s history. Extensive degassing from organic-rich sediments intruded by magmas is a possible driver of the catastrophic environmental changes, which triggered the biotic crises. One of Earth’s largest magmatic events is represented by the Central Atlantic Magmatic Province, which was synchronous with the end-Triassic mass extinction. Here, we show direct evidence for the presence in basaltic magmas of methane, generated or remobilized from the host sedimentary sequence during the emplacement of this Large Igneous Province. Abundant methane-rich fluid inclusions were entrapped within quartz at the end of magmatic crystallization in voluminous (about 1.0 × 10\u003csup\u003e6\u003c/sup\u003e km\u003csup\u003e3\u003c/sup\u003e) intrusions in Brazilian Amazonia, indicating a massive (about 7.2 × 10\u003csup\u003e3\u003c/sup\u003e Gt) fluxing of methane. These micrometre-sized imperfections in quartz crystals attest an extensive release of methane from magma–sediment interaction, which likely contributed to the global climate changes responsible for the end-Triassic mass extinction.',
      original: true,
    },
  ],
  channel: {
    cristinTidsskriftNr: 1185296,
    title: 'Nature Communications',
    issn: '2041-1723',
    eissn: '2041-1723',
    isbns: [],
    volume: '12',
    issue: '1',
  },
};

export const mockPublicationCount = { totalCount: 100, importedCount: 1, notImportedCount: 2, notRelevantCount: 3 };

export const mockAllCategories = [
  {
    code: 'ARTICLE',
    name: {
      nb: 'Vitenskapelig artikkel',
    },
  },
  {
    code: 'EDITORIAL',
    name: {
      nb: 'Leder',
    },
  },
  {
    code: 'READEROPINION',
    name: {
      nb: 'Leserinnlegg',
    },
  },
  {
    code: 'OTHERPRES',
    name: {
      nb: 'Annen presentasjon',
    },
  },
];

export const responseCountryInstitutionIT = {
  cristin_institution_id: '12300000',
  institution_name: {
    en: 'Italy',
  },
  acronym: 'ITALIA',
  country: 'IT',
  cristin_user_institution: false,
  url: 'null/12300000',
};

export const responseCountryInstitutionCN = {
  cristin_institution_id: '48400000',
  institution_name: {
    en: 'China',
  },
  acronym: 'KINA',
  country: 'CN',
  cristin_user_institution: false,
  url: 'null/48400000',
};

export const mockIssnChannel: ChannelLight[] = [
  {
    id: '4187',
    issn: '1054-3139',
    issn_electronic: '1095-9289',
    title: 'ICES Journal of Marine Science',
    type: 'journal',
  },
];

export const mockEIssnChannel: ChannelLight[] = [
  {
    id: '4181',
    issn: '1054-3135',
    issn_electronic: '1095-9285',
    title: 'International Journal of Veterinary Market Research',
    type: 'journal',
  },
];

export const mockAllJournals: ChannelLight[] = [
  {
    id: '51160',
    type: 'journal',
    title: 'Ekspressen',
  },
  {
    id: '51162',
    type: 'journal',
    title: 'Midtnytt, NRK 1',
  },
  {
    id: '51164',
    type: 'journal',
    title: 'AVANTEL Technical Report',
  },
  {
    id: '51168',
    type: 'journal',
    title: 'Final Case report. November 2001.',
  },
  {
    id: '51132',
    type: 'journal',
    title: 'Skopet',
  },
  {
    id: '51128',
    type: 'journal',
    title: 'Perspektiver på høyerer utdanning',
  },
  {
    id: '51136',
    type: 'journal',
    issn: '1528-3526',
    title: 'Quarterly Journal of Electronic Commerce',
  },
  {
    id: '51146',
    type: 'journal',
    title: 'Nordtrib : Nordic symposium on tribology',
  },
  {
    id: '102791',
    type: 'journal',
    issn: '1742-7835',
    issn_electronic: '1742-7843',
    title: 'Basic &amp; Clinical Pharmacology &amp; Toxicology',
  },
];

export const mockPerson = {
  first_name: 'Arne',
  surname: 'Benoni',
  url: 'https://api.cristin-test.uio.no/v2/persons/1234567890',
  cristin_person_id: 1234333567,
};

export const mockPerson_234 = {
  first_name: 'Arne',
  surname: 'Benoni',
  url: 'https://api.cristin-test.uio.no/v2/persons/1234567890',
  cristin_person_id: 234,
};

export const mockPerson_666 = {
  first_name: 'Arne',
  surname: 'Benoni',
  url: 'https://api.cristin-test.uio.no/v2/persons/1234567890',
  cristin_person_id: 666,
};

export const cristinIDWithoutActiveAffiliation = '9456892';
export const cristinIDWithoutActiveAffiliation2 = '4359484';
export const mockCristinIDWithoutAffiliationAttribute = '89754123';
export const mockCristinIdForbiddenPerson = '1235412375';
export const mockDoiForEmptyCristinSearch = '123456789';
export const mockCristinPersonNotFound = '18799';
export const mockTitleForEmptyCristinSearch = 'this_is_a_mocked_title';
export const mockSearchTitleForCristinPubWithDoi = 'search_for_cristin_with_doi';

export const mockPersonWithoutActiveAffiliation = {
  first_name: 'Arne',
  surname: 'Berg',
  url: 'https://api.cristin-test.uio.no/v2/persons/1234567890',
  cristin_person_id: cristinIDWithoutActiveAffiliation,
};

export const mockPersonWithoutAffiliationAttribute = {
  first_name: 'Arne',
  surname: 'Børresen',
  url: 'https://api.cristin-test.uio.no/v2/persons/1234567890',
  cristin_person_id: mockCristinIDWithoutAffiliationAttribute,
};

export const mockForbiddenPerson = {
  first_name: 'Arne',
  surname: 'ForbiddenMan',
  url: 'https://api.cristin-test.uio.no/v2/persons/1234567890',
  cristin_person_id: mockCristinIdForbiddenPerson,
};

export const mockPerson5 = {
  first_name: 'Arne',
  surname: 'Gunnarsen',
  url: 'https://api.cristin-test.uio.no/v2/persons/1234567890',
  cristin_person_id: 435835729,
};

export const mockPerson6 = {
  first_name: 'Arne',
  surname: 'Ottervik',
  url: 'https://api.cristin-test.uio.no/v2/persons/1234567890',
  cristin_person_id: 34792875860,
};

export const mockPersonDetailed = {
  cristin_person_id: '1234567',
  first_name: 'Arne',
  surname: 'Benoni',
  identified_cristin_person: true,
  cristin_profile_url: 'https://app.cristin-test.uio.no/persons/show.jsf?id=1234567890',
  affiliations: [
    {
      institution: {
        cristin_institution_id: '194',
        url: 'https://api.cristin-test.uio.no/v2/institutions/194',
      },
      unit: {
        cristin_unit_id: '194.67.40.0',
        url: 'https://api.cristin-test.uio.no/v2/units/194.67.40.0',
      },
      active: false,
      position: {
        en: 'Guest',
      },
    },
    {
      institution: {
        cristin_institution_id: '7492',
        url: 'https://api.cristin-test.uio.no/v2/institutions/7492',
      },
      unit: {
        cristin_unit_id: '7492.5.1.0',
        url: 'https://api.cristin-test.uio.no/v2/units/7492.5.1.0',
      },
      active: true,
      position: {
        en: 'Researcher',
      },
    },
  ],
};

export const mockPersonDetailedWithoutAffiliationAttribute = {
  cristin_person_id: mockCristinIDWithoutAffiliationAttribute,
  first_name: 'Arne',
  surname: 'Pedersen',
  identified_cristin_person: true,
  cristin_profile_url: 'https://app.cristin-test.uio.no/persons/show.jsf?id=1234567890',
};

export const mockPersonDetailed5 = {
  cristin_person_id: mockPerson5.cristin_person_id,
  first_name: 'Arne',
  surname: 'Gunnarsen',
  identified_cristin_person: true,
  cristin_profile_url: 'https://app.cristin-test.uio.no/persons/show.jsf?id=1234567890',
};

export const mockPersonDetailed6 = {
  cristin_person_id: mockPerson6.cristin_person_id,
  first_name: 'Arne',
  surname: 'Ottervik',
  identified_cristin_person: true,
  cristin_profile_url: 'https://app.cristin-test.uio.no/persons/show.jsf?id=1234567890',
};

export const mockPersonDetailed7 = {
  cristin_person_id: 12121212,
  first_name: 'Gunnar',
  surname: 'Bottolf',
  identified_cristin_person: false,
  cristin_profile_url: 'https://app.cristin-test.uio.no/persons/show.jsf?id=1234567890',
};

export const mockPersonDetailed8 = {
  cristin_person_id: 8409329402,
  first_name: 'Person',
  surname: 'With cristinid, not identified',
  identified_cristin_person: false,
  cristin_profile_url: 'https://app.cristin-test.uio.no/persons/show.jsf?id=8409329402',
};

export const mockPersonDetailedDuplicate = {
  cristin_person_id: 666666,
  first_name: 'Duplicate',
  surname: 'CristinContributor',
  identified_cristin_person: true,
  cristin_profile_url: 'https://app.cristin-test.uio.no/persons/show.jsf?id=666666',
  affiliations: [
    {
      institution: {
        cristin_institution_id: '194',
        url: 'https://api.cristin-test.uio.no/v2/institutions/194',
      },

      active: true,
    },
  ],
};

export const mockPersonDetailedWithoutActiveAffiliations = {
  cristin_person_id: cristinIDWithoutActiveAffiliation,
  first_name: 'Arne',
  surname: 'Osen',
  identified_cristin_person: true,
  cristin_profile_url: 'https://app.cristin-test.uio.no/persons/show.jsf?id=1234567890',
  affiliations: [
    {
      institution: {
        cristin_institution_id: '194',
        url: 'https://api.cristin-test.uio.no/v2/institutions/194',
      },
      unit: {
        cristin_unit_id: '194.67.40.0',
        url: 'https://api.cristin-test.uio.no/v2/units/194.67.40.0',
      },
      active: false,
      position: {
        en: 'Guest',
      },
    },
    {
      institution: {
        cristin_institution_id: '7492',
        url: 'https://api.cristin-test.uio.no/v2/institutions/7492',
      },
      unit: {
        cristin_unit_id: '7492.5.1.0',
        url: 'https://api.cristin-test.uio.no/v2/units/7492.5.1.0',
      },
      active: false,
      position: {
        en: 'Researcher',
      },
    },
  ],
};

export const mockPersonDetailedWithoutActiveAffiliations2 = {
  cristin_person_id: cristinIDWithoutActiveAffiliation,
  first_name: 'Pelle',
  surname: 'Persson',
  identified_cristin_person: true,
  cristin_profile_url: 'https://app.cristin-test.uio.no/persons/show.jsf?id=4359484',
  affiliations: [
    {
      institution: {
        cristin_institution_id: '7492',
        url: 'https://api.cristin-test.uio.no/v2/institutions/7492',
      },
      unit: {
        cristin_unit_id: '7492.5.1.0',
        url: 'https://api.cristin-test.uio.no/v2/units/7492.5.1.0',
      },
      active: false,
      position: {
        en: 'Researcher',
      },
    },
  ],
};

export const mockSavedPublication = {
  category: {
    code: 'ARTICLE',
  },
  contributors: {
    list: [
      {
        cristin_person_id: '34324',
        result_id: '53434',
        first_name: 'gfdgdfgs',
        surname: 'gfdgdfgf',
        order: 1,
        affiliations: [
          {
            role_code: 'AUTHOR',
            institution: {
              cristin_institution_id: '194',
            },
          },
        ],
      },
      {
        cristin_person_id: '42g34234',
        result_id: '5345g3245',
        first_name: 'jslkls',
        surname: 'gdgfdsgfd',
        order: 2,
        affiliations: [
          {
            role_code: 'AUTHOR',
            institution: {
              cristin_institution_id: '2012',
            },
          },
        ],
      },
      {
        cristin_person_id: '42345253',
        result_id: '4325345',
        first_name: 'gdfgsfdgd',
        surname: 'gsfdgsfdgsdf',
        order: 3,
        affiliations: [
          {
            role_code: 'AUTHOR',
            institution: {
              cristin_institution_id: '194',
            },
          },
          {
            role_code: 'AUTHOR',
            institution: {
              cristin_institution_id: '1920',
            },
          },
        ],
        url: 'https://crisrest-utv.dataporten-api.no/persons/646456456?lang=en',
      },
    ],
  },
  cristin_result_id: '534534553',
  import_sources: [
    {
      source_name: 'Scopus',
      source_reference_id: '2-s2.0-543534534534',
    },
  ],
  links: [
    {
      url_type: 'doi',
      url_value: '10.1007/s10549-02534534530-06035-0',
    },
  ],
  original_language: 'en',
  title: {
    en: 'ZNF703 gene copy number and protein expression in breast cancer; associations with proliferation, prognosis and luminal subtypes',
  },
  year_published: '2021',
  pub_id: 584077,
  journal: {
    cristin_journal_id: '116',
    name: 'Breast Cancer Research and Treatment',
    international_standard_numbers: [
      {
        type: 'printed',
      },
      {
        type: 'electronic',
      },
    ],
    pia_journal_number: '116',
  },
  pages: {
    count: '0',
  },
};
export const mockNotAuthorizedForThisPersonDetailResponse = {
  status: 403,
  response_id: 'svh6s12a',
  errors: ['Client lacks authorization.'],
};

export const mockCristinPersonNotFoundResponse = {
  status: 404,
  response_id: 'q81ba1ps',
  errors: ['Person not found or not a Cristin person.'],
};

export const mockServerErrorResponse = {
  status: 500,
  response_id: 'q81ba1ps',
  errors: ['mocked errormessage'],
};

export const mockSaveErrorResponse = {
  status: 400,
  response_id: 'l20utud2',
  errors: [
    'JSON schema validation failed on content: [#/contributors/list/0/affiliations: expected minimum item count: 1, found: 0].',
  ],
};

export const mockSimpleUnitResponse = [
  {
    cristin_unit_id: '194.12.0.0',
    unit_name: {
      en: 'Rector',
      nb: 'Rektor',
    },
    institution: {
      acronym: 'NTNU',
    },
    url: 'https://api.cristin-test.uio.no/v2/units/194.12.0.0',
    acronym: 'RE',
  },
  {
    cristin_unit_id: '194.12.1.0',
    unit_name: {
      en: 'Rector and Board',
      nb: 'Rektor og styre',
    },
    institution: {
      acronym: 'NTNU',
    },
    url: 'https://api.cristin-test.uio.no/v2/units/194.12.1.0',
    acronym: 'RE-REK',
  },
  {
    cristin_unit_id: '194.13.0.0',
    unit_name: {
      en: 'Pro-Rector for Research',
      nb: 'Prorektor for forskning',
    },
    institution: {
      acronym: 'NTNU',
    },
    url: 'https://api.cristin-test.uio.no/v2/units/194.13.0.0',
    acronym: 'FO',
  },
  {
    cristin_unit_id: '194.14.0.0',
    unit_name: {
      en: 'Pro-Rector for Education',
      nb: 'Prorektor for utdanning',
    },
    institution: {
      acronym: 'NTNU',
    },
    url: 'https://api.cristin-test.uio.no/v2/units/194.14.0.0',
    acronym: 'UTD',
  },
  {
    cristin_unit_id: '194.14.30.0',
    unit_name: {
      en: 'NTNU University Library',
      nb: 'NTNU Universitetsbiblioteket',
    },
    institution: {
      acronym: 'NTNU',
    },
    url: 'https://api.cristin-test.uio.no/v2/units/194.14.30.0',
    acronym: 'UTD-UB',
  },
  {
    cristin_unit_id: '194.15.0.0',
    unit_name: {
      en: 'Director of Finance and Property',
      nb: 'Økonomi- og eiendomsdirektør',
    },
    institution: {
      acronym: 'NTNU',
    },
    url: 'https://api.cristin-test.uio.no/v2/units/194.15.0.0',
    acronym: 'OE',
  },
  {
    cristin_unit_id: '194.16.0.0',
    unit_name: {
      en: 'Director, Organization',
      nb: 'Organisasjonsdirektør',
    },
    institution: {
      acronym: 'NTNU',
    },
    url: 'https://api.cristin-test.uio.no/v2/units/194.16.0.0',
    acronym: 'OD',
  },
  {
    cristin_unit_id: '194.16.90.0',
    unit_name: {
      en: 'Communication Division',
      nb: 'Kommunikasjonsavdelingen',
    },
    institution: {
      acronym: 'NTNU',
    },
    url: 'https://api.cristin-test.uio.no/v2/units/194.16.90.0',
    acronym: 'OD-KOMM',
  },
];

export const mockInstitutionSearchByName = [
  {
    cristin_institution_id: '65200000',
    institution_name: {
      en: 'Mexico',
    },
    acronym: 'MEXICO',
    country: 'MX',
    cristin_user_institution: false,
    url: 'https://api.cristin-test.uio.no/v2/institutions/65200000',
  },
  {
    cristin_institution_id: '65220000',
    institution_name: {
      en: 'Hospital General de Mexico',
    },
    acronym: 'HGM',
    country: 'MX',
    cristin_user_institution: false,
    url: 'https://api.cristin-test.uio.no/v2/institutions/65220000',
  },
  {
    cristin_institution_id: '82007415',
    institution_name: {
      en: 'Northern New Mexico College',
    },
    acronym: 'NNMC',
    country: 'US',
    cristin_user_institution: false,
    url: 'https://api.cristin-test.uio.no/v2/institutions/82007415',
  },
];

export const mockCristinPublicationWithDoi = {
  category: {
    code: 'ARTICLE',
    name: {
      nb: 'Vitenskapelig artikkel',
    },
  },
  channel: {
    title: 'Maritime Policy & Management',
  },
  contributors: {
    url: 'https://api.cristin.no/v2/results/1920336/contributors',
    count: 4,
    preview: [
      {
        first_name: 'Tore',
        surname: 'Relling',
      },
      {
        first_name: 'Margareta',
        surname: 'Lützhöft',
      },
      {
        first_name: 'Runar',
        surname: 'Ostnes',
      },
      {
        first_name: 'Hans Petter',
        surname: 'Hildre',
      },
    ],
  },
  cristin_result_id: '1920336',
  created: {
    date: '2021-07-05T14:47:15.000Z',
  },
  import_sources: [
    {
      source_name: 'SCOPUS',
      source_reference_id: '2-s2.0-85107715929',
    },
  ],
  last_modified: {
    date: '2021-08-03T13:57:17.000Z',
  },
  links: [
    {
      url_type: 'ARKIV',
      url: 'https://hdl.handle.net/11250/2786489',
    },
    {
      url_type: 'DOI',
      url: 'https://doi.org/10.1080/03088839.2021.1937739',
    },
  ],
  open_access: 'green',
  original_language: 'en',
  title: {
    en: 'The contribution of Vessel Traffic Services to safe coexistence between automated and conventional vessels',
  },
  year_published: '2021',
  year_reported: '2021',
  url: 'https://api.cristin.no/v2/results/1920336',
  journal: {
    cristin_journal_id: '32339',
    name: 'Maritime Policy & Management',
    publisher: {
      cristin_publisher_id: '313',
      name: 'Taylor & Francis',
      url: 'http://www.tandf.co.uk/books/',
      nvi_level: '1',
    },
    international_standard_numbers: [
      {
        type: 'printed',
        value: '0308-8839',
      },
      {
        type: 'electronic',
        value: '1464-5254',
      },
    ],
    nvi_level: '1',
  },
  pages: {
    count: '20',
  },
};

export const mockCristinIdPersonNotFound = 358485340;
