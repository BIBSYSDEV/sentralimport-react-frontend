export interface Person {
  first_name: string;
  identified_cristin_person: boolean;
  first_name_preferred?: boolean;
  surname_preferred?: boolean;
  surname: string;
  tel?: string;
  cristinId: number;
  cristin_profile_url?: string;
  picture_url?: string;
  require_higher_authorization?: boolean;
}

export interface PersonDetailResponse extends Person {
  affiliations?: AffiliationResponse[];
}

export interface SearchContributor extends Person {
  affiliations?: Affiliation[];
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
