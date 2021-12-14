import { ContributorWrapper } from '../../types/ContributorTypes';

export const checkContributorsForDuplicates = (
  contributorData: ContributorWrapper,
  setDuplicateWarning: any,
  isUpdate: boolean
) => {
  setDuplicateWarning('');
  const contributorsFromLocalStorage = JSON.parse(localStorage.getItem('tempContributors') || '{}');
  if (contributorsFromLocalStorage.contributors?.length > 0) {
    const duplicateList = contributorsFromLocalStorage.contributors.filter((contributor: ContributorWrapper) => {
      return (
        contributorData.toBeCreated.first_name === contributor.toBeCreated.first_name &&
        contributorData.toBeCreated.surname === contributor.toBeCreated.surname
      );
    });
    if (duplicateList.length > (isUpdate ? 0 : 1)) {
      const duplicatesIndex = duplicateList
        .filter(
          (contributor: ContributorWrapper) => contributor.toBeCreated.order !== contributorData.toBeCreated.order
        )
        .map((item: ContributorWrapper) => item.toBeCreated.order);
      setDuplicateWarning(`Det finnes bidragsytere med samme navn på plass: ${duplicatesIndex.toString()}`);
    }
  }
};
