import { Affiliation, ImportPublicationPersonInstutution } from './InstitutionTypes';

export interface ContributorType {
  order?: number;
  sequenceNr?: number;
  first_name: string;
  first_name_preferred?: string;
  surname_preferred?: string;
  surname: string;
  cristin_person_id?: number;
  externalId?: string;
  orcid?: string;
  role_code?: string;
  authorName?: string;
  identified_cristin_person?: boolean;
  url?: string;
  affiliations?: Affiliation[];
  require_higher_authorization?: boolean;
  badge_type?: ContributorStatus;
}

export enum ContributorStatus {
  Verified = 'verified',
  NotVerified = 'not_verified',
  Unknown = 'unknown',
  None = 'none',
}

export interface ImportPublicationPerson {
  cristinId?: number;
  roleCode: string;
  sequenceNr: number;
  externalId?: string;
  orcid?: string;
  firstname?: string;
  surname: string;
  authorName: string;
  institutions: ImportPublicationPersonInstutution[];
}

export interface ContributorWrapper {
  imported: ContributorType;
  cristin: ContributorType;
  toBeCreated: ContributorType;
}

export enum RoleCodes {
  Author = 'AUTHOR',
  Forfatter = 'FORFATTER',
}

export const emptyContributor: ContributorType = {
  order: 0,
  cristin_person_id: 0,
  first_name: '',
  surname: '',
  affiliations: [],
  url: '',
};

export const emptyContributorWrapper: ContributorWrapper = {
  imported: {
    order: 0,
    affiliations: [],
    first_name: '',
    surname: '',
    cristin_person_id: 0,
    role_code: RoleCodes.Author,
  },
  cristin: {
    order: 0,
    affiliations: [],
    first_name: '',
    surname: '',
    cristin_person_id: 0,
    role_code: RoleCodes.Author,
  },
  toBeCreated: {
    order: 0,
    affiliations: [],
    first_name: '',
    surname: '',
    cristin_person_id: 0,
    role_code: RoleCodes.Author,
  },
};

export const MaxLengthFirstName = 30;
export const MaxLengthLastName = 30;

export interface ContributorDuplicates {
  cristinIdDuplicates: number[];
  nameDuplicate: number[];
}

export interface ContributorPiaIdUpdate {
  publication: {
    externalId: string;
    sourceCode: SourceCode;
  };
  cristinId: number;
  externalId: string;
  orcid?: string;
  sequenceNr: number;
}

export enum SourceCode {
  SCOPUS = 'SCOPUS',
}
