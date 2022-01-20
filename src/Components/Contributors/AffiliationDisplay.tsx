import React, { FC } from 'react';
import { Button, Grid, List, ListItem, ListItemText, Typography } from '@material-ui/core';
import styled from 'styled-components';
import { SimpleUnitResponse } from '../../types/InstitutionTypes';
import { AddAffiliationError } from './ContributorSearchPanel';
import { Colors } from '../../assets/styles/StyleConstants';

const StyledAffiliationsWrapper = styled.div<{ backgroundcolor: string }>`
  margin-bottom: 1rem;
  background-color: ${(props) => props.backgroundcolor};
`;

const StyledSuccessTypography = styled(Typography)`
  color: ${Colors.Text.GREEN};
`;

const StyledTypographyWithRightPadding = styled(Typography)`
  padding-right: 1rem;
`;

export const StyledGridWithRightAlignContent = styled(Grid)`
  display: flex;
  justify-content: flex-end;
`;

const StyledContent = styled.div`
  padding: 1rem 0 0.3rem 1rem;
`;

const StyledListItemText = styled(ListItemText)`
  & .MuiListItemText-primary {
    font-size: 0.9rem;
  }
`;

const StyledListItem: any = styled(ListItem)`
  &&.MuiButton-root {
    margin-right: 0;
  }
  &&.MuiListItem-dense {
    padding-top: 0.15rem;
    padding-bottom: 0.15rem;
  }
  &&.MuiListItem-gutters {
    padding-right: 0;
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
    <StyledAffiliationsWrapper backgroundcolor={backgroundcolor} data-testid={dataTestid}>
      <StyledContent>
        <Grid container spacing={1} alignItems="baseline">
          <Grid item xs>
            <Typography data-testid={`${dataTestid}-institution-name`} display="inline" variant="subtitle1">
              {affiliation.institutionName}
            </Typography>
          </Grid>
          {affiliation.countryCode && (
            <Grid item>
              <StyledTypographyWithRightPadding
                data-testid={`${dataTestid}-country-code`}
                display="inline"
                variant="caption">
                {affiliation.countryCode && 'Land: ' + affiliation.countryCode}
              </StyledTypographyWithRightPadding>
            </Grid>
          )}
          {removeInstitutionByCristinNrOrName && (
            <StyledGridWithRightAlignContent item xs={4}>
              <Button
                size="small"
                onClick={() =>
                  removeInstitutionByCristinNrOrName(
                    affiliation.cristinInstitutionNr,
                    affiliation.institutionName ?? ''
                  )
                }
                data-testid={`${dataTestid}-delete-institution`}
                color="secondary">
                Fjern tilknyttning
              </Button>
            </StyledGridWithRightAlignContent>
          )}
          {handleAddAffiliationButtonClick && (
            <StyledGridWithRightAlignContent item xs={4}>
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
            </StyledGridWithRightAlignContent>
          )}
        </Grid>
        <Grid item xs={12}>
          <StyledList disablePadding>
            {affiliation.units.map((unit, unitIndex) => (
              <StyledListItem key={`{$unitIndex}-${unitIndex}`} dense>
                <Grid justifyContent="space-between" container spacing={0}>
                  <Grid item xs>
                    <StyledListItemText
                      data-testid={`${dataTestid}-list-item-text-unit-${unit.cristin_unit_id ?? unitIndex}`}
                      primary={unit.unit_name.en ?? unit.unit_name.nb}
                    />
                  </Grid>
                  {handleDeleteUnitClick && (
                    <StyledGridWithRightAlignContent item>
                      <Button
                        onClick={() => handleDeleteUnitClick(unit)}
                        size="small"
                        data-testid={`${dataTestid}-delete-unit-${unitIndex}`}
                        color="secondary">
                        Fjern enhet
                      </Button>
                    </StyledGridWithRightAlignContent>
                  )}
                </Grid>
              </StyledListItem>
            ))}
          </StyledList>
        </Grid>
        {children}
      </StyledContent>
    </StyledAffiliationsWrapper>
  );
};

export default AffiliationDisplay;
