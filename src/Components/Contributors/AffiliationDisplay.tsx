import React, { FC } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import styled from 'styled-components';
import { SimpleUnitResponse } from '../../types/InstitutionTypes';
import { AddAffiliationError } from './ContributorSearchPanel';
import { Colors } from '../../assets/styles/StyleConstants';

const StyledAffiliationsWrapper = styled(Card)<{ backgroundcolor: string }>`
  margin-bottom: 2rem;
  &&.MuiPaper-outlined {
    border: none;
    background-color: ${(props) => props.backgroundcolor};
  }
`;

const StyledSuccessTypography = styled(Typography)`
  color: ${Colors.Text.GREEN};
`;

const StyledCardContent = styled(CardContent)`
  &&.MuiCardContent-root:last-child {
    padding-bottom: 0;
  }
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
  handleAddAffiliationButtonClick?: () => void;
  addAffiliationError?: AddAffiliationError | undefined;
  addAffiliationSuccessful?: string | undefined;
}

const AffiliationDisplay: FC<AffiliationDisplayProps> = ({
  children,
  affiliation,
  dataTestid,
  backgroundcolor,
  handleDeleteUnitClick,
  showCardActions,
  handleAddAffiliationButtonClick,
  addAffiliationError,
  addAffiliationSuccessful,
}) => {
  return (
    <StyledAffiliationsWrapper backgroundcolor={backgroundcolor} variant="outlined" data-testid={dataTestid}>
      <StyledCardContent>
        <Grid container spacing={2}>
          <Grid item sm={8}>
            <Typography data-testid={`${dataTestid}-institution-name`} display="inline" variant="subtitle1">
              {affiliation.institutionName}
            </Typography>
          </Grid>
          <Grid item sm={4}>
            {handleAddAffiliationButtonClick ? (
              <Button
                data-testid={`add-only-affiliation-button-${dataTestid}`}
                onClick={() => handleAddAffiliationButtonClick()}
                size="small"
                color="primary">
                Velg kun tilknyttning
              </Button>
            ) : (
              <Typography data-testid={`${dataTestid}-country-code`} display="inline" variant="caption">
                {affiliation.countryCode && 'Land: ' + affiliation.countryCode}
              </Typography>
            )}

            {addAffiliationError &&
              affiliation.cristinInstitutionNr &&
              addAffiliationError.institutionId.toString() === affiliation.cristinInstitutionNr.toString() && (
                <Typography color="error" data-testid={`add-only-affiliation-error-${dataTestid}`} variant="body2">
                  {addAffiliationError.message}
                </Typography>
              )}
            {addAffiliationSuccessful &&
              affiliation.cristinInstitutionNr &&
              addAffiliationSuccessful.toString() === affiliation.cristinInstitutionNr.toString() && (
                <StyledSuccessTypography data-testid={`add-affiliation-success-${dataTestid}`} variant="body2">
                  La til institusjon
                </StyledSuccessTypography>
              )}
          </Grid>
        </Grid>
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
