import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import InstitutionSelect from '../InstitutionSelect/InstitutionSelect';
import { Checkbox, FormControlLabel, Typography } from '@material-ui/core';
import { Context } from '../../Context';
import ImportStatus from './ImportStatus';
import PublicationYearPanel from '../DropdownPanel/PublicationYearPanel';
import styled from 'styled-components';
import DoiTextField from './DoiTextField';
import { Colors } from '../../assets/styles/StyleConstants';

const StyledCard = styled(Card)`
  &.MuiPaper-root {
    background-color: ${Colors.LIGHT_GREY};
    border: none;
    margin-top: 4rem;
    margin-left: 1rem;
    @media (max-width: 960px) {
      margin-left: 0;
    }
  }
`;

const StyledCardContent = styled(CardContent)`
  text-align: left;
`;

const StyledInstitutionFilterWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

export default function FilterFormPanel() {
  const { state, dispatch } = React.useContext(Context);

  function handleCheck() {
    dispatch({ type: 'setSampublikasjon', payload: !state.isSampublikasjon });
  }

  return (
    <StyledCard variant="outlined" data-testid="filter-panel">
      <StyledCardContent>
        <Typography gutterBottom variant="h5" component="h2">
          Filter
        </Typography>
        <PublicationYearPanel />
        <ImportStatus />
        <StyledInstitutionFilterWrapper data-testid="institution-filter-wrapper">
          <FormControlLabel control={<Checkbox onClick={handleCheck} />} label="Sampublikasjoner" />
          <InstitutionSelect />
        </StyledInstitutionFilterWrapper>
        <DoiTextField />
      </StyledCardContent>
    </StyledCard>
  );
}
