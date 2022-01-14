import { FormHelperText, MenuItem, TextField, Typography } from '@material-ui/core';
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
import Categories from '../../utils/categories.json';

interface CompareFormCategoryProps {
  importPublication: ImportPublication;
}

export const noCategorySelectElement = { value: '', label: 'Ingen kategori valgt' };

Categories.unshift(noCategorySelectElement);

const CompareFormCategory: FC<CompareFormCategoryProps> = ({ importPublication }) => {
  const { values, setFieldValue } = useFormikContext<CompareFormValuesType>();

  const isLegalCategory = (categoryCode: string) =>
    !!Categories.find((category: CompareFormCategoryOption) => category.value === categoryCode);

  return (
    <StyledLineWrapper>
      <StyledLineLabelTypography htmlFor="cristindata-category">Kategori</StyledLineLabelTypography>
      <StyledLineImportValue>
        <Typography data-testid="importdata-category">{importPublication.categoryName}</Typography>
      </StyledLineImportValue>
      <ActionButtons
        isImportAndCristinEqual={values.category.label === importPublication.categoryName}
        isCopyBottonDisabled={!importPublication.categoryName || !isLegalCategory(importPublication.category)}
        copyCommand={() =>
          setFieldValue('category', { value: importPublication.category, label: importPublication.categoryName }, true)
        }
        dataTestid={'compare-form-category-action'}
      />
      <StyledLineCristinValue data-testid="cristindata-category-select">
        PCB:{values.category.label} ({values.category.value})
        <Field name="category">
          {({ field, meta: { error } }: FieldProps) => (
            <>
              <Autocomplete
                fullWidth
                {...field}
                id="cristindata-category"
                autoHighlight
                data-testid="cristindata-category-select"
                options={Categories}
                getOptionLabel={(option) => option.label}
                getOptionSelected={(option, value) => {
                  return option.value === value.value;
                }}
                onChange={(e, value: CompareFormCategoryOption) => {
                  value && setFieldValue('category', value);
                }}
                renderInput={(params) => (
                  <TextField {...params} data-testid="cristindata-category-select-textfield" variant="outlined" />
                )}
              />
              {error && <FormHelperText error>hepp</FormHelperText>}
            </>
          )}
        </Field>
      </StyledLineCristinValue>
    </StyledLineWrapper>
  );
};

export default CompareFormCategory;
