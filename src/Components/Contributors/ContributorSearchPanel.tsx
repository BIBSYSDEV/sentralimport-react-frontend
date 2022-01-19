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
import { ErrorMessage, Field, FieldProps, Formik } from 'formik';
import * as Yup from 'yup';
import CommonErrorMessage from '../CommonErrorMessage';

const StyledResultTypography = styled(Typography)`
  &.MuiTypography-root {
    margin-bottom: 0.5rem;
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

const StyledShowMoreButton = styled(Button)`
  &&.MuiButton-root {
    margin-bottom: 1rem;
  }
`;

const StyledChoosePersonButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

//styled so it will match exact height of icon button "søk etter person"
const StyledChoosePersonButton = styled(Button)`
  min-height: 2.28rem;
`;

const customTimeout = 800;

const generateSearchResultHeader = (totalCount: number, numbersOfContributors: number, showFullResultList: boolean) => {
  return `Fant ${totalCount} ${totalCount === 1 ? 'bidragsyter' : 'bidragsytere'}${
    !showFullResultList && numbersOfContributors > 5 ? ' (viser 5 første)' : ''
  }${totalCount !== numbersOfContributors && showFullResultList ? ` (viser ${numbersOfContributors} første)` : ''}${
    totalCount > 0 ? ':' : ''
  }`;
};

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
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<Error | undefined>();
  const [openContributorSearchPanel, setOpenContributorSearchPanel] = useState(false);
  const [addAffiliationSuccessful, setAddAffiliationSuccessful] = useState<string | undefined>(undefined);
  const [addAffiliationError, setAddAffiliationError] = useState<AddAffiliationError | undefined>();
  const [showFullResultList, setShowFullResultList] = useState(false);
  const [unitNameCache, setUnitNameCache] = useState(new Map());
  const [institutionNameCache, setInstitutionNameCache] = useState(new Map());
  const [searchResultLength, setSearchResultLength] = useState(0);

  useEffect(() => {
    setAddAffiliationError(undefined);
  }, [contributorData.toBeCreated.affiliations]);

  const isVerifiedCristinPerson = (person: ContributorType) =>
    person.cristin_person_id && person.cristin_person_id.toString() !== '0';

  useEffect(() => {
    if (!isVerifiedCristinPerson(contributorData.toBeCreated)) {
      openSearchPanelAndSearchContributors();
    }
  }, [
    contributorData.toBeCreated.surname,
    contributorData.toBeCreated.first_name,
    contributorData.toBeCreated.cristin_person_id,
  ]);

  const handleChoosePerson = (firstName: string, surname: string) => {
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
  };

  const getContributorDetailsAndAffiliation = async (contributor: ContributorType) => {
    const resultAffiliations: Affiliation[] = [];
    const fetchedAuthor = await getPersonDetailById(contributor);
    if (fetchedAuthor && fetchedAuthor.affiliations) {
      const activeAffiliations = fetchedAuthor.affiliations.filter((affiliation: Affiliation) => affiliation.active);
      for (const activeAffiliation of activeAffiliations) {
        const detailedAffiliationAndCache = await getAffiliationDetails(
          activeAffiliation,
          unitNameCache,
          institutionNameCache
        );
        //klar over at vi får race-conditions på cachinga, men den er fortsatt raskere enn hvis man tar å venter på ett og ett resultat.
        setUnitNameCache(detailedAffiliationAndCache.unitNameCache);
        setInstitutionNameCache(detailedAffiliationAndCache.institutionNameCache);
        detailedAffiliationAndCache.affiliation && resultAffiliations.push(detailedAffiliationAndCache.affiliation);
      }
      fetchedAuthor.affiliations = removeInstitutionsDuplicatesBasedOnCristinId(resultAffiliations);
    } else if (fetchedAuthor && !fetchedAuthor.affiliations) {
      fetchedAuthor.affiliations = [];
    }
    if (fetchedAuthor) {
      fetchedAuthor.badge_type = getContributorStatus(fetchedAuthor, fetchedAuthor.affiliations);
    }
    return fetchedAuthor;
  };

  const searchForContributors = useCallback((firstName: string, surname: string) => {
    async function retrySearch() {
      setIsSearching(true);
      setSearchError(undefined);
      try {
        const authorResults = await searchPersonDetailByName(`${firstName} ${surname}`);
        const count = authorResults.headers['x-total-count'];
        setSearchResultLength(count ? +count : authorResults.data.length);
        if (authorResults.data.length > 0) {
          const promiseContributorArray = [];
          for (let i = 0; i < authorResults.data.length; i++) {
            promiseContributorArray.push(getContributorDetailsAndAffiliation(authorResults.data[i]));
          }
          const newSearchResult = await Promise.all(promiseContributorArray);
          setSearchResults(newSearchResult);
        } else {
          setSearchResults([]);
        }
      } catch (error: any) {
        handlePotentialExpiredSession(error);
        setSearchError(error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }
    if (firstName.length > 0 || surname.length > 0) {
      retrySearch().then();
    }
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

  const openSearchPanelAndSearchContributors = () => {
    setOpenContributorSearchPanel(true);
    searchForContributors(contributorData.toBeCreated.first_name, contributorData.toBeCreated.surname);
  };

  const formValidationSchema = Yup.object().shape({
    firstName: Yup.string().trim().required('Fornavn er et obligatorisk felt').max(30, 'Fornavn kan maks være 30 tegn'),
    surName: Yup.string()
      .trim()
      .required('Etternavn er et obligatorisk felt')
      .max(30, 'Etternavn kan maks være 30 tegn'),
  });

  return (
    <StyledCard variant="outlined">
      {!openContributorSearchPanel && (
        <StyledAccordionLikeButton
          data-testid={`expand-contributor-accordion-button-${resultListIndex}`}
          size="large"
          onClick={() => {
            setShowFullResultList(false);
            openSearchPanelAndSearchContributors();
          }}
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
        <Formik
          initialValues={{
            firstName: contributorData.toBeCreated.first_name,
            surName: contributorData.toBeCreated.surname,
          }}
          validationSchema={formValidationSchema}
          validateOnMount
          initialTouched={{
            firstName: true,
            surName: true,
          }}
          onSubmit={() => {
            // onsubmit is not optional. because we have formik inside formik button type=submit can not be used
          }}>
          {({ isValid, values }) => (
            <Grid container spacing={2} alignItems="flex-start">
              <Grid item xs={12} lg={5} xl={5}>
                <Field name="firstName">
                  {({ field, meta: { error, touched } }: FieldProps) => (
                    <TextField
                      id={'firstName' + resultListIndex}
                      label="Fornavn"
                      fullWidth
                      margin="none"
                      inputProps={{ 'data-testid': `contributor-${resultListIndex}-firstname-text-field-input` }}
                      {...field}
                      error={!!error && touched}
                      helperText={<ErrorMessage name={field.name} />}
                    />
                  )}
                </Field>
              </Grid>
              <Grid xs={12} item lg={4} xl={5}>
                <Field name="surName">
                  {({ field, meta: { error, touched } }: FieldProps) => (
                    <TextField
                      id={'surname' + resultListIndex}
                      label="Etternavn"
                      fullWidth
                      margin="none"
                      inputProps={{ 'data-testid': `contributor-${resultListIndex}-surname-text-field-input` }}
                      {...field}
                      error={!!error && touched}
                      helperText={<ErrorMessage name={field.name} />}
                    />
                  )}
                </Field>
              </Grid>

              <Grid item>
                <StyledChoosePersonButtonWrapper>
                  <StyledChoosePersonButton
                    data-testid={`choose-text-field-person-${resultListIndex}`}
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      isValid && handleChoosePerson(values.firstName.trim(), values.surName.trim());
                    }}
                    color="primary">
                    Velg person
                  </StyledChoosePersonButton>

                  {!isValid && (
                    <CommonErrorMessage
                      datatestid={`contributor-${resultListIndex}-form-error`}
                      errorMessage="Det er feil i skjema"
                    />
                  )}
                </StyledChoosePersonButtonWrapper>
              </Grid>

              <Grid item>
                <Button
                  startIcon={<SearchIcon />}
                  variant="outlined"
                  color="primary"
                  data-testid={`contributor-retry-search-button-${resultListIndex}`}
                  onClick={() => {
                    if (isValid) {
                      searchForContributors(values.firstName.trim(), values.surName.trim());
                      setShowFullResultList(false);
                    }
                  }}>
                  Søk etter person
                </Button>
              </Grid>
              {!isSearching && searchError && (
                <Grid item xs={12}>
                  <Typography color="error">{searchError.message ?? 'Noe gikk galt med søket, prøv igjen'} </Typography>
                </Grid>
              )}
              {isSearching && (
                <Grid item xs={12}>
                  <StyledCircularProgress size={'2rem'} />
                </Grid>
              )}

              {openContributorSearchPanel && !isSearching && (
                <Grid item xs={12}>
                  <StyledResultTypography variant="h6">
                    {generateSearchResultHeader(searchResultLength, searchResults.length, showFullResultList)}
                  </StyledResultTypography>
                </Grid>
              )}
            </Grid>
          )}
        </Formik>
      </StyledCollapse>

      <StyledCollapse
        timeout={customTimeout}
        in={openContributorSearchPanel && !isSearching && searchResults.length > 0}>
        {searchResults.slice(0, !showFullResultList ? 5 : searchResults.length).map((author: ContributorType) => (
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
        {!showFullResultList && searchResults.length > 5 && (
          <StyledShowMoreButton
            data-testid={`search-panel-show-more-button-${resultListIndex}`}
            color="primary"
            variant="outlined"
            onClick={() => setShowFullResultList(true)}>
            Vis flere treff...
          </StyledShowMoreButton>
        )}
      </StyledCollapse>
    </StyledCard>
  );
};

export default ContributorSearchPanel;
