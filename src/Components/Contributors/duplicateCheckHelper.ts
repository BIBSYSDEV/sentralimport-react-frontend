import { ContributorWrapper } from '../../types/ContributorTypes';

export const checkLocalstorageForDuplicates = (contributorData: ContributorWrapper) => {
  const contributorsFromLocalStorage = JSON.parse(localStorage.getItem('tempContributors') || '{}');
  if (contributorsFromLocalStorage.contributors?.length > 0) {
    return contributorsFromLocalStorage.contributors.filter((contributor: ContributorWrapper) => {
      return (
        contributorData.toBeCreated.first_name === contributor.toBeCreated.first_name &&
        contributorData.toBeCreated.surname === contributor.toBeCreated.surname
      );
    });
  }
  return [];
};
