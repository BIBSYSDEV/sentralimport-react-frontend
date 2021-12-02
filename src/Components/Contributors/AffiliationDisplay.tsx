import React, { FC } from 'react';
import { Button, Card, CardActions, CardContent, List, ListItem, ListItemText, Typography } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import styled from 'styled-components';
import { SimpleUnitResponse } from '../../types/InstitutionTypes';

const StyledAffiliationsWrapper = styled(Card)<{ backgroundcolor: string }>`
  margin-bottom: 2rem;
  &&.MuiPaper-outlined {
    border: none;
    background-color: ${(props) => props.backgroundcolor};
  }
`;

const StyledCardContent = styled(CardContent)`
  &&.MuiCardContent-root:last-child {
    padding-bottom: 0;
  }
`;

const StyledCardHeader = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: baseline;
  justify-content: space-between;
`;

const StyledListItemText = styled(ListItemText)`
  & .MuiListItemText-primary {
    font-size: 0.9rem;
  }
`;

interface AffiliationDisplayProps {
  affiliation: {
    units: SimpleUnitResponse[];
    institutionName: string;
    countryCode?: string;
    cristinInstitutionNr?: string | undefined;
  };
  dataTestid: string;
  backgroundcolor: string;
  handleDeleteUnitClick?: (unitIndex: SimpleUnitResponse) => void;
  showCardActions?: boolean;
}

const AffiliationDisplay: FC<AffiliationDisplayProps> = ({
  children,
  affiliation,
  dataTestid,
  backgroundcolor,
  handleDeleteUnitClick,
  showCardActions,
}) => {
  return (
    <StyledAffiliationsWrapper backgroundcolor={backgroundcolor} variant="outlined" data-testid={dataTestid}>
      <StyledCardContent>
        <StyledCardHeader>
          <Typography data-testid={`${dataTestid}-institution-name`} display="inline" variant="subtitle1">
            {affiliation.institutionName}
          </Typography>
          <Typography data-testid={`${dataTestid}-country-code`} display="inline" variant="caption">
            {affiliation.countryCode && 'Land: ' + affiliation.countryCode}
          </Typography>
        </StyledCardHeader>

        <List>
          {affiliation.units.map((unit, unitIndex) => (
            <ListItem key={`{$unitIndex}-${unitIndex}`} dense={true}>
              <StyledListItemText
                data-testid={`${dataTestid}-list-item-text-unit-${unit.cristin_unit_id ?? unitIndex}`}
                primary={unit.unit_name.en ?? unit.unit_name.nb}
              />
              {handleDeleteUnitClick && (
                <Button
                  onClick={() => handleDeleteUnitClick(unit)}
                  size="small"
                  data-testid={`${dataTestid}-delete-unit-${unitIndex}`}
                  startIcon={<DeleteIcon />}
                  variant="outlined"
                  color="secondary">
                  Fjern enhet
                </Button>
              )}
            </ListItem>
          ))}
        </List>
      </StyledCardContent>
      {showCardActions && <CardActions>{children}</CardActions>}
    </StyledAffiliationsWrapper>
  );
};

export default AffiliationDisplay;
