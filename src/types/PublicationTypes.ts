import { ImportPublicationPerson } from './ContributorTypes';

export enum Order {
  asc = 'asc',
  desc = 'desc',
}

export interface ImportPublication {
  duplicate?: boolean;
  externalId: string;
  cristin_id?: boolean;
  category?: any;
  pubId: string;
  authors: ImportPublicationPerson[];
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
  authorTotalCount: number;
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
  value?: string;
}

export interface Language {
  lang: string;
  original: boolean;
  title: string;
}

export const emptyImportPublication: ImportPublication = {
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

export interface ChannelLight {
  id: string;
  type: string;
  title: string;
  issn?: string;
  issn_electronic?: string;
}

export interface CategoryItem {
  code: string;
  name?: {
    nb?: string;
    en?: string;
  };
}

export interface PostPublication {
  category: CategoryItem;
  journal: Journal;
  original_language: string;
  title: any;
  pub_id: string | number;
  year_published: string;
  import_sources: any;
  volume: string;
  issue: string;
  links: Link[];
  pages: Pages;
  contributor: any[];
  cristin_result_id: string | number;
  cristinResultId?: string | number;
  annotation?: string;
}

export interface Link {
  url_type: string;
  url_value: string;
}

export interface Journal {
  cristin_journal_id: string;
  name: string;
  international_standard_numbers: InternationalStandardNumber[];
  pia_journal_number?: string | number;
}

export interface Pages {
  from: string | number;
  to: string | number;
  count: string;
}

export interface PatchPublication {
  category?: CategoryItem;
  journal?: Journal;
  original_language?: string;
  title?: any;
  pub_id?: string | number;
  year_published?: string;
  import_sources?: any;
  volume?: string;
  issue?: string;
  links?: Link[];
  pages?: Pages;
  contributor?: any[];
  cristin_result_id?: string | number;
  cristinResultId: string | number;
  annotation?: string;
}
