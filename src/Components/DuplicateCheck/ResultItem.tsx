import React, { FC } from 'react';
import { Radio, Typography } from '@material-ui/core';
import { CristinPublication, InternationalStandardNumber, UrlTypes } from '../../types/PublicationTypes';
import styled from 'styled-components';
import { Colors } from '../../assets/styles/StyleConstants';

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

const StyledStandardNumberTypography = styled(StyledMetaDataTypography)`
  && {
    font-style: italic;
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

const generateAuthorPresentation = (cristinPublication: CristinPublication) => {
  return cristinPublication.authors
    .slice(0, 5)
    .map((author: any) => [author.surname, author.first_name].join(', '))
    .join('; ')
    .concat(cristinPublication.authors.length > 3 ? ' et al.' : '');
};

export function extractDoiFromCristinPublication(cristinPublication: CristinPublication) {
  return cristinPublication.links?.find((link) => link.url_type === UrlTypes.Doi)?.url;
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
            <StyledMetaDataTypography>{cristinPublication.category.name.nb}</StyledMetaDataTypography>
          )}
          <StyledMetaDataTypography>{generateAuthorPresentation(cristinPublication)}</StyledMetaDataTypography>
          <StyledStandardNumberTypography>
            {cristinPublication.international_standard_numbers &&
              cristinPublication.international_standard_numbers?.map(
                (issn: InternationalStandardNumber) => 'ISSN ' + issn.type + ': ' + issn.value + '; '
              )}
          </StyledStandardNumberTypography>
          <StyledMetaDataTypography>{cristinPublication.journal?.name}</StyledMetaDataTypography>
          <StyledMetaDataTypography>
            {cristinPublication.year_published + ';'}
            {doi && ' doi:' + doi}
          </StyledMetaDataTypography>
        </StyledResultLink>
      </StyledResultItem>
    </div>
  );
};

export default ResultItem;
