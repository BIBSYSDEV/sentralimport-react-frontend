import { ContributorWrapper } from '../../types/ContributorTypes';
import { Dispatch, SetStateAction } from 'react';

const validateBasicMetaData = (contributors: ContributorWrapper[]): string[] => {
  const contributorErrors: string[] = [];
  contributors.forEach((contributor, index) => {
    const errors = [];
    const toBeCreated = contributor.toBeCreated;
    if (!toBeCreated.first_name || toBeCreated.first_name === '') errors.push('fornavn');
    if (!toBeCreated.surname || toBeCreated.surname === '') errors.push('etternavn');
    if (toBeCreated.affiliations && toBeCreated.affiliations.length < 1) errors.push('tilknytning');
    if (errors.length > 0) {
      contributorErrors.push(`${index + 1} (Mangler ${errors.join(', ')})`);
    }
  });
  return contributorErrors;
};

const findDuplicateContributors = (contributors: ContributorWrapper[]): Map<number, number[]> => {
  const allCristinIds = contributors.map((contributor) => contributor.toBeCreated.cristin_person_id);
  const allDifferentCristinIds = new Set(allCristinIds);
  const duplicatesMap = new Map<number, number[]>();
  allDifferentCristinIds.forEach((cristinId) => {
    if (cristinId && cristinId !== 0) {
      const indexes: number[] = [];
      allCristinIds.forEach((_id, index) => {
        if (_id === cristinId) {
          indexes.push(index);
        }
      });
      if (indexes.length > 1) duplicatesMap.set(cristinId, indexes);
    }
  });
  return duplicatesMap;
};

export const validateContributors = (
  contributors: ContributorWrapper[],
  setContributorErrors: Dispatch<SetStateAction<string[]>>,
  setDuplicateContributors: Dispatch<SetStateAction<Map<number, number[]>>>
) => {
  const contributorErrors: string[] = validateBasicMetaData(contributors);

  const duplicatesMap = findDuplicateContributors(contributors);
  setDuplicateContributors(duplicatesMap);
  duplicatesMap.forEach((duplicateList, key) => {
    contributorErrors.push(`${duplicateList.join(', ')} (Duplisert bidragsyter med cristinId: ${key})`);
  });

  setContributorErrors(contributorErrors);
};
