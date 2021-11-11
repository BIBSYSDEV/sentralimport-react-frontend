import React, { useContext, useEffect } from 'react';
import ImportTable from './Components/ImportTable/ImportTable';
import Grid from '@material-ui/core/Grid/Grid';
import FilterFormPanel from './Components/FilterForm/FilterFormPanel';
import Header from './Components/Header/Header';
import './assets/styles/buttons.scss';
import { useHistory } from 'react-router-dom';
import LogPanel from './Components/Log/LogPanel';
import Footer from './Components/Footer/Footer';
import axios from 'axios';
import { Context } from './Context';
import { CRIST_REST_API, USE_MOCK_DATA } from './utils/constants';
import PublicationYearPanel from './Components/DropdownPanel/PublicationYearPanel';
import styled from 'styled-components';

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
  let history = useHistory();
  let { dispatch } = useContext(Context);
  const isAuthorized = localStorage.getItem('authorized') === 'true' || USE_MOCK_DATA;
  //fetches instututions to populate drop-down lists
  useEffect(() => {
    const getInstitutions = async () => {
      let response = await axios.get(
        CRIST_REST_API + `/institutions?cristin_institution=true&per_page=500&lang=nb,en`,
        JSON.parse(localStorage.getItem('config'))
      );
      response = response.data.filter((i) => i.cristin_user_institution);
      const institutionsNorwegian = [];
      const institutionsEnglish = [];
      for (let i = 0; i < response.length; i++) {
        institutionsNorwegian.push({
          value: response[i].acronym,
          label: response[i].institution_name.nb || response[i].institution_name.en,
          cristinInstitutionNr: response[i].cristin_institution_id,
        });
        institutionsEnglish.push({
          value: response[i].acronym,
          label: response[i].institution_name.en || response[i].institution_name.nb,
          cristinInstitutionNr: response[i].cristin_institution_id,
        });
      }
      await dispatch({ type: 'institutions', payload: institutionsNorwegian });
      await dispatch({ type: 'institutionsEnglish', payload: institutionsEnglish });
    };
    isAuthorized && getInstitutions().then();
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
            <PublicationYearPanel />
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
