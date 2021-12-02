import React, { FC } from 'react';
import { Button, Card, CardContent, Collapse } from '@material-ui/core';
import { ContributorType } from '../../types/ContributorTypes';
import ContributorSearchResultItem from './ContributorSearchResultItem';

interface ContributorSearchPanelProps {
  searchResult: any[];
  collapsed: boolean;
  handleChoose: (author: any) => void;
  handleAbort: () => void;
}

const ContributorSearchPanel: FC<ContributorSearchPanelProps> = ({
  searchResult,
  collapsed,
  handleChoose,
  handleAbort,
}) => {
  return searchResult.length > 0 ? (
    <Collapse in={collapsed}>
      <Card>
        <CardContent>
          {searchResult.map((author: ContributorType) => (
            <ContributorSearchResultItem
              key={author.cristin_person_id}
              contributor={author}
              handleChoose={handleChoose}
            />
          ))}
        </CardContent>
        <Button color="primary" onClick={handleAbort}>
          Lukk
        </Button>
      </Card>
    </Collapse>
  ) : (
    <></>
  );
};

export default ContributorSearchPanel;
