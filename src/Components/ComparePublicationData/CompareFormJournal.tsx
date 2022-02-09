import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@material-ui/core';
import ActionButtons from './ActionButtons';
import { useFormikContext } from 'formik';
import React, { FC, useState } from 'react';
import {
  StyledDisabledTypography,
  StyledLineCristinValue,
  StyledLineImportValue,
  StyledLineLabelTypography,
  StyledLineWrapper,
} from './CompareFormWrappers';
import { CompareFormValuesType } from './CompareFormTypes';
import { ImportPublication, Journal } from '../../types/PublicationTypes';
import CreateJournalPanel from './CreateJournalPanel';
import SearchJournalPanel from './SearchJournalPanel';
import styled from 'styled-components';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CommonErrorMessage from '../CommonErrorMessage';
import { Colors } from '../../assets/styles/StyleConstants';

const StyledJournalPresentationWrapper = styled.div`
  margin: 0.5rem 0;
`;

const StyledAccordion = styled(Accordion)`
  && {
    //should look like buttons
    border: 1px solid ${Colors.PRIMARY};
    border-radius: 4px;
    box-shadow: none;
    color: ${Colors.PRIMARY};
    margin-bottom: 0.3rem;
  }
`;

export enum JournalPanels {
  SEARCH_JOURNAL_PANEL = 'searchJournalPanel',
  CREATE_JOURNAL_PANEL = 'createJournalPanel',
}

interface CompareFormJournalProps {
  importPublication: ImportPublication;
  isDuplicate: boolean;
  loadJournalIdError?: Error;
}

const CompareFormJournal: FC<CompareFormJournalProps> = ({ importPublication, isDuplicate, loadJournalIdError }) => {
  const { values, setFieldValue, errors } = useFormikContext<CompareFormValuesType>();
  const [expandedPanel, setExpandedPanel] = useState<JournalPanels | undefined>();

  const createJournalFromImportPublication = {
    cristinTidsskriftNr: importPublication.channel?.cristinTidsskriftNr?.toString(),
    title: importPublication.channel?.title,
    issn: importPublication.channel?.issn,
    eissn: importPublication.channel?.eissn,
  };

  const handleChangePanel = (panel: JournalPanels | undefined) => (event: any, isExpanded: boolean) => {
    setExpandedPanel(isExpanded ? panel : undefined);
  };

  const handleSetJournal = (newJournal: Journal) => {
    setFieldValue('journal', newJournal);
    setExpandedPanel(undefined);
  };

  return (
    <StyledLineWrapper>
      <StyledLineLabelTypography>Tidsskrift</StyledLineLabelTypography>
      <StyledLineImportValue>
        <Typography data-testid="importdata-journal-title">{importPublication.channel?.title}</Typography>
      </StyledLineImportValue>
      <ActionButtons
        isImportAndCristinEqual={
          values.journal?.cristinTidsskriftNr === importPublication.channel?.cristinTidsskriftNr?.toString()
        }
        isCopyBottonDisabled={!importPublication.channel?.title || isDuplicate}
        copyCommand={() => setFieldValue('journal', createJournalFromImportPublication, true)}
        dataTestid={'compare-form-journal-action'}
      />
      <StyledLineCristinValue>
        {!isDuplicate ? (
          <>
            <StyledJournalPresentationWrapper>
              <Typography data-testid="cristindata-journal-title">{values.journal?.title}</Typography>
              {errors.journal?.cristinTidsskriftNr && (
                <CommonErrorMessage
                  errorMessage={errors.journal.cristinTidsskriftNr}
                  datatestid="compare-form-journal-error"
                />
              )}
              {loadJournalIdError && (
                <CommonErrorMessage
                  errorMessage="Could not load the journal id from Cristin"
                  datatestid="compare-form-journal-load-error"
                />
              )}
            </StyledJournalPresentationWrapper>
            <StyledAccordion
              expanded={expandedPanel === JournalPanels.SEARCH_JOURNAL_PANEL}
              onChange={handleChangePanel(JournalPanels.SEARCH_JOURNAL_PANEL)}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="search-journal-content"
                id="search-journal-header">
                <Typography>Søk opp tidsskrift</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <SearchJournalPanel handleChooseJournal={handleSetJournal} />
              </AccordionDetails>
            </StyledAccordion>

            <StyledAccordion
              expanded={expandedPanel === JournalPanels.CREATE_JOURNAL_PANEL}
              onChange={handleChangePanel(JournalPanels.CREATE_JOURNAL_PANEL)}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="create-journal-content"
                id="create-journal-header">
                <Typography>Registrer nytt tidsskrift</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <CreateJournalPanel handleCreateJournal={handleSetJournal} />
              </AccordionDetails>
            </StyledAccordion>
          </>
        ) : (
          <StyledDisabledTypography data-testid="cristindata-journal-for-duplicate">
            {values.journal.title}
          </StyledDisabledTypography>
        )}
      </StyledLineCristinValue>
    </StyledLineWrapper>
  );
};

export default CompareFormJournal;
