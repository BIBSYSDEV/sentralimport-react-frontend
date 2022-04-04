import { mockImportPublication1, mockInstitutions } from '../../src/utils/mockdata';
import mockImportData from '../../src/utils/mockImportData.json';

context('application', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/');
  });

  it('shows the main components of the mainpage', () => {
    cy.get('[data-testid="filter-panel"]').should('exist');
    cy.get('[data-testid="log-panel"]').should('exist');
    cy.get('[data-testid="import-table-panel"]').should('exist');
  });

  it('shows data in the quantity data', () => {
    cy.get('[data-testid=import-status-total-quantity]').contains('Funnet for valgte år: 100');
    cy.get('[data-testid="import-status-imported"]').contains('(1)');
    cy.get('[data-testid="import-status-not-imported"]').contains('(2)');
    cy.get('[data-testid="import-status-not-relevant"]').contains('(3)');
  });

  it('institution-filter has data', () => {
    cy.get('[data-testid="insitution-select"]').click();
    cy.contains('SINTEF Narvik');
  });

  it('can show import-data', () => {
    cy.get('[data-testid="import-table-row-610220"]').contains(mockImportData[0].languages[0].title);
    cy.get('[data-testid="import-table-row-610220"]').contains(mockImportData[0].categoryName);
    cy.get('[data-testid="import-table-row-610220"]').contains(mockImportData[0].sourceName);
    cy.get('[data-testid="import-table-row-610220"]').contains('30.10.2021');
    cy.get('[data-testid="import-table-row-610220"]').contains(mockImportData[0].doi);

    cy.get('[data-testid="import-table-row-610213"]').contains(mockImportData[1].languages[0].title);
  });

  it('can show author modal for import-data', () => {
    cy.get('[data-testid="open-author-list-modal-for-610220"]').click();
    cy.get('[data-testid="author-list-name-0"]').contains(mockImportData[0].authors[0].surname);
    cy.get('[data-testid="author-list-name-1"]').contains(mockImportData[0].authors[1].surname);
    cy.get('[data-testid="author-list-name-2"]').contains(mockImportData[0].authors[2].surname);

    cy.get('[data-testid="author-list-name-0-verified-badge"]').should('exist');
    cy.get('[data-testid="author-list-name-1-verified-badge"]').should('not.exist');
  });

  it('can search post with doi', () => {
    cy.get('[data-testid="doi-filter"]').type(mockImportPublication1.doi);
    cy.get('[data-testid="import-table-panel"]').contains(mockImportPublication1.languages[0].title);
  });

  it('is possible to search for acronyms in filter institutions', () => {
    cy.get('[data-testid=filter-institution-select]').type('ntnu');
    cy.get(`#institution-select-option-0`).should('have.text', mockInstitutions[6].institution_name.nb);
    cy.get(`#institution-select-option-1`).should('have.text', mockInstitutions[5].institution_name.nb);
    cy.get(`#institution-select-option-0`).click();
    cy.get('#institution-select').should('have.value', mockInstitutions[6].institution_name.nb);
  });

  it('can show warning when import-data is missing journal', () => {
    cy.get('[data-testid="importdata-author-presentation-610214-journal-warning"]').contains('Tidskrift mangler');
    cy.get('[data-testid="importdata-author-presentation-610220-journal-warning"]').should('not.exist');
  });
});
