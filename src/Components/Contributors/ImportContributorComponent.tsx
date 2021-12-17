import React, { FC } from 'react';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';
import AffiliationDisplay from './AffiliationDisplay';
import { Colors } from '../../assets/styles/StyleConstants';
import { ContributorWrapper } from '../../types/ContributorTypes';
import { SimpleUnitResponse } from '../../types/InstitutionTypes';

// const StyledActionWrapper = styled.div`
//   margin-top: 1rem;
// `;

const StyledNameTypography = styled(Typography)`
  &.MuiTypography-root {
    margin-bottom: 2rem;
  }
`;

interface AffiliationDisplayType {
  units: SimpleUnitResponse[];
  institutionName: string;
  countryCode: string;
}

interface ContributorOrderComponentProps {
  row: ContributorWrapper;
  handleChooseAuthor: any;
}

const ContributorOrderComponent: FC<ContributorOrderComponentProps> = ({ row, handleChooseAuthor }) => {
  //UnitName is a string of departments split by ";", most important unit last in the list.
  const affiliations: AffiliationDisplayType[] = row.imported.affiliations
    ? row.imported.affiliations
        .slice()
        .sort((affiliationA, affiliationB) => {
          if (
            affiliationA.institutionName &&
            affiliationB.institutionName &&
            affiliationA.institutionName.localeCompare(affiliationB.institutionName) !== 0
          ) {
            return affiliationA.institutionName.localeCompare(affiliationB.institutionName);
          } else if (affiliationA.unitName && affiliationB.unitName) {
            return affiliationA.unitName.localeCompare(affiliationB.unitName);
          } else {
            return 0;
          }
        })
        .map((affiliation) => ({
          units: affiliation.unitName
            ? affiliation.unitName
                .replace(affiliation.institutionName ?? '', '')
                .split(';')
                .filter((unit: string) => unit.length > 0)
                .map((unit) => ({ cristin_unit_id: undefined, unit_name: { nb: unit } }))
                .reverse()
            : [],
          institutionName: affiliation.institutionName ?? '',
          countryCode: affiliation.countryCode ?? '',
        }))
    : [];

  return (
    <>
      <StyledNameTypography variant="h6" gutterBottom data-testid={`creator-name-${row.toBeCreated.order}`}>
        {row.imported.surname && row.imported.first_name
          ? row.imported.first_name + ' ' + row.imported.surname
          : row.imported.authorName}
      </StyledNameTypography>
      {affiliations.map((affiliation, affiliationIndex) => (
        <AffiliationDisplay
          key={`${affiliationIndex}`}
          backgroundcolor={Colors.LIGHT_GREY}
          affiliation={affiliation}
          dataTestid={`creator-${row.toBeCreated.order}-institution-${affiliationIndex}`}
        />
      ))}
      {/*TODO: Knappen skal bare gjemmes før den skrives om*/}
      {/*{row.imported.surname && row.imported.first_name && (*/}
      {/*  <StyledActionWrapper>*/}
      {/*    <Button*/}
      {/*      variant="outlined"*/}
      {/*      color="primary"*/}
      {/*      data-testid={`creator-choose-this-button-${row.toBeCreated.order}`}*/}
      {/*      onClick={() => handleChooseAuthor(row)}>*/}
      {/*      Velg denne*/}
      {/*    </Button>*/}
      {/*  </StyledActionWrapper>*/}
      {/*)}*/}
    </>
  );
};

export default ContributorOrderComponent;
