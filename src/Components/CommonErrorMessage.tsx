import { Typography } from '@material-ui/core';
import React, { FC } from 'react';

interface CommonErrorMessageProps {
  errorMessage: string;
}

const CommonErrorMessage: FC<CommonErrorMessageProps> = ({ errorMessage }) => {
  return (
    <Typography variant="caption" color="error">
      {errorMessage}
    </Typography>
  );
};

export default CommonErrorMessage;
