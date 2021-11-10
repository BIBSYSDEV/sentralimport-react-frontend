import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Skeleton from '@material-ui/lab/Skeleton';
import React from 'react';

function ContributorSkeleton() {
  return (
    <TableBody>
      {Array.from({ length: 5 }, (value, index) => (
        <TableRow hover id={'skeleton' + index} key={index} tabIndex={0}>
          <TableCell>
            <Skeleton variant="rect" width={40} height={20} />
          </TableCell>
          <TableCell>
            <Skeleton variant="rect" width="auto" height={118} />
          </TableCell>
          <TableCell>
            <Skeleton variant="rect" width="auto" height={118} />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}

export default ContributorSkeleton;
