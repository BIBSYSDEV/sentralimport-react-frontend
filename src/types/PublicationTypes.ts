import { ContributorType, ImportPublicationPerson } from './ContributorTypes';
import { ImportSources } from './ContextType';

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
  yearPublished: number | undefined;
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
  original_language: string;
  created: {
    date: string;
  };
  links?: any[];
  journal?: any;
  cristin_result_id: string;
  issue?: string;
  volume?: string;
  pages?: Pages;
  import_sources?: ImportSources[];
}

export interface Channel {
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
  langName?: string;
  summary?: string;
}

export const emptyImportPublication: ImportPublication = {
  externalCategory: '',
  externalId: '',
  yearPublished: undefined,
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
  eissn?: string;
  issn_electronic?: string;
}

export interface CategoryItem {
  code: string;
  name?: {
    nb?: string;
    en?: string;
  };
}

export interface Link {
  url_type: string;
  url_value: string;
  url?: string;
}

export enum UrlTypes {
  Doi = 'DOI',
}

export interface Journal {
  cristin_journal_id?: string;
  name?: string;
  international_standard_numbers?: InternationalStandardNumber[];
  pia_journal_number?: string | number;
}

export interface Pages {
  from: string;
  to: string;
  count: string;
}

export interface PatchPublication {
  original_language: string;
  title: any;
  pub_id: string | number;
  import_sources?: any;
  volume: string;
  issue: string;
  links: Link[];
  cristinResultId: string | number;
  pages?: Pages;
  annotation?: string;
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
  contributors: {
    list: ContributorType[];
  };
  annotation?: string;
}

export interface PostPublicationRespone extends PostPublication {
  cristin_result_id: string | number;
}

export enum InternationalStandardNumberTypes {
  PRINTED = 'printed',
  ELECTRONIC = 'electronic',
}

export interface SavedPublicationLogLine {
  authorsPresentation: string;
  id: string;
  title: string;
}
