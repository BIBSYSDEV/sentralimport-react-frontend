import {
  ContributorType,
  ContributorWrapper,
  emptyContributor,
  ImportPublicationPerson,
  RoleCodes,
} from '../../types/ContributorTypes';
import { Affiliation } from '../../types/InstitutionTypes';
import { getPersonDetailById, SearchLanguage } from '../../api/contributorApi';
import { getAffiliationDetails, getContributorStatus } from '../../utils/contributorUtils';
import { CRIST_REST_API } from '../../utils/constants';
import { removeInstitutionsDuplicatesBasedOnCristinId, replaceNonCristinInstitutions } from './InstututionHelper';
import clone from 'just-clone';

export async function searchCristinPersons(authors: ImportPublicationPerson[]) {
  let unitNameCache = new Map();
  let institutionNameCache = new Map();
  const suggestedAuthors = [];
  for (let i = 0; i < authors.length; i++) {
    let cristinPerson = { ...emptyContributor };
    let affiliations: Affiliation[] = [];
    if (authors[i].cristinId !== 0) {
      cristinPerson.cristin_person_id = authors[i].cristinId;
      cristinPerson = await getPersonDetailById(cristinPerson);
      if (cristinPerson.affiliations) {
        const activeAffiliations = cristinPerson.affiliations.filter((affiliation) => affiliation.active);
        for (const activeAffiliation of activeAffiliations) {
          const detailedAffiliationAndCache = await getAffiliationDetails(
            activeAffiliation,
            unitNameCache,
            institutionNameCache
          );
          unitNameCache = detailedAffiliationAndCache.unitNameCache;
          institutionNameCache = detailedAffiliationAndCache.institutionNameCache;
          if (detailedAffiliationAndCache.affiliation) affiliations.push(detailedAffiliationAndCache.affiliation);
        }
      } else {
        affiliations = await replaceNonCristinInstitutions(authors[i].institutions);
      }

      cristinPerson = {
        cristin_person_id: cristinPerson.cristin_person_id,
        first_name: cristinPerson.first_name_preferred ?? cristinPerson.first_name,
        surname: cristinPerson.surname_preferred ?? cristinPerson.surname,
        affiliations: affiliations.filter((item: Affiliation, index: number) => affiliations.indexOf(item) === index),
        url: CRIST_REST_API + '/persons/' + cristinPerson.cristin_person_id + '?lang=' + SearchLanguage.En,
        order: i + 1,
        identified_cristin_person: cristinPerson.identified_cristin_person,
        require_higher_authorization: cristinPerson.require_higher_authorization,
        badge_type: getContributorStatus(cristinPerson, affiliations),
      };
    }
    suggestedAuthors[i] = cristinPerson;
  }
  return suggestedAuthors;
}

export const createContributorWrapper = (
  authorsFromImportPublication: ImportPublicationPerson[],
  index: number,
  cristinAuthors: ContributorType[]
): ContributorWrapper => {
  const author = authorsFromImportPublication[index];
  const importedContributor: ContributorType =
    authorsFromImportPublication.length > index && author
      ? {
          cristin_person_id: author.cristinId,
          first_name: generateFirstName(author),
          surname: generateLastName(author),
          authorName: author.authorName,
          order: author.sequenceNr,
          affiliations: author.institutions,
          role_code: author.roleCode
            ? author.roleCode === RoleCodes.Forfatter
              ? RoleCodes.Author
              : author.roleCode
            : RoleCodes.Author,
        }
      : emptyContributor;
  return {
    imported: importedContributor,
    cristin: cristinAuthors[index],
    toBeCreated: emptyContributor,
    isEditing: false,
  };
};

const generateFirstName = (author: ImportPublicationPerson): string => {
  if (author.firstname) {
    return author.firstname;
  } else {
    const authorNameParts = author.authorName?.replace(',', '').split(' ');
    return authorNameParts?.length > 1 ? authorNameParts[1] : '';
  }
};

const generateLastName = (author: ImportPublicationPerson): string => {
  if (author.surname) {
    return author.surname;
  } else {
    const authorNameParts = author.authorName?.replace(',', '').split(' ');
    return authorNameParts?.length > 0 ? authorNameParts[0] : '';
  }
};

export const generateToBeCreatedContributor = async (
  contributor: ContributorWrapper,
  cristinAuthor: ContributorType,
  importPerson: ImportPublicationPerson,
  isDuplicate: boolean
) => {
  const hasFoundCristinPerson = contributor.cristin.cristin_person_id !== 0;
  const tempCristinPerson = clone(cristinAuthor);
  tempCristinPerson.affiliations = removeInstitutionsDuplicatesBasedOnCristinId(tempCristinPerson.affiliations ?? []);
  const personToBeCreated: ContributorType = hasFoundCristinPerson
    ? { ...contributor.cristin }
    : { ...contributor.imported };
  return cristinAuthor.cristin_person_id !== 0
    ? tempCristinPerson
    : {
        ...personToBeCreated,
        affiliations: removeInstitutionsDuplicatesBasedOnCristinId(
          await replaceNonCristinInstitutions(isDuplicate ? cristinAuthor.affiliations : importPerson.institutions)
        ),
      };
};