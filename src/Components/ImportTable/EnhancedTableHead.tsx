import React from 'react';
import { Context } from '../../Context';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Checkbox from '@material-ui/core/Checkbox';
import TableSortLabel from '@material-ui/core/TableSortLabel';

const headRows = [
  {
    id: 'Publikasjon',
    numeric: false,
    disablePadding: false,
    label: 'Publikasjon',
  },
  { id: 'category', numeric: true, disablePadding: false, label: 'Kategori' },
  { id: 'source', numeric: true, disablePadding: false, label: 'Kilde' },
  {
    id: 'date',
    numeric: true,
    disablePadding: false,
    label: 'Dato opprettet',
  },
  {
    id: 'Eierinstitusjon',
    numeric: true,
    disablePadding: false,
    label: 'Eierinstitusjon',
  },
  {
    id: 'Forfattere',
    numeric: true,
    disablePadding: false,
    label: 'Forfatterliste',
  },
];

enum Order {
  asc = 'asc',
  desc = 'desc',
}

interface EnhancedTableHeadProps {
  order: Order;
  orderBy: string;
  onRequestSort: (property: string) => void;
  checkAll: (status: boolean) => void;
}

export default function EnhancedTableHead(props: EnhancedTableHeadProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property: string) => {
    onRequestSort(property);
  };
  const { state, dispatch } = React.useContext(Context);

  return (
    <TableHead>
      <TableRow>
        <TableCell component="td" scope="row" padding="checkbox">
          <Checkbox
            key="allPubs"
            checked={state.allChecked}
            onClick={(e) => {
              e.stopPropagation();
              props.checkAll(!state.allChecked);
            }}
            onChange={(e) => {
              e.stopPropagation();
              const temp = !state.allChecked;
              dispatch({ type: 'allChecked', payload: temp });
            }}
          />
        </TableCell>
        {headRows.map((row) => (
          <TableCell
            key={row.id}
            align={row.numeric ? 'right' : 'left'}
            padding={row.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === row.id ? order : false}>
            <TableSortLabel
              active={orderBy === row.id}
              direction={order}
              onClick={() => createSortHandler(row.id)}
              disabled={!(row.id !== 'Eierinstitusjon' && row.id !== 'Publikasjon' && row.id !== 'Forfattere')}>
              {row.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
