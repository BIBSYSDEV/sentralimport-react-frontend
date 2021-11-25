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

const StyledButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-bottom: 1rem;
  align-items: center;
`;

interface SearchPanelProps {
  importPublication: ImportPublication;
  setDuplicateList: (results: CristinPublication[]) => void;
  setIsSearching: (value: boolean) => void;
  setFoundDuplicates: (value: boolean) => void;
  isInitialSearchWithDoi: boolean;
  setTotalResults: (total: number) => void;
}

const SearchPanel: FC<SearchPanelProps> = ({
  importPublication,
  setDuplicateList,
  setIsSearching,
  setFoundDuplicates,
  isInitialSearchWithDoi,
  setTotalResults,
}) => {
  const [doi, setDoi] = useState(importPublication.doi ?? '');
  const [isDoiChecked, setIsDoiChecked] = useState(isInitialSearchWithDoi);
  const [title, setTitle] = useState(importPublication.languages && importPublication.languages[0].title);
  const [titleChecked, setTitleChecked] = useState(!isInitialSearchWithDoi);
  const [yearPublished, setYearPublished] = useState(importPublication.yearPublished);
  const [isYearPublishedChecked, setIsYearPublishedChecked] = useState(false);
  const [issn, setIssn] = useState(importPublication.channel?.issns ? importPublication.channel.issns[0] : '');
  const [isIssnChecked, setIsIssnChecked] = useState(false);
  const [author, setAuthor] = useState(
    importPublication.authors[0].authorName ||
      importPublication.authors[0].surname + ', ' + importPublication.authors[0]?.first_name?.substr(0, 1)
  );
  const [isAuthorChecked, setIsAuthorChecked] = useState(!isInitialSearchWithDoi);

  useEffect(() => {
    setIsDoiChecked(isInitialSearchWithDoi);
    setIsIssnChecked(!isInitialSearchWithDoi);
    setIsYearPublishedChecked(!isInitialSearchWithDoi);
    setIsAuthorChecked(!isInitialSearchWithDoi);
    setTitleChecked(!isInitialSearchWithDoi);
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
    setTitle(importPublication.languages && importPublication.languages[0].title);
    setAuthor(
      importPublication.authors[0].authorName ||
        importPublication.authors[0].surname + ', ' + importPublication.authors[0]?.first_name?.substr(0, 1)
    );
    setYearPublished(importPublication.yearPublished);
    setIssn(importPublication.channel?.issns ? importPublication.channel.issns[0] : '');
    setIsDoiChecked(false);
    setTitleChecked(false);
    setIsAuthorChecked(false);
    setIsIssnChecked(false);
    setIsYearPublishedChecked(false);
    setDuplicateList([]);
  }

  async function retrySearch() {
    setIsSearching(true);
    setFoundDuplicates(false);

    const perPage = '5';
    const results = await searchChristinPublications(
      perPage,
      isDoiChecked ? doi : undefined,
      titleChecked ? title : undefined,
      isYearPublishedChecked ? yearPublished : undefined,
      isIssnChecked ? issn : undefined,
      isAuthorChecked ? author : undefined
    );
    if (results.cristinPublications.length > 0) {
      setFoundDuplicates(true);
    }
    setTotalResults(results.totalPublicationsResults);
    setIsSearching(false);
    setDuplicateList(results.cristinPublications);
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
