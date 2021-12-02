import React, { FC, useState } from 'react';
import { Button, Card, CardContent, CircularProgress, Collapse, Typography } from '@material-ui/core';
import { ContributorType, ContributorWrapper } from '../../types/ContributorTypes';
import ContributorSearchResultItem from './ContributorSearchResultItem';
import { getPersonDetailById, searchPersonDetailByName } from '../../api/contributorApi';
import { Affiliation } from '../../types/InstitutionTypes';
import { getAffiliationDetails } from '../../utils/contributorUtils';
import { handlePotentialExpiredSession } from '../../api/api';
import styled from 'styled-components';
import { Colors } from '../../assets/styles/StyleConstants';

const StyledResultTypography = styled(Typography)`
  color: ${Colors.Text.OPAQUE_87_BLACK};
`;

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
      const authorResults = await searchPersonDetailByName(
        `${contributorData.toBeCreated.first_name} ${contributorData.toBeCreated.surname}`
      );

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
    temp.isEditing = false;
    setOpenContributorSearchPanel(false);
    updateContributor(temp, resultListIndex);
  }

  function handleContributorSearchPanelClose() {
    setOpenContributorSearchPanel(false);
    if (searchResults.length > 0) {
      setSearchResults([]);
    }
  }

  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        data-testid={`contributor-search-button-${resultListIndex}`}
        onClick={() => retrySearch()}
        disabled={contributorData.toBeCreated.first_name === '' || contributorData.toBeCreated.surname === ''}>
        {contributorData.toBeCreated.cristin_person_id ? 'Søk og erstatt person' : 'Søk etter person'}
      </Button>
      {!searching && searchError && (
        <Typography color="error">{searchError.message ?? 'Noe gikk galt med søket, prøv igjen'} </Typography>
      )}
      {searching && <CircularProgress />}
      {openContributorSearchPanel && !searching && (
        <StyledResultTypography>Fant {searchResults.length} bidragsytere</StyledResultTypography>
      )}

      {searchResults.length > 0 && (
        <Collapse in={openContributorSearchPanel && !searching}>
          <Card>
            <CardContent>
              {searchResults.map((author: ContributorType) => (
                <ContributorSearchResultItem
                  key={author.cristin_person_id}
                  contributor={author}
                  handleChoose={handleChooseThis}
                />
              ))}
            </CardContent>
            <Button color="primary" onClick={handleContributorSearchPanelClose}>
              Lukk
            </Button>
          </Card>
        </Collapse>
      )}
    </>
  );
};

export default ContributorSearchPanel;
