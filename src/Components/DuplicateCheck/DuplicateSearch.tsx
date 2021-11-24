import React, { FC, useContext, useEffect, useState } from 'react';
import { Context } from '../../Context';
import { CircularProgress, Divider, FormControlLabel, Radio, RadioGroup, Typography } from '@material-ui/core';
import '../../assets/styles/Results.scss';
import ResultItem from './ResultItem';
import { CristinPublication, ImportData } from '../../types/PublicationTypes';
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
  importPublication: ImportData;
  selectedRadioButton: string;
  setSelectedRadioButton: (value: string) => void;
}

const DuplicateSearch: FC<DuplicateSearchProps> = ({
  importPublication,
  selectedRadioButton,
  setSelectedRadioButton,
}) => {
  const [duplicateList, setDuplicateList] = useState<CristinPublication[]>([]);
  const [foundDuplicates, setFoundDuplicates] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const { state, dispatch } = useContext(Context);
  const relevantStatus = state.currentImportStatus !== 'ikke aktuelle';

  useEffect(() => {
    async function fetch() {
      const perPage = '5';
      setDuplicateList(
        await searchChristinPublications(
          perPage,
          importPublication.doi ?? undefined,
          importPublication.languages ? importPublication.languages[0].title.substring(0, 20) : undefined,
          importPublication.yearPublished ? +importPublication.yearPublished : undefined,
          importPublication.channel?.issns ? importPublication.channel.issns[0] : undefined
        )
      );
    }
    setSelectedRadioButton(SelectValues.CREATE_NEW);
    fetch().then();
  }, [importPublication]);

  useEffect(() => {
    if (importPublication.cristin_id && duplicateList.length > 0) {
      setSelectedRadioButton(duplicateList[0].cristin_result_id);
      dispatch({ type: 'setSelectedPublication', payload: duplicateList[0] });
    }
  }, [duplicateList]);

  function handleRadioGroupChange(event: any) {
    setSelectedRadioButton(event.target.value);
    event.target.value !== SelectValues.CREATE_NEW &&
      event.target.value !== SelectValues.TOGGLE_RELEVANT &&
      dispatch({
        type: 'setSelectedPublication',
        payload: duplicateList.find((element: any) => element.cristin_result_id === event.target.value),
      });
  }

  return (
    <>
      <SearchPanel
        importPublication={importPublication}
        setDuplicateList={setDuplicateList}
        setIsSearching={setIsSearching}
        setFoundDuplicates={setFoundDuplicates}
      />
      <StyledStatusWrapper>
        {isSearching && <CircularProgress style={{ marginLeft: '1rem' }} size={'1.5rem'} />}
        {!isSearching &&
          (foundDuplicates ? (
            <Typography style={{ color: 'green' }}>Søket ga følgende treff</Typography>
          ) : (
            <Typography style={{ color: 'darkred' }}>
              Det finnes ingen eksisterende publikasjoner som matcher søket
            </Typography>
          ))}
      </StyledStatusWrapper>
      <Divider />
      <StyledRadioGroupWrapper>
        <RadioGroup onChange={handleRadioGroupChange} value={selectedRadioButton}>
          <StyledResultListWrapper data-testid="duplicates-result-list">
            {duplicateList.length > 0 &&
              duplicateList.map((cristinPublication: any, index: number) => (
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
              disabled={importPublication.cristin_id}
            />
          </div>
          <div>
            <FormControlLabel
              value={SelectValues.CREATE_NEW}
              control={<Radio />}
              label="Opprett ny cristin-publikasjon basert på importpublikasjon"
              disabled={importPublication.cristin_id}
            />
          </div>
        </RadioGroup>
      </StyledRadioGroupWrapper>
    </>
  );
};

export default DuplicateSearch;
