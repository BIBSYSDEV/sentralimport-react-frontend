import React, { FC, useState } from 'react';
import { Button, Card, Grid, Typography } from '@material-ui/core';
import ContributorSearchPanel from './ContributorSearchPanel';
import {
  Affiliation,
  emptyInstitutionSelector,
  emptyUnitSelector,
  InstitutionSelector,
  UnitSelector,
} from '../../types/InstitutionTypes';
import InstitutionCountrySelect from '../InstitutionSelect/InstitutionCountrySelect';
import { ContributorWrapper } from '../../types/ContributorTypes';
import { getInstitutionName, SearchLanguage } from '../../api/contributorApi';

import styled from 'styled-components';
import EditAffiliations from './EditAffiliations';
import { StyledVerifiedBadge } from '../../assets/styles/StyledBadges';

const StyledFlexEndButtons = styled(Button)`
  &&.MuiButton-root {
    margin-left: 1rem;
  }
`;

interface ContributorFormProps {
  resultListIndex: number;
  contributorData: ContributorWrapper;
  updateContributor: (contributorData: ContributorWrapper, rowIndex: number) => void;
  deleteContributor: (index: number) => void;
  handleChosenAuthorAffiliations: (affiliations: Affiliation[]) => Promise<Affiliation[]>;
}

const ContributorForm: FC<ContributorFormProps> = ({
  resultListIndex,
  contributorData,
  deleteContributor,
  updateContributor,
  handleChosenAuthorAffiliations,
}) => {
  const [selectedInstitution, setSetSelectedInstitution] = useState(emptyInstitutionSelector);
  const [selectedUnit, setSelectedUnit] = useState<UnitSelector>(emptyUnitSelector);
  const [addDisabled, setAddDisabled] = useState(false);

  async function handleSubmit() {
    //TODO: finn ut om det er noen grunn til objekt-copy i det hele tatt ?
    const temp = JSON.parse(JSON.stringify(contributorData));
    const cleanedAffiliations = await handleChosenAuthorAffiliations(temp.toBeCreated.affiliations);
    temp.toBeCreated.affiliations = removeInstitutionsDuplicatesBasedOnCristinId(cleanedAffiliations);
    temp.isEditing = false;
    await updateContributor(temp, resultListIndex);
    setSetSelectedInstitution(emptyInstitutionSelector);
  }

  function removeInstitutionsDuplicatesBasedOnCristinId(affiliations: Affiliation[]) {
    const cristinIdSet = new Set();
    return affiliations.filter((affiliation: Affiliation) => {
      if (cristinIdSet.has(affiliation.cristinInstitutionNr)) return false;
      cristinIdSet.add(affiliation.cristinInstitutionNr);
      return true;
    });
  }

  function handleInstitutionChange(institutionSelector: InstitutionSelector) {
    setSetSelectedInstitution(institutionSelector);
    setSelectedUnit(emptyUnitSelector);
  }

  function handleUnitChange(unit: UnitSelector) {
    setSelectedUnit(unit);
  }

  //Brukes av gammel React select, hives ut når vi får skrevet den om
  function addUnit(affiliationsCopy: Affiliation[]) {
    for (let i = 0; i < affiliationsCopy.length; i++) {
      if (affiliationsCopy[i].cristinInstitutionNr === selectedInstitution.cristinInstitutionNr) {
        if (affiliationsCopy[i].units) {
          affiliationsCopy[i].units?.push({
            unitName: selectedUnit.label,
            unitNr: selectedUnit.value,
          });
        } else {
          affiliationsCopy[i].units = [];
          affiliationsCopy[i].units?.push({
            unitName: selectedUnit.label,
            unitNr: selectedUnit.value,
          });
        }
      }
    }
    return affiliationsCopy;
  }

  //TODO: bytt ut med egen lagd autocomplete som KUN legger til institusjon og ikke enhet.
  async function addInstitution() {
    if (contributorData.toBeCreated.affiliations) {
      setAddDisabled(true);
      let affiliationsCopy: Affiliation[] = [...contributorData.toBeCreated.affiliations];
      //WHY THO? når brukeren har valgt institusjon i nedtrekksmenyen så vet jo applikasjonen hva navnet er?
      const { institutionName } = await getInstitutionName(
        selectedInstitution.cristinInstitutionNr,
        SearchLanguage.En,
        new Map()
      );

      let duplicate = 0;
      for (let i = 0; i < affiliationsCopy.length; i++) {
        if (affiliationsCopy[i].cristinInstitutionNr === selectedInstitution.cristinInstitutionNr) {
          duplicate++;
          //TODO: Why is institutionName set as unitName?? Ask somebody if they know, this doesn't make  any sense
          //Maybe linked to bug SMILE-1131?
          if (affiliationsCopy[i].unitName !== institutionName) {
            affiliationsCopy[i].unitName = institutionName;
          }
        }
      }
      if (duplicate < 1) {
        affiliationsCopy.push({
          institutionName: selectedInstitution.label,
          cristinInstitutionNr: '' + selectedInstitution.cristinInstitutionNr,
          isCristinInstitution: true,
        });
      }

      if (selectedUnit.value !== '') {
        affiliationsCopy = addUnit(affiliationsCopy);
      }

      const temp = contributorData;
      temp.toBeCreated.affiliations = removeInstitutionsDuplicatesBasedOnCristinId(affiliationsCopy);

      updateContributor(temp, resultListIndex);
      setAddDisabled(false);
    }
  }

  function checkIfSelectedUnitsExistsInAffiliations() {
    if (contributorData.toBeCreated.affiliations && selectedUnit) {
      const affiliations = contributorData.toBeCreated.affiliations;
      return affiliations.some((affiliation) => {
        return affiliation.units?.some((unit) => {
          return unit.unitNr === selectedUnit.value;
        });
      });
    }
  }

  return (
    <div data-testid={`contributor-form-${resultListIndex}`}>
      <Typography data-testid={`contributor-form-${resultListIndex}-name`} variant="h6">
        {contributorData.toBeCreated.cristin_person_id && contributorData.toBeCreated.cristin_person_id !== 0 ? (
          <>
            `${contributorData.toBeCreated.first_name} ${contributorData.toBeCreated.surname}` <StyledVerifiedBadge />
          </>
        ) : (
          `${contributorData.toBeCreated.first_name} ${contributorData.toBeCreated.surname}`
        )}
      </Typography>
      <ContributorSearchPanel
        contributorData={contributorData}
        resultListIndex={resultListIndex}
        updateContributor={updateContributor}
      />
      <EditAffiliations
        contributorData={contributorData}
        resultListIndex={resultListIndex}
        updateContributor={updateContributor}
      />
      <Card
        variant="outlined"
        style={{ overflow: 'visible', padding: '0.5rem', marginTop: '0.5rem', marginBottom: '1rem' }}>
        <InstitutionCountrySelect
          handleInstitutionChange={handleInstitutionChange}
          handleUnitChange={handleUnitChange}
          aria-label={'Institusjonsvelger ' + resultListIndex}
          selectedInstitution={selectedInstitution}
          unit={selectedUnit}
        />
        <Button
          style={{ marginTop: '0.5rem' }}
          onClick={() => {
            addInstitution();
          }}
          variant="outlined"
          color="primary"
          size="small"
          disabled={
            addDisabled ||
            selectedInstitution.cristinInstitutionNr === '0' ||
            (contributorData.toBeCreated.affiliations?.filter((toBeCreatedAffiliation: Affiliation) => {
              return selectedInstitution.cristinInstitutionNr === '' + toBeCreatedAffiliation.cristinInstitutionNr;
            }) &&
              !selectedUnit) ||
            (selectedUnit.value !== '' && checkIfSelectedUnitsExistsInAffiliations())
          }>
          OK
        </Button>
      </Card>
      <Grid container spacing={2}>
        <Grid item>
          <StyledFlexEndButtons
            variant="outlined"
            data-testid={`contributor-delete-button-form-${resultListIndex}`}
            color="secondary"
            onClick={() => deleteContributor(resultListIndex)}>
            Slett person
          </StyledFlexEndButtons>
        </Grid>
        <Grid item>
          <StyledFlexEndButtons
            variant="outlined"
            data-testid={`contributor-save-and-close-button-${resultListIndex}`}
            color="primary"
            onClick={handleSubmit}>
            Lukk
          </StyledFlexEndButtons>
        </Grid>
      </Grid>
    </div>
  );
};

export default ContributorForm;
