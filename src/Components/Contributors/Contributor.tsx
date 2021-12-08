import React, { FC } from 'react';
import { Button, Typography } from '@material-ui/core';
import '../../assets/styles/common.scss';
import { Colors } from '../../assets/styles/StyleConstants';
import styled from 'styled-components';
import { ContributorWrapper } from '../../types/ContributorTypes';
import { Affiliation } from '../../types/InstitutionTypes';
import AffiliationDisplay from './AffiliationDisplay';
import { ReactComponent as VerifiedBadge } from '../../assets/icons/verified-badge.svg';
import ContributorForm from './ContributorForm';

const StyledVerifiedBadge = styled(VerifiedBadge)`
  margin-right: 0.5rem;
  width: 1.7rem;
  height: 1.7rem;
  & path {
    fill: ${Colors.Text.GREEN};
  }
`;

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
  function updateEditing() {
    const temp = contributorData;
    temp.isEditing = true;
    updateContributor(temp, resultListIndex);
  }

  return (
    <div>
      {!contributorData.isEditing ? (
        <div data-testid={`contributor-for-import-wrapper-${resultListIndex}`}>
          <Typography gutterBottom variant="h6">
            {contributorData.toBeCreated.first_name + ' ' + contributorData.toBeCreated.surname}
            {contributorData.toBeCreated.identified_cristin_person && (
              <>
                <StyledVerifiedBadge />
                <Typography variant="srOnly">Har CristinId</Typography>
              </>
            )}
          </Typography>
          <div className={`metadata`}>
            {contributorData.toBeCreated.affiliations
              ?.sort((affiliationA, affiliationB) => {
                if (affiliationA.institutionName && affiliationB.institutionName) {
                  return affiliationA.institutionName.localeCompare(affiliationB.institutionName);
                }
                return 0;
              })
              .map((affiliation, affiliationIndex) => (
                <AffiliationDisplay
                  key={`${affiliation.cristinInstitutionNr ?? 0}-${affiliationIndex}`}
                  affiliation={{
                    institutionName: affiliation.institutionName ?? '',
                    units: affiliation.units
                      ? affiliation.units
                          .filter((unit) => unit.unitName !== affiliation.institutionName)
                          .map((unit) => ({
                            cristin_unit_id: unit.unitNr,
                            unit_name: { nb: unit.unitName },
                          }))
                          .reverse()
                      : [],
                    countryCode: affiliation.countryCode ?? '',
                  }}
                  dataTestid={`list-item-author-${contributorData.toBeCreated.cristin_person_id}-affiliations-${affiliation.cristinInstitutionNr}`}
                  backgroundcolor={Colors.LIGHT_GREY}
                />
              ))}
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
            <Button data-testid={`contributor-edit-button-${resultListIndex}`} color="primary" onClick={updateEditing}>
              Rediger
            </Button>
            <Button
              data-testid={`contributor-delete-button-${resultListIndex}`}
              color="secondary"
              onClick={() => deleteContributor(resultListIndex)}>
              Slett person
            </Button>
          </div>
        </div>
      ) : (
        <ContributorForm
          resultListIndex={resultListIndex}
          contributorData={contributorData}
          updateContributor={updateContributor}
          deleteContributor={deleteContributor}
          handleChosenAuthorAffiliations={handleChosenAuthorAffiliations}
        />
      )}
    </div>
  );
};

export default Contributor;
