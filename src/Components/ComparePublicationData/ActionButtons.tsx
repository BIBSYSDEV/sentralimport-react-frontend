import React, { FC } from 'react';
import styled from 'styled-components';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import { IconButton } from '@material-ui/core';

const StyledLineAction = styled.div`
  min-width: 10rem;
  width: 5%;
  display: flex;
  justify-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  //same as iconbutton
  padding: 12px;
  font-size: 15px;
`;

interface ComparePublicationDataModalProps {
  isImportAndCristinEqual: boolean;
  isCopyBottonDisabled: boolean;
  copyCommand: () => void;
}

const ActionButtons: FC<ComparePublicationDataModalProps> = ({
  isImportAndCristinEqual,
  isCopyBottonDisabled,
  copyCommand,
}) => {
  return (
    <StyledLineAction>
      {isImportAndCristinEqual ? (
        <Wrapper>
          <DragHandleIcon />
        </Wrapper>
      ) : (
        <div>
          <IconButton color="secondary" onClick={copyCommand} disabled={isCopyBottonDisabled}>
            <DoubleArrowIcon />
          </IconButton>
        </div>
      )}
    </StyledLineAction>
  );
};

export default ActionButtons;