import React from 'react';
import { Card } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import styled from 'styled-components';
import { Colors } from '../../assets/styles/StyleConstants';

const StyledChooseThisSkeleton = styled(Skeleton)`
  margin-left: 10px;
  margin-top: 10px;
`;

const StyledCloseSkeleton = styled(Skeleton)`
  margin-left: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const StyledAuthorWrapper = styled.div`
  color: ${Colors.Text.GREEN};
  margin-top: 10px;
  margin-left: 10px;
`;

const StyledAffiliationsWrapper = styled.div`
  font-style: italic;
  margin-left: 10px;
`;

export default function ContributorSearchPanelSkeleton() {
  return (
    <>
      <Skeleton variant="text" width={180} height={35} />
      <Card>
        <div>
          <span>
            <StyledAuthorWrapper>
              <Skeleton variant="text" width={160} height={25} />
            </StyledAuthorWrapper>
            <StyledAffiliationsWrapper>
              <Skeleton variant="rect" width={300} height={50} />
            </StyledAffiliationsWrapper>
            <StyledChooseThisSkeleton variant="rect" width={70} height={30} />
            <hr />
          </span>
        </div>
        <StyledCloseSkeleton variant="rect" width={70} height={30} />
      </Card>
    </>
  );
}
