import mockImportData from '../../src/utils/mockImportData.json';
import { mockAllJournals } from '../../src/utils/mockdata';

context('importModal', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/');
  });

  it('can validate new journal registration', () => {
    const mockInvalidIssn = '123412341234';
    cy.get(`[data-testid="import-table-row-${mockImportData[0].pubId}"]`).click();
    cy.get(`[data-testid="duplication-modal-ok-button"]`).click();
    cy.get(`#create-journal-header`).click();

    cy.get(`[data-testid="new-journal-form-issn-input"]`).type(mockInvalidIssn);
    cy.get(`[data-testid="submit-create-journal-button"]`).click();

    cy.waitFor(`#new-journal-title-helper-text`);
    cy.get(`#new-journal-title-helper-text`).contains('Tittel er et obligatorisk felt');
    cy.get(`#new-journal-issn-helper-text`).contains('SSN er ikke på korrekt format (NNNN-NNNC)');
    cy.get(`[data-testid="new-journal-form-error"]`).contains('Det er feil i tidsskrift-skjema');
    cy.get(`[data-testid="submit-create-journal-button"]`).should('exist');
  });
});
