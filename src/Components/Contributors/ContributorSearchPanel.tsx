import React, { FC, useCallback, useEffect, useState } from 'react';
import { Button, Card, CircularProgress, Collapse, Grid, TextField, Typography } from '@material-ui/core';
import { ContributorStatus, ContributorType, ContributorWrapper } from '../../types/ContributorTypes';
import ContributorSearchResultItem from './ContributorSearchResultItem';
import { getPersonDetailById, searchPersonDetailByName } from '../../api/contributorApi';
import { Affiliation } from '../../types/InstitutionTypes';
import { getAffiliationDetails, getContributorStatus } from '../../utils/contributorUtils';
import { handlePotentialExpiredSession } from '../../api/api';
import styled from 'styled-components';
import { Colors } from '../../assets/styles/StyleConstants';
import clone from 'just-clone';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SearchIcon from '@material-ui/icons/Search';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { removeInstitutionsDuplicatesBasedOnCristinId } from './ContributorModal';

const StyledResultTypography = styled(Typography)`
  &.MuiTypography-root {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
  color: ${Colors.Text.OPAQUE_87_BLACK};
`;

const StyledCircularProgress = styled(CircularProgress)`
  margin-top: 0.3rem;
`;

const StyledAccordionLikeButton = styled(Button)`
  width: 100%;
  &.MuiButtonBase-root {
    justify-content: space-between;
  }
`;

const StyledCard = styled(Card)`
  &.MuiPaper-outlined {
    border: 2px solid ${Colors.PRIMARY};
    border-radius: 5px;
    min-height: 3rem;
  }
`;

const StyledCollapse = styled(Collapse)`
  &.MuiCollapse-root {
    width: 100%;
    padding-left: 1rem;
    padding-right: 1rem;
  }
`;

const customTimeout = 800;

export interface AddAffiliationError extends Error {
  institutionId: string;
}

interface ContributorSearchPanelProps {
  resultListIndex: number;
  contributorData: ContributorWrapper;
  updateContributor: (contributorData: ContributorWrapper, rowIndex: number) => void;
}

const ContributorSearchPanel: FC<ContributorSearchPanelProps> = ({
  resultListIndex,
  contributorData,
  updateContributor,
}) => {
  const [searchResults, setSearchResults] = useState<ContributorType[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<Error | undefined>();
  const [openContributorSearchPanel, setOpenContributorSearchPanel] = useState(false);
  const [addAffiliationSuccessful, setAddAffiliationSuccessful] = useState<string | undefined>(undefined);
  const [addAffiliationError, setAddAffiliationError] = useState<AddAffiliationError | undefined>();
  const [firstName, setFirstName] = useState(contributorData.toBeCreated.first_name);
  const [surname, setSurname] = useState(contributorData.toBeCreated.surname);
  const [firstnameDirty, setFirstNameDirty] = useState(false);
  const [surnameDirty, setSurnameDirty] = useState(false);
  const [firstNameError, setFirstnameError] = useState(false);
  const [surnameError, setSurnameError] = useState(false);
  const [isNotPossibleToSwitchPerson, setIsNotPossibleToSwitchPerson] = useState(false);

  const handleFirstNameChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFirstName(event.target.value);
    const firstNameError = event.target.value.trim().length === 0;
    if (!firstNameError && !surnameError) {
      setIsNotPossibleToSwitchPerson(false);
    }
    setFirstnameError(firstNameError);
  };

  const firstNameIsDirtyAndHasError = () => {
    return firstnameDirty && firstNameError;
  };

  const handleSurnameChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSurname(event.target.value);
    const surnameError = event.target.value.trim().length === 0;
    if (!firstNameError && !surnameError) {
      setIsNotPossibleToSwitchPerson(false);
    }
    setSurnameError(surnameError);
  };

  const surnameIsDirtyAndHasError = () => {
    return surnameDirty && surnameError;
  };

  const handleSwitchPersonClick = () => {
    if (firstNameError || surnameError) {
      setIsNotPossibleToSwitchPerson(true);
    } else {
      const temp = contributorData;
      temp.toBeCreated.first_name_preferred = undefined;
      temp.toBeCreated.surname_preferred = undefined;
      temp.toBeCreated.first_name = firstName;
      temp.toBeCreated.surname = surname;
      temp.toBeCreated.badge_type = ContributorStatus.None;
      temp.toBeCreated.cristin_person_id = 0;
      temp.toBeCreated.require_higher_authorization = false;
      temp.toBeCreated.identified_cristin_person = false;
      updateContributor(temp, resultListIndex);
      setOpenContributorSearchPanel(false);
      setIsNotPossibleToSwitchPerson(false);
    }
  };

  const searchForContributors = useCallback((firstName: string, surname: string) => {
    async function retrySearch() {
      setSearching(true);
      setSearchError(undefined);
      let unitNameCache = new Map();
      let institutionNameCache = new Map();
      try {
        const authorResults = await searchPersonDetailByName(`${firstName} ${surname}`);
        if (authorResults.data.length > 0) {
          const fetchedAuthors: ContributorType[] = [];
          for (let i = 0; i < authorResults.data.length; i++) {
            const resultAffiliations: Affiliation[] = [];
            const fetchedAuthor = await getPersonDetailById(authorResults.data[i]);
            if (fetchedAuthor && fetchedAuthor.affiliations) {
              const activeAffiliations = fetchedAuthor.affiliations.filter(
                (affiliation: Affiliation) => affiliation.active
              );
              for (const activeAffiliation of activeAffiliations) {
                const detailedAffiliationAndCache = await getAffiliationDetails(
                  activeAffiliation,
                  unitNameCache,
                  institutionNameCache
                );
                unitNameCache = detailedAffiliationAndCache.unitNameCache;
                institutionNameCache = detailedAffiliationAndCache.institutionNameCache;
                detailedAffiliationAndCache.affiliation &&
                  resultAffiliations.push(detailedAffiliationAndCache.affiliation);
              }
              fetchedAuthor.affiliations = removeInstitutionsDuplicatesBasedOnCristinId(resultAffiliations);
            } else if (fetchedAuthor && !fetchedAuthor.affiliations) {
              fetchedAuthor.affiliations = [];
            }
            if (fetchedAuthor) {
              fetchedAuthor.badge_type = getContributorStatus(fetchedAuthor, fetchedAuthor.affiliations);
              fetchedAuthors.push(fetchedAuthor);
            }
          }
          setSearchResults(fetchedAuthors);
        } else {
          setSearchResults([]);
        }
      } catch (error: any) {
        handlePotentialExpiredSession(error);
        setSearchError(error);
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }
    retrySearch().then();
  }, []);

  function handleChooseOnlyAffiliation(newaffiliation: Affiliation) {
    setAddAffiliationError(undefined);
    setAddAffiliationSuccessful(undefined);
    if (
      contributorData.toBeCreated.affiliations &&
      contributorData.toBeCreated.affiliations.find((oldAffiliation) => {
        if (oldAffiliation.cristinInstitutionNr && newaffiliation.cristinInstitutionNr) {
          return oldAffiliation.cristinInstitutionNr.toString() === newaffiliation.cristinInstitutionNr.toString();
        }

        return false;
      })
    ) {
      setAddAffiliationError({
        name: 'Add institution error',
        message: 'Institusjonen finnes allerede',
        institutionId: newaffiliation.cristinInstitutionNr ?? '',
      });
      return;
    }
    const temp = contributorData;
    if (temp.toBeCreated.affiliations) {
      //Deep copy required to prevent editing affiliations later causes change in search result item
      temp.toBeCreated.affiliations.push(clone(newaffiliation));
    } else {
      temp.toBeCreated.affiliations = [clone(newaffiliation)];
    }
    setAddAffiliationSuccessful(newaffiliation.cristinInstitutionNr);
    updateContributor(temp, resultListIndex);
  }

  function handleChooseOnlyAuthor(author: ContributorType) {
    const newAuthor = author;
    if (newAuthor.affiliations) {
      delete newAuthor.affiliations;
    }
    if (contributorData.toBeCreated.affiliations) {
      newAuthor.affiliations = contributorData.toBeCreated.affiliations;
    }

    handleChooseThis(newAuthor);
  }

  useEffect(() => {
    setAddAffiliationError(undefined);
  }, [contributorData.toBeCreated.affiliations]);

  function handleChooseThis(author: ContributorType) {
    const temp = contributorData;
    temp.cristin = author;
    temp.cristin.order = resultListIndex + 1;
    temp.toBeCreated = author;
    if (temp.toBeCreated.first_name_preferred) {
      temp.toBeCreated.first_name = temp.toBeCreated.first_name_preferred;
    }
    if (temp.toBeCreated.surname_preferred) {
      temp.toBeCreated.surname = temp.toBeCreated.surname_preferred;
    }
    temp.toBeCreated.require_higher_authorization = author.require_higher_authorization;
    temp.toBeCreated.order = resultListIndex + 1;
    setOpenContributorSearchPanel(false);
    updateContributor(temp, resultListIndex);
  }

  const handleOpenSearchPanelClick = () => {
    setOpenContributorSearchPanel(true);
    setFirstName(contributorData.toBeCreated.first_name);
    setSurname(contributorData.toBeCreated.surname);
    searchForContributors(contributorData.toBeCreated.first_name, contributorData.toBeCreated.surname);
  };

  return (
    <StyledCard variant="outlined">
      {!openContributorSearchPanel && (
        <StyledAccordionLikeButton
          data-testid={`contributor-search-button-${resultListIndex}`}
          size="large"
          onClick={handleOpenSearchPanelClick}
          endIcon={<ExpandMoreIcon />}
          color="primary">
          Vis søk
        </StyledAccordionLikeButton>
      )}
      {openContributorSearchPanel && (
        <StyledAccordionLikeButton
          size="large"
          color="primary"
          endIcon={<ExpandLessIcon />}
          onClick={() => {
            setOpenContributorSearchPanel(false);
          }}>
          Skjul søk
        </StyledAccordionLikeButton>
      )}

      <StyledCollapse timeout={customTimeout} in={openContributorSearchPanel}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Grid container spacing={2} alignItems="center">
              <Grid item sm={4}>
                <TextField
                  id={'firstName' + resultListIndex}
                  label="Fornavn"
                  error={firstNameIsDirtyAndHasError()}
                  value={firstName}
                  helperText={firstNameIsDirtyAndHasError() && 'Fornavn er påkrevd'}
                  onBlur={() => setFirstNameDirty(true)}
                  margin="normal"
                  onChange={handleFirstNameChange}
                />
              </Grid>
              <Grid item sm={4}>
                <TextField
                  id={'surname' + resultListIndex}
                  onBlur={() => setSurnameDirty(true)}
                  label="Etternavn"
                  error={surnameIsDirtyAndHasError()}
                  helperText={surnameIsDirtyAndHasError() && 'Etternavn er påkrevd'}
                  value={surname}
                  margin="normal"
                  onChange={handleSurnameChange}
                />
              </Grid>

              <Grid item xs={4}>
                <Grid container>
                  <Grid item>
                    <Button
                      data-testid={`choose-text-field-person-${resultListIndex}`}
                      size="small"
                      onClick={handleSwitchPersonClick}
                      color="primary">
                      Velg person
                    </Button>
                  </Grid>
                  {isNotPossibleToSwitchPerson && (
                    <Grid item>
                      <Typography variant="body2" color="error">
                        Feil i navn
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item>
            <Button
              startIcon={<SearchIcon />}
              variant="outlined"
              color="primary"
              data-testid={`contributor-retry-search-button-${resultListIndex}`}
              onClick={() => {
                searchForContributors(firstName, surname);
              }}
              disabled={contributorData.toBeCreated.first_name === '' || contributorData.toBeCreated.surname === ''}>
              Søk etter person
            </Button>
          </Grid>

          {!searching && searchError && (
            <Grid item xs={12}>
              <Typography color="error">{searchError.message ?? 'Noe gikk galt med søket, prøv igjen'} </Typography>
            </Grid>
          )}
          {searching && (
            <Grid item xs={12}>
              <StyledCircularProgress size={'2rem'} />
            </Grid>
          )}

          {openContributorSearchPanel && !searching && (
            <Grid item xs={12}>
              <StyledResultTypography variant="h6">Fant {searchResults.length} bidragsytere:</StyledResultTypography>
            </Grid>
          )}
        </Grid>
      </StyledCollapse>

      <StyledCollapse timeout={customTimeout} in={openContributorSearchPanel && !searching && searchResults.length > 0}>
        {searchResults.map((author: ContributorType) => (
          <ContributorSearchResultItem
            addAffiliationError={addAffiliationError}
            addAffiliationSuccessful={addAffiliationSuccessful}
            handleChooseOnlyAffiliation={handleChooseOnlyAffiliation}
            handleChooseOnlyAuthor={handleChooseOnlyAuthor}
            key={author.cristin_person_id}
            contributor={author}
            handleChoose={handleChooseThis}
          />
        ))}
      </StyledCollapse>
    </StyledCard>
  );
};

export default ContributorSearchPanel;
