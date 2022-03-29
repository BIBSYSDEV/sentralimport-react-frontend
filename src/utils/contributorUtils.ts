import { getInstitutionUnitNameBasedOnIDAndInstitutionStatus, SearchLanguage } from '../api/contributorApi';
import { Affiliation } from '../types/InstitutionTypes';
import { ContributorStatus, ContributorType } from '../types/ContributorTypes';
import { getInstitutionName } from '../api/institutionApi';
import { ImportPublication } from '../types/PublicationTypes';

export async function getAffiliationDetails(
  affiliation: Affiliation | undefined,
  unitNameCache: Map<string, string>,
  institutionNameCache: Map<string, string>
): Promise<{
  institutionNameCache: Map<string, string>;
  unitNameCache: Map<string, string>;
  affiliation: Affiliation | undefined;
}> {
  if (affiliation) {
    const institutionNameAndCache = await getInstitutionName(
      affiliation.institution?.cristin_institution_id,
      SearchLanguage.En,
      institutionNameCache
    );
    institutionNameCache = institutionNameAndCache.cachedInstitutionResult;
    const unitNameAndCache = await getInstitutionUnitNameBasedOnIDAndInstitutionStatus(affiliation, unitNameCache);
    unitNameCache = unitNameAndCache.cache;
    return {
      unitNameCache: unitNameCache,
      institutionNameCache: institutionNameCache,
      affiliation: {
        institutionName: institutionNameAndCache.institutionName,
        cristinInstitutionNr: affiliation.institution?.cristin_institution_id,
        isCristinInstitution: true,
        units: [
          {
            unitName: unitNameAndCache.unitName,
            unitNr: affiliation.unit ? affiliation.unit?.cristin_unit_id : '',
          },
        ],
      },
    };
  } else {
    return { unitNameCache: unitNameCache, institutionNameCache: institutionNameCache, affiliation: undefined };
  }
}

//This is hacky and should have been done at backend instead of being calculated on frontend
export const getContributorStatus = (contributor: ContributorType, activeAffiliations: Affiliation[] | undefined) => {
  if (
    contributor.affiliations &&
    activeAffiliations &&
    activeAffiliations.length > 0 &&
    contributor.identified_cristin_person
  ) {
    return ContributorStatus.Verified;
  } else if (contributor.require_higher_authorization) {
    return ContributorStatus.Unknown;
  } else if (contributor.cristin_person_id && contributor.cristin_person_id !== 0) {
    return ContributorStatus.NotVerified;
  } else {
    return ContributorStatus.None;
  }
};

export const generateAuthorPresentationFromImportPublication = (importPublication: ImportPublication) => {
  const maxAuthorsShown = 5;
  return importPublication.authors
    .slice(0, maxAuthorsShown)
    .map((author: any) => [author.firstname, author.surname].join(' '))
    .join('; ')
    .concat(importPublication.authors.length > maxAuthorsShown ? ' et al.' : '');
};

export const generateAuthorPresentationForCristinAuthors = (authors: ContributorType[]) => {
  const maxAuthorsShown = 5;
  return authors
    .slice(0, maxAuthorsShown)
    .map((author) => [author.first_name, author.surname].join(' '))
    .join('; ')
    .concat(authors.length > maxAuthorsShown ? ' et al.' : '');
};
