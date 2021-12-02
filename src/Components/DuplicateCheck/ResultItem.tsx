import ResultIcon from '../../assets/icons/result-active.svg';
import React, { FC } from 'react';
import '../../assets/styles/Results.scss';
import { Radio } from '@material-ui/core';
import { CristinPublication, InternationalStandardNumber } from '../../types/PublicationTypes';
import styled from 'styled-components';
import { ImportPublicationPerson } from '../../types/ContributorTypes';

const StyledTitle = styled.div`
  display: block;
  font-size: 1rem;
  margin: 0 0 0.5rem;
  font-weight: 500;
  line-height: 1.2;
`;

interface ResultItemProps {
  cristinPublication: CristinPublication;
}

const ResultItem: FC<ResultItemProps> = ({ cristinPublication }) => {
  return (
    <div>
      <li
        className={`card-horiz basic-background card-horiz-hover result`}
        key={cristinPublication.cristin_result_id}
        data-testid={`duplication-result-${cristinPublication.cristin_result_id}`}>
        <Radio value={cristinPublication.cristin_result_id} aria-label="Duplikat" />
        <a
          className={`result result`}
          href={process.env.REACT_APP_LINK_URL + '/results/show.jsf?id=' + cristinPublication.cristin_result_id}
          target="_blank"
          rel="noopener noreferrer">
          <div className="image-wrapper">
            <img src={ResultIcon} alt="result" />
          </div>
          <div className="content-wrapper">
            <StyledTitle data-testid="mytitle">
              {cristinPublication.title[cristinPublication.original_language]}
            </StyledTitle>
            <div className={`metacristinPublication`}>
              <p>
                {cristinPublication.authors.map(
                  (author: ImportPublicationPerson) => author.surname + ', ' + author.firstname + '; '
                ) + (cristinPublication.authors.length < cristinPublication.authorTotalCount && ' et al')}
              </p>
              <p className={`active`}>{cristinPublication.category.name.en}</p>
              <p className={`italic`}>
                {cristinPublication.international_standard_numbers &&
                  cristinPublication.international_standard_numbers?.map(
                    (issn: InternationalStandardNumber) => 'ISSN ' + issn.type + ': ' + issn.value + '; '
                  )}
              </p>
              <p>
                {cristinPublication.year_published}
                {cristinPublication.publisher && ', ' + cristinPublication.publisher.name}
              </p>
            </div>
          </div>
        </a>
      </li>
    </div>
  );
};

export default ResultItem;
