import React, { FC, useState } from 'react';
import { ContributorType } from '../../types/ContributorTypes';
import styled from 'styled-components';
import { Button, Typography } from '@material-ui/core';
import { Colors } from '../../assets/styles/StyleConstants';
import {
  StyledNotVerifiedBadge,
  StyledUnknownVerifiedBadge,
  StyledVerifiedBadge,
} from '../../assets/styles/StyledComponents';
import AffiliationDisplay from './AffiliationDisplay';

const StyledChooseButton = styled(Button)`
  &.MuiButtonBase-root {
    margin-top: 1rem;
  }
`;

const StyledAffiliationsWrapper = styled.div`
  font-style: italic;
  margin-left: 10px;
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

interface ContributorSearchResultItemProps {
  contributor: ContributorType;
  handleChoose: (author: ContributorType) => void;
}

const ContributorSearchResultItem: FC<ContributorSearchResultItemProps> = ({ contributor, handleChoose }) => {
  const [isActive] = useState(
    contributor.affiliations &&
      contributor.affiliations.some((affiliation) => affiliation.isCristinInstitution) &&
      contributor.identified_cristin_person
  );

  return (
    <div>
      {isActive ? (
        <StyledActivePersonNameTypography data-testid={`author-name-${contributor.cristin_person_id}`} variant="h6">
          <StyledVerifiedBadge data-testid={`author-name-${contributor.cristin_person_id}-verified-badge`} />

          {`${contributor.first_name_preferred ?? contributor.first_name} ${
            contributor.surname_preferred ?? contributor.surname
          }`}
        </StyledActivePersonNameTypography>
      ) : (
        <StyledInactivePersonNameTypography data-testid={`author-name-${contributor.cristin_person_id}`} variant="h6">
          {contributor.require_higher_authorization ? (
            <StyledUnknownVerifiedBadge
              data-testid={`author-name-${contributor.cristin_person_id}-uknown-verified-badge`}
              title="Ukjent verifikasjonsstatus"
            />
          ) : (
            <StyledNotVerifiedBadge data-testid={`author-name-${contributor.cristin_person_id}-not-verified-badge`} />
          )}
          {`${contributor.first_name_preferred ?? contributor.first_name} ${
            contributor.surname_preferred ?? contributor.surname
          }`}
        </StyledInactivePersonNameTypography>
      )}
      {contributor.affiliations
        ?.sort((affiliationA, affiliationB) => {
          if (affiliationA.institutionName && affiliationB.institutionName) {
            return affiliationA.institutionName.localeCompare(affiliationB.institutionName);
          }
          return 0;
        })
        .map((affiliation) => (
          <AffiliationDisplay
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
            dataTestid={`institution-${affiliation.cristinInstitutionNr}`}
            backgroundcolor={Colors.LIGHT_GREY}
          />
        ))}

      {contributor.affiliations?.length === 0 && contributor.require_higher_authorization && (
        <StyledAffiliationsWrapper>
          <StyledTypography data-testid={`person-limited-access-${contributor.cristin_person_id}`} color="error">
            Kan ikke hente inn institusjoner for denne bidragsyteren.
          </StyledTypography>
        </StyledAffiliationsWrapper>
      )}
      <StyledChooseButton size="small" variant="outlined" color="primary" onClick={() => handleChoose(contributor)}>
        Velg denne
      </StyledChooseButton>
      <hr />
    </div>
  );
};

export default ContributorSearchResultItem;
