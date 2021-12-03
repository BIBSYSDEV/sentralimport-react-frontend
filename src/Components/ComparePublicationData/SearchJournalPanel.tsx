import React, { FC, useState } from 'react';

import { Button, CircularProgress, TextField, Typography } from '@material-ui/core';
import styled from 'styled-components';

import { Autocomplete } from '@material-ui/lab';
import { emptyJournal, JournalType } from './ComparePublicationDataModal';
import { ChannelLight } from '../../types/PublicationTypes';
import { getJournalsByQuery, QueryMethod } from '../../api/publicationApi';

const StyledPanelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

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
  const [selectedJournal, setSelectedJournal] = useState<JournalType>(emptyJournal);
  const [inputValue, setInputValue] = useState('');

  //TODO: feilmeldinger

  async function searchJournals(query: string) {
    try {
      setIsLoadingJournals(true);
      setFetchJournalsError(undefined);
      query = encodeURIComponent(query); // some journals returns '&' as '&amp';
      const resultJournals: ChannelLight[] = (await getJournalsByQuery(query, QueryMethod.title)).data;
      const convertedJournals: JournalType[] = resultJournals.map((journal) => {
        return {
          cristinTidsskriftNr: journal.id,
          title: journal.title.replace(/&amp;/g, '&'), // some journals returns '&' as '&amp';
          issn: journal.issn,
          eissn: journal.eissn,
        };
      });
      convertedJournals && setJournals(convertedJournals);
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
    <StyledPanelWrapper>
      <Autocomplete
        fullWidth
        id="cristindata-journal"
        loading={isLoadingJournals}
        noOptionsText="ingen tidskrift funnet"
        data-testid="cristindata-journal-select"
        options={journals ?? []}
        value={selectedJournal}
        onChange={(event, newValue: JournalType | null) => {
          newValue && newValue.cristinTidsskriftNr !== '0' && setSelectedJournal(newValue);
          //TODO: triggers search on select as well (not necessary)
        }}
        inputValue={inputValue}
        onInputChange={(event, inputValue) => {
          inputValue.length > 2 && searchJournals(inputValue); //todo: add debouce
          setInputValue(inputValue);
        }}
        getOptionLabel={(option) => option.title}
        getOptionSelected={() => true} //hack for å få bort warnings - funker læll 🙈
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
    </StyledPanelWrapper>
  );
};
export default SearchJournalPanel;
