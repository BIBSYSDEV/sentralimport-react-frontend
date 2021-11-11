export enum Order {
  asc = 'asc',
  desc = 'desc',
}

export interface ImportData {
  duplicate?: boolean;
  cristin_id: boolean;
  category?: any;
  externalId?: string;
  pubId: string;
  authors: Author[];
  yearPublished?: string;
  channel: Channel;
  doi?: string;
  categoryName: string;
  sourceName: string;
  registered: string;
  languages?: Language[];
}

export interface CristinPublication {
  created: {
    date: string;
  };
  cristin_result_id: string;
}

export interface Author {
  authorName: string;
  sequenceNr: number;
  institutions: institution[];
  cristinId?: number;
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
