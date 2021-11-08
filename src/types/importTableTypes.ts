export enum Order {
  asc = 'asc',
  desc = 'desc',
}

export interface ImportData {
  pubId: string;
  authors: Author[];
  yearPublished?: string;
  channel?: {
    title: string;
    volume?: string;
    pageFrom?: string;
    pageTo?: string;
  };
  doi?: string;
  categoryName: string;
  sourceName: string;
  registered: string;
  languages?: Language[];
}

export interface Author {
  authorName: string;
  sequenceNr: number;
  institutions: institution[];
  cristinId?: number;
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
