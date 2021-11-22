import React, { FC, useContext, useEffect, useState } from 'react';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { Button, FormControl, Grid, TextField, Typography } from '@material-ui/core';
import Select from 'react-select';
import ConfirmationDialog from '../Dialogs/ConfirmationDialog';
import ConfirmDialog from '../Dialogs/ConfirmDialog';
import Validation, { doiMatcher } from '../Validation/Validation';
import { Context } from '../../Context';
import axios from 'axios';
import '../../assets/styles/buttons.scss';
import ContributorModal from '../Contributors/ContributorModal';
import ButtonGroup from '@material-ui/core/ButtonGroup/ButtonGroup';
import ErrorMessage from '../Dialogs/ErrorMessage';
import { CRIST_REST_API } from '../../utils/constants';
import styled from 'styled-components';
import { useSnackbar } from 'notistack';
import ActionButtons from './ActionButtons';
import clone from 'just-clone';
import { Channel, CristinPublication, ImportData, Language } from '../../types/PublicationTypes';
import { getContributorsByPublicationCristinResultId, SearchLanguage } from '../../api/contributorApi';

const StyledModal = styled(Modal)`
  width: 96%;
  max-width: 80rem;
  margin: 1rem auto;
  min-height: 100%;
  padding: 0;
`;

const StyledActionButtonsPlaceHolder = styled.div`
  min-width: 10rem;
  width: 5%;
`;

const StyledFormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const StyledErrorMessage = styled.div`
  color: red;
  font-size: 0.8rem;
  padding-top: 5px;
  padding-bottom: 10px;
`;

const StyledLineWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0.5rem;
  :nth-of-type(2n) {
    background-color: #fafafa;
  }
`;

const StyledHeaderLineWrapper = styled(StyledLineWrapper)`
  color: #76559a;
  padding: 0.5rem 0;
  border-bottom: none;
  margin-bottom: 1rem;
`;

const StyledOpenContributorsButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  margin-top: 1rem;
`;

const StyledLineHeader = styled(Typography)`
  min-width: 20rem;
  width: 40%;
`;

const StyledLineLabelTypography: any = styled(Typography)`
  min-width: 10rem;
  width: 10%;
  && {
    font-weight: bold;
  }
`;

const StyledLineImportValue = styled.div`
  min-width: 10rem;
  width: 40%;
`;

const StyledDisabledTypography = styled(Typography)`
  color: #555555;
`;

const StyledLineCristinValue = styled.div`
  min-width: 20rem;
  width: 40%;
`;

interface Category {
  value: string;
  label: string;
}

interface ComparePublicationDataModalProps {
  isComparePublicationDataModalOpen: boolean;
  handleComparePublicationDataModalClose: () => void;
  importPublication: ImportData;
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
  const [selectedLang, setSelectedLang] = useState<Language | undefined>(
    importPublication.languages.filter((lang: any) => lang.original)[0]
  );
  const [allContributorsFetched, setAllContributorsFetched] = useState(false);
  const [kilde, setKilde] = useState('');
  const [kildeId, setKildeId] = useState('');
  const [isContributorModalOpen, setIsContributorModalOpen] = useState(false);
  const [contributors] = useState(isDuplicate ? state.selectedPublication.authors : importPublication?.authors || []);
  const [aarstall, setAarstall] = useState('');
  const [categories, setCategories] = useState<Category[]>();
  const [doi, setDoi] = useState('');
  const [publishingDetails, setPublishingDetails] = useState<Channel | undefined>(importPublication?.channel);
  const [journals, setJournals] = useState<any>();
  const [selectedJournal, setSelectedJournal] = useState<any>(
    isDuplicate
      ? {
          value: state.selectedPublication.journal?.name || '0',
          label: state.selectedPublication.journal?.name || 'Ingen tidsskrift/journal funnet',
        }
      : {
          value: importPublication.channel?.cristinTidsskriftNr?.toString() || 0,
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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAbortOpen, setDialogAbortOpen] = useState(false);
  const firstUpdate = useRef(true);

  useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    saveToLocalStorage();
  }, [selectedCategory, selectedJournal, doi, aarstall, selectedLang, publishingDetails]);

  useEffect(() => {
    async function setFields() {
      let workedOn = false;
      let publicationFromLocalStorage: ImportData | undefined;
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
          ? state.selectedPublication.import_sources[0]?.source_name || 'Ingen kilde funnet'
          : importPublication.sourceName
      );
      setKildeId(
        isDuplicate
          ? state.selectedPublication.import_sources[0]?.source_reference_id || 'Ingen kildeId funnet'
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
    }

    setFields().then();
  }, [isDuplicate, state.selectedPublication, importPublication]);

  useEffect(() => {
    async function fetch() {
      await getCategories();
      await getJournals();
    }
    fetch().then();
  }, []);

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

  function handleChangeJournal(option: any) {
    setSelectedJournal(option);
    dispatch({ type: 'setSelectedField', payload: 'tidsskrift' });
    dispatch({ type: 'setValidation', payload: option.label });
  }

  function handleChangeTittel(event: any) {
    if (languages && selectedLang) {
      const index = languages.map((lang: any) => lang.lang).indexOf(selectedLang.lang);
      setSelectedLang({ ...selectedLang, title: event.target.value });
      if (languages[index]) {
        languages[index].title = event.target.value;
      }
      setLanguages(languages);
      dispatch({ type: 'setSelectedField', payload: 'tittel' });
      dispatch({ type: 'setValidation', payload: event.target.value });
    }
  }

  function handleChangeAarstall(event: any) {
    setAarstall(event.target.value);
    dispatch({ type: 'setSelectedField', payload: 'aarstall' });
    dispatch({ type: 'setValidation', payload: event.target.value });
  }

  function handleChangeCategory(option: any) {
    setSelectedCategory(option);
  }

  function handleSelectedLang(lang: any) {
    setSelectedLang(lang);
  }

  function handleChangeDoi(event: any) {
    setDoi(event.target.value);
    dispatch({ type: 'setSelectedField', payload: 'doi' });
    dispatch({ type: 'setValidation', payload: event.target.value });
  }

  function handleChangeVolume(event: any) {
    publishingDetails && setPublishingDetails({ ...publishingDetails, volume: event.target.value });
  }

  function handleChangeIssue(event: any) {
    publishingDetails && setPublishingDetails({ ...publishingDetails, issue: event.target.value });
  }

  function handleChangePageFrom(event: any) {
    publishingDetails && setPublishingDetails({ ...publishingDetails, pageFrom: event.target.value });
  }

  function handleChangePageTo(event: any) {
    publishingDetails && setPublishingDetails({ ...publishingDetails, pageTo: event.target.value });
  }

  function handleSubmit() {
    saveToLocalStorage();
    if (state.contributors === null) {
      dispatch({ type: 'contributors', payload: contributors });
    }
    setDialogOpen(true);
  }

  function handleAbortDialogClose() {
    setDialogAbortOpen(true);
  }

  function handleContributorModalClose() {
    setIsContributorModalOpen(false);
  }

  const copyTittel = () => {
    if (languages && importPublication.languages && selectedLang) {
      const originalTitle = importPublication.languages.filter((lang: any) => lang.lang === selectedLang.lang)[0].title;
      setSelectedLang({ ...selectedLang, title: originalTitle });
      const index = languages.map((lang: any) => lang.lang).indexOf(selectedLang.lang);
      languages[index].title = importPublication.languages.filter(
        (lang: any) => lang.lang === selectedLang.lang
      )[0].title;
      setLanguages(languages);
      dispatch({ type: 'setSelectedField', payload: 'tittel' });
      dispatch({ type: 'setValidation', payload: importPublication.languages[0].title });
    }
  };

  const copyAarstall = () => {
    if (importPublication.yearPublished) {
      setAarstall(importPublication.yearPublished);
      dispatch({ type: 'setSelectedField', payload: 'aarstall' });
      dispatch({ type: 'setValidation', payload: importPublication.yearPublished });
    }
  };

  const copyCategory = () => {
    setSelectedCategory({ value: importPublication.category, label: importPublication.categoryName });
  };

  const copyDoi = () => {
    setDoi(importPublication.doi ? importPublication.doi : 'Ingen DOI funnet');
    dispatch({ type: 'setSelectedField', payload: 'doi' });
    dispatch({
      type: 'setValidation',
      payload: importPublication.doi ? importPublication.doi : 'Ingen doi funnet',
    });
  };

  const copyJournal = () => {
    setSelectedJournal(
      importPublication.channel
        ? {
            value: importPublication.channel.cristinTidsskriftNr?.toString(),
            label: importPublication.channel.title,
            issn: importPublication.channel.issn,
            eissn: importPublication.channel.eissn,
          }
        : { value: 'x', label: 'Ingen tidsskrift funnet' }
    );
    dispatch({ type: 'setSelectedField', payload: 'tidsskrift' });
    dispatch({
      type: 'setValidation',
      payload: importPublication.channel?.title,
    });
  };

  const copyPages = () => {
    publishingDetails &&
      setPublishingDetails({
        ...publishingDetails,
        pageFrom: importPublication.channel?.pageFrom,
        pageTo: importPublication.channel?.pageTo,
      });
  };

  const copyVolume = () => {
    publishingDetails && setPublishingDetails({ ...publishingDetails, volume: importPublication.channel?.volume });
  };

  const copyIssue = () => {
    publishingDetails && setPublishingDetails({ ...publishingDetails, issue: importPublication.channel?.issue });
  };

  function confirmImportToCristin(result: any) {
    setDialogOpen(false);
    handleComparePublicationDataModalClose();
    if (result.status === 200) {
      enqueueSnackbar(
        'Importerte ny publikasjon med Cristin-id: ' + result.result.id + ' og tittel: ' + result.result.title,
        {
          variant: 'success',
        }
      );
    } else if (result.status === 401 || result.status === 403) {
      enqueueSnackbar('Din sesjon har gått ut. Vennligst logg inn på nytt', {
        variant: 'warning',
      });
    } else {
      enqueueSnackbar(
        'Noe gikk galt med import av publikasjon med pub-id: ' +
          importPublication.pubId +
          '. Dine endringer er fortsatt lagret i browseren. Vennligst prøv på nytt.',
        {
          variant: 'error',
        }
      );
    }
    handleDuplicateCheckModalClose();
    dispatch({ type: 'importDone', payload: !state.importDone });
    dispatch({ type: 'setContributorsLoaded', payload: false });
  }

  function abortToggle() {
    dispatch({ type: 'doSave', payload: false });
    setDialogAbortOpen(false);
    handleComparePublicationDataModalClose();
    // props.enqueueSnackbar('Lukket publikasjon. Endringer har blitt lagret i browseren', {
    //   variant: 'warning',
    // });
    handleDuplicateCheckModalClose();
    dispatch({ type: 'setContributorErrors', payload: 0 });
    dispatch({ type: 'setContributorsLoaded', payload: false });
  }

  function toggleDialog() {
    setDialogOpen(false);
  }

  function toggleAbortDialog() {
    setDialogAbortOpen(false);
  }

  function openContributorModal() {
    setIsContributorModalOpen(true);
  }

  function searchJournals(searchString: string) {
    getJournals(searchString).then();
  }

  function emptyArr() {
    dispatch({ type: 'setFormErrors', payload: [] });
  }

  // const handleNewJournal = (newJournal) => {
  //   setSelectedJournal({ label: newJournal.title, value: 0, issn: newJournal.issn, eissn: newJournal.eissn });
  //   dispatch({ type: 'setSelectedField', payload: 'tidsskrift' });
  //   dispatch({ type: 'setValidation', payload: newJournal.title });
  // };

  async function getJournals(journalTitle?: string) {
    if (!journalTitle || journalTitle.length === 0) {
      journalTitle = '*';
    }
    await axios
      .get(
        CRIST_REST_API + '/results/channels?type=journal&query=title_general:' + journalTitle,
        JSON.parse(localStorage.getItem('config') || '{}')
      )
      .then((response) => {
        updateJournals(response.data);
      });
  }

  async function getJournalId(issn: any) {
    let journal: any;
    try {
      journal = await axios.get(
        CRIST_REST_API + '/results/channels?type=journal&query=issn:' + issn[0].value || '0',
        JSON.parse(localStorage.getItem('config') || '{}')
      );
    } catch (e) {
      console.log('There was an error while getting the journal id');
    }

    return journal.data.length > 0 ? journal.data[0].id : '0';
  }

  async function getCategories() {
    const result: any = await axios.get(
      CRIST_REST_API + '/results/categories?lang=nb',
      JSON.parse(localStorage.getItem('config') || '{}')
    );
    const categories = [];
    for (let i = 0; i < result.data.length; i++) {
      categories.push({ value: result.data[i].code, label: result.data[i].name.nb });
    }
    setCategories(categories);
  }

  function updateJournals(journals: any) {
    const tempArray: any[] = [];
    for (let i = 0; i < journals.length; i++) {
      tempArray.push({
        value: journals[i].id,
        label: journals[i].title,
        issn: journals[i].issn,
        eissn: journals[i].eissn,
      });
    }
    setJournals(tempArray);
  }

  function formatDate(dateString: string) {
    const newDate = new Date(dateString);
    const tempDay = newDate.getDate();
    const tempYear = newDate.getFullYear();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const tempMonth = months[newDate.getMonth()];
    return tempMonth + ' ' + tempDay + ', ' + tempYear;
  }

  return (
    <div>
      <StyledModal isOpen={isComparePublicationDataModalOpen} size="lg">
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

            <StyledLineWrapper>
              <StyledLineLabelTypography>Språk</StyledLineLabelTypography>
              <StyledLineImportValue>
                <Typography data-testid="importdata-lang">{selectedLang?.lang}</Typography>
              </StyledLineImportValue>
              <StyledActionButtonsPlaceHolder />
              <StyledLineCristinValue>
                <ButtonGroup
                  data-testid="cristindata-lang-buttongroup"
                  className={`buttonGroup`}
                  size="small"
                  aria-label="language buttons">
                  {languages.map((lang: any, index: number) => (
                    <Button
                      key={index}
                      variant="outlined"
                      className={selectedLang === lang ? `selected` : ``}
                      onClick={() => handleSelectedLang(lang)}>
                      {lang.lang}
                    </Button>
                  ))}
                </ButtonGroup>
              </StyledLineCristinValue>
            </StyledLineWrapper>

            <StyledLineWrapper>
              <StyledLineLabelTypography htmlFor="Cristin-tittel">Tittel</StyledLineLabelTypography>
              <StyledLineImportValue>
                <Typography data-testid="importdata-title">
                  {
                    sortedLanguagesFromImportPublication?.filter((lang: any) => lang?.lang === selectedLang?.lang)[0]
                      ?.title
                  }
                </Typography>
              </StyledLineImportValue>
              <ActionButtons
                isImportAndCristinEqual={
                  sortedLanguagesFromImportPublication?.filter((lang: any) => lang?.lang === selectedLang?.lang)[0]
                    ?.title === selectedLang?.title
                }
                isCopyBottonDisabled={!importPublication.languages}
                copyCommand={copyTittel}
              />
              <StyledLineCristinValue>
                <TextField
                  data-testid="cristindata-title-textfield"
                  id="Cristin-tittel"
                  name="title"
                  value={selectedLang?.title}
                  onChange={handleChangeTittel}
                  required
                  multiline
                  fullWidth
                  error={selectedLang && selectedLang.title?.length < 6}
                  helperText={selectedLang && selectedLang.title?.length < 6 ? 'Tittel er for kort/mangler' : ''}
                />
              </StyledLineCristinValue>
            </StyledLineWrapper>

            <StyledLineWrapper>
              <StyledLineLabelTypography htmlFor="cristindata-journal">Tidsskrift</StyledLineLabelTypography>
              <StyledLineImportValue>
                <Typography data-testid="importdata-journal-title">{importPublication.channel?.title}</Typography>
              </StyledLineImportValue>
              <ActionButtons
                isImportAndCristinEqual={
                  selectedJournal.value === importPublication.channel?.cristinTidsskriftNr?.toString()
                }
                isCopyBottonDisabled={!importPublication.channel?.title}
                copyCommand={copyJournal}
              />
              <StyledLineCristinValue>
                <>
                  <Select
                    data-testid="cristindata-journal-select"
                    id="cristindata-journal"
                    aria-label="Tidsskrift-select"
                    placeholder="Søk på tidsskrift"
                    name="journalSelect"
                    options={journals}
                    value={selectedJournal}
                    className="basic-select"
                    classNamePrefix="select"
                    onChange={handleChangeJournal}
                    onInputChange={searchJournals}
                  />
                  {selectedJournal.label === 'Ingen tidsskrift funnet' && (
                    <StyledErrorMessage>Tidsskrift mangler</StyledErrorMessage>
                  )}
                </>
                {/* TODO: doesnt work *<CreateJournalPanel handleCreateJournal={handleNewJournal} />*/}
              </StyledLineCristinValue>
            </StyledLineWrapper>

            <StyledLineWrapper>
              <StyledLineLabelTypography>DOI</StyledLineLabelTypography>
              <StyledLineImportValue>
                <Typography data-testid="importdata-doi">
                  {importPublication.doi ? (
                    <a href={'https://doi.org/' + importPublication.doi} target="_blank" rel="noopener noreferrer">
                      {importPublication.doi}
                    </a>
                  ) : (
                    'Ingen DOI funnet'
                  )}
                </Typography>
              </StyledLineImportValue>
              <ActionButtons
                isImportAndCristinEqual={doi === importPublication.doi}
                isCopyBottonDisabled={!importPublication.doi}
                copyCommand={copyDoi}
              />
              <StyledLineCristinValue>
                <FormControl fullWidth>
                  <TextField
                    id="Cristin-doi"
                    placeholder="DOI"
                    value={doi}
                    data-testid="cristindata-doi-textfield"
                    onChange={(event: any) => handleChangeDoi(event)}
                    margin="normal"
                    error={!doi?.match(doiMatcher)}
                    helperText={doi && !doi.match(doiMatcher) ? 'Doi har galt format' : ''}
                  />
                </FormControl>
              </StyledLineCristinValue>
            </StyledLineWrapper>

            <StyledLineWrapper>
              <StyledLineLabelTypography htmlFor="cristindata-year">Årstall</StyledLineLabelTypography>
              <StyledLineImportValue>
                <Typography data-testid="importdata-year">{importPublication.yearPublished}</Typography>
              </StyledLineImportValue>
              <ActionButtons
                isImportAndCristinEqual={aarstall === importPublication.yearPublished}
                isCopyBottonDisabled={!importPublication.yearPublished}
                copyCommand={copyAarstall}
              />
              <StyledLineCristinValue>
                <TextField
                  id="cristindata-year"
                  data-testid="cristindata-year-textfield"
                  value={aarstall}
                  onChange={handleChangeAarstall}
                  margin="normal"
                  required
                  error={aarstall.toString().length !== 4 || !(parseInt(aarstall) <= new Date().getFullYear())}
                  helperText={
                    aarstall.toString().length !== 4 ||
                    (!(parseInt(aarstall) <= new Date().getFullYear())
                      ? 'Årstall kan ikke være i framtiden eller før år 1000'
                      : '')
                  }
                />
              </StyledLineCristinValue>
            </StyledLineWrapper>

            <StyledLineWrapper>
              <StyledLineLabelTypography htmlFor="cristindata-category">Kategori</StyledLineLabelTypography>
              <StyledLineImportValue>
                <Typography data-testid="importdata-category">{importPublication.categoryName}</Typography>
              </StyledLineImportValue>
              <ActionButtons
                isImportAndCristinEqual={selectedCategory.label === importPublication.categoryName}
                isCopyBottonDisabled={!importPublication.categoryName}
                copyCommand={copyCategory}
              />
              <StyledLineCristinValue data-testid="cristindata-category-select">
                <Select
                  id="cristindata-category"
                  aria-label="Kategori"
                  placeholder="Søk på kategori"
                  name="categorySelect"
                  options={categories}
                  value={selectedCategory}
                  className="basic-select"
                  classNamePrefix="select"
                  onChange={handleChangeCategory}
                />
              </StyledLineCristinValue>
            </StyledLineWrapper>

            <StyledLineWrapper>
              <StyledLineLabelTypography>Volum</StyledLineLabelTypography>
              <StyledLineImportValue>
                <Typography data-testid="importdata-volume">{importPublication.channel?.volume}</Typography>
              </StyledLineImportValue>
              <ActionButtons
                isImportAndCristinEqual={importPublication.channel?.volume === publishingDetails?.volume}
                isCopyBottonDisabled={!importPublication.channel?.volume}
                copyCommand={copyVolume}
              />
              <StyledLineCristinValue>
                <TextField
                  data-testid="cristindata-volume-textfield"
                  id="cristindata-volume"
                  placeholder="Volum"
                  value={publishingDetails && publishingDetails.volume}
                  margin="normal"
                  onChange={handleChangeVolume}
                />
              </StyledLineCristinValue>
            </StyledLineWrapper>

            <StyledLineWrapper>
              <StyledLineLabelTypography>Hefte</StyledLineLabelTypography>
              <StyledLineImportValue>
                <Typography data-testid="importdata-issue">{importPublication.channel?.issue}</Typography>
              </StyledLineImportValue>
              <ActionButtons
                isImportAndCristinEqual={importPublication.channel?.issue === publishingDetails?.issue}
                isCopyBottonDisabled={!importPublication.channel?.issue}
                copyCommand={copyIssue}
              />
              <StyledLineCristinValue>
                <TextField
                  id="Cristin-hefte"
                  data-testid="cristindata-issue-textfield"
                  placeholder="Hefte"
                  value={publishingDetails && publishingDetails.issue}
                  margin="normal"
                  onChange={handleChangeIssue}
                />
              </StyledLineCristinValue>
            </StyledLineWrapper>

            <StyledLineWrapper>
              <StyledLineLabelTypography>Sider</StyledLineLabelTypography>
              <StyledLineImportValue>
                <Typography data-testid="importdata-pages">
                  {importPublication.channel?.pageFrom && `Fra: ${importPublication.channel.pageFrom}`}
                  {importPublication.channel?.pageTo && ` Til: ${importPublication.channel.pageTo}`}
                </Typography>
              </StyledLineImportValue>
              <ActionButtons
                isImportAndCristinEqual={
                  importPublication.channel?.pageFrom === publishingDetails?.pageFrom &&
                  importPublication.channel?.pageTo === publishingDetails?.pageTo
                }
                isCopyBottonDisabled={!(importPublication.channel?.pageFrom || importPublication.channel?.pageTo)}
                copyCommand={copyPages}
              />
              <StyledLineCristinValue>
                <div style={{ display: 'flex' }}>
                  <TextField
                    placeholder="Side fra"
                    data-testid="cristindata-pagefrom-textfield"
                    id="pageFromCristin"
                    value={publishingDetails ? publishingDetails.pageFrom : ''}
                    onChange={handleChangePageFrom}
                  />
                  <TextField
                    placeholder="Side til"
                    data-testid="cristindata-pageto-textfield"
                    id="pageToCristin"
                    value={publishingDetails ? publishingDetails.pageTo : ''}
                    onChange={handleChangePageTo}
                    style={{ marginLeft: '2rem' }}
                  />
                </div>
              </StyledLineCristinValue>
            </StyledLineWrapper>
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
          {state.contributorErrors.length >= 1 ? <ErrorMessage /> : ''}
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
                onClick={handleAbortDialogClose}
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
                  importPublication?.cristin_id ||
                  state.contributorErrors.length >= 1 ||
                  !state.contributorsLoaded
                }
                color="primary"
                onClick={handleSubmit}
                variant="contained"
                data-testid="import-publication-button">
                Importer
              </Button>
            </Grid>
          </Grid>
        </ModalFooter>
      </StyledModal>
      <ConfirmDialog
        doFunction={emptyArr}
        title={'Avbryt import'}
        text={
          'Er du sikker på at du vil lukke denne publikasjonen? Endringer vil bli lagret fram til man åpner en ny publikasjon'
        }
        open={dialogAbortOpen}
        handleClose={abortToggle}
        handleCloseDialog={toggleAbortDialog}
      />
      <ConfirmationDialog
        open={dialogOpen}
        handleClose={confirmImportToCristin}
        handleCloseDialog={toggleDialog}
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
  );
};

export default ComparePublicationDataModal;
