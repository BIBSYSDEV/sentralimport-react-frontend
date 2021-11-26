import React, { FC } from 'react';
import styled from 'styled-components';
import { Button, Typography } from '@material-ui/core';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import AffiliationDisplay from './AffiliationDisplay';
import { Colors } from '../../assets/styles/StyleConstants';

const StyledActionWrapper = styled.div`
  margin-top: 1rem;
`;

interface AffiliationDisplayGurba {
  units: string[];
  institutionName: string;
  countryCode: string;
}

interface ContributorOrderComponentProps {
  row: any;
  handleChooseAuthor: any;
}

const ContributorOrderComponent: FC<ContributorOrderComponentProps> = ({ row, handleChooseAuthor }) => {
  //UnitName is a string of departments split by ";", most important unit last.
  const affiliations: AffiliationDisplayGurba[] = row.imported.affiliations
    .slice()
    .sort((affiliationA: any, affiliationB: any) => {
      if (affiliationA.institutionName.localeCompare(affiliationB.institutionName) === 0) {
        return affiliationA.unitName.localeCompare(affiliationB.unitName);
      }
      return affiliationA.institutionName.localeCompare(affiliationB.institutionName);
    })
    .map((affiliation: any) => ({
      units: affiliation.unitName
        .replace(affiliation.institutionName, '')
        .split(';')
        .filter((unit: string) => unit.length > 0)
        .reverse(),
      institutionName: affiliation.institutionName,
      countryCode: affiliation.countryCode,
    }));

  return (
    <>
      <Typography variant="h6" gutterBottom data-testid={`creator-name-${row.toBeCreated.order}`}>
        {row.imported.surname && row.imported.first_name
          ? row.imported.first_name + ' ' + row.imported.surname
          : row.imported.authorName}{' '}
        {row.cristin.identified_cristin_person && (
          <>
            <VerifiedUserIcon color="primary" />
            <Typography variant="srOnly">Har CristinId</Typography>
          </>
        )}
      </Typography>
      {affiliations.map((affiliation, affiliationIndex) => (
        <AffiliationDisplay
          key={`${affiliationIndex}`}
          backgroundcolor={Colors.LIGHT_GREY}
          affiliation={affiliation}
          dataTestid={`creator-institutions-${row.toBeCreated.order}`}
        />
      ))}
      {row.imported.surname && row.imported.first_name && (
        <StyledActionWrapper>
          <Button
            variant="outlined"
            color="primary"
            data-testid={`creator-choose-this-button-${row.toBeCreated.order}`}
            onClick={() => handleChooseAuthor(row)}>
            Velg denne
          </Button>
        </StyledActionWrapper>
      )}
    </>
  );
};

export default ContributorOrderComponent;
