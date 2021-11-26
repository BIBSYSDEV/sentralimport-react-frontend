import mockImportData from '../../src/utils/mockImportData.json';

context('application', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/');
  });

  it('can save an publication', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[0].pubId}"]`).click();
    cy.get(`[data-testid="duplication-modal-ok-button"]`).click();
    cy.get(`[data-testid="import-publication-button"]`).click();
    cy.get(`[data-testid="confirm-import-dialog-ok"]`).click();
    cy.get('#notistack-snackbar').contains('Importerte ny publikasjon (Cristin-id:');
    cy.get(`[data-testid="duplicate-check-modal"]`).should('not.exist');
    cy.get(`[data-testid="import-modal"]`).should('not.exist');
  });

  it('handles errors when saving publication', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[1].pubId}"]`).click();
    cy.get(`[data-testid="duplication-modal-ok-button"]`).click();
    cy.get(`[data-testid="import-publication-button"]`).click();
    cy.get(`[data-testid="confirm-import-dialog-ok"]`).click();
    cy.get(`[data-testid="import-publication-errors"]`).contains('Noe gikk galt med import av publikasjon med pub-id');
    cy.get(`[data-testid="compare-modal"]`).should('exist');
    cy.get(`[data-testid="import-publication-cancel-button"]`).should('exist').should('not.be.disabled');
  });
});
