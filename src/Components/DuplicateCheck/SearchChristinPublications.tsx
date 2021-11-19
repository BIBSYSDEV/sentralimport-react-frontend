import { CristinPublication } from '../../types/PublicationTypes';
import { getCristinPublicationsBySearchTerm } from '../../api/publicationApi';
import { getContributorsByPublicationCristinResultId, SearchLanguage } from '../../api/contributorApi';

export async function searchChristinPublications(searchTerms: string) {
  const response = await getCristinPublicationsBySearchTerm(searchTerms);
  const cristinPublications: CristinPublication[] = response.data;
  for (let i = 0; i < cristinPublications.length; i++) {
    const response = await getContributorsByPublicationCristinResultId(
      cristinPublications[i].cristin_result_id,
      1,
      10,
      SearchLanguage.Nb
    );
    cristinPublications[i].authors = response.data;
    cristinPublications[i].authorTotalCount = response.headers['x-total-count'];
  }

  return cristinPublications;
}
