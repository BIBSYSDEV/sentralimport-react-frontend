import { TextField, Typography } from '@material-ui/core';
import ActionButtons from './ActionButtons';
import { Field, FieldProps, useFormikContext } from 'formik';
import React, { FC } from 'react';
import {
  StyledLineCristinValue,
  StyledLineImportValue,
  StyledLineLabelTypography,
  StyledLineWrapper,
} from './CompareFormWrappers';
import { ImportPublication } from '../../types/PublicationTypes';
import { Autocomplete } from '@material-ui/lab';
import { CompareFormCategoryOption, CompareFormValuesType } from './CompareFormTypes';
import categories from '../../utils/categories.json';

interface CompareFormCategoryProps {
  importPublication: ImportPublication;
}

const CompareFormCategory: FC<CompareFormCategoryProps> = ({ importPublication }) => {
  const { values, setFieldValue } = useFormikContext<CompareFormValuesType>();

  return (
    <StyledLineWrapper>
      <StyledLineLabelTypography htmlFor="cristindata-category">Kategori</StyledLineLabelTypography>
      <StyledLineImportValue>
        <Typography data-testid="importdata-category">{importPublication.categoryName}</Typography>
      </StyledLineImportValue>
      <ActionButtons
        isImportAndCristinEqual={values.category.label === importPublication.categoryName}
        isCopyBottonDisabled={!importPublication.categoryName}
        copyCommand={() =>
          setFieldValue('category', { value: importPublication.category, label: importPublication.categoryName }, true)
        }
        dataTestid={'compare-form-category-action'}
      />
      <StyledLineCristinValue data-testid="cristindata-category-select">
        <Field name="category">
          {({ field }: FieldProps) => (
            <Autocomplete
              fullWidth
              {...field}
              id="cristindata-category"
              autoHighlight
              data-testid="cristindata-category-select"
              options={categories}
              getOptionLabel={(option) => option.label}
              getOptionSelected={(option, value) => option.value === value.value}
              onChange={(e, value: CompareFormCategoryOption) => value && setFieldValue('category', value)}
              renderInput={(params) => (
                <TextField {...params} data-testid="cristindata-category-select-textfield" variant="outlined" />
              )}
            />
          )}
        </Field>
      </StyledLineCristinValue>
    </StyledLineWrapper>
  );
};

export default CompareFormCategory;
