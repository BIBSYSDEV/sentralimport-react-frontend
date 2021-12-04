import { TextField, Typography } from '@material-ui/core';
import ActionButtons from './ActionButtons';
import { ErrorMessage, Field, FieldProps, useFormikContext } from 'formik';
import React, { FC } from 'react';
import {
  StyledLineCristinValue,
  StyledLineImportValue,
  StyledLineLabelTypography,
  StyledLineWrapper,
} from './CompareFormWrappers';
import { CompareFormValuesType } from './CompareFormTypes';
import { ImportPublication } from '../../types/PublicationTypes';

interface CompareFormVolumeProps {
  importPublication: ImportPublication;
}

const CompareFormVolume: FC<CompareFormVolumeProps> = ({ importPublication }) => {
  const { values, setFieldValue } = useFormikContext<CompareFormValuesType>();

  return (
    <StyledLineWrapper>
      <StyledLineLabelTypography htmlFor="cristindata-volume">Volum</StyledLineLabelTypography>
      <StyledLineImportValue>
        <Typography data-testid="importdata-volume">{importPublication.channel?.volume}</Typography>
      </StyledLineImportValue>
      <ActionButtons
        isImportAndCristinEqual={values.volume === importPublication.channel?.volume}
        isCopyBottonDisabled={!importPublication.channel?.volume}
        copyCommand={() => setFieldValue('volume', importPublication.channel?.volume ?? '', true)}
      />
      <StyledLineCristinValue>
        <Field name="volume">
          {({ field, meta: { error } }: FieldProps) => (
            <TextField
              {...field}
              id="cristindata-volume"
              name="volume"
              placeholder="Volum"
              data-testid="cristindata-volume-textfield"
              inputProps={{ 'data-testid': 'cristindata-volume-textfield-input' }}
              required
              fullWidth
              error={!!error}
              helperText={<ErrorMessage name={field.name} />}
            />
          )}
        </Field>
      </StyledLineCristinValue>
    </StyledLineWrapper>
  );
};

export default CompareFormVolume;
