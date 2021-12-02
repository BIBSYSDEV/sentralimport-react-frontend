import { Typography } from '@material-ui/core';
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

const StyledJournalPresentationWrapper = styled.div`
  margin: 0.5rem 0;
`;

interface CompareFormJournalProps {
  importPublication: ImportPublication;
}

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
        <CreateJournalPanel handleCreateJournal={handleNewJournal} />
        <SearchJournalPanel handleChooseJournal={handleChooseJournal} />
      </StyledLineCristinValue>
    </StyledLineWrapper>
  );
};

export default CompareFormJournal;
