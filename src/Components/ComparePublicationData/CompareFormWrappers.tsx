import styled from 'styled-components';
import { Colors } from '../../assets/styles/StyleConstants';
import { Link, Typography } from '@material-ui/core';

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
  word-wrap: break-word;
`;

export const StyledLineCristinValue = styled.div`
  min-width: 20rem;
  width: 40%;
`;

export const StyledActionButtonsPlaceHolder = styled.div`
  min-width: 5rem;
  width: 5%;
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

export const StyledCenterContentWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

export const StyledOpenContributorsButtonWrapper = styled(StyledCenterContentWrapper)`
  width: 100%;
  margin-top: 1rem;
`;

export const StyledErrorMessageWrapper = styled(StyledCenterContentWrapper)`
  width: 100%;
  margin-top: 1rem;
`;

export const StyledLineHeader = styled(Typography)`
  min-width: 20rem;
  width: 40%;
`;

export const StyledDisabledTypography = styled(Typography)`
  color: #555555;
`;

export const StyledCristinLink = styled(Link)`
  font-weight: bold;
  && {
    color: ${Colors.PURPLE};
  }
  &:hover {
    color: ${Colors.PURPLE};
  }
`;
