import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Checkbox from '@material-ui/core/Checkbox';
import { Markup } from 'interweave';
import { cleanTitleForMarkup } from '../../utils/stringUtils';
import IconButton from '@material-ui/core/IconButton';
import PeopleIcon from '@material-ui/icons/People';
import { ImportPublication } from '../../types/PublicationTypes';
import ResultIcon from '../../assets/icons/result-active.svg';
import { Typography } from '@material-ui/core';
import { ImportPublicationPerson } from '../../types/ContributorTypes';

const monsterPostStyle = {
  fontWeight: 700,
  color: '#e30000',
};

function reformatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('nb-NO', { month: '2-digit', day: '2-digit', year: 'numeric' });
}

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
  handleAuthorPress: (event: React.KeyboardEvent<HTMLButtonElement>, row: ImportPublication) => void;
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
  handleAuthorPress,
}: ImportTableListItemProps) {
  function filterTitle(row: ImportPublication) {
    if (row.languages) {
      return row.languages.filter((l) => l.original)[0].title;
    }
  }

  function countFoundPersons(persons: ImportPublicationPerson[]) {
    let personCount = 0;
    for (let i = 0; i < persons.length; i++) {
      if (persons[i].cristinId && persons[i].cristinId !== 0) {
        personCount++;
      }
    }
    return personCount;
  }

  function handleOwnerInstitutions(row: ImportPublication) {
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
  }

  return (
    <TableRow
      className="card-horiz basic-background result"
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
        <div>
          <div className="image-wrapper">
            <img src={ResultIcon} alt="result" />
          </div>
          <div className="content-wrapper">
            <h6 className={`result-title`}>
              <Markup content={cleanTitleForMarkup(filterTitle(importData) ?? '')} />
            </h6>
            <div className={`metadata`}>
              {importData.authors.slice(0, 5).map((author) => author.authorName + '; ')}
              {importData.authors.length > 5 ? ' et al ' : ''}
              {importData.authors.length > 100 ? (
                <div style={monsterPostStyle}> ({importData.authors.length}) Stort antall bidragsytere </div>
              ) : (
                <Typography paragraph variant="caption">
                  {`(${countFoundPersons(importData.authors)} av ${importData.authors.length} er verifisert)`}
                </Typography>
              )}
              <p className={`journal-name`}>
                {importData.channel && importData.channel.hasOwnProperty('title') ? importData.channel.title + ' ' : ''}
              </p>
              {importData.yearPublished + ';'}
              {importData.channel && importData.channel.volume ? importData.channel.volume + ';' : ''}
              {importData.channel && importData.channel.pageFrom ? importData.channel.pageFrom + '-' : ''}
              {importData.channel && importData.channel.pageTo ? importData.channel.pageTo : ''}
              {importData.doi ? ' doi:' + importData.doi : ''}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell align="right">
        <div>{importData.categoryName}</div>
      </TableCell>
      <TableCell align="right">{importData.sourceName}</TableCell>
      <TableCell align="right">{reformatDate(importData.registered)}</TableCell>
      <TableCell align="right">{handleOwnerInstitutions(importData)}</TableCell>
      <TableCell align="right">
        <IconButton
          onClick={(e) => {
            handleAuthorClick(e, importData);
            e.stopPropagation();
          }}
          onKeyDown={(e) => {
            handleAuthorPress(e, importData);
            e.stopPropagation();
          }}
          aria-label="Forfatterliste">
          <PeopleIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
