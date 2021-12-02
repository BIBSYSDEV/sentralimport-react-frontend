import React, { FC, useEffect, useState } from 'react';
import { Collapse } from 'react-bootstrap';
import { Button, CircularProgress, Grid, TextField, Typography } from '@material-ui/core';
import styled from 'styled-components';
import AddIcon from '@material-ui/icons/Add';
import { Colors } from '../../assets/styles/StyleConstants';
import { Autocomplete } from '@material-ui/lab';
import { JournalType } from './ComparePublicationDataModal';
import { ChannelLight } from '../../types/PublicationTypes';
import { getJournalsByQuery, QueryMethod } from '../../api/publicationApi';

const StyledFormWrapper = styled.div`
  padding: 1rem;
  background-color: ${Colors.LIGHT_GREY}; ;
`;

const StyledSearchJournalPanel = styled.div`
  margin-top: 0.5rem;
`;

const StyledFormHeaderTypography = styled(Typography)`
  && {
    font-weight: bold;
  }
`;

interface SearchJournalPanelProps {
  handleChooseJournal: any;
}

const SearchJournalPanel: FC<SearchJournalPanelProps> = ({ handleChooseJournal }) => {
  const [expanded, setExpanded] = useState(false);
  const [journals, setJournals] = useState<JournalType[]>(); //todo type
  const [fetchJournalsError, setFetchJournalsError] = useState<Error | undefined>();
  const [isLoadingJournals, setIsLoadingJournals] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState<JournalType>();

  const handleExpand = () => {
    if (!expanded) {
      setExpanded(true);
    }
  };

  const handleCancel = () => {
    setExpanded(false);
  };

  async function searchJournals(query: string) {
    try {
      setIsLoadingJournals(true);
      setFetchJournalsError(undefined);
      const resultJournals: ChannelLight[] = (await getJournalsByQuery(query, QueryMethod.title)).data;
      const convertedJournals: JournalType[] = resultJournals.map((journal) => {
        return {
          cristinTidsskriftNr: journal.id,
          title: journal.title,
          issn: journal.issn,
          eissn: journal.eissn,
        };
      });
      setJournals(convertedJournals);
    } catch (error) {
      setFetchJournalsError(error as Error);
    } finally {
      setIsLoadingJournals(false);
    }
  }

  return (
    <StyledSearchJournalPanel>
      {!expanded && (
        <Button
          data-testid="search-journal-button"
          startIcon={<AddIcon />}
          variant="outlined"
          color="primary"
          onClick={handleExpand}>
          Søk opp tidsskrift
        </Button>
      )}
      <Collapse in={expanded} unmountOnExit>
        <StyledFormWrapper>
          <StyledFormHeaderTypography>Søk opp tidskrift</StyledFormHeaderTypography>
          <Autocomplete
            fullWidth
            id="cristindata-journal"
            autoHighlight
            loading={isLoadingJournals}
            noOptionsText="ingen tidskrift funnet"
            data-testid="cristindata-journal-select"
            options={journals ?? []}
            value={selectedJournal}
            onChange={(event, newValue: JournalType | null) => {
              newValue && setSelectedJournal(newValue);
            }}
            onInputChange={(event, value) => {
              value.length > 2 && searchJournals(value); //todo: add debouce
            }}
            getOptionLabel={(option) => option.title}
            getOptionSelected={(option, value) => option.cristinTidsskriftNr === value.cristinTidsskriftNr}
            renderInput={(params) => (
              <TextField
                {...params}
                data-testid="cristindata-journal-select-textfield"
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {isLoadingJournals && <CircularProgress color="inherit" size={'1rem'} />}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
          {fetchJournalsError && (
            <Typography color="error">Kunne ikke laste inn tidskrift. {fetchJournalsError.message}</Typography>
          )}

          <Grid container spacing={2} justifyContent="flex-end" alignItems="baseline" style={{ marginTop: '1rem' }}>
            <Grid item>
              <Button data-testid="cancel-journal-button" variant="outlined" color="secondary" onClick={handleCancel}>
                Avbryt
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setExpanded(false);
                  handleChooseJournal(selectedJournal);
                }}
                data-testid="submit-journal-button">
                Velg
              </Button>
            </Grid>
          </Grid>
        </StyledFormWrapper>
      </Collapse>
    </StyledSearchJournalPanel>
  );
};
export default SearchJournalPanel;
