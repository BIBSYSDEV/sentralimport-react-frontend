import React, { FC } from 'react';
import { Radio, Typography } from '@material-ui/core';
import { CristinPublication, InternationalStandardNumber, UrlTypes } from '../../types/PublicationTypes';
import styled from 'styled-components';
import { Colors } from '../../assets/styles/StyleConstants';
import { generateAuthorPresentationForCristinAuthors } from '../../utils/contributorUtils';

const StyledResultItem = styled.li`
  display: flex;
  align-items: center;
  width: 100%;
  border-left: 0.4rem solid ${Colors.PURPLE};
  margin-left: 0.4rem;
  margin-bottom: 1rem;
  padding: 0 0 0 0.2rem;
  word-wrap: break-word;
`;

const StyledTitleTypography = styled(Typography)`
  color: ${Colors.PURPLE};
  && {
    margin: 0 0 0.5rem;
    font-weight: bold;
    line-height: 1.2;
  }
`;

const StyledMetaDataTypography = styled(Typography)`
  color: ${Colors.BLACK};
  && {
    font-size: 0.8rem;
  }
`;

const StyledCategoryTypography = styled(StyledMetaDataTypography)`
  && {
    font-weight: 900;
  }
`;

const StyledStandardNumberTypography = styled(StyledMetaDataTypography)`
  && {
    font-style: italic;
  }
`;

const StyledWarningTypography = styled(StyledMetaDataTypography)`
  color: ${Colors.WARNING};
  && {
    font-weight: 700;
  }
`;

const StyledResultLink = styled.a`
  margin-left: 0.5rem;
  &:hover {
    color: ${Colors.PURPLE};
  }
`;

interface ResultItemProps {
  cristinPublication: CristinPublication;
}

export function extractDoiFromCristinPublication(cristinPublication: CristinPublication) {
  const doiLink = 'https://doi.org/';
  const url = cristinPublication.links?.find((link) => link.url_type === UrlTypes.Doi)?.url;
  return url ? url.replaceAll(doiLink, '') : '';
}

const ResultItem: FC<ResultItemProps> = ({ cristinPublication }) => {
  const doi = extractDoiFromCristinPublication(cristinPublication);

  return (
    <div>
      <StyledResultItem
        key={cristinPublication.cristin_result_id}
        data-testid={`duplication-result-${cristinPublication.cristin_result_id}`}>
        <Radio
          data-testid={`duplication-result-radio-${cristinPublication.cristin_result_id}`}
          value={cristinPublication.cristin_result_id}
          aria-label="Duplikat"
        />
        <StyledResultLink
          href={process.env.REACT_APP_LINK_URL + '/results/show.jsf?id=' + cristinPublication.cristin_result_id}
          target="_blank"
          rel="noopener noreferrer">
          <StyledTitleTypography>
            {cristinPublication.title && cristinPublication.title[cristinPublication.original_language]}
          </StyledTitleTypography>
          {cristinPublication.category.name.nb && (
            <StyledCategoryTypography>{cristinPublication.category.name.nb}</StyledCategoryTypography>
          )}
          <StyledMetaDataTypography>
            {generateAuthorPresentationForCristinAuthors(cristinPublication.authors)}
          </StyledMetaDataTypography>
          <StyledStandardNumberTypography>
            {cristinPublication.international_standard_numbers &&
              cristinPublication.international_standard_numbers?.map(
                (issn: InternationalStandardNumber) => 'ISSN ' + issn.type + ': ' + issn.value + '; '
              )}
          </StyledStandardNumberTypography>
          {cristinPublication.journal ? (
            <StyledMetaDataTypography>{cristinPublication.journal?.name}</StyledMetaDataTypography>
          ) : (
            <StyledWarningTypography
              data-testid={`duplication-result-${cristinPublication.cristin_result_id}-journal-warning`}>
              Tidskrift mangler
            </StyledWarningTypography>
          )}
          <StyledMetaDataTypography>
            {cristinPublication.year_published + ';'}
            {cristinPublication.volume && cristinPublication.volume + ';'}
            {cristinPublication.pages?.from && cristinPublication.pages.from + '-'}
            {cristinPublication.pages?.to && cristinPublication.pages.to + ';'}
            {doi && ' doi:' + doi}
          </StyledMetaDataTypography>
        </StyledResultLink>
      </StyledResultItem>
    </div>
  );
};

export default ResultItem;
