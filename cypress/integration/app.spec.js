import { mockImportPublication1 } from '../../src/utils/mockdata';
import mockImportData from '../../src/utils/mockImportData.json';

context('application', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/');
  });

  it('shows the main components of the mainpage', () => {
    cy.get('[data-testid="publication-year-panel"]').should('exist');
    cy.get('[data-testid="filter-panel"]').should('exist');
    cy.get('[data-testid="log-panel"]').should('exist');
    cy.get('[data-testid="import-table-panel"]').should('exist');
  });

  it('shows data in the quantity data', () => {
    cy.get('[data-testid=import-status-total-quantity]').contains('Totalt antall: 100');
    cy.get('[data-testid="import-status-imported"]').contains('(1)');
    cy.get('[data-testid="import-status-not-imported"]').contains('(2)');
    cy.get('[data-testid="import-status-not-relevant"]').contains('(3)');
  });

  it('institution-filter has data', () => {
    cy.get('[data-testid="institution-filter-wrapper"] input[type=text]').click();
    cy.contains('SINTEF Narvik');
  });

  it('can show import-data', () => {
    cy.get('[data-testid="import-table-panel"]').contains(mockImportData[0].languages[0].title);
    cy.get('[data-testid="import-table-panel"]').contains(mockImportData[0].categoryName);
    cy.get('[data-testid="import-table-panel"]').contains(mockImportData[0].sourceName);
    cy.get('[data-testid="import-table-panel"]').contains('30.10.2021');
    cy.get('[data-testid="import-table-panel"]').contains(mockImportData[0].doi);
  });

  it('can search post with doi', () => {
    cy.get('[data-testid="doi-filter"]').type(mockImportPublication1.doi);
    cy.get('[data-testid="import-table-panel"]').contains(mockImportPublication1.languages[0].title);
  });
});
