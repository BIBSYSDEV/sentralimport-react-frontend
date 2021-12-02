import {
  getInstitutionName,
  getInstitutionUnitNameBasedOnIDAndInstitutionStatus,
  SearchLanguage,
} from '../api/contributorApi';
import { Affiliation } from '../types/InstitutionTypes';

export async function getAffiliationDetails(
  affiliation: Affiliation | undefined,
  unitNameCache: Map<string, string>,
  institutionNameCache: Map<string, string>
): Promise<{
  institutionNameCache: Map<string, string>;
  unitNameCache: Map<string, string>;
  affiliation: Affiliation | undefined;
}> {
  if (affiliation) {
    const institutionNameAndCache = await getInstitutionName(
      affiliation.institution?.cristin_institution_id,
      SearchLanguage.En,
      institutionNameCache
    );
    institutionNameCache = institutionNameAndCache.cachedInstitutionResult;
    const unitNameAndCache = await getInstitutionUnitNameBasedOnIDAndInstitutionStatus(affiliation, unitNameCache);
    unitNameCache = unitNameAndCache.cache;
    return {
      unitNameCache: unitNameCache,
      institutionNameCache: institutionNameCache,
      affiliation: {
        institutionName: institutionNameAndCache.institutionName,
        cristinInstitutionNr: affiliation.institution?.cristin_institution_id,
        isCristinInstitution: true,
        units: [
          {
            unitName: unitNameAndCache.unitName,
            unitNr: affiliation.unit ? affiliation.unit?.cristin_unit_id : '',
          },
        ],
      },
    };
  } else {
    return { unitNameCache: unitNameCache, institutionNameCache: institutionNameCache, affiliation: undefined };
  }
}
