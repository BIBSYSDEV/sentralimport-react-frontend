import { CristinPublication } from '../../types/PublicationTypes';
import { getCristinAuthorsByPublicationId, getCristinPublicationsBySearchTerm } from '../../api/publicationApi';

export async function searchChristinPublications(searchTerms: string) {
  const response = await getCristinPublicationsBySearchTerm(searchTerms);
  const cristinPublications: CristinPublication[] = response.data;
  for (let i = 0; i < cristinPublications.length; i++) {
    const response = await getCristinAuthorsByPublicationId(cristinPublications[i].cristin_result_id);
    cristinPublications[i].authors = response.data;
    cristinPublications[i].authorTotalCount = response.headers['x-total-count'];
  }

  return cristinPublications;
}
