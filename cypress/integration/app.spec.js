import React from 'react';
import { mockImportPublication1 } from '../../src/utils/mockdata';
import mockImportData from '../../src/utils/mockImportData.json';

context('application', () => {
  it('shows the main components of the mainpage', () => {
    cy.visit('/');
    cy.get('[data-testid="publication-year-panel"]').should('exist');
    cy.get('[data-testid="quantity-table-panel"]').should('exist');
    cy.get('[data-testid="filter-panel"]').should('exist');
    cy.get('[data-testid="log-panel"]').should('exist');
    cy.get('[data-testid="import-table-panel"]').should('exist');
  });

  it('shows data in the quantity table', () => {
    cy.visit('/');
    cy.get('[data-testid="quantity-table-panel"]').should('exist');
    cy.get('[data-testid="quantity-table-total"]').contains(/^100$/); //exact match
    cy.get('[data-testid="quantity-table-imported"]').contains(/^1$/);
    cy.get('[data-testid="quantity-table-not-imported"]').contains(/^2$/);
    cy.get('[data-testid="quantity-table-not-relevant"]').contains(/^3$/);
  });

  it('institution-filter has data', () => {
    cy.visit('/');
    cy.get('[data-testid="institution-filter-wrapper"] input[type=text]').click();
    cy.contains('SINTEF Narvik');
  });

  it('can show import-data', () => {
    cy.visit('/');
    cy.get('[data-testid="import-table-panel"]').contains(mockImportData[0].languages[0].title);
    cy.get('[data-testid="import-table-panel"]').contains(mockImportData[0].categoryName);
    cy.get('[data-testid="import-table-panel"]').contains(mockImportData[0].sourceName);
    cy.get('[data-testid="import-table-panel"]').contains(mockImportData[0].registered);
    cy.get('[data-testid="import-table-panel"]').contains(mockImportData[0].doi);
  });

  it('can search post with doi', () => {
    cy.visit('/');
    cy.get('[data-testid="doi-filter"]').type(mockImportPublication1.doi);
    cy.get('[data-testid="import-table-panel"]').contains(mockImportPublication1.languages[0].title);
  });

  it('saves contributor with foreign institution with cristin-id - institution should be kept', () => {
    cy.visit('/');
    cy.get('[data-testid="doi-filter"]').type(mockImportPublication1.doi);
    cy.get(`[data-testid="import-table-row-${mockImportPublication1.pubId}"]`).click();
    cy.get(`[data-testid="result-modal-ok-button"]`).click();
    cy.get(`[data-testid="open-contributors-modal-button"]`).click();
    //institusjon skal ikke skifte navn
    cy.get(`[data-testid="contributor-form-0"`).contains(
      mockImportPublication1.authors[0].institutions[0].institutionName
    );
    cy.get(`[data-testid="contributor-save-button-0"]`).click();
    cy.get(`[data-testid="contributor-for-import-wrapper-0"`).contains(
      mockImportPublication1.authors[0].institutions[0].institutionName
    );
  });

  it('saves contributor with foreign institution without cristin-id - institution should be replaced by nationality', () => {
    cy.visit('/');
    cy.get(`[data-testid="import-table-row-${mockImportData[0].pubId}"]`).click();
    cy.get(`[data-testid="result-modal-ok-button"]`).click();
    cy.get(`[data-testid="open-contributors-modal-button"]`).click();
    cy.get(`[data-testid="contributor-form-0"`).contains('China (Ukjent institusjon');
    cy.get(`[data-testid="contributor-save-button-0"]`).click();
    cy.get(`[data-testid="contributor-for-import-wrapper-0"`).contains('China (Ukjent institusjon');
  });
});
