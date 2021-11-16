import React from 'react';
import { Context } from '../../Context';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Checkbox from '@material-ui/core/Checkbox';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { SortValue } from '../../types/ContextType';
import styled from 'styled-components';
import { Colors } from '../../assets/styles/StyleConstants';
import { Order } from '../../types/PublicationTypes';

const StyledTableHead = styled(TableHead)`
  &.MuiTableHead-root {
    background-color: ${Colors.LIGHT_PURPLE};
    border-left: solid ${Colors.LIGHT_PURPLE} 5px;
  }
`;

const StyledTableCell = styled(TableCell)`
  &.MuiTableCell-root {
    padding-top: 0.2rem;
    padding-bottom: 0.3rem;
  }
`;

const headRows = [
  {
    id: SortValue.Publication,
    numeric: false,
    disablePadding: false,
    label: 'Publikasjon',
  },
  { id: SortValue.Category, numeric: true, disablePadding: false, label: 'Kategori' },
  { id: SortValue.Source, numeric: true, disablePadding: false, label: 'Kilde' },
  {
    id: SortValue.Date,
    numeric: true,
    disablePadding: false,
    label: 'Dato opprettet',
  },
  {
    id: SortValue.OwnerInstitution,
    numeric: true,
    disablePadding: false,
    label: 'Eierinstitusjon',
  },
  {
    id: SortValue.Authors,
    numeric: true,
    disablePadding: false,
    label: 'Forfatterliste',
  },
];

interface EnhancedTableHeadProps {
  order: Order;
  orderBy: string;
  onRequestSort: (property: SortValue) => void;
  checkAll: (status: boolean) => void;
}

export default function EnhancedTableHead(props: EnhancedTableHeadProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property: SortValue) => {
    onRequestSort(property);
  };
  const { state, dispatch } = React.useContext(Context);

  return (
    <StyledTableHead>
      <TableRow>
        <StyledTableCell component="td" scope="row" padding="checkbox">
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
        </StyledTableCell>
        {headRows.map((row) => (
          <StyledTableCell
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
          </StyledTableCell>
        ))}
      </TableRow>
    </StyledTableHead>
  );
}
