import React, { FC, useContext, useEffect, useLayoutEffect, useState } from 'react';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { Button, CircularProgress, Grid, Typography } from '@material-ui/core';
import ConfirmImportDialog from '../Dialogs/ConfirmImportDialog';
import { Context } from '../../Context';
import ContributorModal from '../Contributors/ContributorModal';
import styled from 'styled-components';
import { useSnackbar } from 'notistack';
import {
  CristinPublication,
  ImportPublication,
  InternationalStandardNumber,
  InternationalStandardNumberTypes,
  Journal,
  Language,
} from '../../types/PublicationTypes';
import CommonErrorMessage from '../CommonErrorMessage';
import { handlePotentialExpiredSession } from '../../api/api';
import { ChannelQueryMethod, getJournalsByQuery } from '../../api/publicationApi';
import { Form, Formik } from 'formik';
import {
  StyledActionButtonsPlaceHolder,
  StyledCenterContentWrapper,
  StyledCristinLink,
  StyledDisabledTypography,
  StyledErrorMessageWrapper,
  StyledFormWrapper,
  StyledHeaderLineWrapper,
  StyledLineCristinValue,
  StyledLineHeader,
  StyledLineImportValue,
  StyledLineLabelTypography,
  StyledLineWrapper,
  StyledOpenContributorsButtonWrapper,
} from './CompareFormWrappers';
import CompareFormTitle from './CompareFormTitle';
import CompareFormYear from './CompareFormYear';
import CompareFormDoi from './CompareFormDoi';
import CompareFormCategory from './CompareFormCategory';
import CompareFormVolume from './CompareFormVolume';
import CompareFormIssue from './CompareFormIssue';
import CompareFormPages from './CompareFormPages';
import CompareFormJournal from './CompareFormJournal';
import { CompareFormValuesType } from './CompareFormTypes';
import { ContributorType, ContributorWrapper, emptyContributor } from '../../types/ContributorTypes';
import { formatCristinCreatedDate, NoDatePlaceHolder } from '../../utils/stringUtils';
import { handleCreatePublication, handleUpdatePublication } from './ImportPublicationHelper';
import { CRISTIN_REACT_APP_URL } from '../../utils/constants';
import CancelIcon from '@material-ui/icons/Cancel';
import LaunchIcon from '@material-ui/icons/Launch';
import { Alert } from '@material-ui/lab';
import { findLegalCategory } from '../../utils/categoryUtils';
import { validateContributors } from '../Contributors/ContributorValidate';
import {
  createContributorWrapper,
  generateToBeCreatedContributor,
  searchCristinPersons,
} from '../Contributors/ContributorHelper';
import { getDuplicateAffiliations } from '../Contributors/InstututionHelper';
import { extractDoiFromCristinPublication } from '../DuplicateCheck/ResultItem';
import { generateFormValidationSchema } from './CompareFormValidationSchema';

const StyledModal = styled(Modal)`
  width: 96%;
  min-width: 50rem;
  max-width: 80rem;
  min-height: 100%;
  margin: 1rem auto;
  padding: 0;
`;

const StyledSnackBarButton: any = styled(Button)`
  && .MuiButton-label {
    color: white;
  }
`;

const CircularProgressWrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const StyledAlert = styled(Alert)`
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
`;

export interface CombinedTitleType {
  titleToBeImported: string;
  titleFromImportPublication: string;
}

interface ComparePublicationDataModalProps {
  isComparePublicationDataModalOpen: boolean;
  handleComparePublicationDataModalClose: () => void;
  importPublication: ImportPublication;
  cristinPublication?: CristinPublication;
  handleDuplicateCheckModalClose: () => void;
}

const ComparePublicationDataModal: FC<ComparePublicationDataModalProps> = ({
  isComparePublicationDataModalOpen,
  handleComparePublicationDataModalClose,
  importPublication,
  cristinPublication,
  handleDuplicateCheckModalClose,
}) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { state, dispatch } = useContext(Context);
  const [isConfirmImportDialogOpen, setIsConfirmImportDialogOpen] = useState(false);
  const [importPublicationError, setImportPublicationError] = useState<Error | undefined>();
  const [loadJournalIdError, setLoadJournalIdError] = useState<Error | undefined>();

  //contributors-stuff
  const [contributorErrors, setContributorErrors] = useState<string[]>([]);
  const [isContributorModalOpen, setIsContributorModalOpen] = useState(false);
  const [contributors, setContributors] = useState<ContributorWrapper[]>(
    cristinPublication ? cristinPublication.authors : importPublication?.authors ?? []
  );
  const [isLoadingContributors, setIsLoadingContributors] = useState(false);
  const [loadingContributorsError, setLoadingContributorsError] = useState<Error | undefined>();

  const kildeId = cristinPublication
    ? (cristinPublication.import_sources && cristinPublication.import_sources[0]?.source_reference_id) ??
      'Ingen kildeId funnet'
    : importPublication.externalId;

  const kilde = cristinPublication
    ? (cristinPublication.import_sources && cristinPublication.import_sources[0]?.source_name) ?? 'Ingen kilde funnet'
    : importPublication.sourceName;

  //publication-form-stuff
  const [initialFormValues, setInitialFormValues] = useState<CompareFormValuesType | undefined>();
  const [formValues, setFormValues] = useState<CompareFormValuesType | undefined>();

  //title-stuff
  const titlesFromImportPublicationMap = new Map<string, string>();
  const titlesToBeImportedMap = new Map<string, string>();
  importPublication.languages.forEach((language) => {
    titlesToBeImportedMap.set(language.lang.toUpperCase(), language.title);
    titlesFromImportPublicationMap.set(language.lang.toUpperCase(), language.title);
  });

  if (cristinPublication) {
    for (const langCode in cristinPublication.title) {
      titlesToBeImportedMap.set(langCode.toUpperCase(), cristinPublication.title[langCode]);
      const existingTitle = titlesFromImportPublicationMap.get(langCode);
      titlesFromImportPublicationMap.set(
        langCode.toUpperCase(),
        existingTitle ? cristinPublication.title[langCode] : ''
      );
    }
  }

  const originalLanguageStringFromimportPublication: string =
    importPublication.languages.find((lang: Language) => lang.original)?.lang ?? importPublication.languages[0].lang;

  const generateTitlesToBeImported = () => {
    const langCodes = [...titlesToBeImportedMap.keys()];
    return [...titlesToBeImportedMap.values()].map((value, index) => {
      return {
        title: value,
        langCode: langCodes[index],
      };
    });
  };

  useEffect(() => {
    //init ligger i en useeffect pga asynkront kall til getJournalId
    const initFormik = async () => {
      //Formik is initiated from either importPublication orcristinPublication (set in duplicate-modal)

      //TODO: det trengs en sjekk på om cristinPublication.links inneholder en doi - nå settes den uansett
      setInitialFormValues(
        cristinPublication
          ? {
              isInitiatedFromCristinPublication: true,
              originalLanguage: cristinPublication.original_language.toUpperCase() ?? '',
              titles: generateTitlesToBeImported(),
              year: cristinPublication.year_published,
              doi: extractDoiFromCristinPublication(cristinPublication),
              journal: {
                cristinTidsskriftNr: await getJournalId(cristinPublication.journal),
                title: cristinPublication.journal?.name ?? 'Ingen tidsskrift funnet',
              },
              category: {
                value: cristinPublication.category?.code,
                label: cristinPublication.category?.name?.nb,
              },
              volume: cristinPublication.volume ?? '',
              issue: cristinPublication.issue ?? '',
              pageFrom: cristinPublication.pages?.from ?? '',
              pageTo: cristinPublication.pages?.to ?? '',
            }
          : {
              isInitiatedFromCristinPublication: false,
              originalLanguage: originalLanguageStringFromimportPublication.toUpperCase(),
              titles: generateTitlesToBeImported(),
              year: importPublication.yearPublished,
              doi: importPublication.doi,
              journal: {
                cristinTidsskriftNr: importPublication?.channel?.cristinTidsskriftNr?.toString() ?? '',
                title: importPublication?.channel?.title ?? 'Ingen tidsskrift funnet',
              },
              category: findLegalCategory(importPublication),
              volume: importPublication.channel?.volume ?? '',
              issue: importPublication.channel?.issue ?? '',
              pageFrom: importPublication.channel?.pageFrom ?? '',
              pageTo: importPublication.channel?.pageTo ?? '',
            }
      );
    };
    initFormik().then();
  }, [cristinPublication, importPublication]);

  useLayoutEffect(() => {
    async function enrichImportPublicationAuthors() {
      const tempContributors: ContributorWrapper[] = [];
      try {
        setIsLoadingContributors(true);
        setLoadingContributorsError(undefined);
        const authorsFromImportPublication = importPublication.authors;

        let cristinAuthors: ContributorType[];
        if (cristinPublication) {
          cristinAuthors = cristinPublication.authors;
        } else {
          cristinAuthors = await searchCristinPersons(authorsFromImportPublication);
        }
        for (let i = 0; i < Math.max(cristinAuthors.length, authorsFromImportPublication.length); i++) {
          if (cristinAuthors[i]) {
            if (cristinPublication) {
              if (i < cristinAuthors.length) {
                cristinAuthors[i].affiliations = await getDuplicateAffiliations(cristinPublication.authors[i]);
              } else {
                cristinAuthors[i] = { ...emptyContributor };
              }
            }
            tempContributors[i] = createContributorWrapper(authorsFromImportPublication, i, cristinAuthors);
            tempContributors[i].toBeCreated = await generateToBeCreatedContributor(
              tempContributors[i],
              cristinAuthors[i],
              authorsFromImportPublication[i],
              !!cristinPublication
            );
          }
        }
        validateContributors(tempContributors, setContributorErrors);
      } catch (error) {
        setLoadingContributorsError(error as Error);
      } finally {
        setIsLoadingContributors(false);
      }
      setContributors(tempContributors);
    }
    !cristinPublication && enrichImportPublicationAuthors().then();
  }, [importPublication, cristinPublication]);

  const successSnackBarActions = (key: any, resultId: string) => (
    <>
      <StyledSnackBarButton
        startIcon={<LaunchIcon />}
        rel="noopener noreferrer"
        target="_blank"
        href={`${CRISTIN_REACT_APP_URL}/results/show.jsf?id=${resultId}`}>
        Vis publikasjon
      </StyledSnackBarButton>
      <StyledSnackBarButton
        startIcon={<CancelIcon />}
        onClick={() => {
          closeSnackbar(key);
        }}>
        Lukk
      </StyledSnackBarButton>
    </>
  );

  function handlePublicationImported(result: any) {
    setIsConfirmImportDialogOpen(false);

    if (result.status === 200) {
      enqueueSnackbar('Publikasjonen ble importert.', {
        variant: 'success',
        persist: true,
        action: (key: any) => successSnackBarActions(key, result.result.id),
      });
      handleComparePublicationDataModalClose();
      handleDuplicateCheckModalClose();
      dispatch({ type: 'triggerImportDataSearch', payload: !state.triggerImportDataSearch });
    } else {
      const errorMessage = `Noe gikk galt med import av publikasjon med pub-id: ${importPublication.pubId}.
       Dine endringer er fortsatt lagret i browseren. ${result.errorMessage ?? ''}`;
      setImportPublicationError(new Error(errorMessage));
    }
  }

  async function getJournalId(journal: Journal): Promise<string> {
    if (journal) {
      if (journal.cristin_journal_id) return journal.cristin_journal_id;
      const issnObj = journal.international_standard_numbers?.find(
        (standard_number: InternationalStandardNumber) =>
          standard_number.type === InternationalStandardNumberTypes.PRINTED
      );
      if (issnObj?.value && issnObj.value !== '0') {
        try {
          setLoadJournalIdError(undefined);
          const journalResponse = await getJournalsByQuery(issnObj.value, ChannelQueryMethod.issn);
          if (journalResponse.data.length > 0) return journalResponse.data[0].id;
        } catch (error) {
          handlePotentialExpiredSession(error);
          setLoadJournalIdError(error as Error);
        }
      }
    }
    return '';
  }

  const handleImportButtonClick = (values: CompareFormValuesType) => {
    setFormValues(values);
    setIsConfirmImportDialogOpen(true);
  };

  function handleImportPublicationConfirmed(annotation: string) {
    if (formValues) {
      if (!cristinPublication) {
        handleCreatePublication(formValues, importPublication, contributors, annotation).then((response) =>
          handlePublicationImported(response)
        );
      } else {
        handleUpdatePublication(
          formValues,
          importPublication,
          cristinPublication.cristin_result_id,

          annotation
        ).then((response) => handlePublicationImported(response));
      }
    }
  }

  return (
    <>
      <StyledModal isOpen={isComparePublicationDataModalOpen} size="lg" data-testid="compare-modal">
        {initialFormValues && (
          <Formik
            onSubmit={handleImportButtonClick}
            initialValues={initialFormValues}
            validateOnMount
            validationSchema={generateFormValidationSchema(initialFormValues.originalLanguage)}>
            {({ isValid, handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <ModalBody>
                  <StyledFormWrapper>
                    <StyledHeaderLineWrapper>
                      <StyledLineLabelTypography />
                      <StyledLineHeader variant="h4">Import-publikasjon</StyledLineHeader>
                      <StyledActionButtonsPlaceHolder />
                      <StyledLineHeader variant="h4">Cristin-publikasjon</StyledLineHeader>
                    </StyledHeaderLineWrapper>
                    <StyledLineWrapper>
                      <StyledLineLabelTypography>Publication id</StyledLineLabelTypography>
                      <StyledLineImportValue>
                        <StyledDisabledTypography data-testid="importdata-pubid">
                          {importPublication.pubId}
                        </StyledDisabledTypography>
                      </StyledLineImportValue>
                      <StyledActionButtonsPlaceHolder />
                      <StyledLineCristinValue>
                        <StyledDisabledTypography data-testid="cristindata-id">
                          {cristinPublication ? cristinPublication.cristin_result_id : 'Ingen Cristin-Id'}
                        </StyledDisabledTypography>
                      </StyledLineCristinValue>
                    </StyledLineWrapper>
                    <StyledLineWrapper>
                      <StyledLineLabelTypography>Dato registrert</StyledLineLabelTypography>
                      <StyledLineImportValue>
                        <StyledDisabledTypography data-testid="importdata-date-registered">
                          {importPublication.registered}
                        </StyledDisabledTypography>
                      </StyledLineImportValue>
                      <StyledActionButtonsPlaceHolder />
                      <StyledLineCristinValue data-testid="cristindata-created">
                        <StyledDisabledTypography>
                          {cristinPublication
                            ? formatCristinCreatedDate(cristinPublication.created.date)
                            : NoDatePlaceHolder}
                        </StyledDisabledTypography>
                      </StyledLineCristinValue>
                    </StyledLineWrapper>
                    <StyledLineWrapper>
                      <StyledLineLabelTypography>Kilde</StyledLineLabelTypography>
                      <StyledLineImportValue>
                        <Typography data-testid="importdata-source">
                          {importPublication.sourceName} ({importPublication.externalId})
                        </Typography>
                      </StyledLineImportValue>
                      <StyledActionButtonsPlaceHolder />
                      <StyledLineCristinValue>
                        <StyledDisabledTypography data-testid="cristindata-source">
                          {kilde} ({kildeId})
                        </StyledDisabledTypography>
                      </StyledLineCristinValue>
                    </StyledLineWrapper>
                    <StyledLineWrapper>
                      <StyledLineLabelTypography>Originalspråk</StyledLineLabelTypography>
                      <StyledLineImportValue>
                        <Typography data-testid="importdata-source">
                          {originalLanguageStringFromimportPublication}
                        </Typography>
                      </StyledLineImportValue>
                      <StyledActionButtonsPlaceHolder />
                      <StyledLineCristinValue>
                        <StyledDisabledTypography data-testid="cristindata-source">
                          {initialFormValues.originalLanguage}
                        </StyledDisabledTypography>
                      </StyledLineCristinValue>
                    </StyledLineWrapper>
                    <CompareFormTitle titlesFromImportPublicationMap={titlesFromImportPublicationMap} />
                    <CompareFormJournal
                      importPublication={importPublication}
                      loadJournalIdError={loadJournalIdError}
                      isCristinPublicationSelected={!!cristinPublication}
                    />
                    <CompareFormDoi importPublication={importPublication} />
                    <CompareFormYear
                      importPublication={importPublication}
                      isCristinPublicationSelected={!!cristinPublication}
                    />
                    <CompareFormCategory
                      importPublication={importPublication}
                      isCristinPublicationSelected={!!cristinPublication}
                    />
                    <CompareFormVolume importPublication={importPublication} />
                    <CompareFormIssue importPublication={importPublication} />
                    <CompareFormPages importPublication={importPublication} />
                  </StyledFormWrapper>
                  {cristinPublication ? (
                    <StyledCenterContentWrapper>
                      <StyledAlert severity="warning" data-testid="duplicate-warning-box">
                        NB! Posten eksisterer i Cristin.{' '}
                        <StyledCristinLink
                          data-testid={`duplicate-warning-publication-link`}
                          href={`${CRISTIN_REACT_APP_URL}/results/show.jsf?id=${cristinPublication.cristin_result_id}`}
                          target="_blank"
                          rel="noopener noreferrer">
                          Gå til posten i Cristin
                        </StyledCristinLink>{' '}
                        om du vil endre på årstall, bidragsytere, kategori eller tidskrift (NVI-felter).
                      </StyledAlert>
                    </StyledCenterContentWrapper>
                  ) : (
                    <StyledOpenContributorsButtonWrapper>
                      {isLoadingContributors ? (
                        <CircularProgressWrapper>
                          <CircularProgress size={'1rem'} />
                          <Typography style={{ margin: '1rem' }}>Laster inn forfattere</Typography>
                        </CircularProgressWrapper>
                      ) : loadingContributorsError ? (
                        <StyledOpenContributorsButtonWrapper>
                          <CommonErrorMessage
                            datatestid="contributor-loading-error"
                            errorMessage={`Feil ved lasting av bidragsytere: (${loadingContributorsError.message})`}
                          />
                        </StyledOpenContributorsButtonWrapper>
                      ) : (
                        <Button
                          size="large"
                          data-testid="open-contributors-modal-button"
                          onClick={() => setIsContributorModalOpen(true)}
                          variant="contained"
                          color="primary">
                          Vis bidragsytere
                        </Button>
                      )}
                    </StyledOpenContributorsButtonWrapper>
                  )}
                  <StyledErrorMessageWrapper>
                    {contributorErrors.length >= 1 && (
                      <StyledAlert data-testid={`contributor-errors`} severity="error">
                        Det er feil i bidragsyterlisten ved index:
                        {contributorErrors.map((error, index) => (
                          <li key={index}> {error} </li>
                        ))}
                      </StyledAlert>
                    )}
                    {importPublicationError && (
                      <Typography color="error" data-testid="import-publication-errors">
                        {importPublicationError.message}
                      </Typography>
                    )}
                  </StyledErrorMessageWrapper>
                </ModalBody>

                <ModalFooter>
                  <Grid container spacing={2} justifyContent="flex-end" alignItems="baseline">
                    <Grid item>
                      <Button
                        onClick={handleComparePublicationDataModalClose}
                        variant="outlined"
                        color="secondary"
                        data-testid="import-publication-cancel-button">
                        Avbryt
                      </Button>
                    </Grid>
                    <Grid item>
                      <div>
                        <Button
                          disabled={!isValid || contributorErrors.length >= 1 || !!loadingContributorsError}
                          color="primary"
                          type="submit"
                          variant="contained"
                          data-testid="import-publication-button">
                          {cristinPublication ? 'Oppdater Cristinpublikasjon' : 'Importer'}
                        </Button>
                      </div>
                      {!isValid && (
                        <CommonErrorMessage datatestid="compare-form-error" errorMessage="Det er feil i skjema" />
                      )}
                    </Grid>
                  </Grid>
                </ModalFooter>
              </Form>
            )}
          </Formik>
        )}
      </StyledModal>
      <ConfirmImportDialog
        handleImportPublicationConfirmed={handleImportPublicationConfirmed}
        isOpen={isConfirmImportDialogOpen}
        handleAbort={() => setIsConfirmImportDialogOpen(false)}
      />
      {importPublication && (
        <ContributorModal
          isContributorModalOpen={isContributorModalOpen}
          contributors={contributors}
          setContributorErrors={setContributorErrors}
          setContributors={setContributors}
          handleContributorModalClose={() => setIsContributorModalOpen(false)}
          importPublication={importPublication}
        />
      )}
    </>
  );
};

export default ComparePublicationDataModal;
