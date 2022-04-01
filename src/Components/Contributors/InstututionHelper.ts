import { Affiliation, ImportPublicationPersonInstutution } from '../../types/InstitutionTypes';
import {
  getCountryInformationByCountryCode,
  getInstitutionName,
  getInstitutionNameWithCache,
  searchForInstitutionsByNameAndCountry,
} from '../../api/institutionApi';
import { SearchLanguage } from '../../api/contributorApi';
import { ContributorType } from '../../types/ContributorTypes';
import clone from 'just-clone';

const Foreign_educational_institution_generic_code = '9127';
const Other_institutions_generic_code = '9126';

const countriesApiResultCache: any = {};
const institutionNameCache = new Map<string, Affiliation | null>();

export function removeInstitutionsDuplicatesBasedOnCristinId(affiliations: Affiliation[]) {
  const cristinIdSet = new Set();
  return affiliations.filter((affiliation: Affiliation) => {
    if (cristinIdSet.has(affiliation.cristinInstitutionNr)) return false;
    cristinIdSet.add(affiliation.cristinInstitutionNr);
    return true;
  });
}
export const isCristinInstitution = (cristinInstitutionNr: string | undefined) => {
  cristinInstitutionNr = '' + cristinInstitutionNr; //cristinInstitutionNr from pia is a number
  return (
    cristinInstitutionNr !== Foreign_educational_institution_generic_code &&
    cristinInstitutionNr !== Other_institutions_generic_code &&
    cristinInstitutionNr !== '0' &&
    cristinInstitutionNr !== ''
  );
};

export function removeUnknownInstitutionIfAnInstitutionFromSameCountryExists(
  affiliations: Affiliation[]
): Affiliation[] {
  const countryCodeSet = new Set();
  const unknownInstitutionsIndexes = new Set();
  affiliations.forEach((affiliation, affiliationIndex) => {
    if (
      affiliation.institutionName &&
      !affiliation.institutionName.includes('(Ukjent institusjon)') &&
      affiliation.countryCode
    ) {
      countryCodeSet.add(affiliation.countryCode);
    } else {
      unknownInstitutionsIndexes.add(affiliationIndex);
    }
  });
  return affiliations.filter((affiliation, affiliationIndex) => {
    return !(unknownInstitutionsIndexes.has(affiliationIndex) && countryCodeSet.has(affiliation.countryCode));
  });
}

export async function replaceNonCristinInstitutions(
  affiliations: Affiliation[] | ImportPublicationPersonInstutution[] | undefined
): Promise<Affiliation[]> {
  const affiliationPromises: Promise<Affiliation | null>[] = [];
  affiliations?.forEach((affiliation) => {
    affiliationPromises.push(replaceNonCristinInstitution(affiliation));
  });
  const affiliationResult = await Promise.all(affiliationPromises);
  return removeUnknownInstitutionIfAnInstitutionFromSameCountryExists(
    affiliationResult.filter((affiliation): affiliation is Affiliation => affiliation !== null)
  );
}

async function getCountryInformationByCountryCodeWithCache(countryCode: string): Promise<Affiliation | null> {
  if (countriesApiResultCache[countryCode]) {
    return countriesApiResultCache[countryCode];
  } else {
    const institutionCountryInformation = (await getCountryInformationByCountryCode(countryCode, SearchLanguage.En))
      .data;
    if (institutionCountryInformation.length > 0) {
      const newAffiliation = {
        cristinInstitutionNr: institutionCountryInformation[0].cristin_institution_id,
        institutionName:
          (institutionCountryInformation[0].institution_name.en ||
            institutionCountryInformation[0].institution_name.nb) + ' (Ukjent institusjon)',
        countryCode: institutionCountryInformation[0].country,
        isCristinInstitution: institutionCountryInformation[0].cristin_user_institution,
      };
      countriesApiResultCache[countryCode] = newAffiliation;
      return newAffiliation;
    }
  }
  return null;
}

async function attemptGettingInstitutionByName(affiliation: Affiliation): Promise<Affiliation | null> {
  if (affiliation.institutionName) {
    const guessedByNameFromCristinAffiliations = await searchForInstitutionsByNameAndCountry(
      affiliation.institutionName,
      SearchLanguage.En,
      affiliation.countryCode ?? ''
    );
    const foundOnlyOneMatch = guessedByNameFromCristinAffiliations.data.length === 1;
    if (foundOnlyOneMatch) {
      const institution = guessedByNameFromCristinAffiliations.data[0];
      return {
        cristinInstitutionNr: institution.cristin_institution_id,
        institutionName: institution.institution_name.en ?? institution.institution_name.nb,
        countryCode: institution.country,
        isCristinInstitution: institution.cristin_user_institution,
      };
    }
  }
  return null;
}

async function attemptGettingInstitutionByNameAndCacheResult(affiliation: Affiliation): Promise<Affiliation | null> {
  if (affiliation.institutionName && institutionNameCache.has(affiliation.institutionName)) {
    return institutionNameCache.get(affiliation.institutionName) ?? null;
  } else if (affiliation.institutionName) {
    const newAffiliation = await attemptGettingInstitutionByName(affiliation);
    institutionNameCache.set(affiliation.institutionName, newAffiliation);
    return newAffiliation;
  }
  return null;
}

export async function replaceNonCristinInstitution(affiliation: Affiliation): Promise<Affiliation | null> {
  if (!isCristinInstitution(affiliation.cristinInstitutionNr) && affiliation.countryCode) {
    return (
      (await attemptGettingInstitutionByNameAndCacheResult(affiliation)) ??
      (await getCountryInformationByCountryCodeWithCache(affiliation.countryCode))
    );
  } else if (affiliation.cristinInstitutionNr?.toString() !== '0') {
    const clonedAffiliation = clone(affiliation);
    clonedAffiliation.institutionName = await getInstitutionName(affiliation.cristinInstitutionNr, SearchLanguage.En);
    return clonedAffiliation;
  }
  return null;
}

export async function getDuplicateAffiliations(author: ContributorType) {
  let institutionNameCache = new Map();
  const affiliations: Affiliation[] = [];
  if (author.affiliations) {
    for (let i = 0; i < author.affiliations.length; i++) {
      const index: number = affiliations.findIndex((id) => {
        return (
          author.affiliations && id.cristinInstitutionNr === author.affiliations[i].institution?.cristin_institution_id
        );
      });
      if (index >= 0 && i !== index) {
        if (!affiliations[index].units) affiliations[index].units = [];
        affiliations[index].units?.push({
          unitNr: author.affiliations[i].unit?.cristin_unit_id ?? '',
          unitName: author.affiliations[i].unit?.unit_name?.nb ?? '',
        });
      } else {
        const institutionNameAndCache = await getInstitutionNameWithCache(
          author.affiliations[i].institution?.cristin_institution_id,
          SearchLanguage.En,
          institutionNameCache
        );
        institutionNameCache = institutionNameAndCache.cachedInstitutionResult;

        const temptemp: Affiliation = {
          cristinInstitutionNr: author.affiliations[i].institution?.cristin_institution_id,
          institutionName: institutionNameAndCache.institutionName,
          isCristinInstitution: author.affiliations[i].institution?.isCristinInstitution,
        };
        const unit = author.affiliations[i].unit;
        if (unit)
          temptemp.units = [
            {
              unitNr: unit.cristin_unit_id ?? '',
              unitName: unit.unit_name?.nb ?? '',
            },
          ];
        affiliations.push(temptemp);
      }
    }
  }
  return affiliations;
}
