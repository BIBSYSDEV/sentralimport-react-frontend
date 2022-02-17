import { Order } from './PublicationTypes';
import { Institution, InstitutionSelector } from './InstitutionTypes';

export interface ContextType {
  allChecked: boolean;
  contributors: null | any;
  contributorsLoaded: boolean;
  currentImportStatus: string;
  currentImportYear: CurrentImportYear;
  currentInstitution: any;
  currentPageNr: number;
  currentPerPage: CurrentPerPage;
  currentSortOrder: Order;
  currentSortValue: SortValue;
  doiFilter: string | null;
  institutions: null | InstitutionSelector[];
  globalInstitutions: Institution[];
  isSampublikasjon: boolean;
  param: null | any;
  totalCount: number;
  triggerImportDataSearch: boolean;
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

/*export interface SelectedPublication {
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
}*/

export interface ImportSources {
  source_name: string;
  source_reference_id?: string;
}
