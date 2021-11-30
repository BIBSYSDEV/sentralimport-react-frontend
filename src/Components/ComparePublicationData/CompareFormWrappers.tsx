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
