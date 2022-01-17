import React, { FC, useContext, useEffect, useState } from 'react';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { Button, Grid, Typography } from '@material-ui/core';
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
import { getContributorsByPublicationCristinResultId, SearchLanguage } from '../../api/contributorApi';
import CommonErrorMessage from '../CommonErrorMessage';
import { handlePotentialExpiredSession } from '../../api/api';
import { ChannelQueryMethod, getJournalsByQuery } from '../../api/publicationApi';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import {
  StyledActionButtonsPlaceHolder,
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
import { ContributorType } from '../../types/ContributorTypes';
import { DoiFormat, formatCristinCreatedDate, NoDatePlaceHolder } from '../../utils/stringUtils';
import {
  createCristinPublicationForSaving,
  handleCreatePublication,
  handleUpdatePublication,
} from './ImportPublicationHelper';
import { CRISTIN_REACT_APP_URL } from '../../utils/constants';
import CancelIcon from '@material-ui/icons/Cancel';
import LaunchIcon from '@material-ui/icons/Launch';
import { Alert } from '@material-ui/lab';
import { findLegalCategory } from '../../utils/categoryUtils';

const StyledModal = styled(Modal)`
  width: 96%;
  min-width: 50rem;
  max-width: 80rem;
  min-height: 100%;
  margin: 1rem auto;
  padding: 0;
`;

const StyledDisabledTypography = styled(Typography)`
  color: #555555;
`;

const StyledSnackBarButton: any = styled(Button)`
  && .MuiButton-label {
    color: white;
  }
`;

const StyledAlert = styled(Alert)`
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
`;

const generateLanguageObjectFromCristinPublication = (publ: CristinPublication) => {
  return {
    title: publ.title[publ.original_language],
    lang: publ.original_language?.toUpperCase(),
    original: true,
  };
};

interface ComparePublicationDataModalProps {
  isComparePublicationDataModalOpen: boolean;
  handleComparePublicationDataModalClose: () => void;
  importPublication: ImportPublication;
  cristinPublication: CristinPublication; //TODO: Rydd i dette tullet
  handleDuplicateCheckModalClose: () => void;
  isDuplicate: boolean;
}

const ComparePublicationDataModal: FC<ComparePublicationDataModalProps> = ({
  isComparePublicationDataModalOpen,
  handleComparePublicationDataModalClose,
  importPublication,
  cristinPublication,
  handleDuplicateCheckModalClose,
  isDuplicate,
}) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { state, dispatch } = useContext(Context);
  const [isConfirmImportDialogOpen, setIsConfirmImportDialogOpen] = useState(false);
  const [isConfirmAbortDialogOpen, setIsConfirmAbortDialogOpen] = useState(false);
  const [importPublicationError, setImportPublicationError] = useState<Error | undefined>();
  const [loadJournalIdError, setLoadJournalIdError] = useState<Error | undefined>();

  //contributors-stuff
  const [isContributorsLoading, setIsContributorsLoading] = useState(false);
  const [contributorErrors, setContributorErrors] = useState<string[]>([]);
  const [isContributorModalOpen, setIsContributorModalOpen] = useState(false);
  const [contributors] = useState(isDuplicate ? state.selectedPublication.authors : importPublication?.authors || []);
  const [loadContributorsError, setLoadContributorsError] = useState<Error | undefined>();
  const [isLoadingContributors, setIsLoadingContributors] = useState(false);

  //publication-form-stuff
  const [initialFormValues, setInitialFormValues] = useState<CompareFormValuesType | undefined>();
  const [formValuesToSave, setFormValuesToSave] = useState<CompareFormValuesType | undefined>();
  const sortedLanguagesFromImportPublication = clone(importPublication)
    .languages.sort((a: any, b: any) => a.original - b.original)
    .reverse();
  const [publicationLanguages, setPublicationLanguages] = useState(
    isDuplicate
      ? [generateLanguageObjectFromCristinPublication(state.selectedPublication)]
      : sortedLanguagesFromImportPublication
  ); //TODO: putt hele publicationLanguages i formik
  const [selectedLang, setSelectedLang] = useState<Language>(
    isDuplicate
      ? {
          title: state.selectedPublication.title[state.selectedPublication.original_language],
          lang: state.selectedPublication.original_language?.toUpperCase(),
          original: true,
        }
      : importPublication.languages?.find((lang: Language) => lang.original) ?? importPublication.languages[0]
  );
  const kildeId = isDuplicate
    ? (state.selectedPublication.import_sources && state.selectedPublication.import_sources[0]?.source_reference_id) ||
      'Ingen kildeId funnet'
    : importPublication.externalId;
  const kilde = isDuplicate
    ? (state.selectedPublication.import_sources && state.selectedPublication.import_sources[0]?.source_name) ||
      'Ingen kilde funnet'
    : importPublication.sourceName;

  const updatePublicationLanguages = (title: string, lang: string) => {
    const index = publicationLanguages.map((lang: any) => lang.lang).indexOf(lang);
    if (publicationLanguages[index]) {
      publicationLanguages[index].title = title;
    }
    setPublicationLanguages(publicationLanguages);
  };

  useEffect(() => {
    async function getContributors() {
      try {
        setLoadContributorsError(undefined);
        setIsLoadingContributors(true);
        if (isDuplicate && !isContributorsLoading) {
          fetchAllAuthors(state.selectedPublication.cristin_result_id).then();
          setIsContributorsLoading(true);
        }
      } catch (error) {
        handlePotentialExpiredSession(error);
        setLoadContributorsError(error as Error);
      } finally {
        setIsLoadingContributors(false);
      }
    }

    //init ligger i en useeffect pga asynkront kall til getJournalId
    const initFormik = async () => {
      //Formik is initiated from either importPublication or state.selectedPublication (set in duplicate-modal)

      //TODO: det trengs en sjekk på om state.selectedPublication.links inneholder en doi - nå settes den uansett
      setInitialFormValues(
        isDuplicate && state.selectedPublication
          ? {
              title: selectedLang.title ?? '',
              year: state.selectedPublication.year_published,
              doi:
                state.selectedPublication.links &&
                state.selectedPublication.links[state.selectedPublication.links.length - 1]?.url?.substring(
                  16,
                  state.selectedPublication.links[0]?.url?.length + 1
                ),
              language: selectedLang,
              journal: {
                cristinTidsskriftNr: (await getJournalId(state.selectedPublication.journal)) || '',
                title: state.selectedPublication.journal?.name || 'Ingen tidsskrift funnet',
              },
              category: {
                value: state.selectedPublication.category?.code,
                label: state.selectedPublication.category?.name?.nb,
              },
              volume: state.selectedPublication.volume ?? '',
              issue: state.selectedPublication.issue ?? '',
              pageFrom: state.selectedPublication.pages?.from ?? '',
              pageTo: state.selectedPublication.pages?.to ?? '',
            }
          : {
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
    //TODO! NB! this should be removed as soon as contributors does not use localstorage anymore
    window.localStorage.removeItem('tempContributors');
    initFormik().then();
    getContributors().then();
  }, [isDuplicate, state.selectedPublication, importPublication]);

  async function fetchAllAuthors(resultId: string) {
    if (state.doSave) {
      //TODO: dosave-check her også ?
      let page = 1;
      let allAuthors: ContributorType[] = [];
      while (allAuthors.length < state.selectedPublication.authorTotalCount) {
        const contributorResponse = await getContributorsByPublicationCristinResultId(
          resultId,
          page,
          500,
          SearchLanguage.Nb // Gir det mening med språk her ?
        );
        allAuthors = [...allAuthors, ...contributorResponse.data];
        page++;
      }
      const tempPub = { ...state.selectedPublication, authors: allAuthors };
      dispatch({ type: 'setSelectedPublication', payload: tempPub });
    }
  }

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
      //TODO! NB! this should be removed as soon as contributors does not use localstorage anymore
      window.localStorage.removeItem('tempContributors');
      dispatch({ type: 'triggerImportDataSearch', payload: !state.triggerImportDataSearch });
    } else {
      const errorMessage = `Noe gikk galt med import av publikasjon med pub-id: ${importPublication.pubId}.
       Dine endringer er fortsatt lagret i browseren. ${result.errorMessage ?? ''}`;
      setImportPublicationError(new Error(errorMessage));
      // dispatch({ type: 'setContributorsLoaded', payload: false });
    }
  }

  function handleConfirmAbortDialogSubmit() {
    //TODO! NB! this should be removed as soon as contributors does not use localstorage anymore
    window.localStorage.removeItem('tempContributors');

    dispatch({ type: 'doSave', payload: false });
    setIsConfirmAbortDialogOpen(false);
    handleComparePublicationDataModalClose();
    handleDuplicateCheckModalClose();
    dispatch({ type: 'setContributorsLoaded', payload: false });
  }

  function emptyGlobalFormErrors() {
    dispatch({ type: 'setFormErrors', payload: [] });
  }

  async function getJournalId(journal: Journal) {
    const issnObj = journal.international_standard_numbers?.find(
      (standard_number: InternationalStandardNumber) =>
        standard_number.type === InternationalStandardNumberTypes.PRINTED
    );
    if (issnObj?.value && issnObj.value !== '0') {
      try {
        setLoadJournalIdError(undefined);
        const journalResponse = await getJournalsByQuery(issnObj.value, ChannelQueryMethod.issn);
        return journalResponse.data.length > 0 && journalResponse.data[0].id;
      } catch (error) {
        handlePotentialExpiredSession(error);
        setLoadJournalIdError(error as Error);
      }
    }
  }

  const handleImportButtonClick = (values: CompareFormValuesType) => {
    setFormValuesToSave(values);
    if (state.contributors === null) {
      dispatch({ type: 'contributors', payload: contributors }); //?
    }
    setIsConfirmImportDialogOpen(true);
  };

  function handleImportPublicationConfirmed(annotation: string) {
    if (formValuesToSave) {
      const publication = createCristinPublicationForSaving(
        formValuesToSave,
        importPublication,
        publicationLanguages,
        annotation,
        isDuplicate && state.selectedPublication.cristin_result_id
      );
      isDuplicate
        ? handleUpdatePublication(publication, dispatch).then((response) => handlePublicationImported(response))
        : handleCreatePublication(publication, dispatch).then((response) => handlePublicationImported(response));
    }
  }

  const formValidationSchema = Yup.object().shape({
    title: Yup.string().required('Tittel er et obligatorisk felt'),
    category: Yup.object().shape({
      value: Yup.string().required(),
    }),
    year: Yup.number()
      .typeError('Årstall må være et nummer')
      .required('Årstall er et obligatorisk felt')
      .integer('Årstall må være heltall')
      .moreThan(999, 'Årstall må være større enn 999')
      .lessThan(new Date().getFullYear() + 1, 'Årstall kan ikke være et framtidig år'), //todo: nødvendige sjekker ?
    doi: Yup.string().matches(DoiFormat, 'Doi har galt format'),
    journal: Yup.object().shape({
      cristinTidsskriftNr: Yup.string().required('Tidsskrift er et obligatorisk felt'),
      title: Yup.string().required('Tittel er et obligatorisk felt'),
    }),
  });

  return (
    <>
      {loadContributorsError ? (
        <Typography color="error">Noe gikk galt. {loadContributorsError.message}</Typography>
      ) : (
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
                              {isDuplicate ? cristinPublication.cristin_result_id : 'Ingen Cristin-Id'}
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
                              {isDuplicate && cristinPublication
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
                        />
                        <CompareFormDoi importPublication={importPublication} />
                        <CompareFormYear importPublication={importPublication} />
                        <CompareFormCategory importPublication={importPublication} />
                        <CompareFormVolume importPublication={importPublication} />
                        <CompareFormIssue importPublication={importPublication} />
                        <CompareFormPages importPublication={importPublication} />
                      </StyledFormWrapper>
                      <StyledOpenContributorsButtonWrapper>
                        <Button
                          size="large"
                          data-testid="open-contributors-modal-button"
                          onClick={() => setIsContributorModalOpen(true)}
                          variant="contained"
                          color="primary">
                          Vis bidragsytere
                        </Button>
                      </StyledOpenContributorsButtonWrapper>
                      <StyledErrorMessageWrapper>
                        {contributorErrors.length >= 1 && (
                          <StyledAlert data-testid={`contributor-error`} severity="error">
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
                          {contributorErrors.length >= 1 && <div> Feil i bidragsyterlisten. </div>}
                          {isLoadingContributors && <div> Henter bidragsytere. </div>}
                        </Grid>
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
                                !!importPublication?.cristin_id ||
                                contributorErrors.length >= 1 ||
                                !state.contributorsLoaded
                              }
                              color="primary"
                              type="submit"
                              variant="contained"
                              data-testid="import-publication-button">
                              Importer
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
              handleContributorModalClose={() => setIsContributorModalOpen(false)}
              importPublication={importPublication}
              isDuplicate={isDuplicate}
              setContributorErrors={setContributorErrors}
            />
          )}
        </>
      )}
    </>
  );
};

export default ComparePublicationDataModal;
