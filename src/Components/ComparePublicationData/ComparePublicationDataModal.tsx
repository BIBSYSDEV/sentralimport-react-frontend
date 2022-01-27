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
import { ContributorType, ContributorWrapper, emptyContributor } from '../../types/ContributorTypes';
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
import { validateContributors } from '../Contributors/ContributorValidate';
import {
  createContributorWrapper,
  generateToBeCreatedContributor,
  searchCristinPersons,
} from '../Contributors/ContributorHelper';
import { getDuplicateAffiliations } from '../Contributors/InstututionHelper';
import { extractDoiFromCristinPublication } from '../DuplicateCheck/ResultItem';

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
  const [contributorErrors, setContributorErrors] = useState<string[]>([]);
  const [isContributorModalOpen, setIsContributorModalOpen] = useState(false);
  const [contributors, setContributors] = useState<ContributorWrapper[]>(
    isDuplicate ? state.selectedPublication.authors : importPublication?.authors || []
  );
  const [isLoadingContributors, setIsLoadingContributors] = useState(false);
  const [loadingContributorsError, setLoadingContributorsError] = useState<Error | undefined>();

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
          title: state.selectedPublication.title
            ? state.selectedPublication.title[state.selectedPublication.original_language]
            : '',
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
    //init ligger i en useeffect pga asynkront kall til getJournalId
    const initFormik = async () => {
      //Formik is initiated from either importPublication or state.selectedPublication (set in duplicate-modal)

      //TODO: det trengs en sjekk på om state.selectedPublication.links inneholder en doi - nå settes den uansett
      setInitialFormValues(
        isDuplicate && state.selectedPublication
          ? {
              title: selectedLang.title ?? '',
              year: state.selectedPublication.year_published,
              doi: extractDoiFromCristinPublication(state.selectedPublication),
              language: selectedLang,
              journal: {
                cristinTidsskriftNr: await getJournalId(state.selectedPublication.journal),
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
    initFormik().then();
  }, [isDuplicate, state.selectedPublication, importPublication]);

  useLayoutEffect(() => {
    async function enrichImportPublicationAuthors() {
      const tempContributors: ContributorWrapper[] = [];
      try {
        setIsLoadingContributors(true);
        setLoadingContributorsError(undefined);
        const identified: boolean[] = [];
        const authorsFromImportPublication = importPublication.authors;

        let cristinAuthors: ContributorType[];
        if (isDuplicate) {
          cristinAuthors = state.selectedPublication.authors;
        } else {
          cristinAuthors = await searchCristinPersons(authorsFromImportPublication);
        }
        for (let i = 0; i < Math.max(cristinAuthors.length, authorsFromImportPublication.length); i++) {
          if (cristinAuthors[i]) {
            if (isDuplicate && state.doSave) {
              if (i < cristinAuthors.length) {
                cristinAuthors[i].affiliations = await getDuplicateAffiliations(state.selectedPublication.authors[i]);
              } else {
                cristinAuthors[i] = { ...emptyContributor };
              }
            }
            identified[i] = cristinAuthors[i].identified_cristin_person || false;
            tempContributors[i] = createContributorWrapper(authorsFromImportPublication, i, cristinAuthors);
            tempContributors[i].toBeCreated = await generateToBeCreatedContributor(
              tempContributors[i],
              cristinAuthors[i],
              authorsFromImportPublication[i],
              isDuplicate
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

    enrichImportPublicationAuthors().then();
  }, [importPublication, state.selectedPublication]);

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
          if (!contributors[i].toBeCreated.identified_cristin_person && isDuplicate) {
            //const person = await getPersonDetailById(contributors[i].toBeCreated); //TODO! Denne gir ingen mening - søker på cristinid=0 som gir 404-feil
            // identified[i] = person.identified_cristin_person ?? false;
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
    if (!isDuplicate) return;
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
        contributors,
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
                    <CompareFormJournal importPublication={importPublication} loadJournalIdError={loadJournalIdError} />
                    <CompareFormDoi importPublication={importPublication} />
                    <CompareFormYear importPublication={importPublication} />
                    <CompareFormCategory importPublication={importPublication} />
                    <CompareFormVolume importPublication={importPublication} />
                    <CompareFormIssue importPublication={importPublication} />
                    <CompareFormPages importPublication={importPublication} />
                  </StyledFormWrapper>
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
                            !!importPublication?.cristin_id ||
                            contributorErrors.length >= 1 ||
                            !state.contributorsLoaded ||
                            !!loadingContributorsError
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
          contributors={contributors}
          setContributors={setContributors}
          handleContributorModalClose={() => setIsContributorModalOpen(false)}
          importPublication={importPublication}
          isDuplicate={isDuplicate}
        />
      )}
    </>
  );
};

export default ComparePublicationDataModal;
