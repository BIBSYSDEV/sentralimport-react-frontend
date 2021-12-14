import React, { FC } from 'react';
import '../../assets/styles/common.scss';
import { ContributorWrapper } from '../../types/ContributorTypes';
import { Affiliation } from '../../types/InstitutionTypes';
import ContributorForm from './ContributorForm';

interface ContributorProps {
  contributorData: ContributorWrapper;
  updateContributor: (contributorData: ContributorWrapper, rowIndex: number) => void;
  resultListIndex: number;
  handleChosenAuthorAffiliations: (affiliations: Affiliation[]) => Promise<Affiliation[]>;
  deleteContributor: (index: number) => void;
}

const Contributor: FC<ContributorProps> = ({
  contributorData,
  updateContributor,
  resultListIndex,
  handleChosenAuthorAffiliations,
  deleteContributor,
}) => {
  return (
    <ContributorForm
      resultListIndex={resultListIndex}
      contributorData={contributorData}
      updateContributor={updateContributor}
      deleteContributor={deleteContributor}
      handleChosenAuthorAffiliations={handleChosenAuthorAffiliations}
    />
  );
};

export default Contributor;
