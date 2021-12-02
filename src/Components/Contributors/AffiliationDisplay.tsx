import React, { FC, useState } from 'react';
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
import AddIcon from '@material-ui/icons/Add';
import styled from 'styled-components';
import { SimpleUnitResponse } from '../../types/InstitutionTypes';
import UnitSelect from '../InstitutionSelect/UnitSelect';

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
  handleAddUnitClick?: (unit: SimpleUnitResponse) => void;
  handleDeleteAffiliationClick?: () => void;
  addUnitError?: string | undefined;
  deleteUnitError?: string | undefined;
}

const AffiliationDisplay: FC<AffiliationDisplayProps> = ({
  children,
  affiliation,
  dataTestid,
  backgroundcolor,
  handleDeleteUnitClick,
  handleAddUnitClick,
  handleDeleteAffiliationClick,
  addUnitError,
  deleteUnitError,
}) => {
  const [showUnitSelector, setShowUnitSelector] = useState(false);
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
            <ListItem key={unitIndex} dense={true}>
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
      {(handleDeleteAffiliationClick || handleAddUnitClick) && (
        <CardActions>
          {children}
          <Grid container spacing={3}>
            {handleDeleteAffiliationClick && (
              <Grid item>
                <Button
                  size="small"
                  onClick={handleDeleteAffiliationClick}
                  data-testid={`${dataTestid}-delete-institution`}
                  startIcon={<DeleteIcon />}
                  variant="outlined"
                  color="secondary">
                  Fjern tilknyttning
                </Button>
              </Grid>
            )}
            {handleAddUnitClick && (
              <Grid item>
                <Button
                  size="small"
                  data-testid={`${dataTestid}-add-unit`}
                  onClick={() => setShowUnitSelector(true)}
                  startIcon={<AddIcon />}
                  variant="outlined"
                  color="primary">
                  Legg til enhet
                </Button>
              </Grid>
            )}
            {showUnitSelector && handleAddUnitClick && (
              <Grid item xs={12}>
                <Grid container spacing={3}>
                  <Grid item sm={8}>
                    <UnitSelect
                      cristinInstitutionNr={affiliation.cristinInstitutionNr ?? ''}
                      handleUnitChange={(unit: any) => {
                        setShowUnitSelector(false);
                        handleAddUnitClick(unit);
                      }}
                    />
                  </Grid>
                  <Grid item sm={4}>
                    <Button
                      size="small"
                      data-testid={`cancel-${dataTestid}-add-unit`}
                      onClick={() => setShowUnitSelector(false)}
                      variant="outlined"
                      color="secondary">
                      Avbryt
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            )}
            {addUnitError && (
              <Grid item xs={12}>
                <Typography color="error">{addUnitError}</Typography>
              </Grid>
            )}
            {deleteUnitError && (
              <Grid item xs={12}>
                <Typography color="error">{deleteUnitError}</Typography>
              </Grid>
            )}
          </Grid>
        </CardActions>
      )}
    </StyledAffiliationsWrapper>
  );
};

export default AffiliationDisplay;
