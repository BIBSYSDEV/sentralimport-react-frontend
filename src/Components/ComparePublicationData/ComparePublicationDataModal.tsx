import React, { FC, useContext, useEffect, useState } from 'react';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { Button, Grid, Typography } from '@material-ui/core';
import ConfirmImportDialog from '../Dialogs/ConfirmImportDialog';
import ConfirmDialog from '../Dialogs/ConfirmDialog';
import Validation, { doiMatcher } from '../Validation/Validation';
import { Context } from '../../Context';
import '../../assets/styles/buttons.scss';
import ContributorModal from '../Contributors/ContributorModal';
import ContributorErrorMessage from './ContributorErrorMessage';
import styled from 'styled-components';
import { useSnackbar } from 'notistack';
import clone from 'just-clone';
import { Channel, CristinPublication, ImportPublication, Language } from '../../types/PublicationTypes';
import { getContributorsByPublicationCristinResultId, SearchLanguage } from '../../api/contributorApi';
import CommonErrorMessage from '../CommonErrorMessage';
import { handlePotentialExpiredSession } from '../../api/api';
import { getJournalsByQuery, QueryMethod } from '../../api/publicationApi';
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

const StyledModal = styled(Modal)`
  width: 96%;
  max-width: 80rem;
  margin: 1rem auto;
  min-height: 100%;
  padding: 0;
`;

const StyledDisabledTypography = styled(Typography)`
  color: #555555;
`;

export interface CategoryOption {
  value: string;
  label: string;
}

export interface JournalType {
  cristinTidsskriftNr: string;
  title: string;
  issn?: string;
  eissn?: string;
}

export interface compareFormValuesType {
  title: string;
  year: string;
  doi: string;
  language: any;
  category: CategoryOption;
  volume: string;
  issue: string;
  pageFrom: string;
  pageTo: string;
  journal: JournalType;
}

interface ComparePublicationDataModalProps {
  isComparePublicationDataModalOpen: boolean;
  handleComparePublicationDataModalClose: () => void;
  importPublication: ImportPublication;
  cristinPublication: CristinPublication;
  handleDuplicateCheckModalClose: () => void;
  isDuplicate: boolean;
}

//TODO: tidsskrift id er ikke med i duplikat. må derfor matche på issn i stedet?
const ComparePublicationDataModal: FC<ComparePublicationDataModalProps> = ({
  isComparePublicationDataModalOpen,
  handleComparePublicationDataModalClose,
  importPublication,
  cristinPublication,
  handleDuplicateCheckModalClose,
  isDuplicate,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { useRef, useLayoutEffect } = React;
  const { state, dispatch } = useContext(Context);
  const sortedLanguagesFromImportPublication = clone(importPublication)
    .languages.sort((a: any, b: any) => a.original - b.original)
    .reverse();
  const [languages, setLanguages] = useState(sortedLanguagesFromImportPublication);
  const originalImportLanguage = importPublication.languages?.find((lang: Language) => lang.original);
  const [selectedLang, setSelectedLang] = useState<Language | undefined>(originalImportLanguage);
  const [allContributorsFetched, setAllContributorsFetched] = useState(false);
  const [kilde, setKilde] = useState('');
  const [kildeId, setKildeId] = useState('');
  const [isContributorModalOpen, setIsContributorModalOpen] = useState(false);
  const [contributors] = useState(isDuplicate ? state.selectedPublication.authors : importPublication?.authors || []);
  const [aarstall, setAarstall] = useState('');
  const [doi, setDoi] = useState('');
  const [publishingDetails, setPublishingDetails] = useState<Channel | undefined>(importPublication?.channel);
  const [selectedJournal, setSelectedJournal] = useState<any>(
    isDuplicate
      ? {
          value: state.selectedPublication.journal?.name || '0',
          label: state.selectedPublication.journal?.name || 'Ingen tidsskrift/journal funnet',
        }
      : {
          value: importPublication.channel?.cristinTidsskriftNr?.toString() || '0',
          label: importPublication.channel?.title || 'Ingen tidsskrift/journal funnet',
        }
  );
  const [selectedCategory, setSelectedCategory] = useState(
    isDuplicate
      ? {
          value: state.selectedPublication?.category,
          label: state.selectedPublication?.categoryName,
        }
      : {
          value: '',
          label: 'Ingen kategori funnet',
        }
  );
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [dialogAbortOpen, setDialogAbortOpen] = useState(false);
  const firstUpdate = useRef(true);
  const [fetchDataError, setFetchDataError] = useState<Error | undefined>();
  const [importPublicationError, setImportPublicationError] = useState<Error | undefined>();

  useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    saveToLocalStorage();
  }, [selectedCategory, selectedJournal, doi, aarstall, selectedLang, publishingDetails]);

  useEffect(() => {
    async function setFields() {
      try {
        setFetchDataError(undefined);
        let workedOn = false;
        let publicationFromLocalStorage: ImportPublication | undefined;
        const localStorageData = localStorage.getItem('tempPublication');
        if (localStorageData) {
          publicationFromLocalStorage = JSON.parse(localStorageData).publication;
          if (
            publicationFromLocalStorage &&
            publicationFromLocalStorage.pubId === importPublication.pubId &&
            publicationFromLocalStorage.duplicate === isDuplicate
          )
            workedOn = true;
        }
        if (isDuplicate && !workedOn && !allContributorsFetched) {
          fetchAllAuthors(state.selectedPublication.cristin_result_id).then();
          setAllContributorsFetched(true);
        }

        setKilde(
          isDuplicate
            ? (state.selectedPublication.import_sources && state.selectedPublication.import_sources[0]?.source_name) ||
                'Ingen kilde funnet'
            : importPublication.sourceName
        );
        setKildeId(
          isDuplicate
            ? (state.selectedPublication.import_sources &&
                state.selectedPublication.import_sources[0]?.source_reference_id) ||
                'Ingen kildeId funnet'
            : importPublication.externalId
        );

        setSelectedJournal(
          workedOn
            ? {
                value: publicationFromLocalStorage?.channel?.cristinTidsskriftNr?.toString(),
                label: publicationFromLocalStorage?.channel?.title,
              }
            : isDuplicate
            ? {
                value: (await getJournalId(state.selectedPublication.journal?.international_standard_numbers)) || '0',
                label: state.selectedPublication.journal?.name || 'Ingen tidsskrift funnet',
              }
            : {
                value: importPublication.channel?.cristinTidsskriftNr?.toString() || '0',
                label: importPublication.channel?.title || 'Ingen tidsskrift funnet',
              }
        );

        setSelectedCategory(
          workedOn
            ? {
                value: publicationFromLocalStorage?.category,
                label: publicationFromLocalStorage?.categoryName,
              }
            : isDuplicate
            ? {
                value: state.selectedPublication.category?.code,
                label: state.selectedPublication.category?.name.nb,
              }
            : {
                value: importPublication.category,
                label: importPublication.categoryName,
              }
        );

        setLanguages(
          workedOn && publicationFromLocalStorage
            ? publicationFromLocalStorage.languages
            : isDuplicate
            ? [
                {
                  title: state.selectedPublication.title[state.selectedPublication.original_language],
                  lang: state.selectedPublication.original_language?.toUpperCase(),
                  original: true,
                },
              ]
            : sortedLanguagesFromImportPublication
        );

        setSelectedLang(
          workedOn
            ? publicationFromLocalStorage?.languages.filter((language: any) => language.original)[0]
            : isDuplicate
            ? {
                title: state.selectedPublication.title[state.selectedPublication.original_language],
                lang: state.selectedPublication.original_language?.toUpperCase(),
                original: true,
              }
            : importPublication.languages.filter((language: any) => language.original)[0]
        );

        setAarstall(
          workedOn
            ? publicationFromLocalStorage?.yearPublished
            : isDuplicate
            ? state.selectedPublication.year_published
            : importPublication.yearPublished
        );

        setDoi(
          workedOn
            ? publicationFromLocalStorage?.doi
            : isDuplicate && state.selectedPublication.links
            ? state.selectedPublication.links[state.selectedPublication.links.length - 1]?.url?.substring(
                16,
                state.selectedPublication.links[0]?.url?.length + 1
              )
            : importPublication.doi
            ? importPublication.doi
            : ''
        );

        setPublishingDetails(
          workedOn
            ? publicationFromLocalStorage?.channel
            : isDuplicate
            ? {
                ...state.selectedPublication.journal,
                volume: state.selectedPublication.volume || '',
                pageFrom: state.selectedPublication.pages?.from || '',
                pageTo: state.selectedPublication.pages?.to || '',
                issue: state.selectedPublication.issue || '',
              }
            : {
                ...importPublication.channel,
                volume: importPublication.channel?.volume || '',
                pageFrom: importPublication.channel?.pageFrom || '',
                pageTo: importPublication.channel?.pageTo || '',
                issue: importPublication.channel?.issue || '',
              }
        );
      } catch (error) {
        handlePotentialExpiredSession(error);
        setFetchDataError(error as Error);
      }
    }
    setFields().then();
  }, [isDuplicate, state.selectedPublication, importPublication]);

  function saveToLocalStorage() {
    if (state.doSave)
      localStorage.setItem(
        'tempPublication',
        JSON.stringify({
          publication: {
            cristinResultId: isDuplicate ? cristinPublication.cristin_result_id : '',
            category: selectedCategory.value,
            categoryName: selectedCategory.label,
            channel: {
              ...publishingDetails,
              cristinTidsskriftNr: selectedJournal.value,
              title: selectedJournal.label,
              issn: selectedJournal.issn,
              eissn: selectedJournal.eissn,
            },
            doi: doi,
            languages: languages,
            pubId: importPublication.pubId,
            registered: importPublication.registered,
            yearPublished: aarstall,
            duplicate: isDuplicate,
            import_sources: [
              {
                source_name: importPublication.sourceName,
                source_reference_id: importPublication.externalId,
              },
            ],
          },
        })
      );
  }

  async function fetchAllAuthors(resultId: string) {
    if (state.doSave) {
      let page = 1;
      let allAuthors: any[] = [];
      while (allAuthors.length < state.selectedPublication.authorTotalCount) {
        const contributorResponse = await getContributorsByPublicationCristinResultId(
          resultId,
          page,
          500,
          SearchLanguage.Nb
        );
        allAuthors = [...allAuthors, ...contributorResponse.data];
        page++;
      }
      const tempPub = { ...state.selectedPublication, authors: allAuthors };
      dispatch({ type: 'setSelectedPublication', payload: tempPub });
    }
  }

  function handleFormSubmit() {
    setImportPublicationError(undefined);
    saveToLocalStorage();
    if (state.contributors === null) {
      dispatch({ type: 'contributors', payload: contributors });
    }
    setIsConfirmDialogOpen(true);
  }

  function handleAbort() {
    setDialogAbortOpen(true);
  }

  function handleContributorModalClose() {
    setIsContributorModalOpen(false);
  }

  function handlePublicationImported(result: any) {
    setIsConfirmDialogOpen(false);
    if (result.status === 200) {
      enqueueSnackbar(
        'Importerte ny publikasjon (Cristin-id: ' + result.result.id + ' og tittel: ' + result.result.title + ')',
        {
          variant: 'success',
        }
      );
      handleComparePublicationDataModalClose();
      handleDuplicateCheckModalClose();
    } else {
      const errorMessage = `Noe gikk galt med import av publikasjon med pub-id: ${importPublication.pubId}.
       Dine endringer er fortsatt lagret i browseren. ${result.errorMessage}`;
      setImportPublicationError(new Error(errorMessage));
      dispatch({ type: 'importDone', payload: false });
      // dispatch({ type: 'setContributorsLoaded', payload: false });
    }
  }

  function abortToggle() {
    dispatch({ type: 'doSave', payload: false });
    setDialogAbortOpen(false);
    handleComparePublicationDataModalClose();
    handleDuplicateCheckModalClose();
    dispatch({ type: 'setContributorErrors', payload: 0 });
    dispatch({ type: 'setContributorsLoaded', payload: false });
  }

  function handleCloseConfirmImportDialog() {
    setIsConfirmDialogOpen(false);
  }

  function toggleAbortDialog() {
    setDialogAbortOpen(false);
  }

  function openContributorModal() {
    setIsContributorModalOpen(true);
  }

  function emptyGlobalFormErrors() {
    dispatch({ type: 'setFormErrors', payload: [] });
  }

  async function getJournalId(issn: any[] | undefined) {
    try {
      const journalResponse = await getJournalsByQuery(issn ? issn[0].value : '0', QueryMethod.issn);
      return journalResponse.data.length > 0 ? journalResponse.data[0].id : '0';
    } catch (error) {
      handlePotentialExpiredSession(error);
      console.log('There was an error while getting the journal id', error);
      return '';
    }
  }
  //
  // function updateJournals(journals: any) {
  //   const tempArray: any[] = [];
  //   for (let i = 0; i < journals.length; i++) {
  //     tempArray.push({
  //       value: journals[i].id,
  //       label: journals[i].title,
  //       issn: journals[i].issn,
  //       eissn: journals[i].eissn,
  //     });
  //   }
  //   setJournals(tempArray);
  // }

  function formatDate(dateString: string) {
    const newDate = new Date(dateString);
    const tempDay = newDate.getDate();
    const tempYear = newDate.getFullYear();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const tempMonth = months[newDate.getMonth()];
    return tempMonth + ' ' + tempDay + ', ' + tempYear;
  }

  const formValidationSchema = Yup.object().shape({
    title: Yup.string().required('Tittel er et obligatorisk felt').min(6, 'Tittel må ha minimum 6 tegn'),
    year: Yup.number()
      .typeError('Årstall må være et nummer')
      .required('Årstall er et obligatorisk felt')
      .integer('Årstall må være heltall')
      .moreThan(999, 'Årstall må være større enn 999')
      .lessThan(new Date().getFullYear() + 1, 'Årstall kan ikke være et framtidig år'), //todo: nødvendige sjekker ?
    doi: Yup.string().matches(doiMatcher, 'Doi har galt format'),
  });

  //todo: skrive om initiering og ta hensyn til isduplicate
  const formValues: compareFormValuesType = {
    title: selectedLang?.title ?? '',
    year: aarstall,
    doi: doi,
    language: selectedLang,
    journal: selectedJournal,
    category: selectedCategory,
    volume: importPublication?.channel?.volume ?? '',
    issue: importPublication?.channel?.issue ?? '',
    pageFrom: importPublication?.channel?.pageFrom ?? '',
    pageTo: importPublication?.channel?.pageTo ?? '',
  };

  const NewAndImprovedHandleFormSubmit = () => {
    saveToLocalStorage(); //tja ?
    if (state.contributors === null) {
      dispatch({ type: 'contributors', payload: contributors });
    }
    setIsConfirmDialogOpen(true);
    //later: sette formValues som parameter i confirmdialogOpen
  };

  return (
    <>
      {fetchDataError ? (
        <Typography color="error">Noe gikk galt. {fetchDataError.message}</Typography>
      ) : (
        <div>
          <StyledModal isOpen={isComparePublicationDataModalOpen} size="lg" data-testid="compare-modal">
            <ModalBody>
              <StyledFormWrapper>
                <Formik
                  onSubmit={NewAndImprovedHandleFormSubmit}
                  initialValues={formValues}
                  validationSchema={formValidationSchema}>
                  {({ isValid }) => (
                    <Form>
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
                            {isDuplicate ? formatDate(cristinPublication.created.date.substring(0, 10)) : '-'}
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

                      <CompareFormTitle importPublication={importPublication} selectedLang={selectedLang} />
                      <CompareFormJournal importPublication={importPublication} />
                      <CompareFormDoi importPublication={importPublication} />
                      <CompareFormYear importPublication={importPublication} />
                      <CompareFormCategory importPublication={importPublication} />
                      <CompareFormVolume importPublication={importPublication} />
                      <CompareFormIssue importPublication={importPublication} />
                      <CompareFormPages importPublication={importPublication} />

                      {!isValid && (
                        <CommonErrorMessage datatestid="compare-form-error" errorMessage="Det er feil i skjema" />
                      )}
                    </Form>
                  )}
                </Formik>
              </StyledFormWrapper>
              <StyledOpenContributorsButtonWrapper>
                <Button
                  size="large"
                  data-testid="open-contributors-modal-button"
                  onClick={openContributorModal}
                  variant="contained"
                  color="primary">
                  Vis bidragsytere
                </Button>
              </StyledOpenContributorsButtonWrapper>
              <StyledErrorMessageWrapper>
                {state.contributorErrors.length >= 1 && <ContributorErrorMessage />}
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
                  <Validation
                    publication={isDuplicate ? state.selectedPublication : importPublication}
                    duplicate={isDuplicate}
                  />
                </Grid>
                <Grid item>
                  {state.contributorErrors?.length >= 1 ? <div> Feil i bidragsyterlisten. </div> : ''}
                  {!state.contributorsLoaded ? <div> Henter bidragsytere. </div> : ''}
                </Grid>
                <Grid item>
                  <Button
                    onClick={handleAbort}
                    variant="outlined"
                    color="secondary"
                    data-testid="import-publication-cancel-button">
                    Avbryt
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    disabled={
                      state.formErrors.length >= 1 ||
                      !!importPublication?.cristin_id ||
                      state.contributorErrors.length >= 1 ||
                      !state.contributorsLoaded
                    }
                    color="primary"
                    onClick={handleFormSubmit}
                    variant="contained"
                    data-testid="import-publication-button">
                    Importer
                  </Button>
                </Grid>
              </Grid>
            </ModalFooter>
          </StyledModal>
          <ConfirmDialog
            doFunction={emptyGlobalFormErrors}
            title={'Avbryt import'}
            text={
              'Er du sikker på at du vil lukke denne publikasjonen? Endringer vil bli lagret fram til man åpner en ny publikasjon'
            }
            open={dialogAbortOpen}
            handleClose={abortToggle}
            handleCloseDialog={toggleAbortDialog}
          />
          <ConfirmImportDialog
            open={isConfirmDialogOpen}
            handleClose={handlePublicationImported}
            handleCloseDialog={handleCloseConfirmImportDialog}
            data={importPublication}
            duplicate={isDuplicate}
          />
          {importPublication && (
            <ContributorModal
              isContributorModalOpen={isContributorModalOpen}
              handleContributorModalClose={handleContributorModalClose.bind(this)}
              importPublication={importPublication}
              isDuplicate={isDuplicate}
            />
          )}
        </div>
      )}
    </>
  );
};

export default ComparePublicationDataModal;
