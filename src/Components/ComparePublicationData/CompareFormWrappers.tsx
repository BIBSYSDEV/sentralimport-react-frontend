import styled from 'styled-components';
import { Colors } from '../../assets/styles/StyleConstants';
import { Typography } from '@material-ui/core';

export const StyledLineWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0.5rem;
  :nth-of-type(2n) {
    background-color: ${Colors.LIGHT_GREY};
  }
`;
export const StyledLineLabelTypography: any = styled(Typography)`
  min-width: 10rem;
  width: 10%;
  && {
    font-weight: bold;
  }
`;

export const StyledLineImportValue = styled.div`
  min-width: 10rem;
  width: 40%;
`;

export const StyledLineCristinValue = styled.div`
  min-width: 20rem;
  width: 40%;
`;

export const StyledActionButtonsPlaceHolder = styled.div`
  min-width: 10rem;
  width: 5%;
`;

export const StyledErrorMessageWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`;

export const StyledFormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const StyledHeaderLineWrapper = styled(StyledLineWrapper)`
  color: ${Colors.PURPLE};
  padding: 0.5rem 0;
  border-bottom: none;
  margin-bottom: 1rem;
`;

export const StyledOpenContributorsButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  margin-top: 1rem;
`;

export const StyledLineHeader = styled(Typography)`
  min-width: 20rem;
  width: 40%;
`;
