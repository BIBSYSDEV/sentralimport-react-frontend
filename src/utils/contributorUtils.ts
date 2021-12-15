import {
  getInstitutionName,
  getInstitutionUnitNameBasedOnIDAndInstitutionStatus,
  SearchLanguage,
} from '../api/contributorApi';
import { Affiliation } from '../types/InstitutionTypes';
import { BadgeType } from '../types/ContributorTypes';

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

//This is hacky and should have been done at backend instead of being calculated on frontend
export const getBadgeForContributor = (
  activeAffiliations: Affiliation[] | undefined,
  require_higher_authorization: boolean | undefined,
  identified_cristin_person: boolean | undefined,
  cristin_person_id: number | undefined
) => {
  if (activeAffiliations && activeAffiliations.length > 0 && identified_cristin_person) {
    return BadgeType.Verified;
  } else if (require_higher_authorization) {
    return BadgeType.Unknown;
  } else if (cristin_person_id && cristin_person_id !== 0) {
    return BadgeType.NotVerified;
  } else {
    return BadgeType.None;
  }
};
