import React from 'react';
import { Button, Card, Collapse } from '@material-ui/core';
import styled from 'styled-components';
import { Colors } from '../../assets/styles/StyleConstants';

interface ContributorSearchPanelProps {
  searchResult: any[];
  collapsed: boolean;
  handleChoose: (author: any) => void;
  handleAbort: () => void;
}

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

export default function ContributorSearchPanel(props: ContributorSearchPanelProps) {
  if (props.searchResult.length > 0) {
    return (
      <Collapse in={props.collapsed}>
        <Card>
          <div>
            {props.searchResult.map((author, i) => (
              <span key={i}>
                <StyledAuthorWrapper data-testid={`author-name-${author.cristin_person_id}`}>
                  {(author.first_name_preferred ?? author.first_name) +
                    ' ' +
                    (author.surname_preferred ?? author.surname)}
                </StyledAuthorWrapper>
                {author.affiliations.map((affiliation: any, h: number) => (
                  <StyledAffiliationsWrapper
                    data-testid={`list-item-author-${author.cristin_person_id}-affiliations-${affiliation.cristinInstitutionNr}`}
                    key={h}>
                    {affiliation.institutionName}
                    {affiliation.units &&
                      affiliation.units.map((unit: any, i: number) => <div key={i}>&bull; {unit.unitName}</div>)}
                  </StyledAffiliationsWrapper>
                ))}
                <StyledChooseButton key={i} color="primary" onClick={() => props.handleChoose(author)}>
                  Velg denne
                </StyledChooseButton>
                <hr />
              </span>
            ))}
          </div>
          <Button color="primary" onClick={props.handleAbort}>
            Lukk
          </Button>
        </Card>
      </Collapse>
    );
  } else {
    return null;
  }
}
