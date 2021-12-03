import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@material-ui/core';
import ActionButtons from './ActionButtons';
import { useFormikContext } from 'formik';
import React, { FC, useState } from 'react';
import {
  StyledLineCristinValue,
  StyledLineImportValue,
  StyledLineLabelTypography,
  StyledLineWrapper,
} from './CompareFormWrappers';
import { CompareFormValuesType } from './ComparePublicationDataModal';
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

interface CompareFormJournalProps {
  importPublication: ImportPublication;
}

export enum JournalPanels {
  SEARCH_JOURNAL_PANEL = 'searchJournalPanel',
  CREATE_JOURNAL_PANEL = 'createJournalPanel',
}

const CompareFormJournal: FC<CompareFormJournalProps> = ({ importPublication }) => {
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
      <StyledLineLabelTypography>Tidskrift</StyledLineLabelTypography>
      <StyledLineImportValue>
        <Typography data-testid="importdata-journal">{importPublication.channel?.title}</Typography>
      </StyledLineImportValue>
      <ActionButtons
        isImportAndCristinEqual={
          values.journal?.cristinTidsskriftNr === importPublication.channel?.cristinTidsskriftNr?.toString()
        }
        isCopyBottonDisabled={!importPublication.channel?.title}
        copyCommand={() => setFieldValue('journal', createJournalFromImportPublication, true)}
      />
      <StyledLineCristinValue>
        <StyledJournalPresentationWrapper>
          <Typography data-testid="cristindata-journal">{values.journal?.title}</Typography>
          {errors.journal?.cristinTidsskriftNr && (
            <CommonErrorMessage
              errorMessage={errors.journal.cristinTidsskriftNr}
              datatestid="compare-form-journal-error"
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
            <Typography>Registrer nytt tidskrift</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <CreateJournalPanel handleCreateJournal={handleSetJournal} />
          </AccordionDetails>
        </StyledAccordion>
      </StyledLineCristinValue>
    </StyledLineWrapper>
  );
};

export default CompareFormJournal;
