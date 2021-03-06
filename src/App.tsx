import React, { useContext, useEffect } from 'react';
import ImportTable from './Components/ImportTable/ImportTable';
import Grid from '@material-ui/core/Grid/Grid';
import FilterFormPanel from './Components/FilterForm/FilterFormPanel';
import Header from './Components/Header/Header';
import { useHistory } from 'react-router-dom';
import ImportLogPanel from './Components/Log/ImportLogPanel';
import { Context } from './Context';
import { USE_MOCK_DATA } from './utils/constants';
import styled from 'styled-components';
import { getInstitutions } from './api/institutionApi';
import { handlePotentialExpiredSession } from './api/api';
import { InstitutionSelector } from './types/InstitutionTypes';
import createLastUpdated from './Components/Footer/CreateLastUpdated';
import { Typography } from '@material-ui/core';

const StyledApp = styled.div`
  text-align: center;
  font-family: 'PT Sans', sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const StyledBody = styled.div`
  display: flex;
  width: 100%;
  flex-grow: 1;
`;

const StyledGrid = styled(Grid)`
  max-width: 100%;
`;

const StyledFooter = styled.div`
  max-width: 100%;
  text-align: right;
  margin-right: 1rem;
`;

export default function App() {
  const history = useHistory();
  const { dispatch } = useContext(Context);
  const isAuthorized = localStorage.getItem('authorized') === 'true' || USE_MOCK_DATA;

  //fetches instututions to populate drop-down lists
  useEffect(() => {
    const createInstitutionLists = async () => {
      try {
        const institutionListResponse = await getInstitutions();
        const cristinInstitutions = institutionListResponse.data.filter((i) => i.cristin_user_institution);
        //TODO: there is no need for institutionNorwegian and institutionEnglish, it should be possible to use cristinInstitutions as is.
        const institutionsNorwegian: InstitutionSelector[] = [];
        cristinInstitutions.forEach((cristinInstitution) => {
          institutionsNorwegian.push({
            value: cristinInstitution.acronym,
            label: cristinInstitution.institution_name.nb ?? cristinInstitution.institution_name.en,
            cristinInstitutionNr: cristinInstitution.cristin_institution_id,
          });
        });
        dispatch({ type: 'globalInstitutions', payload: cristinInstitutions });
        dispatch({ type: 'institutions', payload: institutionsNorwegian });
      } catch (error) {
        handlePotentialExpiredSession(error);
      }
    };
    isAuthorized && createInstitutionLists().then();
  }, [isAuthorized]);

  if (!isAuthorized) {
    history.push('login');
  }

  return isAuthorized ? (
    <StyledApp>
      <Header />
      <StyledBody>
        <StyledGrid container spacing={3}>
          <Grid item xs={12} md={3}>
            <FilterFormPanel />
            <ImportLogPanel />
          </Grid>
          <Grid item xs={12} md={9}>
            <ImportTable />
          </Grid>
        </StyledGrid>
      </StyledBody>
      <StyledFooter>
        <Typography variant="caption">{createLastUpdated()}</Typography>
      </StyledFooter>
    </StyledApp>
  ) : (
    <></>
  );
}
