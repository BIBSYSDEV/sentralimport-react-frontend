import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import Skeleton from '@material-ui/lab/Skeleton';
import TableRow from '@material-ui/core/TableRow';

interface PlaceHolderListItemProps {
  index: number;
}

export default function PlaceHolderListItem({ index }: PlaceHolderListItemProps) {
  return (
    <TableRow id={'skeleton' + index} role="checkbox" tabIndex={0}>
      <TableCell component="td" scope="row" padding="none" />
      <TableCell>
        <Skeleton variant="rect" width="auto" height={118} />
      </TableCell>
      <TableCell>
        <Skeleton variant="rect" width="auto" height={10} />
      </TableCell>
      <TableCell>
        <Skeleton variant="rect" width="auto" height={10} />
      </TableCell>
      <TableCell>
        <Skeleton variant="rect" width="auto" height={10} />
      </TableCell>
      <TableCell>
        <Skeleton variant="rect" width="auto" height={10} />
      </TableCell>
      <TableCell>
        <Skeleton variant="rect" width={40} height={40} style={{ float: 'right' }} />
      </TableCell>
    </TableRow>
  );
}
