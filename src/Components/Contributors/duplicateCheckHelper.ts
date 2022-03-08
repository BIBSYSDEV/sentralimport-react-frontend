import { ContributorWrapper } from '../../types/ContributorTypes';

export const checkContributorsForNameDuplicates = (
  contributorData: ContributorWrapper,
  allContributors: ContributorWrapper[],
  isUpdate: boolean
) => {
  if (allContributors.length > 0) {
    const duplicateNameList = allContributors.filter((contributor: ContributorWrapper) => {
      return (
        contributorData.toBeCreated.first_name === contributor.toBeCreated.first_name &&
        contributorData.toBeCreated.surname === contributor.toBeCreated.surname
      );
    });
    if (duplicateNameList.length > (isUpdate ? 0 : 1)) {
      const duplicatesIndex = duplicateNameList
        .filter(
          (contributor: ContributorWrapper) => contributor.toBeCreated.order !== contributorData.toBeCreated.order
        )
        .map((item: ContributorWrapper) => item.toBeCreated.order);
      return `Det finnes bidragsytere med samme navn på plass: ${duplicatesIndex.toString()}`;
    }
  }
  return '';
};
