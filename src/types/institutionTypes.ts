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
  cristin_unit_id: string;
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
