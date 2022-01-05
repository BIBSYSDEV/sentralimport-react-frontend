import React, { FC, useContext, useEffect, useState } from 'react';
import { Context } from '../../Context';
import { CircularProgress, Divider, FormControlLabel, Radio, RadioGroup, Typography } from '@material-ui/core';
import ResultItem from './ResultItem';
import { CristinPublication, ImportPublication } from '../../types/PublicationTypes';
import { searchChristinPublications } from './SearchChristinPublications';
import SearchPanel from './SearchPanel';
import styled from 'styled-components';
import { SelectValues } from './DuplicateCheckModal';

const StyledRadioGroupWrapper = styled.div`
  margin-top: 1rem;
`;

const StyledStatusWrapper = styled.div`
  margin-bottom: 1rem;
`;

const StyledResultListWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

interface DuplicateSearchProps {
  importPublication: ImportPublication;
  selectedRadioButton: string;
  setSelectedRadioButton: (value: string) => void;
}

const maxResults = '5';

const DuplicateSearch: FC<DuplicateSearchProps> = ({
  importPublication,
  selectedRadioButton,
  setSelectedRadioButton,
}) => {
  const [resultList, setResultList] = useState<CristinPublication[]>([]);
  const [foundDuplicates, setFoundDuplicates] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isInitialSearchWithDoi, setIsInitialSearchWithDoi] = useState(false);
  const { state, dispatch } = useContext(Context);
  const relevantStatus = state.currentImportStatus !== 'ikke aktuelle';
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    async function initialSearch() {
      setIsSearching(true);
      setFoundDuplicates(false);
      if (importPublication.doi) {
        setIsInitialSearchWithDoi(true);
      }
      const results = await searchChristinPublications(
        maxResults,
        importPublication.doi,
        importPublication.languages[0].title.substring(0, 20),
        importPublication.yearPublished,
        importPublication.channel?.issn
      );
      if (results.cristinPublications.length > 0) {
        setFoundDuplicates(true);
      }
      setTotalResults(results.totalPublicationsResults);
      setIsSearching(false);
      setResultList(results.cristinPublications);
    }
    setSelectedRadioButton(SelectValues.CREATE_NEW);
    initialSearch().then();
  }, [importPublication]);

  useEffect(() => {
    if (importPublication.cristin_id && resultList.length > 0) {
      setSelectedRadioButton(resultList[0].cristin_result_id);
      dispatch({ type: 'setSelectedPublication', payload: resultList[0] });
    }
  }, [resultList]);

  function handleRadioGroupChange(event: any) {
    setSelectedRadioButton(event.target.value);
    event.target.value !== SelectValues.CREATE_NEW &&
      event.target.value !== SelectValues.TOGGLE_RELEVANT &&
      dispatch({
        type: 'setSelectedPublication',
        payload: resultList.find((element: any) => element.cristin_result_id === event.target.value),
      });
  }

  return (
    <>
      <SearchPanel
        importPublication={importPublication}
        setDuplicateList={setResultList}
        setIsSearching={setIsSearching}
        setFoundDuplicates={setFoundDuplicates}
        isInitialSearchWithDoi={isInitialSearchWithDoi}
        setTotalResults={setTotalResults}
      />
      <StyledStatusWrapper>
        {isSearching && <CircularProgress style={{ marginLeft: '1rem' }} size={'1.5rem'} />}
        {!isSearching &&
          (foundDuplicates ? (
            <Typography color="primary">{`Søket ga følgende treff: (Viser ${resultList.length} av ${totalResults})`}</Typography>
          ) : (
            <Typography color="primary">Det finnes ingen eksisterende publikasjoner som matcher søket</Typography>
          ))}
      </StyledStatusWrapper>
      <Divider />
      <StyledRadioGroupWrapper>
        <RadioGroup onChange={handleRadioGroupChange} value={selectedRadioButton}>
          <StyledResultListWrapper data-testid="duplicates-result-list">
            {resultList.length > 0 &&
              resultList.map((cristinPublication: any, index: number) => (
                <FormControlLabel
                  key={index}
                  control={<ResultItem cristinPublication={cristinPublication} />}
                  label=""
                />
              ))}
          </StyledResultListWrapper>
          <div>
            <FormControlLabel
              value={SelectValues.TOGGLE_RELEVANT}
              control={<Radio />}
              label={relevantStatus ? 'Marker som ikke aktuell' : 'Marker som aktuell'}
              disabled={!!importPublication.cristin_id}
            />
          </div>
          <div>
            <FormControlLabel
              value={SelectValues.CREATE_NEW}
              control={<Radio />}
              label="Opprett ny cristin-publikasjon basert på importpublikasjon"
              disabled={!!importPublication.cristin_id}
            />
          </div>
        </RadioGroup>
      </StyledRadioGroupWrapper>
    </>
  );
};

export default DuplicateSearch;
