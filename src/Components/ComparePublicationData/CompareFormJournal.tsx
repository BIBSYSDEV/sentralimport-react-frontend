import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@material-ui/core';
import ActionButtons from './ActionButtons';
import { useFormikContext } from 'formik';
import React, { FC } from 'react';
import {
  StyledLineCristinValue,
  StyledLineImportValue,
  StyledLineLabelTypography,
  StyledLineWrapper,
} from './CompareFormWrappers';
import { compareFormValuesType } from './ComparePublicationDataModal';
import { ImportPublication, Journal } from '../../types/PublicationTypes';
import CreateJournalPanel from './CreateJournalPanel';
import SearchJournalPanel from './SearchJournalPanel';
import styled from 'styled-components';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const StyledJournalPresentationWrapper = styled.div`
  margin: 0.5rem 0;
`;
const StyledFormHeaderTypography = styled(Typography)`
  && {
    font-weight: bold;
  }
`;

interface CompareFormJournalProps {
  importPublication: ImportPublication;
}
//TODO:
// const [expanded, setExpanded] = React.useState(false);
//
// const handleChange = (panel) => (event, isExpanded) => {
//   setExpanded(isExpanded ? panel : false);
// };
//
// <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>

const CompareFormJournal: FC<CompareFormJournalProps> = ({ importPublication }) => {
  const { values, setFieldValue } = useFormikContext<compareFormValuesType>();

  const createJournalFromImportPublication = {
    cristinTidsskriftNr: importPublication.channel?.cristinTidsskriftNr?.toString(),
    title: importPublication.channel?.title,
    issn: importPublication.channel?.issn,
    eissn: importPublication.channel?.eissn,
  };

  const handleNewJournal = (newJournal: Journal) => {
    setFieldValue('journal', newJournal);
  };
  const handleChooseJournal = (newJournal: Journal) => {
    console.log(newJournal);
    setFieldValue('journal', newJournal);
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
        </StyledJournalPresentationWrapper>

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="search-journal-content"
            id="search-journal-header">
            <StyledFormHeaderTypography>Søk opp tidsskrift</StyledFormHeaderTypography>
          </AccordionSummary>
          <AccordionDetails>
            <SearchJournalPanel handleChooseJournal={handleChooseJournal} />
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="create-journal-content"
            id="create-journal-header">
            <StyledFormHeaderTypography>Registrer nytt tidskrift</StyledFormHeaderTypography>
          </AccordionSummary>
          <AccordionDetails>
            <CreateJournalPanel handleCreateJournal={handleNewJournal} />
          </AccordionDetails>
        </Accordion>
      </StyledLineCristinValue>
    </StyledLineWrapper>
  );
};

export default CompareFormJournal;
