export function parseTitle(title: string) {
  let cleanTitle = title;
  while (cleanTitle.indexOf('&lt;') !== -1) {
    cleanTitle = cleanTitle.replace('&lt;', '<');
    cleanTitle = cleanTitle.replace('&gt;', '>');
  }

  if (cleanTitle.indexOf('<inf>') || cleanTitle.indexOf('</inf>')) {
    cleanTitle = cleanTitle.replace('<inf>', '<sub>');
    cleanTitle = cleanTitle.replace('</inf>', '</sub>');
  }

  return cleanTitle;
}
