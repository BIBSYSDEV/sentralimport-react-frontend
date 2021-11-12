export interface PersonDetailResponse {
  first_name: string;
  identified_cristin_person: boolean;
  first_name_preferred?: boolean;
  surname_preferred?: boolean;
  tel?: string;
  cristinId: number;
  cristin_profile_url?: string;
  picture_url?: string;
  affiliations?: AffiliationResponse[];
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
