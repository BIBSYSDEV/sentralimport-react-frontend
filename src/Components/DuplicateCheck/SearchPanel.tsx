import React, { FC, useState } from 'react';
import { Button, Checkbox, FormControlLabel, FormGroup, TextField, Typography } from '@material-ui/core';
import styled from 'styled-components';
import { CristinPublication, ImportData } from '../../types/PublicationTypes';
import { searchChristinPublications } from './SearchChristinPublications';

const StyledFormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

const StyledFormElementWrapper = styled.div`
  display: flex;
  margin-bottom: 1rem;
`;

const StyledFormControlLabel = styled(FormControlLabel)`
  min-width: 11rem;
`;

const StyledButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-bottom: 1rem;
  align-items: center;
`;

interface SearchPanelProps {
  importPublication: ImportData;
  setDuplicateList: (results: CristinPublication[]) => void;
  setIsSearching: (value: boolean) => void;
  setFoundDuplicates: (value: boolean) => void;
}

const SearchPanel: FC<SearchPanelProps> = ({
  importPublication,
  setDuplicateList,
  setIsSearching,
  setFoundDuplicates,
}) => {
  const [doi, setDoi] = useState(importPublication.doi ?? '');
  const [isDoiChecked, setIsDoiChecked] = useState(false);
  const [title, setTitle] = useState(importPublication.languages && importPublication.languages[0].title);
  const [titleChecked, setTitleChecked] = useState(false);
  const [yearPublished, setYearPublished] = useState(+(importPublication.yearPublished ?? 0));
  const [isYearPublishedChecked, setIsYearPublishedChecked] = useState(false);
  const [issn, setIssn] = useState(importPublication.channel?.issns ? importPublication.channel.issns[0] : '');
  const [isIssnChecked, setIsIssnChecked] = useState(false);
  const [author, setAuthor] = useState(
    importPublication.authors[0].authorName ||
      importPublication.authors[0].surname + ', ' + importPublication.authors[0]?.first_name?.substr(0, 1)
  );
  const [isAuthorChecked, setIsAuthorChecked] = useState(false);

  function handleChangeDoi(event: any) {
    setDoi(event.target.value);
  }

  function handleChangeIssn(event: any) {
    setIssn(event.target.value);
  }

  function handleChangeTitle(event: any) {
    setTitle(event.target.value);
  }

  function handleChangePublished(event: any) {
    setYearPublished(event.target.value);
  }

  function handleChangeAuthor(event: any) {
    setAuthor(event.target.value);
  }

  function resetValues() {
    setDoi(importPublication.doi ?? '');
    setTitle(importPublication.languages && importPublication.languages[0].title);
    setAuthor(
      importPublication.authors[0].authorName ||
        importPublication.authors[0].surname + ', ' + importPublication.authors[0]?.first_name?.substr(0, 1)
    );
    setYearPublished(+(importPublication.yearPublished ?? 0));
    setIssn(importPublication.channel?.issns ? importPublication.channel.issns[0] : '');
    setIsDoiChecked(false);
    setTitleChecked(false);
    setIsAuthorChecked(false);
    setIsIssnChecked(false);
    setIsYearPublishedChecked(false);
    setDuplicateList([]);
  }

  async function retrySearch() {
    const searchString =
      (isDoiChecked ? '?doi=' + doi : '') +
      (titleChecked
        ? (isDoiChecked ? '&' : '?') + 'title=' + title + (isAuthorChecked ? '&contributor=' + author : '')
        : '') +
      (isYearPublishedChecked
        ? (isDoiChecked || titleChecked ? '&' : '?') +
          'published_since=' +
          (+yearPublished - 1) +
          '&published_before=' +
          +yearPublished
        : '') +
      (isIssnChecked ? (isDoiChecked || isYearPublishedChecked || isIssnChecked ? '&' : '?') + 'issn=' + issn : '') +
      '&per_page=5';
    setIsSearching(true);
    setFoundDuplicates(false);
    const results = await searchChristinPublications(searchString);
    if (results.length > 0) {
      setFoundDuplicates(true);
    }
    setIsSearching(false);
    setDuplicateList(results);
  }

  const noCheckBoxesChecked = !(
    isYearPublishedChecked ||
    isIssnChecked ||
    isAuthorChecked ||
    titleChecked ||
    isDoiChecked
  );

  return (
    <StyledFormWrapper>
      <FormGroup>
        <Typography style={{ fontWeight: 'bold' }} gutterBottom>
          Søk etter duplikater:
        </Typography>
        <StyledFormElementWrapper>
          <StyledFormControlLabel
            control={
              <Checkbox
                data-testid="search-panel-doi-checkbox"
                checked={isDoiChecked}
                onClick={() => setIsDoiChecked(!isDoiChecked)}
              />
            }
            label="DOI"
          />
          <TextField
            data-testid="search-panel-doi-textfield"
            variant="outlined"
            fullWidth
            disabled={!isDoiChecked}
            multiline
            value={doi}
            onChange={handleChangeDoi}
          />
        </StyledFormElementWrapper>

        <StyledFormElementWrapper>
          <StyledFormControlLabel
            control={
              <Checkbox
                data-testid="search-panel-title-checkbox"
                checked={titleChecked}
                onClick={() => setTitleChecked(!titleChecked)}
              />
            }
            label="Tittel"
          />
          <TextField
            data-testid="search-panel-title-textfield"
            fullWidth
            variant="outlined"
            disabled={!titleChecked}
            multiline
            value={title}
            onChange={handleChangeTitle}
          />
        </StyledFormElementWrapper>

        <StyledFormElementWrapper>
          <StyledFormControlLabel
            control={
              <Checkbox
                data-testid="search-panel-author-checkbox"
                checked={isAuthorChecked}
                onClick={() => setIsAuthorChecked(!isAuthorChecked)}
              />
            }
            label="Søk med forfatter"
          />
          <TextField
            data-testid="search-panel-author-textfield"
            variant="outlined"
            fullWidth
            disabled={!isAuthorChecked}
            value={author}
            onChange={handleChangeAuthor}
          />
        </StyledFormElementWrapper>

        {importPublication.channel?.issns && (
          <StyledFormElementWrapper>
            <StyledFormControlLabel
              control={
                <Checkbox
                  data-testid="search-panel-issn-checkbox"
                  checked={isIssnChecked}
                  onClick={() => setIsIssnChecked(!isIssnChecked)}
                />
              }
              label="ISSN"
            />
            <TextField
              data-testid="search-panel-issn-textfield"
              variant="outlined"
              fullWidth
              disabled={!isIssnChecked}
              value={issn}
              onChange={handleChangeIssn}
            />
          </StyledFormElementWrapper>
        )}

        <StyledFormElementWrapper>
          <StyledFormControlLabel
            control={
              <Checkbox
                data-testid="search-panel-year-checkbox"
                checked={isYearPublishedChecked}
                onClick={() => setIsYearPublishedChecked(!isYearPublishedChecked)}
              />
            }
            label="Publiseringsår"
          />
          <TextField
            data-testid="search-panel-year-textfield"
            variant="outlined"
            disabled={!isYearPublishedChecked}
            value={yearPublished}
            onChange={handleChangePublished}
          />
        </StyledFormElementWrapper>

        <StyledButtonWrapper>
          <Button
            data-testid="search-panel-reset-serach-button"
            variant="outlined"
            color="primary"
            onClick={resetValues}>
            Tilbakestill søkeverdier
          </Button>
          <Button
            style={{ marginLeft: '1rem' }}
            data-testid="search-panel-retry-search-button"
            variant="contained"
            disabled={noCheckBoxesChecked}
            color="primary"
            onClick={retrySearch}>
            Søk på nytt
          </Button>
        </StyledButtonWrapper>
      </FormGroup>
    </StyledFormWrapper>
  );
};
export default SearchPanel;
