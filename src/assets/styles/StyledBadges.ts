import styled from 'styled-components';
import { ReactComponent as VerifiedBadge } from '../icons/verified-badge.svg';
import { Colors } from './StyleConstants';
import { ReactComponent as NotVerifiedBadge } from '../icons/not-verified-badge.svg';
import { ReactComponent as UnknownVerifiedBadge } from '../icons/uknown-verification-badge.svg';

export const StyledVerifiedBadge = styled(VerifiedBadge)`
  margin-right: 0.5rem;
  width: 1.7rem;
  height: 1.7rem;
  & path {
    fill: ${Colors.Text.GREEN};
  }
`;

export const StyledVerifiedBadgeSmall = styled(VerifiedBadge)`
  margin-right: 0.5rem;
  width: 1.2rem;
  height: 1.2rem;
  & path {
    fill: ${Colors.Text.GREEN};
  }
`;

export const StyledNotVerifiedBadge = styled(NotVerifiedBadge)`
  margin-right: 0.5rem;
  width: 1.7rem;
  height: 1.7rem;
  & path {
    fill: ${Colors.Text.OPAQUE_41_BLACK};
  }
  & circle {
    fill: ${Colors.Text.OPAQUE_41_BLACK};
  }
`;

export const StyledUnknownVerifiedBadge = styled(UnknownVerifiedBadge)`
  margin-right: 0.5rem;
  width: 1.7rem;
  height: 1.7rem;
  & path {
    fill: ${Colors.Text.OPAQUE_41_BLACK};
  }
  & ellipse {
    fill: ${Colors.Text.OPAQUE_41_BLACK};
  }
`;
