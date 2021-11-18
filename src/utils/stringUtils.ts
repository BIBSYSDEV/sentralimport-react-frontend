export function cleanTitleForMarkup(title: string) {
  while (title.indexOf('&lt;') !== -1) {
    title = title.replace('&lt;', '<');
    title = title.replace('&gt;', '>');
  }
  if (title.indexOf('<inf>') || title.indexOf('</inf>')) {
    title = title.replace('<inf>', '<sub>');
    title = title.replace('</inf>', '</sub>');
  }
  return title;
}
