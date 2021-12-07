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
import { CategoryItem, ImportPublication } from '../../types/PublicationTypes';
import { Autocomplete } from '@material-ui/lab';
import { getCategories } from '../../api/publicationApi';
import { SearchLanguage } from '../../api/contributorApi';
import { CompareFormCategoryOption, CompareFormValuesType } from './CompareFormTypes';

interface CompareFormCategoryProps {
  importPublication: ImportPublication;
}

const CompareFormCategory: FC<CompareFormCategoryProps> = ({ importPublication }) => {
  const { values, setFieldValue } = useFormikContext<CompareFormValuesType>();
  const [categories, setCategories] = useState<CompareFormCategoryOption[]>();
  const [fetchCategoriesError, setFetchCategoriesError] = useState<Error | undefined>();
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  useEffect(() => {
    async function getCategoriesAndReformatToReactSelect() {
      try {
        setIsLoadingCategories(true);
        setFetchCategoriesError(undefined);
        const categoriesResponse = await getCategories(SearchLanguage.Nb);
        setCategories(
          categoriesResponse.data.map((category: CategoryItem) => ({
            value: category.code,
            label: category.name?.nb ?? '',
          }))
        );
      } catch (error) {
        setFetchCategoriesError(error as Error);
      } finally {
        setIsLoadingCategories(false);
      }
    }
    getCategoriesAndReformatToReactSelect().then();
  }, []);

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
              fullWidth
              {...field}
              id="cristindata-category"
              autoHighlight
              loading={isLoadingCategories}
              noOptionsText="ingen kategorier funnet"
              data-testid="cristindata-category-select"
              options={categories ?? []}
              getOptionLabel={(option) => option.label}
              getOptionSelected={(option, value) => option.value === value.value}
              onChange={(e, value: CompareFormCategoryOption) => value && setFieldValue('category', value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  data-testid="cristindata-category-select-textfield"
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {isLoadingCategories && <CircularProgress color="inherit" size={'1rem'} />}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          )}
        </Field>
        {fetchCategoriesError && (
          <Typography color="error">Kunne ikke laste inn kategorier. {fetchCategoriesError.message}</Typography>
        )}
      </StyledLineCristinValue>
    </StyledLineWrapper>
  );
};

export default CompareFormCategory;
