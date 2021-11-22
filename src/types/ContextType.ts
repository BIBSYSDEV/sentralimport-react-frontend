import { Order } from './PublicationTypes';

export interface ContextType {
  allChecked: boolean;
  contributorErrors: number[];
  contributorPage: number;
  contributorPerPage: number;
  contributors: null | any;
  contributorsLoaded: boolean;
  currentImportStatus: string;
  currentImportYear: CurrentImportYear;
  currentInstitution: any;
  currentPageNr: number;
  currentPerPage: CurrentPerPage;
  currentSortOrder: Order;
  currentSortValue: SortValue;
  doSave: boolean;
  doiFilter: null;
  formErrors: string[];
  identified: any[];
  identifiedImported: any[];
  importDone: boolean;
  institutions: null | InstitutionSelector[];
  institutionsEnglish: null | InstitutionSelector[];
  isSampublikasjon: boolean;
  param: null | any;
  selectedField: string;
  selectedPublication: SelectedPublication | any; //TODO: code-cleanup, selectedPublication changes interface throughout the application (possibly only the initial state is incorrect)
  totalCount: number;
  validation: string;
}

export interface CurrentImportYear {
  label: string;
  value: number;
}

export interface CurrentPerPage {
  label: string;
  value: number;
}

export enum SortValue {
  Date = 'date',
  Publication = 'Publikasjon',
  Category = 'category',
  Source = 'source',
  OwnerInstitution = 'Eierinstitusjon',
  Authors = 'Forfattere',
}

export enum BooleanString {
  false = 'false',
  true = 'true',
}

export interface SelectedPublication {
  authors?: any;
  category: {
    code: string;
  };
  created: {
    date: string;
  };
  import_sources: ImportSources[];
  journal: {
    international_standard_numbers?: string;
    name: string;
  };
  title: {
    en: string;
    nb?: string;
  };
  categoryName?: string;
  cristin_result_id: string;
  original_language?: string;
}

export interface ImportSources {
  source_name: string;
  source_reference_id?: string;
}

export interface InstitutionSelector {
  cristinInstitutionNr: string;
  label: string;
  value: string;
}
