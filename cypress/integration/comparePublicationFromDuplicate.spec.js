import mockImportData from '../../src/utils/mockImportData.json';
import mockCristinPublications from '../../src/utils/mockCristinPublications.json';

context('importFromDuplicate', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/');
  });

  it('can open compare-modal from duplicate-cristin-post', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[0].pubId}"]`).click();
    cy.get(`[data-testid="duplication-result-radio-688231"]`).click();
    cy.get(`[data-testid="duplication-modal-ok-button"]`).click();

    cy.get(`[data-testid="importdata-pubid"]`).contains(mockImportData[0].pubId);
    cy.get(`[data-testid="cristindata-id"]`).contains(mockCristinPublications[0].cristin_result_id);

    cy.get(`[data-testid="importdata-source"]`).contains(mockImportData[0].externalId);
    cy.get(`[data-testid="importdata-source"]`).contains(mockImportData[0].sourceName);
    cy.get(`[data-testid="cristindata-source"]`).contains(mockCristinPublications[0].import_sources[0].source_name);
    cy.get(`[data-testid="cristindata-source"]`).contains(
      mockCristinPublications[0].import_sources[0].source_reference_id
    );

    cy.get(`[data-testid="importdata-journal-title"]`).contains(mockImportData[0].channel.title);
    cy.get(`[data-testid="cristindata-journal-title"]`).contains(mockCristinPublications[0].journal.name);
  });
});
