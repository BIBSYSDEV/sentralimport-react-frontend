export interface Person {
  first_name: string;
  identified_cristin_person: boolean;

  tel?: string;
  cristinId: number;
  cristin_profile_url?: string;
  picture_url?: string;
}

export interface PersonDetailResponse extends Person {
  first_name_preferred?: string;
  surname_preferred?: string;
  affiliations?: AffiliationResponse[];
}

export interface SearchContributor extends Person {
  affiliations?: Affiliation[];
}

export interface PublicationContributor extends Person {
  order: number;
  result_id: string;
  affiliations?: publicationContributorAffiliationResponse;
}

export interface AffiliationResponse {
  institution: {
    cristin_institution_id: string;
    url: string;
  };
  unit?: {
    cristin_unit_id: string;
    url: string;
  };
  active: boolean;
  position: {
    en?: string;
    nb?: string;
  };
}

export interface publicationContributorAffiliationResponse {
  institution: {
    cristin_institution_id: string;
    url: string;
  };
  unit?: {
    cristin_unit_id: string;
    url: string;
  };
  role_code: string;
  role: {
    code: string;
    name: {
      nb: string;
      en: string;
    };
  };
}

export interface PersonSearchResponse {
  first_name: string;
  surname: string;
  url: string;
  cristin_person_id: number;
}

export interface Unit {
  unitName: string;
  unitNr: string;
}

export interface Affiliation {
  institutionName: string;
  cristinInstitutionNr: string;
  isCristinInstitution: boolean;
  units: Unit[];
}

export const defaultAuthor = {
  cristin_person_id: null,
  identified_cristin_person: false,
  first_name: '',
  surname: '',
  order: 0,
  affiliations: [],
  url: null,
  isEditing: true,
};

//TODO: endre datamodell ? trekke ut felles data som order ?
export const emptyContributor = {
  imported: {
    order: 0,
    affiliations: [],
    first_name: '',
    surname: '',
    cristin_person_id: 0,
    role_code: 'AUTHOR',
  },
  cristin: {
    order: 0,
    affiliations: [],
    first_name: '',
    surname: '',
    cristin_person_id: 0,
    role_code: 'AUTHOR',
  },
  toBeCreated: {
    order: 0,
    affiliations: [],
    first_name: '',
    surname: '',
    cristin_person_id: 0,
    role_code: 'AUTHOR',
  },
};
