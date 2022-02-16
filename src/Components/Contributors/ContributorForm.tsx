import React, { FC, useEffect, useState } from 'react';
import { Button, Grid, Typography } from '@material-ui/core';
import ContributorSearchPanel from './ContributorSearchPanel';
import { Affiliation } from '../../types/InstitutionTypes';
import { ContributorStatus, ContributorWrapper } from '../../types/ContributorTypes';
import styled from 'styled-components';
import {
  StyledNotVerifiedBadge,
  StyledUnknownVerifiedBadge,
  StyledVerifiedBadge,
} from '../../assets/styles/StyledBadges';
import AddAffiliation from './AddAffiliation';
import EditAffiliation from './EditAffiliation';
import { Alert } from '@material-ui/lab';
import { checkContributorsForDuplicates } from './duplicateCheckHelper';
import { Colors } from '../../assets/styles/StyleConstants';

const StyledVerifiedNameTypography = styled(Typography)`
  color: ${Colors.Text.GREEN};
`;

const StyledGreyTypography = styled(Typography)`
  color: ${Colors.Text.OPAQUE_54_BLACK};
`;

const StyledInstitutionList = styled.div`
  margin-top: 1rem;
`;

const StyledAlert = styled(Alert)`
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
`;

interface ContributorFormProps {
  resultListIndex: number;
  contributorData: ContributorWrapper;
  updateContributor: (contributorData: ContributorWrapper, rowIndex: number) => void;
  deleteContributor: (index: number) => void;
  contributors: ContributorWrapper[];
}

const ContributorForm: FC<ContributorFormProps> = ({
  resultListIndex,
  contributorData,
  deleteContributor,
  updateContributor,
  contributors,
}) => {
  const [duplicateWarning, setDuplicateWarning] = useState('');
  const [duplicateError, setDuplicateError] = useState('');

  useEffect(() => {
    checkContributorsForDuplicates(contributorData, contributors, setDuplicateWarning, setDuplicateError, false);
  }, [
    contributorData.toBeCreated.first_name,
    contributorData.toBeCreated.surname,
    contributorData.toBeCreated.cristin_person_id,
  ]);

  return (
    <div data-testid={`contributor-form-${resultListIndex}`}>
      <Grid container spacing={2} justifyContent="space-between">
        <Grid item>
          {contributorData.toBeCreated.badge_type &&
          contributorData.toBeCreated.badge_type === ContributorStatus.Verified ? (
            <StyledVerifiedNameTypography data-testid={`contributor-form-${resultListIndex}-name`} variant="h6">
              <StyledVerifiedBadge
                data-testid={`verified-contributor-badge-${contributorData.toBeCreated.cristin_person_id}`}
              />
              {`${contributorData.toBeCreated.first_name} ${contributorData.toBeCreated.surname}`}
            </StyledVerifiedNameTypography>
          ) : (
            <StyledGreyTypography data-testid={`contributor-form-${resultListIndex}-name`} variant="h6">
              {contributorData.toBeCreated.badge_type === ContributorStatus.Unknown && (
                <StyledUnknownVerifiedBadge
                  data-testid={`unknown-verified-contributor-badge-${contributorData.toBeCreated.cristin_person_id}`}
                />
              )}
              {contributorData.toBeCreated.badge_type === ContributorStatus.NotVerified && (
                <StyledNotVerifiedBadge
                  data-testid={`not-verified-contributor-badge-${contributorData.toBeCreated.cristin_person_id}`}
                />
              )}
              {`${contributorData.toBeCreated.first_name} ${contributorData.toBeCreated.surname}`}
            </StyledGreyTypography>
          )}
        </Grid>
        <Grid item>
          <Button
            data-testid={`contributor-delete-button-form-${resultListIndex}`}
            color="secondary"
            onClick={() => deleteContributor(resultListIndex)}>
            Fjern bidragsyter
          </Button>
        </Grid>
        {duplicateError ? (
          <Grid item xs={12}>
            <StyledAlert data-testid={`contributor-form-${resultListIndex}-duplicate-error`} severity="error">
              {duplicateError}
            </StyledAlert>
          </Grid>
        ) : (
          duplicateWarning && (
            <Grid item xs={12}>
              <StyledAlert data-testid={`contributor-form-${resultListIndex}-duplicate-warning`} severity="warning">
                {duplicateWarning}
              </StyledAlert>
            </Grid>
          )
        )}
        <Grid item xs={12}>
          <ContributorSearchPanel
            contributorData={contributorData}
            resultListIndex={resultListIndex}
            updateContributor={updateContributor}
          />
        </Grid>
        {contributorData.toBeCreated.affiliations && contributorData.toBeCreated.affiliations.length > 0 ? (
          <Grid item xs={12}>
            <StyledInstitutionList data-testid={`list-item-author-${contributorData.toBeCreated.surname}-affiliations`}>
              {contributorData.toBeCreated.affiliations
                ?.filter(
                  (item: Affiliation, number: number) =>
                    contributorData.toBeCreated.affiliations?.indexOf(item) === number
                )
                .map((affiliation, affiliationIndex) => (
                  <EditAffiliation
                    key={`${affiliation.cristinInstitutionNr ?? 0}-${affiliationIndex}`}
                    affiliation={affiliation}
                    contributorData={contributorData}
                    resultListIndex={resultListIndex}
                    updateContributor={updateContributor}
                  />
                ))}
            </StyledInstitutionList>
          </Grid>
        ) : (
          <Grid item xs={12}>
            <StyledAlert data-testid={`contributor-form-${resultListIndex}-missing-affiliation-error`} severity="error">
              Bidragsyter mangler tilknytning
            </StyledAlert>
          </Grid>
        )}
      </Grid>

      <AddAffiliation
        contributorData={contributorData}
        resultListIndex={resultListIndex}
        updateContributor={updateContributor}
      />
    </div>
  );
};

export default ContributorForm;
