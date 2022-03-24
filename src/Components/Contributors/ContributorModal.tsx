import React, { FC, useLayoutEffect, useRef, useState } from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import { Button, Divider, Typography } from '@material-ui/core';
import styled from 'styled-components';
import AddIcon from '@material-ui/icons/Add';
import ContributorOrderComponent from './ContributorOrderComponent';
import ImportContributorComponent from './ImportContributorComponent';
import { ContributorWrapper, emptyContributorWrapper } from '../../types/ContributorTypes';
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

interface ContributorProps {
  importPublication: ImportPublication;
  contributors: ContributorWrapper[];
  setContributors: (contributors: ContributorWrapper[]) => void;
  isContributorModalOpen: boolean;
  handleContributorModalClose: () => void;
  duplicateContributors: Map<number, number[]>;
}

const NumberOfContributorsToShow = 30;

export const NumberOfContributorsToDefineMonsterPost = 100;

const isMonsterPost = (contributors: ContributorWrapper[]) =>
  contributors.length > NumberOfContributorsToDefineMonsterPost;

const contributorHasErrors = (contributor: ContributorWrapper): boolean =>
  contributor.toBeCreated?.affiliations?.length === 0;

const hasContributorDuplicate = (contributor: ContributorWrapper, duplicateContributors: Map<number, number[]>) => {
  if (contributor.toBeCreated?.cristin_person_id) {
    return !!duplicateContributors.get(contributor.toBeCreated?.cristin_person_id);
  }
  return false;
};

const ContributorModal: FC<ContributorProps> = ({
  contributors,
  setContributors,
  isContributorModalOpen,
  handleContributorModalClose,
  duplicateContributors,
}) => {
  const [maxContributorsToShow, setMaxContributorsToShow] = useState(
    isMonsterPost(contributors) ? contributors.length : NumberOfContributorsToShow
  );

  const [isContributorHiddenList, setIsContributorHiddenList] = useState<boolean[]>(
    isMonsterPost(contributors)
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

  const handleShowContributor = (index: number) => {
    setIsContributorHiddenList((prevState) => {
      prevState[index] = !prevState[index];
      return [...prevState];
    });
  };

  return (
    <>
      <StyledModal isOpen={isContributorModalOpen}>
        <ModalHeader toggle={handleContributorModalClose}>
          Bidragsytere
          {isMonsterPost(contributors) && (
            <Typography variant="body2" display="inline">
              {`  ("Monsterpost" - bidragsytere uten norsk tilknytning og uten feil er skjult)`}
            </Typography>
          )}
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
              {contributors.slice(0, maxContributorsToShow).map((contributor, index) => (
                <li key={index} data-testid={`contributor-line-${index}`}>
                  <StyledContributorLineWrapper>
                    <StyledOrderColumn>
                      <ContributorOrderComponent
                        row={contributor}
                        contributors={contributors}
                        setContributors={setContributors}
                        hideArrows={isContributorHiddenList[index]}
                      />
                    </StyledOrderColumn>
                    <StyledContributorColumn>
                      {isContributorHiddenList[index] ? (
                        <StyledHiddenContributorWrapper>
                          <Typography
                            variant="h6"
                            gutterBottom
                            data-testid={`import-contributor-hidden-${index}`}
                            color="textSecondary">
                            {contributor.imported.first_name + ' ' + contributor.imported.surname}{' '}
                          </Typography>
                          <Button variant="text" color="primary" onClick={() => handleShowContributor(index)}>
                            Vis bidragsyter
                          </Button>
                        </StyledHiddenContributorWrapper>
                      ) : (
                        <ImportContributorComponent contributor={contributor} />
                      )}
                    </StyledContributorColumn>
                    <StyledContributorColumn>
                      <div>
                        {!isContributorHiddenList[index] && (
                          <ContributorForm
                            resultListIndex={index}
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
