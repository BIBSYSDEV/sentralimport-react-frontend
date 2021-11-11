import { mockImportPublication1, mockPersonDetailed, mockUnits } from '../../src/utils/mockdata';
import mockImportData from '../../src/utils/mockImportData.json';

context('contributor', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/');
  });

  it('saves contributor with foreign institution with cristin-id - institution should be kept', () => {
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
    cy.get(`[data-testid="import-table-row-${mockImportData[0].pubId}"]`).click();
    cy.get(`[data-testid="result-modal-ok-button"]`).click();
    cy.get(`[data-testid="open-contributors-modal-button"]`).click();
    cy.get(`[data-testid="contributor-form-0"`).contains('China (Ukjent institusjon');
    cy.get(`[data-testid="contributor-save-button-0"]`).click();
    cy.get(`[data-testid="contributor-for-import-wrapper-0"`).contains('China (Ukjent institusjon');
  });

  it('hides in-active affiliations for authors with cristin-id', () => {
    cy.get('[data-testid="import-table-row-610213"]').click();
    cy.get('[data-testid="result-modal-ok-button"]').click();
    cy.get('[data-testid="open-contributors-modal-button"]').click();
    cy.get(
      `[data-testid="institution-${mockPersonDetailed.affiliations[1].institution.cristin_institution_id}-unit-${mockPersonDetailed.affiliations[1].unit.cristin_unit_id}-list-item"]`
    )
      .first()
      .should('have.text', `${mockUnits.unit_name.en}`);
    cy.get(
      `[data-testid="institution-${mockPersonDetailed.affiliations[0].institution.cristin_institution_id}-unit-${mockPersonDetailed.affiliations[0].unit.cristin_unit_id}-list-item"]`
    ).should('not.exist');
  });
});
