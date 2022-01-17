import { ContributorWrapper } from '../../types/ContributorTypes';

const getAllIndexes = (array: any[], value: any) => {
  const indexes = [];
  for (let i = 0; i < array.length; i++) if (array[i] === value) indexes.push(i);
  return indexes;
};

export const validateContributors = (
  tempContributors: ContributorWrapper[],
  setContributorErrors: (value: string[]) => void
) => {
  //TODO: replace  validation with formik and yup
  const contributorErrors: string[] = [];

  tempContributors.map((contributor, index) => {
    const errors = [];
    const toBeCreated = contributor.toBeCreated;
    if (!toBeCreated.first_name || toBeCreated.first_name === '') errors.push('fornavn');
    if (!toBeCreated.surname || toBeCreated.surname === '') errors.push('etternavn');
    if (toBeCreated.affiliations && toBeCreated.affiliations.length < 1) errors.push('tilknytning');
    if (errors.length > 0) {
      contributorErrors.push(`${index + 1} (Mangler ${errors.join(', ')})`);
    }
  });

  let duplicateCristinIdIndexList: number[] = [];
  const allCristinIds = tempContributors.map((contributor) => contributor.toBeCreated.cristin_person_id);
  const isDuplicate = allCristinIds.some((cristinId, index) => {
    if (cristinId && cristinId !== 0 && allCristinIds.indexOf(cristinId) != index) {
      duplicateCristinIdIndexList = duplicateCristinIdIndexList.concat(getAllIndexes(allCristinIds, cristinId));
      return true;
    } else return false;
  });
  if (isDuplicate) contributorErrors.push(`${duplicateCristinIdIndexList.join(', ')}  har duplisert cristinID`);

  setContributorErrors(contributorErrors);
};
