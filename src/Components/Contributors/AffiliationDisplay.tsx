import React, { FC } from 'react';
import { Button, Card, CardContent, Grid, List, ListItem, ListItemText, Typography } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import styled from 'styled-components';
import { SimpleUnitResponse } from '../../types/InstitutionTypes';
import { AddAffiliationError } from './ContributorSearchPanel';
import { Colors } from '../../assets/styles/StyleConstants';

const StyledAffiliationsWrapper = styled(Card)<{ backgroundcolor: string }>`
  margin-bottom: 1rem;
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
    padding-bottom: 0.3rem;
  }
`;

const StyledListItemText = styled(ListItemText)`
  & .MuiListItemText-primary {
    font-size: 0.9rem;
  }
`;

const StyledRemoveUnitButton = styled(Button)`
  &.MuiButton-root {
    margin-right: 2.3rem;
  }
`;

const StyledListItem: any = styled(ListItem)`
  &&.MuiListItem-dense {
    padding-top: 0.15rem;
    padding-bottom: 0.15rem;
  }
`;

const StyledList = styled(List)`
  &.MuiList-root {
    padding-top: 0.15rem;
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
  removeInstitutionByCristinNrOrName?: (cristinInstitutionNr: string | undefined, institutionName: string) => void;
}

const AffiliationDisplay: FC<AffiliationDisplayProps> = ({
  children,
  affiliation,
  dataTestid,
  backgroundcolor,
  handleDeleteUnitClick,
  handleAddAffiliationButtonClick,
  addAffiliationError,
  addAffiliationSuccessful,
  removeInstitutionByCristinNrOrName,
}) => {
  return (
    <StyledAffiliationsWrapper backgroundcolor={backgroundcolor} variant="outlined" data-testid={dataTestid}>
      <StyledCardContent>
        <Grid container justifyContent="space-between" spacing={0}>
          <Grid item xs={6}>
            <Typography data-testid={`${dataTestid}-institution-name`} display="inline" variant="subtitle1">
              {affiliation.institutionName}
            </Typography>
          </Grid>
          {affiliation.countryCode && (
            <Grid item>
              <Typography data-testid={`${dataTestid}-country-code`} display="inline" variant="caption">
                {affiliation.countryCode && 'Land: ' + affiliation.countryCode}
              </Typography>
            </Grid>
          )}
          {removeInstitutionByCristinNrOrName && (
            <Grid item>
              <Button
                size="small"
                onClick={() =>
                  removeInstitutionByCristinNrOrName(
                    affiliation.cristinInstitutionNr,
                    affiliation.institutionName ?? ''
                  )
                }
                data-testid={`${dataTestid}-delete-institution`}
                startIcon={<DeleteIcon />}
                color="secondary">
                Fjern tilknyttning
              </Button>
            </Grid>
          )}
          {handleAddAffiliationButtonClick && (
            <Grid item>
              <Button
                data-testid={`add-only-affiliation-button-${dataTestid}`}
                onClick={() => handleAddAffiliationButtonClick()}
                size="small"
                color="primary">
                Velg kun tilknyttning
              </Button>

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
          )}
        </Grid>
        <Grid item xs={12}>
          <StyledList disablePadding={true}>
            {affiliation.units.map((unit, unitIndex) => (
              <StyledListItem key={`{$unitIndex}-${unitIndex}`} dense={true}>
                <Grid justifyContent="space-between" container spacing={0}>
                  <Grid item>
                    <StyledListItemText
                      data-testid={`${dataTestid}-list-item-text-unit-${unit.cristin_unit_id ?? unitIndex}`}
                      primary={unit.unit_name.en ?? unit.unit_name.nb}
                    />
                  </Grid>
                  {handleDeleteUnitClick && (
                    <Grid item>
                      <StyledRemoveUnitButton
                        onClick={() => handleDeleteUnitClick(unit)}
                        size="small"
                        data-testid={`${dataTestid}-delete-unit-${unitIndex}`}
                        startIcon={<DeleteIcon />}
                        color="secondary">
                        Fjern enhet
                      </StyledRemoveUnitButton>
                    </Grid>
                  )}
                </Grid>
              </StyledListItem>
            ))}
          </StyledList>
        </Grid>
        {children}
      </StyledCardContent>
    </StyledAffiliationsWrapper>
  );
};

export default AffiliationDisplay;
