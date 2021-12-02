import React, { FC, useState } from 'react';

import { Button, CircularProgress, TextField, Typography } from '@material-ui/core';
import styled from 'styled-components';

import { Autocomplete } from '@material-ui/lab';
import { JournalType } from './ComparePublicationDataModal';
import { ChannelLight } from '../../types/PublicationTypes';
import { getJournalsByQuery, QueryMethod } from '../../api/publicationApi';

const StyledButtonWrapper = styled.div`
  margin-top: 1rem;
`;

interface SearchJournalPanelProps {
  handleChooseJournal: any;
}

const SearchJournalPanel: FC<SearchJournalPanelProps> = ({ handleChooseJournal }) => {
  const [journals, setJournals] = useState<JournalType[]>();
  const [fetchJournalsError, setFetchJournalsError] = useState<Error | undefined>();
  const [isLoadingJournals, setIsLoadingJournals] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState<JournalType | null>();

  //TODO: feilmelding controlled/uncontrolled

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

  const handleClickChooseButton = () => {
    if (selectedJournal) {
      handleChooseJournal(selectedJournal);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
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
          setSelectedJournal(newValue);
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
      <StyledButtonWrapper>
        <Button
          variant="contained"
          color="primary"
          onClick={handleClickChooseButton}
          data-testid="submit-journal-button">
          Velg
        </Button>
      </StyledButtonWrapper>
    </div>
  );
};
export default SearchJournalPanel;
