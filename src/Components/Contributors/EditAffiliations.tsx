import React, { FC, useState } from 'react';
import { Affiliation, SimpleUnitResponse } from '../../types/InstitutionTypes';
import AffiliationDisplay from './AffiliationDisplay';
import { Colors } from '../../assets/styles/StyleConstants';
import { ContributorWrapper } from '../../types/ContributorTypes';
import styled from 'styled-components';

const StyledInstitutionList = styled.div`
  margin-top: 1rem;
`;

interface EditAffiliationsProps {
  contributorData: ContributorWrapper;
  resultListIndex: number;
  updateContributor: (contributorData: ContributorWrapper, rowIndex: number) => void;
}

const EditAffiliations: FC<EditAffiliationsProps> = ({ contributorData, updateContributor, resultListIndex }) => {
  const [addUnitError, setAddUnitError] = useState<{ institutionNr: string; message: string } | undefined>();
  const [deleteUnitError, setDeleteUnitError] = useState<{ institutionNr: string; message: string } | undefined>();

  function addUnitToInstitution(newUnit: SimpleUnitResponse, institutionNr: string) {
    const affiliationIndex = contributorData.toBeCreated.affiliations
      ? contributorData.toBeCreated.affiliations.findIndex(
          (affiliation) => affiliation.cristinInstitutionNr === institutionNr
        )
      : -1;
    if (contributorData.toBeCreated.affiliations && contributorData.toBeCreated.affiliations[affiliationIndex]) {
      const newUnitMassaged = {
        unitName: newUnit.unit_name.en ?? newUnit.unit_name.nb,
        unitNr: newUnit.cristin_unit_id ?? '',
      };
      if (
        contributorData.toBeCreated.affiliations[affiliationIndex].units?.some(
          (existingUnit) => existingUnit.unitNr === newUnit.cristin_unit_id
        )
      ) {
        throw new Error(`Enhet eksisterer allerede, enhet : ${newUnit.unit_name.en ?? newUnit.unit_name.nb}`);
      }
      contributorData.toBeCreated.affiliations[affiliationIndex].units
        ? contributorData.toBeCreated.affiliations[affiliationIndex].units?.push(newUnitMassaged)
        : (contributorData.toBeCreated.affiliations[affiliationIndex].units = [newUnitMassaged]);
      updateContributor(contributorData, resultListIndex);
    } else {
      throw new Error(`Fant ikke institusjon med institusjons nummer: ${institutionNr}`);
    }
  }

  function addUnitToInstitutionAndHandleError(newUnit: SimpleUnitResponse, institutionNr: string) {
    try {
      setAddUnitError(undefined);
      addUnitToInstitution(newUnit, institutionNr);
    } catch (error) {
      if (error instanceof Error) {
        setAddUnitError({ institutionNr: institutionNr, message: error.message });
      }
    }
  }

  function deleteUnitToInstitution(unitToBeDeleted: SimpleUnitResponse, institutionNr: string) {
    const affiliationIndex = contributorData.toBeCreated.affiliations
      ? contributorData.toBeCreated.affiliations.findIndex(
          (affiliation) => affiliation.cristinInstitutionNr === institutionNr
        )
      : -1;
    if (contributorData.toBeCreated.affiliations && contributorData.toBeCreated.affiliations[affiliationIndex]) {
      const unitIndex =
        contributorData.toBeCreated.affiliations[affiliationIndex].units?.findIndex(
          (existingUnit) => existingUnit.unitNr === unitToBeDeleted.cristin_unit_id
        ) ?? -1;
      if (unitIndex < 0) {
        throw new Error('Fant ikke enhet');
      } else {
        contributorData.toBeCreated.affiliations[affiliationIndex].units?.splice(unitIndex, 1);
        updateContributor(contributorData, resultListIndex);
      }
    } else {
      throw new Error(`Fant ikke institusjon med institusjons nummer: ${institutionNr}`);
    }
  }

  function deleteUnitToInstitutionAndHandleError(unitToBeDeleted: SimpleUnitResponse, institutionNr: string) {
    try {
      setDeleteUnitError(undefined);
      deleteUnitToInstitution(unitToBeDeleted, institutionNr);
    } catch (error) {
      if (error instanceof Error) {
        setDeleteUnitError({ institutionNr: institutionNr, message: error.message });
      }
    }
  }

  function removeInstitutionByCristinNrOrName(cristinInstitutionNr: string | undefined, institutionName: string) {
    if (contributorData.toBeCreated.affiliations) {
      const temp = contributorData;
      if (cristinInstitutionNr) {
        temp.toBeCreated.affiliations = [...contributorData.toBeCreated.affiliations].filter(
          (affiliation) => affiliation.cristinInstitutionNr !== cristinInstitutionNr
        );
      } else {
        temp.toBeCreated.affiliations = [...contributorData.toBeCreated.affiliations].filter(
          (affiliation) => affiliation.institutionName !== institutionName
        );
      }
      updateContributor(temp, resultListIndex);
    }
  }

  return (
    <StyledInstitutionList>
      {contributorData.toBeCreated.affiliations
        ?.filter(
          (item: Affiliation, number: number) => contributorData.toBeCreated.affiliations?.indexOf(item) === number
        )
        .map((affiliation) => (
          <AffiliationDisplay
            affiliation={{
              institutionName: affiliation.institutionName ?? '',
              units: affiliation.units
                ? affiliation.units.map((unit) => ({
                    cristin_unit_id: unit.unitNr,
                    unit_name: { nb: unit.unitName },
                  }))
                : [],
              countryCode: affiliation.countryCode ?? '',
              cristinInstitutionNr: affiliation.cristinInstitutionNr,
            }}
            dataTestid={`list-item-author-${contributorData.toBeCreated.surname}-affiliations-${affiliation.cristinInstitutionNr}`}
            backgroundcolor={Colors.LIGHT_GREY}
            handleAddUnitClick={
              affiliation.isCristinInstitution === true
                ? (unit) => {
                    addUnitToInstitutionAndHandleError(unit, affiliation.cristinInstitutionNr ?? '');
                  }
                : undefined
            }
            handleDeleteUnitClick={(unit) => {
              deleteUnitToInstitutionAndHandleError(unit, affiliation.cristinInstitutionNr ?? '');
            }}
            handleDeleteAffiliationClick={() =>
              removeInstitutionByCristinNrOrName(affiliation.cristinInstitutionNr, affiliation.institutionName ?? '')
            }
            addUnitError={
              addUnitError && addUnitError.institutionNr === affiliation.cristinInstitutionNr
                ? addUnitError.message
                : undefined
            }
            deleteUnitError={
              deleteUnitError && deleteUnitError.institutionNr === affiliation.cristinInstitutionNr
                ? deleteUnitError.message
                : undefined
            }
          />
        ))}
    </StyledInstitutionList>
  );
};

export default EditAffiliations;
