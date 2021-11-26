import React, { FC } from 'react';
import { Button, Card, CardActions, CardContent, List, ListItem, ListItemText, Typography } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import styled from 'styled-components';

const StyledAffiliationsWrapper = styled(Card)<{ backgroundColor: string }>`
  margin-bottom: 2rem;
  &&.MuiPaper-outlined {
    border: none;
    background-color: ${(props) => props.backgroundColor};
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
  affiliation: { units: string[]; institutionName: string; countryCode?: string };
  dataTestid: string;
  backgroundcolor: string;
  deleteUnitHandleClick?: (unitIndex: number) => void;
  addAffiliationsHandleClick?: () => void;
  deleteAffiliationHandleClick?: () => void;
}

const AffiliationDisplay: FC<AffiliationDisplayProps> = ({
  affiliation,
  dataTestid,
  backgroundcolor,
  deleteUnitHandleClick,
  addAffiliationsHandleClick,
  deleteAffiliationHandleClick,
}) => {
  return (
    <StyledAffiliationsWrapper backgroundColor={backgroundcolor} variant="outlined" data-testid={dataTestid}>
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
            <ListItem key={unitIndex} dense={true}>
              <StyledListItemText data-testid={`${dataTestid}-list-item-text-unit-${unitIndex}`} primary={unit} />
              {deleteUnitHandleClick && (
                <Button
                  onClick={() => deleteUnitHandleClick(unitIndex)}
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
      {(deleteAffiliationHandleClick || addAffiliationsHandleClick) && (
        <CardActions>
          {deleteAffiliationHandleClick && (
            <Button
              size="small"
              onClick={deleteAffiliationHandleClick}
              data-testid={`${dataTestid}-delete-institution`}
              startIcon={<DeleteIcon />}
              variant="outlined"
              color="secondary">
              Fjern tilknyttning
            </Button>
          )}
          {addAffiliationsHandleClick && (
            <Button
              size="small"
              data-testid={`${dataTestid}-add-unit`}
              onClick={addAffiliationsHandleClick}
              startIcon={<AddIcon />}
              variant="outlined"
              color="primary">
              Legg til enhet
            </Button>
          )}
        </CardActions>
      )}
    </StyledAffiliationsWrapper>
  );
};

export default AffiliationDisplay;
