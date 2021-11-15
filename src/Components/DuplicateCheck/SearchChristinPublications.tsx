import axios from 'axios';
import { CRIST_REST_API } from '../../utils/constants';
import { CristinPublication } from '../../types/PublicationTypes';

async function getCristinPublicationsBySearchTerm(searchTerms: string) {
  const response: any = await axios.get(
    CRIST_REST_API + '/results' + searchTerms + '&fields=all&lang=nb',
    JSON.parse(localStorage.getItem('config') || '{}')
  );
  return response;
}

async function getCristinAuthorsByPublicationId(cristinId: string) {
  const response = await axios.get(
    CRIST_REST_API + '/results/' + cristinId + '/contributors?per_page=10&lang=nb',
    JSON.parse(localStorage.getItem('config') || '{}')
  );
  return response;
}

export async function searchChristinPublications(searchTerms: string) {
  //TODO: flytt ut api-kall til api
  const response = await getCristinPublicationsBySearchTerm(searchTerms);
  const cristinPublications: CristinPublication[] = response.data;
  for (let i = 0; i < cristinPublications.length; i++) {
    const response = await getCristinAuthorsByPublicationId(cristinPublications[i].cristin_result_id);
    cristinPublications[i].authors = response.data;
    cristinPublications[i].authorTotalCount = response.headers['x-total-count'];
  }

  return cristinPublications;
}
