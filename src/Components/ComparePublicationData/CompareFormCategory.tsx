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
import { CategoryOption, compareFormValuesType } from './ComparePublicationDataModal';
import { ImportPublication } from '../../types/PublicationTypes';
import { Autocomplete } from '@material-ui/lab';

interface CompareFormCategoryProps {
  importPublication: ImportPublication;
  categories?: CategoryOption[];
}

const CompareFormCategory: FC<CompareFormCategoryProps> = ({ importPublication, categories }) => {
  const { values, setFieldValue } = useFormikContext<compareFormValuesType>();

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
      />
      <StyledLineCristinValue data-testid="cristindata-category-select">
        <Field name="category">
          {({ field }: FieldProps) => (
            <Autocomplete
              //TODO: select isteden ?
              fullWidth
              {...field}
              id="cristindata-category"
              autoHighlight
              noOptionsText="ingen kategorier funnet"
              data-testid="cristindata-category-select"
              options={categories ?? []}
              getOptionLabel={(option) => option.label}
              getOptionSelected={(option, value) => option.value === value.value}
              onChange={(e, value: CategoryOption) => value && setFieldValue('category', value)}
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
