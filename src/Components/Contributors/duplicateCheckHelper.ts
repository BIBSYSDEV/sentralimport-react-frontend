import { ContributorWrapper } from '../../types/ContributorTypes';

export const checkContributorsForDuplicates = (
  contributorData: ContributorWrapper,
  allContributors: ContributorWrapper[],
  setDuplicateWarning: any,
  setDuplicateError: any,
  isUpdate: boolean
) => {
  setDuplicateWarning('');
  if (allContributors.length > 0) {
    if (contributorData.toBeCreated.cristin_person_id && contributorData.toBeCreated.cristin_person_id !== 0) {
      const duplicateIdList = allContributors.filter(
        (contributor: ContributorWrapper) =>
          contributor.toBeCreated.cristin_person_id === contributorData.toBeCreated.cristin_person_id
      );
      if (duplicateIdList.length > (isUpdate ? 0 : 1)) {
        const duplicatesIndex = duplicateIdList
          .filter(
            (contributor: ContributorWrapper) => contributor.toBeCreated.order !== contributorData.toBeCreated.order
          )
          .map((item: ContributorWrapper) => item.toBeCreated.order);
        setDuplicateError(`Det finnes bidragsytere med samme id på plass: ${duplicatesIndex.toString()}`);
      }
    }

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
      setDuplicateWarning(`Det finnes bidragsytere med samme navn på plass: ${duplicatesIndex.toString()}`);
    }
  }
};
