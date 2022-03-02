export interface CompareFormCategoryOption {
  value: string;
  label: string;
}

export interface CompareFormJournalType {
  cristinTidsskriftNr: string;
  title: string;
  issn?: string;
  eissn?: string;
}

export interface CompareFormTitleType {
  title: string;
  langCode: string;
}

export const emptyJournal: CompareFormJournalType = {
  cristinTidsskriftNr: '0',
  title: '',
};

export interface CompareFormValuesType {
  isInitiatedFromCristinPublication: boolean;
  originalLanguage: string;
  titles: CompareFormTitleType[];
  year: number | undefined;
  doi?: string;
  category: CompareFormCategoryOption;
  volume?: string;
  issue?: string;
  pageFrom?: string;
  pageTo?: string;
  journal: CompareFormJournalType;
}
