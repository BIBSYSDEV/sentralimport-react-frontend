//TODO: identifiser bruk og rydd

export interface Institution {
  url: string;
  cristin_user_institution: boolean;
  country: string;
  cristin_institution_id: string;
  acronym: string;
  institution_name: {
    en?: string;
    nb: string;
  };
}

export interface Unit {
  unitName: string;
  unitNr: string;
}

export interface SimpleUnitResponse {
  acronym?: string;
  url?: string;
  cristin_unit_id: string | undefined;
  unit_name: {
    en?: string;
    nb: string;
  };
}

export interface UnitResponse extends SimpleUnitResponse {
  institution: {
    cristin_institution_id: string;
    url: string;
  };
  parent_unit?: SimpleUnitResponse;
  parent_units?: SimpleUnitResponse[];
}

export interface InstitutionCountryInformation {
  acronym: string;
  country: string;
  cristin_institution_id: string;
  cristin_user_institution: boolean;
  institution_name: {
    en?: string;
    nb?: string;
  };
  url: string;
}

export interface ImportPublicationPersonInstutution {
  unitName?: string;
  countryCode?: string;
  institutionName?: string;
  cristinInstitutionNr?: string | number;
  isCristinInstitution?: boolean;
  acronym?: string;
}

export interface Affiliation extends ImportPublicationPersonInstutution {
  institution?: CristinInstitution;
  unit?: CristinUnit;
  units?: Unit[];
  active?: boolean;
  position?: {
    en?: string;
    nb?: string;
  };
}

export interface CristinUnit {
  cristin_unit_id: string;
  unit_name?: {
    nb?: string;
    en?: string;
  };
  url: string;
}

export interface CristinInstitution {
  cristin_institution_id: string;
  isCristinInstitution?: boolean;
  url: string;
}

export interface InstitutionSelector {
  cristinInstitutionNr: string;
  label: string;
  value: string;
}
