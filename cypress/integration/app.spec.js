import React from 'react';

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
});
