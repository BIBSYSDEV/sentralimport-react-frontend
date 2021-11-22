import React, { FC } from 'react';
import { Button } from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import styled from 'styled-components';

const StyledOrderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

interface ContributorOrderComponentProps {
  row: any;
  setContributors: any;
  contributors: any;
}

enum Direction {
  UP = 0,
  DOWN = 1,
}

const ContributorOrderComponent: FC<ContributorOrderComponentProps> = ({ row, setContributors, contributors }) => {
  const handleOrderContributors = (author: any, direction: Direction) => {
    const copy = [...contributors];
    const index = author.toBeCreated.order - 1;
    let movedToOrder: number;
    if (direction === Direction.UP) {
      copy[index] = copy[index - 1];
      copy[index - 1] = author;

      movedToOrder = index;

      setContributors((previousState: any) =>
        previousState.map((contributor: any, i: number) => {
          if (i === index) {
            return {
              ...copy[i],
              toBeCreated: {
                ...copy[i].toBeCreated,
                order: index + 1,
              },
            };
          }
          if (i === index - 1) {
            return {
              ...copy[i],
              toBeCreated: {
                ...copy[i].toBeCreated,
                order: movedToOrder,
              },
            };
          }
          return copy[i];
        })
      );
    } else {
      copy[index] = copy[index + 1];
      copy[index + 1] = author;

      movedToOrder = index + 2;

      setContributors((previousState: any) =>
        previousState.map((contributor: any, i: number) => {
          if (i === index) {
            return {
              ...copy[i],
              toBeCreated: {
                ...copy[i].toBeCreated,
                order: index + 1,
              },
            };
          }
          if (i === index + 1) {
            return {
              ...copy[i],
              toBeCreated: {
                ...copy[i].toBeCreated,
                order: movedToOrder,
              },
            };
          }
          return copy[i];
        })
      );
    }
  };

  return (
    <StyledOrderWrapper>
      {row.toBeCreated.order > 1 && (
        <Button
          aria-label="flytt opp"
          data-testid={`move-up-button-${row.toBeCreated.order}`}
          onClick={() => handleOrderContributors(row, Direction.UP)}>
          <KeyboardArrowUpIcon />
        </Button>
      )}
      <div>
        {row.toBeCreated.order === row.imported.order
          ? row.toBeCreated.order
          : row.toBeCreated.order + ' (tidl. ' + row.imported.order + ')'}
      </div>
      {row.toBeCreated.order < contributors.length && (
        <Button
          aria-label="flytt ned"
          data-testid={`move-down-button-${row.toBeCreated.order}`}
          onClick={() => handleOrderContributors(row, Direction.DOWN)}>
          <KeyboardArrowDownIcon />
        </Button>
      )}
    </StyledOrderWrapper>
  );
};

export default ContributorOrderComponent;
