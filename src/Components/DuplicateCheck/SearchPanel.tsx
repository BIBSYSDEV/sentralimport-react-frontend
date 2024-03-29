import React, { FC, useEffect, useState } from 'react';
import { Button, Checkbox, FormControlLabel, FormGroup, TextField, Typography } from '@material-ui/core';
import styled from 'styled-components';
import { CristinPublication, ImportPublication } from '../../types/PublicationTypes';
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

const StyledCenterWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  margin-bottom: 1rem;
  align-items: center;
`;

const StyledButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-bottom: 1rem;
  align-items: center;
`;

const maxResults = '5';

interface SearchPanelProps {
  importPublication: ImportPublication;
  setDuplicateResultList: (results: CristinPublication[]) => void;
  setIsSearching: (value: boolean) => void;
  setFoundDuplicates: (value: boolean) => void;
  isInitialSearchWithDoi: boolean;
  setTotalResults: (total: number) => void;
}

const SearchPanel: FC<SearchPanelProps> = ({
  importPublication,
  setDuplicateResultList,
  setIsSearching,
  setFoundDuplicates,
  isInitialSearchWithDoi,
  setTotalResults,
}) => {
  const [doi, setDoi] = useState(importPublication.doi ?? '');
  const [isDoiChecked, setIsDoiChecked] = useState(false);
  const [title, setTitle] = useState(importPublication.languages[0]?.title ?? '');
  const [isTitleChecked, setIsTitleChecked] = useState(false);
  const [yearPublished, setYearPublished] = useState(importPublication.yearPublished);
  const [isYearPublishedChecked, setIsYearPublishedChecked] = useState(false);
  const [issn, setIssn] = useState(importPublication.channel?.issn ?? '');
  const [isIssnChecked, setIsIssnChecked] = useState(false);
  const [author, setAuthor] = useState(importPublication.authors[0]?.surname ?? '');
  const [isAuthorChecked, setIsAuthorChecked] = useState(false);

  useEffect(() => {
    setIsDoiChecked(isInitialSearchWithDoi);
    setIsIssnChecked(!isInitialSearchWithDoi);
    setIsYearPublishedChecked(!isInitialSearchWithDoi);
    setIsAuthorChecked(!isInitialSearchWithDoi);
    setIsTitleChecked(!isInitialSearchWithDoi);
  }, [isInitialSearchWithDoi]);

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
    setTitle(importPublication.languages[0]?.title ?? '');
    setAuthor(importPublication.authors[0]?.surname ?? '');
    setYearPublished(importPublication.yearPublished);
    setIssn(importPublication.channel?.issn ?? '');
    setIsDoiChecked(false);
    setIsTitleChecked(false);
    setIsAuthorChecked(false);
    setIsIssnChecked(false);
    setIsYearPublishedChecked(false);
    setDuplicateResultList([]);
  }

  async function retrySearch() {
    setIsSearching(true);
    setFoundDuplicates(false);

    const results = await searchChristinPublications(
      maxResults,
      isDoiChecked ? doi.trim() : undefined,
      isTitleChecked ? title.trim() : undefined,
      isYearPublishedChecked ? yearPublished : undefined,
      isIssnChecked ? issn.trim() : undefined,
      isAuthorChecked ? author.trim() : undefined
    );
    if (results.cristinPublications.length > 0) {
      setFoundDuplicates(true);
    }
    setTotalResults(results.totalPublicationsResults);
    setIsSearching(false);
    setDuplicateResultList(results.cristinPublications);
  }

  const noCheckBoxesChecked = !(
    isYearPublishedChecked ||
    isIssnChecked ||
    isAuthorChecked ||
    isTitleChecked ||
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
                onClick={() => {
                  if (!isDoiChecked) {
                    setIsIssnChecked(false);
                    setIsYearPublishedChecked(false);
                    setIsAuthorChecked(false);
                    setIsTitleChecked(false);
                  }
                  setIsDoiChecked(!isDoiChecked);
                }}
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
        <StyledCenterWrapper>
          <Typography>eller søk på</Typography>
        </StyledCenterWrapper>
        <StyledFormElementWrapper>
          <StyledFormControlLabel
            control={
              <Checkbox
                data-testid="search-panel-title-checkbox"
                checked={isTitleChecked}
                onClick={() => {
                  if (!isTitleChecked) {
                    setIsDoiChecked(false);
                  }
                  setIsTitleChecked(!isTitleChecked);
                }}
              />
            }
            label="Tittel"
          />
          <TextField
            data-testid="search-panel-title-textfield"
            fullWidth
            variant="outlined"
            disabled={!isTitleChecked}
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
                onClick={() => {
                  if (!isAuthorChecked) {
                    setIsDoiChecked(false);
                  }
                  setIsAuthorChecked(!isAuthorChecked);
                }}
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
        {importPublication.channel?.issn && (
          <StyledFormElementWrapper>
            <StyledFormControlLabel
              control={
                <Checkbox
                  data-testid="search-panel-issn-checkbox"
                  checked={isIssnChecked}
                  onClick={() => {
                    if (!isIssnChecked) {
                      setIsDoiChecked(false);
                    }
                    setIsIssnChecked(!isIssnChecked);
                  }}
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
                onClick={() => {
                  if (isYearPublishedChecked) {
                    setIsDoiChecked(false);
                  }
                  setIsYearPublishedChecked(!isYearPublishedChecked);
                }}
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
