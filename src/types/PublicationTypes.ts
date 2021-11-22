export enum Order {
  asc = 'asc',
  desc = 'desc',
}

export interface ImportData {
  duplicate?: boolean;
  externalId: string;
  cristin_id?: boolean;
  category?: any;
  pubId: string;
  authors: Author[];
  yearPublished: string;
  channel?: Channel;
  doi?: string;
  categoryName: string;
  sourceName: string;
  registered: string;
  externalCategory: string;
  languages: Language[];
}

export interface CristinPublication {
  authorTotalCount: any;
  authors: any;
  international_standard_numbers?: InternationalStandardNumber[];
  publisher: any;
  year_published: any;
  category: any;
  title: any;
  original_language?: any;
  created: {
    date: string;
  };
  cristin_result_id: string;
}

export interface Author {
  first_name?: string;
  surname?: string;
  authorName: string;
  sequenceNr: number;
  institutions: institution[];
  cristinId?: number;
}

export interface Channel {
  issns?: any; //?????
  issn?: string;
  eissn?: string;
  cristinTidsskriftNr?: string;
  issue?: string;
  title: string;
  volume?: string;
  pageFrom?: string;
  pageTo?: string;
}

export interface InternationalStandardNumber {
  type: string;
  value: string;
}

export interface institution {
  unitName: string;
  acronym: string;
}

export interface Language {
  lang: string;
  original: boolean;
  title: string;
}

export const emptyImportPublication: ImportData = {
  externalCategory: '',
  externalId: '',
  yearPublished: '',
  channel: {
    title: '',
  },
  cristin_id: false,
  pubId: '',
  sourceName: '',
  registered: '',
  categoryName: 'CAT',
  languages: [
    {
      lang: 'EN',
      title: 'Title',
      original: true,
    },
  ],
  authors: [],
};

export interface PublicationCount {
  totalCount: number;
  importedCount: number;
  notImportedCount: number;
  notRelevantCount: number;
}
