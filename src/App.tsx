import React, { useContext, useEffect } from 'react';
import ImportTable from './Components/ImportTable/ImportTable';
import Grid from '@material-ui/core/Grid/Grid';
import FilterFormPanel from './Components/FilterForm/FilterFormPanel';
import Header from './Components/Header/Header';
import './assets/styles/buttons.scss';
import { useHistory } from 'react-router-dom';
import LogPanel from './Components/Log/LogPanel';
import Footer from './Components/Footer/Footer';
import { Context } from './Context';
import { USE_MOCK_DATA } from './utils/constants';
import styled from 'styled-components';
import { getInstitutions } from './api/institutionApi';
import { handlePotentialExpiredSession } from './api/api';
import { InstitutionSelector } from './types/InstitutionTypes';

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

export default function App() {
  const history = useHistory();
  const { dispatch } = useContext(Context);
  const isAuthorized = localStorage.getItem('authorized') === 'true' || USE_MOCK_DATA;

  window.localStorage.removeItem('tempContributors');
  window.localStorage.removeItem('tempPublication');

  //fetches instututions to populate drop-down lists
  useEffect(() => {
    const createInstitutionLists = async () => {
      try {
        const institutionListResponse = await getInstitutions();
        const cristinInstitutions = institutionListResponse.data.filter((i) => i.cristin_user_institution);
        //TODO: there is no need for institutionNorwegian and institutionEnglish, it should be possible to use cristinInstitutions as is.
        const institutionsNorwegian: InstitutionSelector[] = [];
        const institutionsEnglish: InstitutionSelector[] = [];
        cristinInstitutions.forEach((cristinInstitution) => {
          institutionsNorwegian.push({
            value: cristinInstitution.acronym,
            label: cristinInstitution.institution_name.nb ?? cristinInstitution.institution_name.en,
            cristinInstitutionNr: cristinInstitution.cristin_institution_id,
          });
          institutionsEnglish.push({
            value: cristinInstitution.acronym,
            label: cristinInstitution.institution_name.en ?? cristinInstitution.institution_name.nb,
            cristinInstitutionNr: cristinInstitution.cristin_institution_id,
          });
        });
        dispatch({ type: 'institutions', payload: institutionsNorwegian });
        dispatch({ type: 'institutionsEnglish', payload: institutionsEnglish });
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
            <LogPanel />
          </Grid>
          <Grid item xs={12} md={9}>
            <ImportTable />
          </Grid>
        </StyledGrid>
      </StyledBody>
      <Footer />
    </StyledApp>
  ) : (
    <></>
  );
}
