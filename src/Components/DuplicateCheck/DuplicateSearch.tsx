import React, { FC, useContext, useEffect, useState } from 'react';
import { Context } from '../../Context';
import { Divider, FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import '../../assets/styles/Results.scss';
import ResultItem from './ResultItem';
import { CristinPublication, ImportData } from '../../types/PublicationTypes';
import { searchChristinPublications } from './SearchChristinPublications';
import SearchPanel from './SearchPanel';
import styled from 'styled-components';

const StyledRadioGroupWrapper = styled.div`
  margin-top: 1rem;
`;

interface DuplicateSearchProps {
  importPublication: ImportData;
}

const DuplicateSearch: FC<DuplicateSearchProps> = ({ importPublication }) => {
  const [duplicateList, setDuplicateList] = useState<CristinPublication[]>([]);

  const { state, dispatch } = useContext(Context);
  const relevantStatus = state.currentImportStatus !== 'ikke aktuelle';

  useEffect(() => {
    async function fetch() {
      state.selected = 'true'; //what?

      let searchString;
      if (importPublication.doi) {
        searchString = '?doi=' + importPublication.doi;
      } else {
        const title = importPublication.languages && importPublication.languages[0].title.substr(0, 20);
        searchString = '?title=' + title;
        if (importPublication.yearPublished) {
          const yearPublished: number = +importPublication.yearPublished;
          searchString += '&published_since=' + (yearPublished - 1) + '&published_before=' + yearPublished;
        }

        if (importPublication.hasOwnProperty('channel') && importPublication.channel.hasOwnProperty('issns')) {
          const issn = importPublication.channel.issns[0];
          searchString += '&issn=' + issn;
        }
      }
      searchString += '&per_page=5';
      setDuplicateList(await searchChristinPublications(searchString));
    }
    fetch().then();
  }, [importPublication]);

  useEffect(() => {
    if (importPublication.hasOwnProperty('cristin_id') && duplicateList.length > 0) {
      dispatch({ type: 'setSelected', payload: duplicateList[0].cristin_result_id });
      dispatch({ type: 'setSelectedPublication', payload: duplicateList[0] });
    }
  }, [duplicateList]);

  function handleChange(event: any) {
    dispatch({ type: 'setSelected', payload: event.target.value });
    event.target.value !== 'true' &&
      event.target.value !== 'false' &&
      dispatch({
        type: 'setSelectedPublication',
        payload: duplicateList.find((element: any) => element.cristin_result_id === event.target.value),
      });
  }

  return (
    <>
      <SearchPanel importPublication={importPublication} setDuplicateList={setDuplicateList} />
      <Divider />
      <StyledRadioGroupWrapper>
        <RadioGroup onChange={handleChange} value={state.selected}>
          <div data-testid="duplicates-result-list">
            {duplicateList.length > 0 &&
              duplicateList.map((cristinPublication: any, index: number) => (
                <FormControlLabel
                  key={index}
                  control={<ResultItem cristinPublication={cristinPublication} />}
                  label=""
                />
              ))}
          </div>
          <div>
            <FormControlLabel
              value="false"
              control={<Radio />}
              label={relevantStatus ? 'Marker som ikke aktuell' : 'Marker som aktuell'}
              disabled={importPublication.cristin_id}
            />
          </div>
          <div>
            <FormControlLabel
              value="true"
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
