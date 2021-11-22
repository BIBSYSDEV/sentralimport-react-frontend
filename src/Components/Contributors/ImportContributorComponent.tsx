import React, { FC } from 'react';
import styled from 'styled-components';
import { Button, Typography } from '@material-ui/core';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';

const StyledActionWrapper = styled.div`
  margin-top: 1rem;
`;

interface ContributorOrderComponentProps {
  row: any;
  handleChooseAuthor: any;
}

const ContributorOrderComponent: FC<ContributorOrderComponentProps> = ({ row, handleChooseAuthor }) => {
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
      {row.imported.affiliations.map((institution: any, index: number) => (
        <div key={index} data-testid={`creator-institutions-${row.toBeCreated.order}`}>
          <Typography gutterBottom style={{ fontStyle: `italic`, fontSize: '0.9rem' }}>
            {institution.unitName /*TODO: kan splittes på ';'*/}
            {institution.countryCode && ' (' + institution.countryCode + ')'}
          </Typography>
        </div>
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
