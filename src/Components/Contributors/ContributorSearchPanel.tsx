import React, { FC, useEffect, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Collapse,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core';
import { ContributorType, ContributorWrapper } from '../../types/ContributorTypes';
import ContributorSearchResultItem from './ContributorSearchResultItem';
import { getPersonDetailById, searchPersonDetailByName } from '../../api/contributorApi';
import { Affiliation } from '../../types/InstitutionTypes';
import { getAffiliationDetails } from '../../utils/contributorUtils';
import { handlePotentialExpiredSession } from '../../api/api';
import styled from 'styled-components';
import { Colors } from '../../assets/styles/StyleConstants';
import clone from 'just-clone';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SearchIcon from '@material-ui/icons/Search';

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

const StyledCard = styled(Card)`
  &.MuiPaper-outlined {
    border: 3px solid ${Colors.PURPLE};
    border-radius: 5px;
  }
`;

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
  const [isEditingName, setIsEditingName] = useState(true);

  function removeInstitutionsDuplicatesBasedOnCristinId(affiliations: Affiliation[]) {
    const cristinIdSet = new Set();
    return affiliations.filter((affiliation: Affiliation) => {
      if (cristinIdSet.has(affiliation.cristinInstitutionNr)) return false;
      cristinIdSet.add(affiliation.cristinInstitutionNr);
      return true;
    });
  }

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
            fetchedAuthors.push(fetchedAuthor);
          }
        }
        setSearchResults(fetchedAuthors);
        setOpenContributorSearchPanel(true);
      } else {
        setSearchResults([]);
        setOpenContributorSearchPanel(true);
      }
    } catch (error: any) {
      handlePotentialExpiredSession(error);
      setSearchError(error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }

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
    temp.cristin.isEditing = false;
    temp.cristin.order = resultListIndex + 1;
    temp.toBeCreated = author;
    if (temp.toBeCreated.first_name_preferred) {
      temp.toBeCreated.first_name = temp.toBeCreated.first_name_preferred;
    }
    if (temp.toBeCreated.surname_preferred) {
      temp.toBeCreated.surname = temp.toBeCreated.surname_preferred;
    }
    temp.toBeCreated.isEditing = false;
    temp.toBeCreated.order = resultListIndex + 1;
    setOpenContributorSearchPanel(false);
    setIsEditingName(false);
    updateContributor(temp, resultListIndex);
  }

  function handleContributorSearchPanelClose() {
    setOpenContributorSearchPanel(false);
    if (searchResults.length > 0) {
      setSearchResults([]);
    }
  }

  function handleResetPersonWithCristinId() {
    const temp = contributorData;
    temp.toBeCreated.first_name_preferred = undefined;
    temp.toBeCreated.surname_preferred = undefined;
    temp.toBeCreated.first_name = firstName;
    temp.toBeCreated.surname = surname;
    temp.toBeCreated.cristin_person_id = 0;
    updateContributor(temp, resultListIndex);
    setOpenContributorSearchPanel(false);
    setIsEditingName(false);
  }

  function handleSaveNameChangeContributorWithoutCristinId() {
    const temp = contributorData;
    temp.toBeCreated.first_name = firstName;
    temp.toBeCreated.surname = surname;
    updateContributor(temp, resultListIndex);
    setOpenContributorSearchPanel(false);
    setIsEditingName(false);
  }

  return (
    <Grid container spacing={2} alignItems="center">
      {!isEditingName && (
        <Grid item>
          <Button
            onClick={() => {
              setIsEditingName(true);
              setOpenContributorSearchPanel(true);
              retrySearch();
            }}
            variant="outlined"
            color="primary">
            Vis søk
          </Button>
        </Grid>
      )}
      {isEditingName && (
        <Grid item>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => {
              setIsEditingName(false);
            }}>
            Skjul søk
          </Button>
        </Grid>
      )}
      <Grid item xs={12}>
        <Collapse in={isEditingName}>
          <Grid container spacing={2}>
            <Grid item>
              <TextField
                id={'firstName' + resultListIndex}
                label="Fornavn"
                value={firstName}
                margin="normal"
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Grid>
            <Grid item>
              <TextField
                id={'firstName' + resultListIndex}
                label="Fornavn"
                value={surname}
                margin="normal"
                onChange={(e) => setSurname(e.target.value)}
              />
            </Grid>
            <Grid item>
              <Button
                startIcon={<SearchIcon />}
                variant="outlined"
                color="primary"
                data-testid={`contributor-search-button-${resultListIndex}`}
                onClick={() => {
                  setIsEditingName(true);
                  retrySearch();
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

            {isEditingName && !searching && (
              <Grid item xs={12}>
                <StyledResultTypography variant="h6">Fant {searchResults.length} bidragsytere</StyledResultTypography>
              </Grid>
            )}
          </Grid>
        </Collapse>
      </Grid>

      <Grid item xs={12}>
        <Collapse in={openContributorSearchPanel && isEditingName && !searching && searchResults.length > 0}>
          <StyledCard variant="outlined">
            <CardContent>
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
            </CardContent>
            <Button color="primary" onClick={handleContributorSearchPanelClose}>
              Lukk resultatliste
            </Button>
          </StyledCard>
        </Collapse>
      </Grid>
    </Grid>
  );
};

export default ContributorSearchPanel;
