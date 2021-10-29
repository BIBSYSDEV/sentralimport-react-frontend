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
];

export const mockImportData = [
  {
    pubId: 584092,
    category: 'ACADEMICREVIEW',
    categoryName: 'Vitenskapelig oversiktsartikkel/review',
    registered: 'Jan 6, 2021',
    doi: '10.1108/IJPSM-04-2020-0096',
    sourceName: 'Scopus',
    sourceCode: 'SCOPUS',
    externalId: '2-s2.0-85098522896',
    yearPublished: 2021,
    authors: [
      {
        cristinId: 0,
        roleCode: 'FORFATTER',
        sequenceNr: 1,
        surname: 'etternavn1',
        firstname: 'fornavn1',
        authorName: 'etternavn1 f.',
        institutions: [
          {
            unitName: 'Department of Management and Business Administration;Gabriele D’Annunzio University',
            countryCode: 'IT',
            institutionName: 'Gabriele D’Annunzio University',
            cristinInstitutionNr: 0,
            isCristinInstitution: false,
          },
        ],
      },
      {
        cristinId: 0,
        roleCode: 'FORFATTER',
        sequenceNr: 2,
        surname: 'etternavn2',
        firstname: 'fornavn2',
        authorName: 'etternavn2 f.',
        institutions: [
          {
            unitName: 'Nord University',
            countryCode: 'NO',
            institutionName: 'Nord University',
            acronym: 'NORD',
            cristinInstitutionNr: 204,
            isCristinInstitution: true,
          },
          {
            unitName: 'School of Business;Kristianstad University',
            countryCode: 'SE',
            institutionName: 'Kristianstad University',
            cristinInstitutionNr: 10600017,
            isCristinInstitution: false,
          },
          {
            unitName: 'Kozminski University',
            countryCode: 'PL',
            institutionName: 'Kozminski University',
            cristinInstitutionNr: 0,
            isCristinInstitution: false,
          },
        ],
      },
      {
        cristinId: 0,
        roleCode: 'FORFATTER',
        sequenceNr: 3,
        surname: 'etternavn3',
        firstname: 'fornavn3',
        authorName: 'etternavn3 f.',
        institutions: [
          {
            unitName: 'The Open University',
            countryCode: 'GB',
            institutionName: 'The Open University',
            cristinInstitutionNr: 13900060,
            isCristinInstitution: false,
          },
          {
            unitName: 'University of Milan-Bicocca',
            countryCode: 'IT',
            institutionName: 'University of Milan-Bicocca',
            cristinInstitutionNr: 12300049,
            isCristinInstitution: false,
          },
        ],
      },
    ],
    languages: [
      {
        lang: 'EN',
        langName: 'Engelsk',
        title: 'Public appointments as a tool for public governance: a systematic literature review',
        summary:
          'Purpose: The purpose of this paper is to review previous research on public appointments to systematize existing knowledge, identify gaps and discuss implications for future research in this field. Design/methodology/approach: This paper is based on a systematic literature review, carried out using the Scopus database. We selected academic articles published in journals ranked in the 2018 CABS Academic Journal Guide plus public administration articles in journals classified by Google as falling within the areas of public policy and administration. The papers were analysed according to four categories: geographical area, theoretical framework, research method and organizational setting. Findings: Results show the lack of research regarding areas like Latin America or East Asia; from a theoretical viewpoint, given the lack of explicit theoretical approaches, future research should have more formal and clear theoretical frameworks. Moreover, given the dominance of case study and review/reflection studies, alternative research methods, such as surveys or mixed methods are suggested for future works. Research limitations/implications: We identify a new research agenda to revive the focus on public appointments as a tool for intra- and inter-organizational governance in the public sector. Specifically, we argue that how the process of public appointments is managed has huge democratic implications, and public managers have a key role to play in that respect by designing effective governance systems and organizational procedures. The selection of papers has been limited to articles published in peer- review journals ranked in the 2018 CABS Guide; no distinctions have been made regarding journals\u0027 positioning in the ranking. Moreover, this work takes a managerial and organizational approach, while the research on public appointments is clearly interdisciplinary, with previous contributions coming mainly from political scientists. Originality/value: Despite the relevant body of literature on this topic, this study represents the first manuscript to summarize the state of the art of this theme, providing a research agenda on this very relevant but quite neglected issue in public governance.',
        original: true,
      },
    ],
    channel: {
      cristinTidsskriftNr: 29099,
      title: 'International Journal of Public Sector Management',
      issn: '0951-3558',
      eissn: '1758-6666',
      isbns: [],
    },
  },
];

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

export const mockCountryInstitutions = [
  {
    cristin_institution_id: '12300000',
    institution_name: {
      en: 'Italy',
    },
    acronym: 'ITALIA',
    country: 'IT',
    cristin_user_institution: false,
    url: 'null/12300000',
  },
];

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
