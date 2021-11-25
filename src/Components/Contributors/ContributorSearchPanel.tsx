import React, { FC } from 'react';
import { Button, Card, Collapse, Typography } from '@material-ui/core';
import styled from 'styled-components';
import { Colors } from '../../assets/styles/StyleConstants';
import { ContributorType } from '../../types/ContributorTypes';

const StyledChooseButton = styled(Button)`
  justify-self: flex-end;
`;

const StyledAuthorWrapper = styled.div`
  color: ${Colors.Text.GREEN};
  margin-top: 10px;
  margin-left: 10px;
`;

const StyledAffiliationsWrapper = styled.div`
  font-style: italic;
  margin-left: 10px;
`;

const StyledTypography = styled(Typography)`
  margin-left: 10px;
`;

interface ContributorSearchPanelProps {
  searchResult: any[];
  collapsed: boolean;
  handleChoose: (author: any) => void;
  handleAbort: () => void;
}

const ContributorSearchPanel: FC<ContributorSearchPanelProps> = ({
  searchResult,
  collapsed,
  handleChoose,
  handleAbort,
}) => {
  return searchResult.length > 0 ? (
    <Collapse in={collapsed}>
      <Card>
        <div>
          {searchResult.map((author: ContributorType, searchResultIndex: number) => (
            <span key={searchResultIndex}>
              <StyledAuthorWrapper data-testid={`author-name-${author.cristin_person_id}`}>
                {(author.first_name_preferred ?? author.first_name) +
                  ' ' +
                  (author.surname_preferred ?? author.surname)}
              </StyledAuthorWrapper>
              {author.affiliations?.map((affiliation: any, h: number) => (
                <StyledAffiliationsWrapper
                  data-testid={`list-item-author-${author.cristin_person_id}-affiliations-${affiliation.cristinInstitutionNr}`}
                  key={h}>
                  {affiliation.institutionName}
                  {affiliation.units &&
                    affiliation.units.map((unit: any, i: number) => <div key={i}>&bull; {unit.unitName}</div>)}
                </StyledAffiliationsWrapper>
              ))}

              {author.affiliations?.length === 0 && author.require_higher_authorization && (
                <StyledAffiliationsWrapper>
                  <StyledTypography data-testid={`person-limited-access-${author.cristin_person_id}`} color="error">
                    Kan ikke hente inn institusjoner for denne bidragsyteren.
                  </StyledTypography>
                </StyledAffiliationsWrapper>
              )}
              <StyledChooseButton color="primary" onClick={() => handleChoose(author)}>
                Velg denne
              </StyledChooseButton>
              <hr />
            </span>
          ))}
        </div>
        <Button color="primary" onClick={handleAbort}>
          Lukk
        </Button>
      </Card>
    </Collapse>
  ) : (
    <></>
  );
};

export default ContributorSearchPanel;
