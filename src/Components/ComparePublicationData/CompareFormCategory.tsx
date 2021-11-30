import { MenuItem, TextField, Typography } from '@material-ui/core';
import ActionButtons from './ActionButtons';
import { ErrorMessage, Field, FieldProps, useFormikContext } from 'formik';
import React, { FC } from 'react';
import {
  StyledLineCristinValue,
  StyledLineImportValue,
  StyledLineLabelTypography,
  StyledLineWrapper,
} from './CompareFormWrappers';
import { CategoryOption, compareFormValuesType } from './ComparePublicationDataModal';
import { ImportPublication } from '../../types/PublicationTypes';
//import Select from 'react-select';

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
        <Field name="title">
          {({ field, meta: { error } }: FieldProps) => (
            <TextField
              {...field}
              id="cristindata-category"
              name="category"
              placeholder="Kategori"
              data-testid="cristindata-category-textfield"
              inputProps={{ 'data-testid': 'cristindata-category-textfield-input' }}
              fullWidth
              select
              variant="outlined"
              value={field.value}
              error={!!error}
              helperText={<ErrorMessage name={field.name} />}>
              {categories?.map((category: CategoryOption) => (
                <MenuItem value={category.value}>{category.label}</MenuItem>
              ))}
            </TextField>
          )}
        </Field>

        {/*//TODO: material /}
        {/*<Select*/}
        {/*  aria-label="Kategori"*/}
        {/*  placeholder="Søk på kategori"*/}
        {/*  name="categorySelect"*/}
        {/*  options={categories}*/}
        {/*  value={selectedCategory}*/}
        {/*  className="basic-select"*/}
        {/*  classNamePrefix="select"*/}
        {/*  onChange={handleChangeCategory}*/}
        {/*/>*/}
      </StyledLineCristinValue>
    </StyledLineWrapper>
  );
};

export default CompareFormCategory;
