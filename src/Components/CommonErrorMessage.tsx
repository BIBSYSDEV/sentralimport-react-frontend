import { Typography } from '@material-ui/core';
import React, { FC } from 'react';

interface CommonErrorMessageProps {
  errorMessage: string;
  datatestid: string;
}

const CommonErrorMessage: FC<CommonErrorMessageProps> = ({ errorMessage, datatestid }) => {
  return (
    <Typography variant="caption" color="error" data-testid={datatestid}>
      {errorMessage}
    </Typography>
  );
};

export default CommonErrorMessage;
