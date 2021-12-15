import mockImportData from '../../src/utils/mockImportData.json';
import { Colors } from '../../src/assets/styles/StyleConstants';
import { mockForbiddenPerson, mockPersonWithoutAffiliationAttribute } from '../../src/utils/mockdata';

context('contributor badges', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/');
  });

  /*
  it('shows bagdes on verified cristin person from importdata', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[1].pubId}"]`).click();
    cy.get('[data-testid="duplication-modal-ok-button"]').click();
    cy.get('[data-testid="open-contributors-modal-button"]').click();
    cy.get('[data-testid="contributor-form-0-name"]').should('have.css', 'color', Colors.Text.GREEN);
    cy.get(`[data-testid="verified-contributor-badge-${mockPerson.cristin_person_id}"]`).should('exist');
    cy.get('[data-testid="contributor-form-2-name"]').should('have.css', 'color', Colors.Text.OPAQUE_54_BLACK);
  });

   */

  it('retains contributor badges from the search panel', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[1].pubId}"]`).click();
    cy.get('[data-testid="duplication-modal-ok-button"]').click();
    cy.get('[data-testid="open-contributors-modal-button"]').click();
    cy.wait(500);
    cy.get('[data-testid="contributor-search-button-2"]').click();
    cy.wait(500);

    //choose unknown cristin author:
    cy.get(`[data-testid="add-only-person-${mockForbiddenPerson.cristin_person_id}"]`).click();
    cy.get('[data-testid="contributor-form-2-name"]').should('have.css', 'color', Colors.Text.OPAQUE_54_BLACK);
    cy.get(`[data-testid="unknown-verified-contributor-badge-${mockForbiddenPerson.cristin_person_id}"]`).should(
      'exist'
    );

    //Choose not-verified cristin author:
    cy.get('[data-testid="contributor-search-button-2"]').click();
    cy.get(
      `[data-testid="add-person-and-affiliations-${mockPersonWithoutAffiliationAttribute.cristin_person_id}"]`
    ).click();
    cy.get(
      `[data-testid="not-verified-contributor-badge-${mockPersonWithoutAffiliationAttribute.cristin_person_id}"]`
    ).should('exist');

    //Choose no cristin author:
    cy.get('[data-testid="contributor-search-button-2"]').click();
    cy.wait(500);
    cy.get('[data-testid="choose-text-field-person-2"]').click();
    cy.get(
      `[data-testid="not-verified-contributor-badge-${mockPersonWithoutAffiliationAttribute.cristin_person_id}"]`
    ).should('not.exist');
  });
});
