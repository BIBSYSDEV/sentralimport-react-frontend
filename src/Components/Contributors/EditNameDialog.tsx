import React, { FC, useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@material-ui/core';
import { ContributorWrapper } from '../../types/ContributorTypes';

const dialogTitleId = 'edit-contributor-name-dialog-title';

interface EditNameDialogProps {
  showEditNameDialog: boolean;
  setShowEditNameDialog: (showEditNameDialog: boolean) => void;
  initialFirstName: string;
  initialSurname: string;
  resultListIndex: number;
  contributorData: ContributorWrapper;
  updateContributor: (contributorData: ContributorWrapper, rowIndex: number) => void;
  setOpenContributorSearchPanel: (openContributorSearchPanel: boolean) => void;
}

const EditNameDialog: FC<EditNameDialogProps> = ({
  showEditNameDialog,
  setShowEditNameDialog,
  initialFirstName,
  initialSurname,
  resultListIndex,
  contributorData,
  updateContributor,
  setOpenContributorSearchPanel,
}) => {
  const [firstName, setFirstName] = useState(initialFirstName);
  const [firstNameDirty, setFirstNameDirty] = useState(false);
  const [firstNameError, setFirstNameError] = useState(false);
  const [surnameDirty, setSurnameDirty] = useState(false);
  const [surname, setSurname] = useState(initialSurname);
  const [surnameError, setSurnameError] = useState(false);

  const handleClose = () => {
    setShowEditNameDialog(false);
  };

  const handleFirstNameChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFirstName(event.target.value);
    setFirstNameError(event.target.value.trim().length === 0);
  };

  const showFirstNameError = () => {
    return firstNameDirty && firstNameError;
  };

  const handleSurnameChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSurname(event.target.value);
  };

  useEffect(() => {
    setFirstName(initialFirstName);
    setSurname(initialSurname);
  }, [initialFirstName, initialSurname]);

  const handleSubmit = () => {
    const temp = contributorData;
    temp.toBeCreated.first_name_preferred = undefined;
    temp.toBeCreated.surname_preferred = undefined;
    temp.toBeCreated.first_name = firstName;
    temp.toBeCreated.surname = surname;
    temp.toBeCreated.cristin_person_id = 0;
    updateContributor(temp, resultListIndex);
    setShowEditNameDialog(false);
    setOpenContributorSearchPanel(false);
  };

  return (
    <Dialog onClose={handleClose} open={showEditNameDialog} aria-labelledby={dialogTitleId}>
      <DialogTitle id={dialogTitleId}>Lag ny bidragsyter</DialogTitle>
      <DialogContent>
        <DialogContentText>Skriv inn fornavn og etternavn</DialogContentText>
        <TextField
          onBlur={() => setFirstNameDirty(true)}
          value={firstName}
          error={showFirstNameError()}
          helperText={showFirstNameError() && 'Fornavn er påkrevd'}
          required
          autoFocus
          id="first-name-textfield"
          label="Fornavn"
          fullWidth
          onChange={handleFirstNameChange}
        />
        <TextField
          onBlur={() => setSurnameDirty(true)}
          onChange={(event) => setSurname(event.target.value)}
          required
          helperText={surnameDirty && surname.length === 0 && 'Etternavn er påkrevd'}
          error={surnameDirty && surname.length === 0}
          id="surname-textfield"
          value={surname}
          label="Etternavn"
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Avbryt
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Lagre
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditNameDialog;
