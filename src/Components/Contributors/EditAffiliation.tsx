import React, { FC, useState } from 'react';
import AffiliationDisplay from './AffiliationDisplay';
import { generateAffiliationDisplayData } from './ContributorSearchResultItem';
import { Colors } from '../../assets/styles/StyleConstants';
import { Button, Grid, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import UnitSelect from '../InstitutionSelect/UnitSelect';
import { Affiliation, SimpleUnitResponse } from '../../types/InstitutionTypes';
import { ContributorWrapper } from '../../types/ContributorTypes';

interface EditAffiliationProps {
  affiliation: Affiliation;
  contributorData: ContributorWrapper;
  resultListIndex: number;
  updateContributor: (contributorData: ContributorWrapper, rowIndex: number) => void;
}

const EditAffiliation: FC<EditAffiliationProps> = ({
  affiliation,
  contributorData,
  resultListIndex,
  updateContributor,
}) => {
  const [showUnitSelector, setShowUnitSelector] = useState(false);
  const [deleteOrAddUnitError, setDeleteOrAddUnitError] = useState<
    { institutionNr: string; message: string } | undefined
  >();

  function addUnitToInstitution(newUnit: SimpleUnitResponse, institutionNr: string) {
    const affiliationIndex = contributorData.toBeCreated.affiliations
      ? contributorData.toBeCreated.affiliations.findIndex(
          (affiliation) => affiliation.cristinInstitutionNr?.toString() === institutionNr.toString()
        )
      : -1;
    if (contributorData.toBeCreated.affiliations && contributorData.toBeCreated.affiliations[affiliationIndex]) {
      const newUnitMassaged = {
        unitName: newUnit.unit_name.en ?? newUnit.unit_name.nb,
        unitNr: newUnit.cristin_unit_id ?? '',
      };
      if (
        contributorData.toBeCreated.affiliations[affiliationIndex].units?.some(
          (existingUnit) => existingUnit.unitNr.toString() === newUnit.cristin_unit_id,
          toString()
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
      setDeleteOrAddUnitError(undefined);
      addUnitToInstitution(newUnit, institutionNr);
    } catch (error) {
      if (error instanceof Error) {
        setDeleteOrAddUnitError({ institutionNr: institutionNr, message: error.message });
      }
    }
  }

  function deleteUnitToInstitution(unitToBeDeleted: SimpleUnitResponse, institutionNr: string) {
    const affiliationIndex = contributorData.toBeCreated.affiliations
      ? contributorData.toBeCreated.affiliations.findIndex(
          (affiliation) => affiliation.cristinInstitutionNr?.toString() === institutionNr.toString()
        )
      : -1;
    if (contributorData.toBeCreated.affiliations && contributorData.toBeCreated.affiliations[affiliationIndex]) {
      const unitIndex =
        contributorData.toBeCreated.affiliations[affiliationIndex].units?.findIndex(
          (existingUnit) => existingUnit.unitNr === unitToBeDeleted.cristin_unit_id
        ) ?? -1;
      if (unitIndex < 0) {
        throw new Error(`Fant ikke enhet: ${unitToBeDeleted.cristin_unit_id}`);
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
      setDeleteOrAddUnitError(undefined);
      deleteUnitToInstitution(unitToBeDeleted, institutionNr);
    } catch (error) {
      if (error instanceof Error) {
        setDeleteOrAddUnitError({ institutionNr: institutionNr, message: error.message });
      }
    }
  }

  function removeInstitutionByCristinNrOrName(cristinInstitutionNr: string | undefined, institutionName: string) {
    if (contributorData.toBeCreated.affiliations) {
      const temp = contributorData;
      if (cristinInstitutionNr) {
        temp.toBeCreated.affiliations = [...contributorData.toBeCreated.affiliations].filter(
          (affiliation) => affiliation.cristinInstitutionNr?.toString() !== cristinInstitutionNr.toString()
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
    <AffiliationDisplay
      removeInstitutionByCristinNrOrName={removeInstitutionByCristinNrOrName}
      showCardActions={true}
      affiliation={generateAffiliationDisplayData(affiliation)}
      dataTestid={`list-item-author-${contributorData.toBeCreated.surname}-affiliations-${affiliation.cristinInstitutionNr}`}
      backgroundcolor={Colors.LIGHT_GREY}
      handleDeleteUnitClick={(unit) => {
        deleteUnitToInstitutionAndHandleError(unit, affiliation.cristinInstitutionNr ?? '');
      }}>
      <Grid container spacing={2}>
        {affiliation.isCristinInstitution === true && (
          <Grid item>
            <Button
              size="small"
              data-testid={`list-item-author-${contributorData.toBeCreated.surname}-affiliations-${affiliation.cristinInstitutionNr}-add-unit`}
              onClick={() => setShowUnitSelector(true)}
              startIcon={<AddIcon />}
              color="primary">
              Legg til enhet
            </Button>
          </Grid>
        )}
        {showUnitSelector && affiliation.isCristinInstitution === true && (
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item sm={8}>
                <UnitSelect
                  cristinInstitutionNr={affiliation.cristinInstitutionNr ?? ''}
                  handleUnitChange={(unit: any) => {
                    setShowUnitSelector(false);
                    addUnitToInstitutionAndHandleError(unit, affiliation.cristinInstitutionNr ?? '');
                  }}
                />
              </Grid>
              <Grid item sm={4}>
                <Button
                  size="small"
                  data-testid={`cancel-list-item-author-${contributorData.toBeCreated.surname}-affiliations-${affiliation.cristinInstitutionNr}-add-unit`}
                  onClick={() => setShowUnitSelector(false)}
                  color="secondary">
                  Avbryt
                </Button>
              </Grid>
            </Grid>
          </Grid>
        )}
        {deleteOrAddUnitError && (
          <Grid item xs={12}>
            <Typography
              data-testid={`list-item-author-${contributorData.toBeCreated.surname}-affiliations-${affiliation.cristinInstitutionNr}-error`}
              color="error">
              {deleteOrAddUnitError.message}
            </Typography>
          </Grid>
        )}
      </Grid>
    </AffiliationDisplay>
  );
};

export default EditAffiliation;
