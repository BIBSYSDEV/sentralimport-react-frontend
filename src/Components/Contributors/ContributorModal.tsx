import React, { FC, useLayoutEffect, useRef, useState } from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import { Button, Checkbox, Divider, FormControlLabel, FormGroup, Typography } from '@material-ui/core';
import styled from 'styled-components';
import AddIcon from '@material-ui/icons/Add';
import ContributorOrderComponent from './ContributorOrderComponent';
import ImportContributorComponent from './ImportContributorComponent';
import {
  ContributorWrapper,
  emptyContributorWrapper,
  MaxLengthFirstName,
  MaxLengthLastName,
} from '../../types/ContributorTypes';
import { Colors } from '../../assets/styles/StyleConstants';
import { ImportPublication } from '../../types/PublicationTypes';
import ContributorForm from './ContributorForm';
import clone from 'just-clone';

const StyledModal = styled(Modal)`
  width: 96%;
  max-width: 96%;
  min-width: 60rem;
  overflow: hidden;
`;

const StyledContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const StyledContributorLineWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 0.5rem;
`;

const StyledContributorHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const StyledOrderColumn = styled.div`
  width: 5%;
  min-width: 6rem;
`;
const StyledHiddenContributorWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`;

const StyledImportHeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledModalHeaderWrapper = styled.div`
  display: flex;
  gap: 3rem;
  align-items: center;
`;

const StyledOrderedList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const StyledContributorColumn = styled.div`
  width: 45%;
  min-width: 15rem;
  margin-left: 2rem;
`;

const StyledHeaderText = styled(Typography)`
  color: ${Colors.PURPLE};
  && {
    font-weight: bold;
    font-size: 1.2rem;
  }
`;

const StyledContributorFooter = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 2rem;
`;

const NorwegianCountryCode = 'NO';

const doesContributorHaveNorwegianAffiliation = (contributor: ContributorWrapper) =>
  contributor.imported?.affiliations?.some((inst) => inst.countryCode === NorwegianCountryCode);

const NumberOfContributorsToShow = 30;

export const NumberOfContributorsToDefineMonsterPost = 100;

const contributorHasErrors = (contributor: ContributorWrapper): boolean =>
  contributor.toBeCreated?.affiliations?.length === 0 ||
  contributor.toBeCreated?.first_name === '' ||
  contributor.toBeCreated?.surname === '' ||
  contributor.toBeCreated?.first_name?.length > MaxLengthFirstName ||
  contributor.toBeCreated?.surname?.length > MaxLengthLastName;

const hasContributorDuplicate = (contributor: ContributorWrapper, duplicateContributors: Map<number, number[]>) => {
  if (contributor.toBeCreated?.cristin_person_id) {
    return !!duplicateContributors.get(contributor.toBeCreated?.cristin_person_id);
  }
  return false;
};

interface ContributorProps {
  importPublication: ImportPublication;
  contributors: ContributorWrapper[];
  setContributors: (contributors: ContributorWrapper[]) => void;
  isContributorModalOpen: boolean;
  handleContributorModalClose: () => void;
  duplicateContributors: Map<number, number[]>;
}

const ContributorModal: FC<ContributorProps> = ({
  contributors,
  setContributors,
  isContributorModalOpen,
  handleContributorModalClose,
  duplicateContributors,
}) => {
  const isMonsterPost = contributors.length > NumberOfContributorsToDefineMonsterPost;
  const [maxContributorsToShow, setMaxContributorsToShow] = useState(
    isMonsterPost ? contributors.length : NumberOfContributorsToShow
  );
  const arrayOfContributorsWithForreignInstitution = contributors.map(
    (contributor) =>
      !contributor.imported?.affiliations?.some((inst) => inst.countryCode === NorwegianCountryCode) ?? false
  );
  const [isFilterChecked, setIsFilterChecked] = useState(false);
  const [listOfHiddenContributors, setListOfHiddenContributors] = useState<boolean[]>(
    isMonsterPost
      ? contributors.map((contributor) => {
          return (
            !doesContributorHaveNorwegianAffiliation(contributor) &&
            !hasContributorDuplicate(contributor, duplicateContributors) &&
            !contributorHasErrors(contributor)
          );
        })
      : new Array(contributors.length).fill(false)
  );
  const firstUpdate = useRef(true);

  useLayoutEffect(() => {
    if (firstUpdate.current) firstUpdate.current = false;
  }, [contributors]);

  const handleShowContributor = (index: number) => {
    setListOfHiddenContributors((prevState) => {
      prevState[index] = !prevState[index];
      return [...prevState];
    });
  };

  const handleToggleFilterForNonMonsterPosts = () => {
    if (isFilterChecked) {
      setListOfHiddenContributors(new Array(contributors.length).fill(false));
    } else {
      setListOfHiddenContributors(arrayOfContributorsWithForreignInstitution);
    }
    setIsFilterChecked((prevState) => !prevState);
  };

  const updateContributor = (author: ContributorWrapper, rowIndex: number) => {
    const tempContrib = [...contributors];
    tempContrib[rowIndex] = author;
    setContributors(tempContrib);
  };

  // Ved sletting av en bidragsyter, sjekk om indeksering skal bli beholdt / oppdatert for alle andre elementer i bidragsyterlisten
  //TODO skriv om funksjonen slik at den blir enklere å lese !!!!!!!!
  //TODO Sjekk om alle edge-cases blir håndtert korrekt med tanke på rekkefølge i toBeCreated og imported (Sørg for at rekkefølgenummer på en gitt bidragsyter aldri blir mindre enn 1)
  const removeContributor = (rowIndex: number) => {
    const tempContrib = [...contributors];
    tempContrib.splice(rowIndex, 1);
    for (let i = rowIndex; i < tempContrib.length; i++) {
      const importedOrder = tempContrib[i].imported.order;
      const toBeCreatedOrder = tempContrib[i].toBeCreated.order;
      if (toBeCreatedOrder && importedOrder) {
        if (importedOrder === tempContrib[i].toBeCreated.order && importedOrder >= rowIndex) {
          tempContrib[i].imported.order = importedOrder - 1;
          tempContrib[i].toBeCreated.order = toBeCreatedOrder - 1;
        } else {
          if (importedOrder !== rowIndex) {
            if (importedOrder > rowIndex) {
              if (importedOrder > 0) {
                if (importedOrder < toBeCreatedOrder) {
                  tempContrib[i].toBeCreated.order = toBeCreatedOrder - 1;
                }
              } else {
                tempContrib[i].toBeCreated.order = toBeCreatedOrder - 1;
              }
            }
          }
        }
      }
    }
    for (let j = 0; j < rowIndex; j++) {
      const importedOrder = tempContrib[j].imported.order;
      const toBeCreatedOrder = tempContrib[j].toBeCreated.order;
      if (toBeCreatedOrder && importedOrder) {
        if (importedOrder === rowIndex && importedOrder !== toBeCreatedOrder) {
          tempContrib[j].imported.order = importedOrder - 1;
        } else if (importedOrder > rowIndex) {
          tempContrib[j].imported.order = importedOrder - 1;
        }
      }
    }
    setContributors(tempContrib);
  };

  function addContributor() {
    const newContributor = clone(emptyContributorWrapper);
    newContributor.imported.order = contributors.length + 1;
    newContributor.cristin.order = contributors.length + 1;
    newContributor.toBeCreated.order = contributors.length + 1;
    setContributors([...contributors, newContributor]);
  }

  return (
    <>
      <StyledModal isOpen={isContributorModalOpen}>
        <ModalHeader toggle={handleContributorModalClose}>
          <StyledModalHeaderWrapper>
            Bidragsytere
            {isMonsterPost ? (
              <Typography variant="body2">
                ("Monsterpost" - bidragsytere uten norsk tilknytning og uten feil er skjult)
              </Typography>
            ) : (
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      data-testid="filter-contributors-check"
                      color="primary"
                      checked={isFilterChecked}
                      onChange={handleToggleFilterForNonMonsterPosts}
                      name="filterContributors"
                    />
                  }
                  label="Vis kun forfattere ved norske institusjoner"
                />
              </FormGroup>
            )}
          </StyledModalHeaderWrapper>
        </ModalHeader>
        <ModalBody>
          <StyledContentWrapper>
            <StyledContributorHeader>
              <StyledOrderColumn>
                <StyledHeaderText>Rekkefølge</StyledHeaderText>
              </StyledOrderColumn>
              <StyledContributorColumn>
                <StyledImportHeaderWrapper>
                  <StyledHeaderText>Import-Forfatter</StyledHeaderText>
                </StyledImportHeaderWrapper>
              </StyledContributorColumn>
              <StyledContributorColumn>
                <StyledHeaderText>Cristin-Forfatter</StyledHeaderText>
              </StyledContributorColumn>
            </StyledContributorHeader>
            <Divider />

            <StyledOrderedList>
              {contributors.slice(0, maxContributorsToShow).map((contributor, contributorIndex) => (
                <li key={contributorIndex} data-testid={`contributor-line-${contributorIndex}`}>
                  <StyledContributorLineWrapper>
                    <StyledOrderColumn>
                      <ContributorOrderComponent
                        row={contributor}
                        contributors={contributors}
                        setContributors={setContributors}
                        hideArrows={listOfHiddenContributors[contributorIndex]}
                      />
                    </StyledOrderColumn>
                    <StyledContributorColumn>
                      {listOfHiddenContributors[contributorIndex] ? (
                        <StyledHiddenContributorWrapper>
                          <Typography
                            variant="h6"
                            gutterBottom
                            data-testid={`import-contributor-hidden-${contributorIndex}`}
                            color="textSecondary">
                            {contributor.imported.first_name + ' ' + contributor.imported.surname}
                          </Typography>
                          <Button
                            variant="text"
                            color="primary"
                            data-testid={`show-contributor-button-${contributorIndex}`}
                            onClick={() => handleShowContributor(contributorIndex)}>
                            Vis bidragsyter
                          </Button>
                        </StyledHiddenContributorWrapper>
                      ) : (
                        <ImportContributorComponent contributor={contributor} />
                      )}
                    </StyledContributorColumn>
                    <StyledContributorColumn>
                      <div>
                        {!listOfHiddenContributors[contributorIndex] && (
                          <ContributorForm
                            resultListIndex={contributorIndex}
                            contributorData={contributor}
                            contributors={contributors}
                            updateContributor={updateContributor}
                            removeContributor={removeContributor}
                            duplicateContributors={duplicateContributors}
                          />
                        )}
                      </div>
                    </StyledContributorColumn>
                  </StyledContributorLineWrapper>
                  <Divider />
                </li>
              ))}
            </StyledOrderedList>

            {maxContributorsToShow < contributors.length && (
              <Button
                color="primary"
                variant="contained"
                onClick={() => setMaxContributorsToShow((prevState) => prevState + NumberOfContributorsToShow)}>
                (Viser {maxContributorsToShow} av {contributors.length}) Vis flere ...
              </Button>
            )}

            <StyledContributorFooter>
              <Button
                variant="outlined"
                color="primary"
                onClick={addContributor}
                data-testid="add-contributor-button"
                startIcon={<AddIcon />}>
                Legg til bidragsyter
              </Button>
              <Button
                style={{ marginLeft: '1rem' }}
                variant="contained"
                color="primary"
                data-testid="contributor-back-button"
                onClick={handleContributorModalClose}>
                Tilbake
              </Button>
            </StyledContributorFooter>
          </StyledContentWrapper>
        </ModalBody>
      </StyledModal>
    </>
  );
};

export default ContributorModal;
