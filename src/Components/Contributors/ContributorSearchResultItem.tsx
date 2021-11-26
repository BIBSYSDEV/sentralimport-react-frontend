import React, { FC, useState } from 'react';
import { ContributorType } from '../../types/ContributorTypes';
import styled from 'styled-components';
import { Button, Typography } from '@material-ui/core';
import { Colors } from '../../assets/styles/StyleConstants';

const StyledChooseButton = styled(Button)`
  justify-self: flex-end;
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
  color: ${Colors.Text.OPAQUE_54_BLACK};
`;

interface ContributorSearchResultItemProps {
  contributor: ContributorType;
  handleChoose: (author: ContributorType) => void;
}

const ContributorSearchResultItem: FC<ContributorSearchResultItemProps> = ({ contributor, handleChoose }) => {
  const [isActive] = useState(
    contributor.affiliations && contributor.affiliations.some((affiliation) => affiliation.isCristinInstitution)
  );

  return (
    <div>
      {isActive ? (
        <StyledActivePersonNameTypography variant="h6">
          {`${contributor.first_name_preferred ?? contributor.first_name} ${
            contributor.surname_preferred ?? contributor.surname
          }`}
        </StyledActivePersonNameTypography>
      ) : (
        <StyledInactivePersonNameTypography variant="h6">
          {`${contributor.first_name_preferred ?? contributor.first_name} ${
            contributor.surname_preferred ?? contributor.surname
          }`}
        </StyledInactivePersonNameTypography>
      )}
      {contributor.affiliations?.map((affiliation: any, h: number) => (
        <StyledAffiliationsWrapper
          data-testid={`list-item-author-${contributor.cristin_person_id}-affiliations-${affiliation.cristinInstitutionNr}`}
          key={h}>
          {affiliation.institutionName}
          {affiliation.units &&
            affiliation.units.map((unit: any, i: number) => <div key={i}>&bull; {unit.unitName}</div>)}
        </StyledAffiliationsWrapper>
      ))}

      {contributor.affiliations?.length === 0 && contributor.require_higher_authorization && (
        <StyledAffiliationsWrapper>
          <StyledTypography data-testid={`person-limited-access-${contributor.cristin_person_id}`} color="error">
            Kan ikke hente inn institusjoner for denne bidragsyteren.
          </StyledTypography>
        </StyledAffiliationsWrapper>
      )}
      <StyledChooseButton color="primary" onClick={() => handleChoose(contributor)}>
        Velg denne
      </StyledChooseButton>
      <hr />
    </div>
  );
};

export default ContributorSearchResultItem;
