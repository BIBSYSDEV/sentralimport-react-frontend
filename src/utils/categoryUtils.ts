import Categories from './categories.json';
import { ImportPublication } from '../types/PublicationTypes';
import { CompareFormCategoryOption } from '../Components/ComparePublicationData/CompareFormTypes';

export const emptyCategoryOption: CompareFormCategoryOption = { value: '', label: 'Ingen kategori valgt' };

export const LegalCategoryOptions: CompareFormCategoryOption[] = [emptyCategoryOption].concat(Categories);

export const findLegalCategory = (importPublication: ImportPublication): CompareFormCategoryOption => {
  return (
    Categories.find((category: CompareFormCategoryOption) => category.value === importPublication.category) ??
    emptyCategoryOption
  );
};

export const isLegalCategory = (categoryCode: string) =>
  !!Categories.find((category: CompareFormCategoryOption) => category.value === categoryCode);
