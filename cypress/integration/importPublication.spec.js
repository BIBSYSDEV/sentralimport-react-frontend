import mockImportData from '../../src/utils/mockImportData.json';
import { mockSaveErrorResponse } from '../../src/utils/mockdata';
import mockCristinPublications from '../../src/utils/mockCristinPublications.json';

context('import publication', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/');
  });

  it('can save an publication', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[0].pubId}"]`).click();
    cy.get(`[data-testid="duplication-modal-ok-button"]`).click();
    cy.get(`[data-testid="import-publication-button"]`).click();
    cy.get(`[data-testid="confirm-import-dialog-ok"]`).click();
    cy.get('#notistack-snackbar').contains('Importerte publikasjon');
    cy.get(`[data-testid="duplicate-check-modal"]`).should('not.exist');
    cy.get(`[data-testid="import-modal"]`).should('not.exist');
  });

  it('can update an publication', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[0].pubId}"]`).click();
    cy.get(`[data-testid="duplication-result-radio-${mockCristinPublications[0].cristin_result_id}"]`).click();
    cy.get(`[data-testid="duplication-modal-ok-button"]`).click();
    cy.get(`[data-testid="import-publication-button"]`).click();
    cy.get(`[data-testid="confirm-import-dialog-ok"]`).click();
    cy.get('#notistack-snackbar').contains('Importerte publikasjon');
    cy.get(`[data-testid="duplicate-check-modal"]`).should('not.exist');
    cy.get(`[data-testid="import-modal"]`).should('not.exist');
  });

  it('handles errors when saving publication', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[1].pubId}"]`).click();
    cy.get(`[data-testid="duplication-modal-ok-button"]`).click();
    cy.get(`[data-testid="import-publication-button"]`).click();
    cy.get(`[data-testid="confirm-import-dialog-ok"]`).click();
    cy.get(`[data-testid="import-publication-errors"]`).contains('Noe gikk galt med import av publikasjon med pub-id');
    cy.get(`[data-testid="import-publication-errors"]`).contains(mockSaveErrorResponse.errors[0]);
    cy.get(`[data-testid="import-publication-errors"]`).contains(mockSaveErrorResponse.response_id);
    cy.get(`[data-testid="compare-modal"]`).should('exist');
    cy.get(`[data-testid="import-publication-cancel-button"]`).should('exist').should('not.be.disabled');
  });
});
