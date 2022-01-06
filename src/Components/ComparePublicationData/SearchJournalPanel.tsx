import React, { FC, useState } from 'react';

import { Button, CircularProgress, TextField, Typography } from '@material-ui/core';
import styled from 'styled-components';

import { Autocomplete } from '@material-ui/lab';
import { ChannelLight } from '../../types/PublicationTypes';
import { getJournalsByQuery, QueryMethod } from '../../api/publicationApi';
import { CompareFormJournalType, emptyJournal } from './CompareFormTypes';

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
  const [journals, setJournals] = useState<CompareFormJournalType[]>();
  const [fetchJournalsError, setFetchJournalsError] = useState<Error | undefined>();
  const [isLoadingJournals, setIsLoadingJournals] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState<CompareFormJournalType>(emptyJournal);
  const [inputValue, setInputValue] = useState('');

  async function searchJournals(query: string) {
    try {
      setIsLoadingJournals(true);
      setFetchJournalsError(undefined);
      query = query.replaceAll('&', ''); // backend returns some journals with '&' as '&amp';
      const resultJournals: ChannelLight[] = (await getJournalsByQuery(query, QueryMethod.title)).data;
      const convertedJournals: CompareFormJournalType[] = resultJournals.map((journal) => {
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

  const generateOptionLabel = (journal: CompareFormJournalType) => {
    let optionLabel = journal.title;
    const details = [];
    journal.issn && details.push(`ISSN: ${journal.issn}`);
    journal.eissn && details.push(`e-ISSN: ${journal.eissn}`);
    if (details.length > 0) {
      optionLabel += ` (${details.join(', ')})`;
    }
    return optionLabel;
  };

  return (
    <StyledPanelWrapper>
      <Autocomplete
        fullWidth
        id="cristindata-journal"
        loading={isLoadingJournals}
        noOptionsText="ingen tidsskrift funnet"
        data-testid="cristindata-journal-select"
        options={journals ?? []}
        value={selectedJournal}
        filterOptions={() => journals ?? []}
        onChange={(event, newValue: CompareFormJournalType | null) => {
          newValue && newValue.cristinTidsskriftNr !== '0' && setSelectedJournal(newValue);
          //TODO: this triggers search on select as well (not necessary)
        }}
        inputValue={inputValue}
        onInputChange={(event, inputValue) => {
          inputValue.length > 2 && searchJournals(inputValue); //todo: add debouce
          setInputValue(inputValue);
        }}
        getOptionLabel={(option) => generateOptionLabel(option)}
        getOptionSelected={() => true} //hack for å få bort warnings - funker læll 🙈
        renderInput={(params) => (
          <TextField
            {...params}
            multiline
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
        <Typography color="error">Kunne ikke laste inn tidsskrift. {fetchJournalsError.message}</Typography>
      )}
      <StyledButtonWrapper>
        <Button
          variant="contained"
          color="primary"
          onClick={handleClickChooseButton}
          data-testid="submit-search-journal-button">
          Velg
        </Button>
      </StyledButtonWrapper>
    </StyledPanelWrapper>
  );
};
export default SearchJournalPanel;
