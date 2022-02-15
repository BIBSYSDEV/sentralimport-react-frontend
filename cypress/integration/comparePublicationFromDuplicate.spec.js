import mockImportData from '../../src/utils/mockImportData.json';
import mockCristinPublications from '../../src/utils/mockCristinPublications.json';

context('importFromDuplicate', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/');
  });

  it('can open compare-modal from duplicate-cristin-post', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[1].pubId}"]`).click();

    cy.get(`[data-testid="duplication-result-radio-688231"]`).click();
    cy.get(`[data-testid="duplication-modal-ok-button"]`).click();

    cy.get(`[data-testid="importdata-pubid"]`).contains(mockImportData[1].pubId);
    cy.get(`[data-testid="cristindata-id"]`).contains(mockCristinPublications[0].cristin_result_id);

    cy.get(`[data-testid="importdata-source"]`).contains(mockImportData[1].externalId);
    cy.get(`[data-testid="importdata-source"]`).contains(mockImportData[0].sourceName);
    cy.get(`[data-testid="cristindata-source"]`).contains(mockCristinPublications[0].import_sources[0].source_name);
    cy.get(`[data-testid="cristindata-source"]`).contains(
      mockCristinPublications[0].import_sources[0].source_reference_id
    );

    cy.get(`[data-testid="importdata-journal-title"]`).contains(mockImportData[1].channel.title);
    cy.get(`[data-testid="cristindata-journal-for-duplicate"]`).contains(mockCristinPublications[0].journal.name);

    cy.get(`[data-testid="importdata-year"]`).contains(mockImportData[1].yearPublished);
    cy.get(`[data-testid="cristindata-year-for-duplicate"]`).contains(mockCristinPublications[0].year_published);

    cy.get(`[data-testid="importdata-category"]`).contains(mockImportData[1].categoryName);
    cy.get(`[data-testid="cristindata-category-for-duplicate"]`).contains(mockCristinPublications[0].category.name.nb);

    cy.get(`[data-testid="duplicate-warning-box"]`).should('exist');
    cy.get(`[data-testid="duplicate-warning-publication-link"]`)
      .should('have.attr', 'href')
      .and('include', `results/show.jsf?id=${mockCristinPublications[0].cristin_result_id}`);
    cy.get(`[data-testid="open-contributors-modal-button"]`).should('not.exist');
    cy.get(`[data-testid="import-publication-button"]`).should('exist').should('not.be.disabled');
  });

  it('can open compare-modal from duplicate-cristin-post that has errors', () => {
    //year_published has wrong format, journal is missing and category has an illegal value
    cy.get(`[data-testid="import-table-row-${mockImportData[0].pubId}"]`).click();

    cy.get(`[data-testid="search-panel-title-checkbox"]`).click();
    cy.get(`[data-testid="search-panel-retry-search-button"]`).click();

    cy.get(`[data-testid="duplication-result-radio-${mockCristinPublications[4].cristin_result_id}"]`).click();
    cy.get(`[data-testid="duplication-modal-ok-button"]`).click();

    cy.get(`[data-testid="import-publication-button"]`).should('exist').should('not.be.disabled');
    cy.get(`[data-testid="compare-form-error"]`).should('not.exist');
  });
});
