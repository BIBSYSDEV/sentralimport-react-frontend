import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import PeopleIcon from '@material-ui/icons/People';
import { ImportPublication } from '../../types/PublicationTypes';
import ImportPublicationPresentation from '../DuplicateCheck/ImportPublicationPresentation';
import styled from 'styled-components';
import { Colors } from '../../assets/styles/StyleConstants';

const reformatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('nb-NO', { month: '2-digit', day: '2-digit', year: 'numeric' });
};

const StyledTableRow = styled(TableRow)`
  display: flex;
  align-items: center;
  width: 100%;
  border-left: 0.4rem solid ${Colors.PURPLE};
  margin-left: 0.4rem;
  margin-bottom: 1rem;
  padding: 0 0 0 0.2rem;
  word-wrap: break-word;

  &:hover {
    text-decoration: none;
    cursor: pointer;
  }
`;

interface ImportTableListItemProps {
  importData: ImportPublication;
  setOpen: (status: boolean) => void;
  handleClick: (event: any, row: { row: any }) => void;
  handleKeyPress: (event: React.KeyboardEvent<HTMLButtonElement>, row: { row: any }) => void;
  handleOnBlur: (event: any) => void;
  handleOnFocus: (event: any) => void;
  checked: boolean;
  handleCheckBoxChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    importData: ImportPublication,
    index: number
  ) => void;
  index: number;
  handleAuthorClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, row: ImportPublication) => void;
}

export default function ImportTableListItem({
  importData,
  handleClick,
  handleKeyPress,
  handleOnBlur,
  handleOnFocus,
  checked,
  index,
  handleCheckBoxChange,
  handleAuthorClick,
}: ImportTableListItemProps) {
  const handleOwnerInstitutions = (row: ImportPublication) => {
    let inst: any[] = [];
    const authorList = row.authors;
    for (let h = 0; h < authorList.length; h++) {
      for (let i = 0; i < authorList[h].institutions.length; i++) {
        inst.push(authorList[h].institutions[i].acronym);
      }
    }
    inst = inst.filter(function (element, index) {
      return element !== undefined && inst.indexOf(element) === index;
    });

    return inst.map((name, i) => {
      return <p key={i}>{name}</p>;
    });
  };

  return (
    <StyledTableRow
      tabIndex={0}
      onClick={(event: any) => handleClick(event, { row: importData })}
      key={importData.pubId}
      role="checkbox"
      onKeyDown={(event: any) => handleKeyPress(event, { row: importData })}
      id={importData.pubId}
      onBlur={(event: any) => handleOnBlur(event)}
      onFocus={(event: any) => handleOnFocus(event)}
      hover
      data-testid={`import-table-row-${importData.pubId}`}>
      <TableCell component="td" scope="row" padding="none">
        <Checkbox
          key={importData.pubId}
          checked={checked}
          onClick={(e) => {
            e.stopPropagation();
          }}
          onChange={(event) => {
            handleCheckBoxChange(event, importData, index);
          }}
        />
      </TableCell>

      <TableCell>
        <ImportPublicationPresentation importPublication={importData} isInImportTable={true} />
      </TableCell>
      <TableCell align="right">
        <div>{importData.categoryName}</div>
      </TableCell>
      <TableCell align="right">{importData.sourceName}</TableCell>
      <TableCell align="right">{reformatDate(importData.registered)}</TableCell>
      <TableCell align="right">{handleOwnerInstitutions(importData)}</TableCell>
      <TableCell align="right">
        <IconButton
          data-testid={`open-author-list-modal-for-${importData.pubId}`}
          onClick={(e) => {
            handleAuthorClick(e, importData);
            e.stopPropagation();
          }}
          aria-label="Forfatterliste">
          <PeopleIcon />
        </IconButton>
      </TableCell>
    </StyledTableRow>
  );
}
