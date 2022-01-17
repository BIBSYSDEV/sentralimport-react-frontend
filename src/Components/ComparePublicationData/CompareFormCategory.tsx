import { FormHelperText, TextField, Typography } from '@material-ui/core';
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
import { isLegalCategory, LegalCategoryOptions } from '../../utils/categoryUtils';

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
        {!isLegalCategory(importPublication.category) && (
          <Typography color="error" variant="caption" data-testid="import-category-error">
            Kategorien er ikke en gyldig cristin-kategori
          </Typography>
        )}
      </StyledLineImportValue>
      <ActionButtons
        isImportAndCristinEqual={values.category.label === importPublication.categoryName}
        isCopyBottonDisabled={!importPublication.categoryName || !isLegalCategory(importPublication.category)}
        copyCommand={() =>
          setFieldValue('category', { value: importPublication.category, label: importPublication.categoryName }, true)
        }
        dataTestid={'compare-form-category-action'}
      />
      <StyledLineCristinValue>
        <Field name="category">
          {({ field, meta: { error } }: FieldProps) => (
            <>
              <Autocomplete
                fullWidth
                {...field}
                id="cristindata-category"
                autoHighlight
                data-testid="cristindata-category-select"
                options={LegalCategoryOptions}
                getOptionLabel={(option) => option.label}
                getOptionSelected={(option, value) => option.value === value.value}
                onChange={(e, value: CompareFormCategoryOption) => {
                  value && setFieldValue('category', value);
                }}
                renderInput={(params) => (
                  <TextField {...params} data-testid="cristindata-category-select-textfield" variant="outlined" />
                )}
              />
              {error && (
                <FormHelperText data-testid="cristindata-category-field-error" error>
                  Kategori er et obligatorisk felt
                </FormHelperText>
              )}
            </>
          )}
        </Field>
      </StyledLineCristinValue>
    </StyledLineWrapper>
  );
};

export default CompareFormCategory;
