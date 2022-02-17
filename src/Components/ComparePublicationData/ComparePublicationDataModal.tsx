import React, { FC, useContext, useEffect, useLayoutEffect, useState } from 'react';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { Button, CircularProgress, Grid, Typography } from '@material-ui/core';
import ConfirmImportDialog from '../Dialogs/ConfirmImportDialog';
import GenericConfirmDialog from '../Dialogs/GenericConfirmDialog';
import { Context } from '../../Context';
import ContributorModal from '../Contributors/ContributorModal';
import styled from 'styled-components';
import { useSnackbar } from 'notistack';
import clone from 'just-clone';
import {
  CristinPublication,
  ImportPublication,
  InternationalStandardNumber,
  InternationalStandardNumberTypes,
  Journal,
  Language,
} from '../../types/PublicationTypes';
import { getPersonDetailById } from '../../api/contributorApi';
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
import CompareFormLanguage from './CompareFormLanguage';
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
import { formValidationSchema } from './CompareFormValidationSchema';

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

const generateLanguageObjectFromCristinPublication = (publ: CristinPublication) => {
  return {
    title: publ.title ? publ.title[publ.original_language] : '',
    lang: publ.original_language?.toUpperCase(),
    original: true,
  };
};

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
  const [isConfirmAbortDialogOpen, setIsConfirmAbortDialogOpen] = useState(false);
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

  //publication-form-stuff
  const [initialFormValues, setInitialFormValues] = useState<CompareFormValuesType | undefined>();
  const [formValues, setFormValues] = useState<CompareFormValuesType | undefined>();
  const sortedLanguagesFromImportPublication = clone(importPublication)
    .languages.sort((a: any, b: any) => a.original - b.original)
    .reverse();
  const [publicationLanguages, setPublicationLanguages] = useState(
    cristinPublication
      ? [generateLanguageObjectFromCristinPublication(cristinPublication)]
      : sortedLanguagesFromImportPublication
  ); //TODO: putt hele publicationLanguages i formik
  const [selectedLang, setSelectedLang] = useState<Language>(
    cristinPublication
      ? {
          title: cristinPublication.title ? cristinPublication.title[cristinPublication.original_language] : '',
          lang: cristinPublication.original_language?.toUpperCase(),
          original: true,
        }
      : importPublication.languages?.find((lang: Language) => lang.original) ?? importPublication.languages[0]
  );
  const kildeId = cristinPublication
    ? (cristinPublication.import_sources && cristinPublication.import_sources[0]?.source_reference_id) ??
      'Ingen kildeId funnet'
    : importPublication.externalId;
  const kilde = cristinPublication
    ? (cristinPublication.import_sources && cristinPublication.import_sources[0]?.source_name) ?? 'Ingen kilde funnet'
    : importPublication.sourceName;

  const updatePublicationLanguages = (title: string, lang: string) => {
    const index = publicationLanguages.map((lang: any) => lang.lang).indexOf(lang);
    if (publicationLanguages[index]) {
      publicationLanguages[index].title = title;
    }
    setPublicationLanguages(publicationLanguages);
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
              title: selectedLang.title ?? '',
              year: cristinPublication.year_published,
              doi: extractDoiFromCristinPublication(cristinPublication),
              language: selectedLang,
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
              title: selectedLang.title ?? '',
              year: importPublication.yearPublished,
              doi: importPublication.doi,
              language: selectedLang,
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
        const identified: boolean[] = [];
        const authorsFromImportPublication = importPublication.authors;

        let cristinAuthors: ContributorType[];
        if (cristinPublication) {
          cristinAuthors = cristinPublication.authors;
        } else {
          cristinAuthors = await searchCristinPersons(authorsFromImportPublication);
        }
        for (let i = 0; i < Math.max(cristinAuthors.length, authorsFromImportPublication.length); i++) {
          if (cristinAuthors[i]) {
            if (cristinPublication && state.doSave) {
              if (i < cristinAuthors.length) {
                cristinAuthors[i].affiliations = await getDuplicateAffiliations(cristinPublication.authors[i]);
              } else {
                cristinAuthors[i] = { ...emptyContributor };
              }
            }
            identified[i] = cristinAuthors[i].identified_cristin_person ?? false;
            tempContributors[i] = createContributorWrapper(authorsFromImportPublication, i, cristinAuthors);
            tempContributors[i].toBeCreated = await generateToBeCreatedContributor(
              tempContributors[i],
              cristinAuthors[i],
              authorsFromImportPublication[i],
              !!cristinPublication
            );
          }
        }
        dispatch({ type: 'setContributorsLoaded', payload: true });
        dispatch({ type: 'identified', payload: identified }); //skjer dette to steder ?
        dispatch({ type: 'identifiedImported', payload: identified });
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

  useEffect(() => {
    async function identifyCristinPersonsInContributors_And_CreateListOfIdentified() {
      try {
        if (!isLoadingContributors) {
          return;
        }
        const identified: boolean[] = [];
        const identifiedImported: boolean[] = [];
        for (let i = 0; i < contributors.length; i++) {
          if (
            !contributors[i].imported.identified_cristin_person &&
            contributors[i].imported.cristin_person_id !== null &&
            contributors[i].imported.cristin_person_id !== 0 &&
            i < contributors.length
          ) {
            const person = await getPersonDetailById(contributors[i].imported);
            identifiedImported[i] = person.identified_cristin_person ?? false;
          }
        }
        dispatch({ type: 'identifiedImported', payload: identifiedImported });
        dispatch({ type: 'identified', payload: identified });
        //TODO: kan ikke dette ligge direkte på contributor-objektet isteden ?
      } catch (error) {
        setLoadingContributorsError(error as Error);
      } finally {
        setIsLoadingContributors(false);
      }
    }
    if (!cristinPublication) return;
    identifyCristinPersonsInContributors_And_CreateListOfIdentified().then();
  }, [contributors]);

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
      // dispatch({ type: 'setContributorsLoaded', payload: false });
    }
  }

  function handleConfirmAbortDialogSubmit() {
    dispatch({ type: 'doSave', payload: false });
    setIsConfirmAbortDialogOpen(false);
    handleComparePublicationDataModalClose();
    handleDuplicateCheckModalClose();
    dispatch({ type: 'setContributorsLoaded', payload: false });
  }

  function emptyGlobalFormErrors() {
    dispatch({ type: 'setFormErrors', payload: [] });
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
    if (state.contributors === null) {
      dispatch({ type: 'contributors', payload: contributors }); //?
    }
    setIsConfirmImportDialogOpen(true);
  };

  function handleImportPublicationConfirmed(annotation: string) {
    if (formValues) {
      if (!cristinPublication) {
        handleCreatePublication(
          formValues,
          importPublication,
          contributors,
          publicationLanguages,
          annotation,
          dispatch
        ).then((response) => handlePublicationImported(response));
      } else {
        handleUpdatePublication(
          formValues,
          importPublication,
          cristinPublication.cristin_result_id,
          publicationLanguages,
          annotation,
          dispatch
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
            validationSchema={formValidationSchema}>
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
                    <CompareFormLanguage
                      languages={publicationLanguages}
                      selectedLang={selectedLang}
                      setSelectedLang={setSelectedLang}
                    />
                    <CompareFormTitle
                      importPublication={importPublication}
                      updatePublicationLanguages={updatePublicationLanguages}
                      selectedLang={selectedLang}
                    />
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
                          disabled={
                            !isValid ||
                            (!cristinPublication &&
                              (contributorErrors.length >= 1 ||
                                !state.contributorsLoaded ||
                                !!loadingContributorsError))
                          }
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
      <GenericConfirmDialog
        doFunction={emptyGlobalFormErrors}
        title={'Avbryt import'}
        text={
          'Er du sikker på at du vil lukke denne publikasjonen? Endringer vil bli lagret fram til man åpner en ny publikasjon'
        }
        open={isConfirmAbortDialogOpen}
        handleClose={handleConfirmAbortDialogSubmit}
        handleAbort={() => setIsConfirmAbortDialogOpen(false)}
      />
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
