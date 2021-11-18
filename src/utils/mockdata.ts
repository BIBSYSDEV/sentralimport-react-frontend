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

export const mockAllJournals = [
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
];

export const mockPerson = {
  first_name: 'Arne',
  surname: 'Benoni',
  url: 'https://api.cristin-test.uio.no/v2/persons/1234567890',
  cristin_person_id: '1234567',
};

export const personWithoutAffiliationCristinId = '9456892';

export const mockPerson2 = {
  first_name: 'Arne',
  surname: 'Benoni',
  url: 'https://api.cristin-test.uio.no/v2/persons/1234567890',
  cristin_person_id: personWithoutAffiliationCristinId,
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

export const mockPersonDetailedWithoutActiveAffiliations = {
  cristin_person_id: personWithoutAffiliationCristinId,
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
        type: 'online',
      },
    ],
    pia_journal_number: '116',
  },
  pages: {
    count: '0',
  },
};
