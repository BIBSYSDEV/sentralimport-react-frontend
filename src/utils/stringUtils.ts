import { format } from 'date-fns';
import countries from 'i18n-iso-countries';
import en_countries_locale from 'i18n-iso-countries/langs/en.json';

countries.registerLocale(en_countries_locale);

export function cleanTitleForMarkup(title: string | undefined) {
  if (title) {
    while (title.indexOf('&lt;') !== -1) {
      title = title.replace('&lt;', '<');
      title = title.replace('&gt;', '>');
    }
    if (title.indexOf('<inf>') || title.indexOf('</inf>')) {
      title = title.replace('<inf>', '<sub>');
      title = title.replace('</inf>', '</sub>');
    }
  }
  return title;
}

export const NoDatePlaceHolder = '-';
export function formatCristinCreatedDate(dateString: string) {
  return format(new Date(dateString.substring(0, 10)), 'LLL dd, yyyy');
}

export const DoiFormat = /^$|^(10)[.](.+)[/](.+)/i; //Following this DOI specification: https://www.doi.org/doi_handbook/2_Numbering.html
export const IssnFormat = /^[0-9]{4}-[0-9]{3}[0-9xX]$/g;

export const convertIso3166ToCountryString = (countryCode: string): string => {
  return countries.getName(countryCode, en_countries_locale.locale) ?? '';
};
