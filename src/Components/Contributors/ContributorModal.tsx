import React, { FC, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import { Context } from '../../Context';
import { Button, Checkbox, Divider, FormControlLabel, FormGroup, Typography } from '@material-ui/core';
import GenericConfirmDialog from '../Dialogs/GenericConfirmDialog';
import styled from 'styled-components';
import AddIcon from '@material-ui/icons/Add';
import ContributorOrderComponent from './ContributorOrderComponent';
import ImportContributorComponent from './ImportContributorComponent';
import { ContributorWrapper, emptyContributorWrapper } from '../../types/ContributorTypes';
import { Colors } from '../../assets/styles/StyleConstants';
import { ImportPublication } from '../../types/PublicationTypes';
import ContributorForm from './ContributorForm';
import clone from 'just-clone';
import { validateContributors } from './ContributorValidate';

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

interface ContributorProps {
  importPublication: ImportPublication;
  contributors: ContributorWrapper[];
  setContributors: (contributors: ContributorWrapper[]) => void;
  isContributorModalOpen: boolean;
  isDuplicate: boolean;
  handleContributorModalClose: () => void;
  setContributorErrors: (value: string[]) => void;
}

const ContributorModal: FC<ContributorProps> = ({
  contributors,
  setContributors,
  isContributorModalOpen,
  handleContributorModalClose,
  setContributorErrors,
}) => {
  const [isClosingDialogOpen, setIsClosingDialogOpen] = useState(false);
  const { dispatch } = useContext(Context);
  const [arrayOfContributorsWithNorwegianInstitution, setArrayOfContributorsWithNorwegianInstitution] = useState(
    new Array(contributors.length).fill(false)
  );
  const [isContributorsFiltered, setIsContributorsFiltered] = useState(false);

  const firstUpdate = useRef(true);

  useLayoutEffect(() => {
    if (firstUpdate.current) firstUpdate.current = false;
  }, [contributors]);

  useEffect(() => {
    setArrayOfContributorsWithNorwegianInstitution(
      contributors.map((contributor) =>
        contributor.imported?.affiliations?.some((inst) => inst.countryCode === NorwegianCountryCode)
      )
    );
  }, [contributors]);

  const updateContributor = (author: ContributorWrapper, rowIndex: number) => {
    const temp = [...contributors];
    temp[rowIndex] = author;
    setContributors(temp);
    validateContributors(temp, setContributorErrors);
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

  const handleCloseDeleteConfirmDialog = (rowIndex: number) => {
    dispatch({ type: 'param', payload: rowIndex });
    setIsClosingDialogOpen(!isClosingDialogOpen);
  };

  function handleCloseContributorModal() {
    handleContributorModalClose();
    dispatch({ type: 'contributors', payload: contributors });
  }

  const handleToggleFilter = () => {
    setIsContributorsFiltered((prevState) => !prevState);
  };

  return (
    <>
      <StyledModal isOpen={isContributorModalOpen}>
        <ModalHeader toggle={handleCloseContributorModal}>Bidragsytere</ModalHeader>
        <ModalBody>
          <StyledContentWrapper>
            <StyledContributorHeader>
              <StyledOrderColumn>
                <StyledHeaderText>Rekkefølge</StyledHeaderText>
              </StyledOrderColumn>
              <StyledContributorColumn>
                <StyledImportHeaderWrapper>
                  <StyledHeaderText>Import-Forfatter</StyledHeaderText>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          data-testid="filter-contributors-check"
                          color="primary"
                          checked={isContributorsFiltered}
                          onChange={handleToggleFilter}
                          name="filterContributors"
                        />
                      }
                      label="Vis kun forfattere ved norske institusjoner"
                    />
                  </FormGroup>
                </StyledImportHeaderWrapper>
              </StyledContributorColumn>
              <StyledContributorColumn>
                <StyledHeaderText>Cristin-Forfatter</StyledHeaderText>
              </StyledContributorColumn>
            </StyledContributorHeader>
            <Divider />

            <StyledOrderedList>
              {contributors.map((contributor, index) => (
                <li key={index} data-testid={`contributor-line-${index}`}>
                  <StyledContributorLineWrapper>
                    <StyledOrderColumn>
                      <ContributorOrderComponent
                        row={contributor}
                        contributors={contributors}
                        setContributors={setContributors}
                        hideArrows={!arrayOfContributorsWithNorwegianInstitution[index] && isContributorsFiltered}
                      />
                    </StyledOrderColumn>
                    <StyledContributorColumn>
                      {!arrayOfContributorsWithNorwegianInstitution[index] && isContributorsFiltered ? (
                        <Typography
                          data-testid={`import-contributor-hidden-${contributor.toBeCreated.order}`}
                          color="textSecondary">
                          Forfatter-info er skjult
                        </Typography>
                      ) : (
                        <ImportContributorComponent contributor={contributor} />
                      )}
                    </StyledContributorColumn>
                    <StyledContributorColumn>
                      <div hidden={!arrayOfContributorsWithNorwegianInstitution[index] && isContributorsFiltered}>
                        <ContributorForm
                          resultListIndex={index}
                          contributorData={contributor}
                          contributors={contributors}
                          updateContributor={updateContributor}
                          deleteContributor={handleCloseDeleteConfirmDialog}
                        />
                      </div>
                    </StyledContributorColumn>
                  </StyledContributorLineWrapper>
                  <Divider />
                </li>
              ))}
            </StyledOrderedList>

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
                onClick={handleCloseContributorModal}>
                Tilbake
              </Button>
            </StyledContributorFooter>
          </StyledContentWrapper>
        </ModalBody>
      </StyledModal>
      <GenericConfirmDialog
        doFunction={removeContributor}
        title={'Slett bidragsyter'}
        text={'Er du sikker på at du vil slette denne bidragsyteren?'}
        open={isClosingDialogOpen}
        handleClose={handleCloseDeleteConfirmDialog}
        handleAbort={handleCloseDeleteConfirmDialog}
      />
    </>
  );
};

export default ContributorModal;
