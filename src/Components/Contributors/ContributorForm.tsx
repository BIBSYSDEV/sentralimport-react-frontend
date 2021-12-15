import React, { FC } from 'react';
import { Button, Grid, Typography } from '@material-ui/core';
import ContributorSearchPanel from './ContributorSearchPanel';
import { Affiliation } from '../../types/InstitutionTypes';
import { BadgeType, ContributorWrapper } from '../../types/ContributorTypes';
import styled from 'styled-components';
import {
  StyledNotVerifiedBadge,
  StyledUnknownVerifiedBadge,
  StyledVerifiedBadge,
} from '../../assets/styles/StyledBadges';
import AddAffiliation from './AddAffiliation';
import EditAffiliation from './EditAffiliation';
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

const StyledFlexEndButtons = styled(Button)`
  &&.MuiButton-root {
    margin-left: 1rem;
  }
`;

interface ContributorFormProps {
  resultListIndex: number;
  contributorData: ContributorWrapper;
  updateContributor: (contributorData: ContributorWrapper, rowIndex: number) => void;
  deleteContributor: (index: number) => void;
  handleChosenAuthorAffiliations: (affiliations: Affiliation[]) => Promise<Affiliation[]>;
}

const ContributorForm: FC<ContributorFormProps> = ({
  resultListIndex,
  contributorData,
  deleteContributor,
  updateContributor,
  handleChosenAuthorAffiliations,
}) => {
  async function handleSubmit() {
    //TODO: finn ut om det er noen grunn til objekt-copy i det hele tatt ?
    const temp = JSON.parse(JSON.stringify(contributorData));
    const cleanedAffiliations = await handleChosenAuthorAffiliations(temp.toBeCreated.affiliations);
    //removeInstitutionsDuplicatesBasedOnCristinId trengs fordi dubletter kan komme inn med importdata.
    temp.toBeCreated.affiliations = removeInstitutionsDuplicatesBasedOnCristinId(cleanedAffiliations);
    temp.isEditing = false;
    await updateContributor(temp, resultListIndex);
  }

  function removeInstitutionsDuplicatesBasedOnCristinId(affiliations: Affiliation[]) {
    const cristinIdSet = new Set();
    return affiliations.filter((affiliation: Affiliation) => {
      if (cristinIdSet.has(affiliation.cristinInstitutionNr)) return false;
      cristinIdSet.add(affiliation.cristinInstitutionNr);
      return true;
    });
  }

  return (
    <div data-testid={`contributor-form-${resultListIndex}`}>
      <Typography>{JSON.stringify(contributorData.toBeCreated)}</Typography>
      {contributorData.toBeCreated.badge_type && contributorData.toBeCreated.badge_type === BadgeType.Verified ? (
        <StyledVerifiedNameTypography data-testid={`contributor-form-${resultListIndex}-name`} variant="h6">
          <StyledVerifiedBadge
            data-testid={`verified-contributor-badge-${contributorData.toBeCreated.cristin_person_id}`}
          />
          {`${contributorData.toBeCreated.first_name} ${contributorData.toBeCreated.surname}`}
        </StyledVerifiedNameTypography>
      ) : (
        <StyledGreyTypography data-testid={`contributor-form-${resultListIndex}-name`} variant="h6">
          {contributorData.toBeCreated.badge_type === BadgeType.Unknown && (
            <StyledUnknownVerifiedBadge
              data-testid={`verified-contributor-badge-${contributorData.toBeCreated.cristin_person_id}`}
            />
          )}
          {contributorData.toBeCreated.badge_type === BadgeType.NotVerified && (
            <StyledNotVerifiedBadge
              data-testid={`verified-contributor-badge-${contributorData.toBeCreated.cristin_person_id}`}
            />
          )}
          {`${contributorData.toBeCreated.first_name} ${contributorData.toBeCreated.surname}`}
        </StyledGreyTypography>
      )}

      <ContributorSearchPanel
        contributorData={contributorData}
        resultListIndex={resultListIndex}
        updateContributor={updateContributor}
      />
      <StyledInstitutionList>
        {contributorData.toBeCreated.affiliations
          ?.filter(
            (item: Affiliation, number: number) => contributorData.toBeCreated.affiliations?.indexOf(item) === number
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
      <AddAffiliation
        contributorData={contributorData}
        resultListIndex={resultListIndex}
        updateContributor={updateContributor}
      />
      <Grid container spacing={2}>
        <Grid item>
          <StyledFlexEndButtons
            variant="outlined"
            data-testid={`contributor-delete-button-form-${resultListIndex}`}
            color="secondary"
            onClick={() => deleteContributor(resultListIndex)}>
            Slett person
          </StyledFlexEndButtons>
        </Grid>
        <Grid item>
          <StyledFlexEndButtons
            variant="outlined"
            data-testid={`contributor-save-and-close-button-${resultListIndex}`}
            color="primary"
            onClick={handleSubmit}>
            Lukk
          </StyledFlexEndButtons>
        </Grid>
      </Grid>
    </div>
  );
};

export default ContributorForm;
