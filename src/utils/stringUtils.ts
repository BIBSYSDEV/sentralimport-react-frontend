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

//Following this DOI specification: https://www.doi.org/doi_handbook/2_Numbering.html
export const DOI_REGEX = /^$|^(10)[.](.+)[/](.+)/i;
