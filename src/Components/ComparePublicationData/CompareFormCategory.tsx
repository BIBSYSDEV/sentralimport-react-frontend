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
import Categories from '../../utils/categories.json';

interface CompareFormCategoryProps {
  importPublication: ImportPublication;
}

const CompareFormCategory: FC<CompareFormCategoryProps> = ({ importPublication }) => {
  const { values, setFieldValue } = useFormikContext<CompareFormValuesType>();

  const isLegalCategory = (categoryCode: string) =>
    !!Categories.find((category: CompareFormCategoryOption) => category.value === categoryCode);

  return (
    <StyledLineWrapper>
      <StyledLineLabelTypography htmlFor="cristindata-category">Kategori</StyledLineLabelTypography>
      <StyledLineImportValue>
        <Typography data-testid="importdata-category">{importPublication.categoryName}</Typography>
        {!isLegalCategory(importPublication.category) && (
          <Typography color="error" variant="caption">
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
      <StyledLineCristinValue data-testid="cristindata-category-select">
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
                getOptionSelected={(option, value) => option.value === value.value}
                onChange={(e, value: CompareFormCategoryOption) => {
                  value && setFieldValue('category', value);
                }}
                renderInput={(params) => (
                  <TextField {...params} data-testid="cristindata-category-select-textfield" variant="outlined" />
                )}
              />
              {error && <FormHelperText error>Kategori er et obligatorisk felt</FormHelperText>}
            </>
          )}
        </Field>
      </StyledLineCristinValue>
    </StyledLineWrapper>
  );
};

export default CompareFormCategory;
