import React from 'react';
import ListModal from '../ListModal/ListModal';
import { Button, Typography } from '@material-ui/core';
import styled from 'styled-components';
import { SavedPublicationLogLine } from '../../types/PublicationTypes';

const LogPanelWrapper = styled.div`
  display: flex;
  margin-top: 2rem;
  padding-left: 1rem;
`;

const StyledPublicationItemWrapper = styled.div`
  padding-bottom: 1.5rem;
`;

const StyledMetadataWrapper = styled.div`
  display: flex;
  align-items: baseline;
`;

const StyledTypography = styled(Typography)`
  padding-right: 0.4rem;
`;

export default function LogPanel() {
  const [visible, setVisible] = React.useState(false);

  function toggleLog() {
    setVisible(!visible);
  }

  function close() {
    setVisible(false);
  }

  function createRows() {
    const publications = JSON.parse(localStorage.getItem('log') ?? '[]') as any[];
    return publications.length !== 0 ? (
      <div>
        {publications.reverse().map((pub: SavedPublicationLogLine) => (
          <StyledPublicationItemWrapper key={pub.id}>
            <StyledMetadataWrapper>
              <StyledTypography variant="caption">CristinId:</StyledTypography>
              <StyledTypography>{pub.id}</StyledTypography>
            </StyledMetadataWrapper>
            <StyledMetadataWrapper>
              <StyledTypography variant="caption">Tittel:</StyledTypography>
              <StyledTypography>{pub.title}</StyledTypography>
            </StyledMetadataWrapper>
          </StyledPublicationItemWrapper>
        ))}
      </div>
    ) : (
      <Typography>Ingen publikasjoner</Typography>
    );
  }

  return (
    <LogPanelWrapper data-testid="log-panel">
      <Button color="default" onClick={toggleLog} variant="contained" style={{ margin: '10px' }}>
        Vis mine siste importerte publikasjoner
      </Button>
      <ListModal title={'Mine siste importerte publikasjoner'} open={visible} handleClose={close} body={createRows()} />
    </LogPanelWrapper>
  );
}
