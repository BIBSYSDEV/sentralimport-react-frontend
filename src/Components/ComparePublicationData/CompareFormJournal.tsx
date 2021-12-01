import { CircularProgress, TextField, Typography } from '@material-ui/core';
import ActionButtons from './ActionButtons';
import { Field, FieldProps, useFormikContext } from 'formik';
import React, { FC, useEffect, useState } from 'react';
import {
  StyledLineCristinValue,
  StyledLineImportValue,
  StyledLineLabelTypography,
  StyledLineWrapper,
} from './CompareFormWrappers';
import { compareFormValuesType, JournalType } from './ComparePublicationDataModal';
import { ImportPublication, Journal } from '../../types/PublicationTypes';
import CreateJournalPanel from '../CreateJournalPanel/CreateJournalPanel';
import { getJournalsByQuery, QueryMethod } from '../../api/publicationApi';
import { Autocomplete } from '@material-ui/lab';
//import styled from 'styled-components';

// const StyledErrorMessage = styled.div`
//   font-size: 0.8rem;
//   padding-top: 5px;
//   padding-bottom: 10px;
// `;

interface CompareFormJournalProps {
  importPublication: ImportPublication;
}

const CompareFormJournal: FC<CompareFormJournalProps> = ({ importPublication }) => {
  const { values, setFieldValue } = useFormikContext<compareFormValuesType>();
  const [journals, setJournals] = useState<any>(); //todo type
  const [fetchJournalsError, setFetchJournalsError] = useState<Error | undefined>(new Error('test'));
  const [isLoadingJournals, setIsLoadingJournals] = useState(false);

  const handleNewJournal = (newJournal: Journal) => setJournals((old: any) => [...old, newJournal]); //TODO: sjekk

  useEffect(() => {
    async function getJournals(journalTitle?: string) {
      try {
        setIsLoadingJournals(true);
        setFetchJournalsError(undefined);
        if (!journalTitle || journalTitle.length === 0) {
          journalTitle = '*';
        }
        const journals = (await getJournalsByQuery(journalTitle, QueryMethod.title)).data;
        setJournals(journals);
      } catch (error) {
        setFetchJournalsError(error as Error);
      } finally {
        setIsLoadingJournals(false);
      }
    }
    getJournals().then();
  }, []);

  return (
    <StyledLineWrapper>
      <StyledLineLabelTypography htmlFor="cristindata-journal">Tidskrift</StyledLineLabelTypography>
      <StyledLineImportValue>
        <Typography data-testid="importdata-journal">{importPublication.channel?.title}</Typography>
      </StyledLineImportValue>
      <ActionButtons
        isImportAndCristinEqual={
          values.journal.cristinTidsskriftNr === importPublication.channel?.cristinTidsskriftNr?.toString()
        }
        isCopyBottonDisabled={!importPublication.channel?.title}
        copyCommand={() =>
          setFieldValue(
            'journal',
            {
              cristinTidsskriftNr: importPublication.channel?.cristinTidsskriftNr?.toString(),
              title: importPublication.channel?.title,
              issn: importPublication.channel?.issn,
              eissn: importPublication.channel?.eissn,
            },
            true
          )
        }
      />
      <StyledLineCristinValue>
        <Field name="journal">
          {({ field }: FieldProps) => (
            <Autocomplete
              fullWidth
              {...field}
              id="cristindata-journal"
              autoHighlight
              loading={isLoadingJournals}
              noOptionsText="ingen tidskrift funnet"
              data-testid="cristindata-journal-select"
              options={journals ?? []}
              //TODO- search!  onInputChange={searchJournals} //hva med en wait ?
              getOptionLabel={(option) => option.title}
              getOptionSelected={(option, value) => option.cristinTidsskriftNr === value.cristinTidsskriftNr}
              onChange={(e, value: JournalType) => value && setFieldValue('journal', value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  data-testid="cristindata-journal-select-textfield"
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {isLoadingJournals && <CircularProgress color="inherit" size={'1rem'} />}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          )}
        </Field>
        {fetchJournalsError && (
          <Typography color="error">Kunne ikke laste inn tidskrift. {fetchJournalsError.message}</Typography>
        )}
        <CreateJournalPanel handleCreateJournal={handleNewJournal} />
      </StyledLineCristinValue>
    </StyledLineWrapper>
  );
};

export default CompareFormJournal;

//             {selectedJournal.label === 'Ingen tidsskrift funnet' && (
//                 <StyledErrorMessage>
//                     <CommonErrorMessage
//                         datatestid="journal-missing-error"
//                         errorMessage="Tidsskrift mangler"
//                     />
//                 </StyledErrorMessage>
//             )}
