import mockImportData from '../../src/utils/mockImportData.json';
import { mockSavedPublication } from '../../src/utils/mockdata';

context('import publication', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/');
  });

  it('can show an empty list in a log', () => {
    cy.get(`[data-testid="show-log-modal"]`).click();
    cy.get(`[data-testid="no-log-content"]`).should('exist');
    cy.get(`[data-testid="log-publication-0"]`).should('not.exist');
  });

  it('can show a log over imported publications', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[0].pubId}"]`).click();
    cy.get(`[data-testid="duplication-modal-ok-button"]`).click();
    cy.get(`[data-testid="import-publication-button"]`).click();
    cy.get(`[data-testid="confirm-import-dialog-ok"]`).click();
    cy.get(`[data-testid="show-log-modal"]`).click();
    cy.get(`[data-testid="no-log-content"]`).should('not.exist');
    cy.get(`[data-testid="log-publication-0"]`).should('exist');
    cy.get(`[data-testid="log-publication-button-0"]`)
      .should('have.attr', 'href')
      .and('include', `results/show.jsf?id=${mockSavedPublication.cristin_result_id}`);
    cy.get(`[data-testid="log-publication-0"]`).contains(mockImportData[0].languages[0].title);
    cy.get(`[data-testid="log-publication-0"]`).contains(mockImportData[0].authors[0].surname);
  });
});
