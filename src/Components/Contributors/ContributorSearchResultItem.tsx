import React, { FC, useState } from 'react';
import { ContributorType } from '../../types/ContributorTypes';
import styled from 'styled-components';
import { Button, Grid, Typography } from '@material-ui/core';
import { Colors } from '../../assets/styles/StyleConstants';
import { Affiliation } from '../../types/InstitutionTypes';
import {
  StyledNotVerifiedBadge,
  StyledUnknownVerifiedBadge,
  StyledVerifiedBadge,
} from '../../assets/styles/StyledBadges';
import AffiliationDisplay, { StyledGridWithRightAlignContent } from './AffiliationDisplay';
import { AddAffiliationError } from './ContributorSearchPanel';

const StyledNameGridContainer = styled(Grid)`
  &.MuiGrid-container {
    margin-bottom: 1rem;
  }
`;

const ContributorSearchResultWrapper = styled.div`
  margin-bottom: 1rem;
`;

const StyledAffiliationsWrapper = styled.div`
  font-style: italic;
  margin-left: 10px;
  margin-bottom: 1rem;
`;

const StyledTypography = styled(Typography)`
  margin-left: 10px;
  color: ${Colors.Text.OPAQUE_54_BLACK};
`;

const StyledActivePersonNameTypography = styled(Typography)`
  color: ${Colors.Text.GREEN};
`;

const StyledInactivePersonNameTypography = styled(Typography)`
  color: ${Colors.Text.OPAQUE_41_BLACK};
`;

const sortContributorAffiliations = (affiliations: Affiliation[] | undefined) => {
  return affiliations?.sort((affiliationA, affiliationB) => {
    if (affiliationA.institutionName && affiliationB.institutionName) {
      return affiliationA.institutionName.localeCompare(affiliationB.institutionName);
    }
    return 0;
  });
};

export const generateAffiliationDisplayData = (affiliation: Affiliation) => {
  return {
    institutionName: affiliation.institutionName ?? '',
    cristinInstitutionNr: affiliation.cristinInstitutionNr,
    units: affiliation.units
      ? affiliation.units
          .filter((unit) => unit.unitName !== affiliation.institutionName)
          .map((unit) => ({
            cristin_unit_id: unit.unitNr,
            unit_name: { nb: unit.unitName },
          }))
      : [],
    countryCode: affiliation.countryCode ?? '',
  };
};

interface ContributorSearchResultItemProps {
  contributor: ContributorType;
  handleChoose: (author: ContributorType) => void;
  handleChooseOnlyAuthor: (author: ContributorType) => void;
  handleChooseOnlyAffiliation: (affiliation: Affiliation) => void;
  addAffiliationSuccessful: string | undefined;
  addAffiliationError: AddAffiliationError | undefined;
}

const ContributorSearchResultItem: FC<ContributorSearchResultItemProps> = ({
  contributor,
  handleChoose,
  handleChooseOnlyAuthor,
  handleChooseOnlyAffiliation,
  addAffiliationSuccessful,
  addAffiliationError,
}) => {
  const [isActive] = useState(
    contributor.affiliations &&
      contributor.affiliations.some((affiliation) => affiliation.isCristinInstitution) &&
      contributor.identified_cristin_person
  );

  return (
    <ContributorSearchResultWrapper>
      <StyledNameGridContainer container>
        <Grid item sm={8}>
          {isActive ? (
            <StyledActivePersonNameTypography data-testid={`author-name-${contributor.cristin_person_id}`} variant="h6">
              <StyledVerifiedBadge data-testid={`author-name-${contributor.cristin_person_id}-verified-badge`} />

              {`${contributor.first_name_preferred ?? contributor.first_name} ${
                contributor.surname_preferred ?? contributor.surname
              }`}
            </StyledActivePersonNameTypography>
          ) : (
            <StyledInactivePersonNameTypography
              data-testid={`author-name-${contributor.cristin_person_id}`}
              variant="h6">
              {contributor.require_higher_authorization ? (
                <StyledUnknownVerifiedBadge
                  data-testid={`author-name-${contributor.cristin_person_id}-uknown-verified-badge`}
                  title="Ukjent verifikasjonsstatus"
                />
              ) : (
                <StyledNotVerifiedBadge
                  data-testid={`author-name-${contributor.cristin_person_id}-not-verified-badge`}
                />
              )}
              {`${contributor.first_name_preferred ?? contributor.first_name} ${
                contributor.surname_preferred ?? contributor.surname
              }`}
            </StyledInactivePersonNameTypography>
          )}
        </Grid>
        <StyledGridWithRightAlignContent item sm={4}>
          <Button
            data-testid={`add-only-person-${contributor.cristin_person_id}`}
            onClick={() => handleChooseOnlyAuthor(contributor)}
            size="small"
            color="primary">
            Velg kun person
          </Button>
        </StyledGridWithRightAlignContent>
      </StyledNameGridContainer>
      {sortContributorAffiliations(contributor.affiliations)?.map((affiliation, affiliationIndex) => (
        <AffiliationDisplay
          addAffiliationSuccessful={addAffiliationSuccessful}
          handleAddAffiliationButtonClick={() => handleChooseOnlyAffiliation(affiliation)}
          key={`${affiliation.cristinInstitutionNr ?? 0}-${affiliationIndex}`}
          affiliation={generateAffiliationDisplayData(affiliation)}
          dataTestid={`institution-${affiliation.cristinInstitutionNr}`}
          backgroundcolor={Colors.LIGHT_GREY}
          addAffiliationError={addAffiliationError}
        />
      ))}
      {contributor.affiliations?.length === 0 && contributor.require_higher_authorization && (
        <StyledAffiliationsWrapper>
          <StyledTypography data-testid={`person-limited-access-${contributor.cristin_person_id}`} color="error">
            Kan ikke hente inn institusjoner for denne bidragsyteren.
          </StyledTypography>
        </StyledAffiliationsWrapper>
      )}
      <Button
        data-testid={`add-person-and-affiliations-${contributor.cristin_person_id}`}
        size="small"
        variant="outlined"
        color="primary"
        onClick={() => handleChoose(contributor)}>
        {contributor.affiliations && contributor.affiliations.length > 0
          ? 'Velg person og tilknyttning'
          : 'Velg person og fjern tilknytninger'}
      </Button>
      <hr />
    </ContributorSearchResultWrapper>
  );
};

export default ContributorSearchResultItem;
