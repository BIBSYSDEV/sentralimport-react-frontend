import { ContributorWrapper, MaxLengthFirstName, MaxLengthLastName } from '../../types/ContributorTypes';
import { Dispatch, SetStateAction } from 'react';

const validateBasicMetaData = (contributors: ContributorWrapper[]): string[] => {
  const contributorErrors: string[] = [];
  contributors.forEach((contributor, index) => {
    const errors = [];
    const toBeCreated = contributor.toBeCreated;
    if (toBeCreated) {
      if (!toBeCreated.first_name || toBeCreated.first_name === '') errors.push('fornavn');
      if (!toBeCreated.surname || toBeCreated.surname === '') errors.push('etternavn');
      if (toBeCreated.affiliations && toBeCreated.affiliations.length < 1) errors.push('tilknytning');
      if (errors.length > 0) {
        contributorErrors.push(`${index + 1} (Mangler ${errors.join(', ')})`);
      }
      if (toBeCreated.first_name?.length > MaxLengthFirstName)
        contributorErrors.push(`${index + 1} (Fornavn er for langt)`);
      if (toBeCreated.surname?.length > MaxLengthLastName)
        contributorErrors.push(`${index + 1} (Etternavn er for langt)`);
    }
  });
  return contributorErrors;
};

const hasSameName = (contributorA: ContributorWrapper, contributorB: ContributorWrapper): boolean => {
  return (
    contributorA.toBeCreated.first_name.trim().toLowerCase() ===
      contributorB.toBeCreated.first_name.trim().toLowerCase() &&
    contributorA.toBeCreated.surname.trim().toLowerCase() === contributorB.toBeCreated.surname.trim().toLowerCase()
  );
};

export interface Duplicate {
  cristinDuplicates: number[];
  nameDuplicate: number[];
}

const findDuplicateContributors = (contributors: ContributorWrapper[]): Map<number, Duplicate> => {
  const duplicatesMap = new Map<number, Duplicate>();
  contributors.forEach((contributorA, contributorAIndex) => {
    const nameIndexes: number[] = [];
    const cristinIndexes: number[] = [];
    contributors.forEach((contributorB, contributorBIndex) => {
      if (contributorBIndex !== contributorAIndex) {
        if (hasSameName(contributorA, contributorB)) {
          nameIndexes.push(contributorBIndex);
        }
        if (hasSameCristinId(contributorA, contributorB)) {
          cristinIndexes.push(contributorBIndex);
        }
      }
    });
    if (nameIndexes.length > 0 || cristinIndexes.length > 0) {
      duplicatesMap.set(contributorAIndex, { cristinDuplicates: cristinIndexes, nameDuplicate: nameIndexes });
    }
  });
  return duplicatesMap;
};

const hasSameCristinId = (contributorA: ContributorWrapper, contributorB: ContributorWrapper): boolean => {
  return (
    !!contributorA.toBeCreated.cristin_person_id &&
    !!contributorB.toBeCreated.cristin_person_id &&
    contributorB.toBeCreated.cristin_person_id.toString() !== '0' &&
    contributorA.toBeCreated.cristin_person_id.toString() !== '0' &&
    contributorA.toBeCreated.cristin_person_id === contributorB.toBeCreated.cristin_person_id
  );
};

export const validateContributors = (
  contributors: ContributorWrapper[],
  setContributorErrors: Dispatch<SetStateAction<string[]>>,
  setDuplicateContributors: Dispatch<SetStateAction<Map<number, Duplicate>>>
) => {
  const contributorErrors: string[] = validateBasicMetaData(contributors);

  const duplicatesMap = findDuplicateContributors(contributors);
  setDuplicateContributors(duplicatesMap);
  const duplicateCristinIds = new Set<number>();
  duplicatesMap.forEach((duplicateList, key) => {
    if (duplicateList.cristinDuplicates.length > 0) {
      const cristinId = contributors[key].toBeCreated.cristin_person_id;
      if (!!cristinId && !duplicateCristinIds.has(cristinId)) {
        duplicateCristinIds.add(cristinId);
        contributorErrors.push(
          `${key + 1}, ${duplicateList.cristinDuplicates
            .map((index) => index + 1)
            .join(', ')} (Duplisert bidragsyter med cristinId: ${cristinId})`
        );
      }
    }
  });

  setContributorErrors(contributorErrors);
};
