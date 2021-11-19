import {
  mockImportPublication1,
  mockPerson,
  mockPersonDetailed,
  mockPersonDetailedWithoutActiveAffiliations,
  mockUnits,
  cristinIDWithoutActiveAffiliation,
  cristinIDWithoutAffiliationAttribute,
} from '../../src/utils/mockdata';
import mockImportData from '../../src/utils/mockImportData.json';

context('contributor', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/');
  });

  it('saves contributor with foreign institution with cristin-id - institution should be kept', () => {
    cy.get('[data-testid="doi-filter"]').type(mockImportPublication1.doi);
    cy.get(`[data-testid="import-table-row-${mockImportPublication1.pubId}"]`).click();
    cy.get(`[data-testid="duplication-modal-ok-button"]`).click();
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
    cy.get(`[data-testid="duplication-modal-ok-button"]`).click();
    cy.get(`[data-testid="open-contributors-modal-button"]`).click();
    cy.get(`[data-testid="contributor-form-0"`).contains('China (Ukjent institusjon');
    cy.get(`[data-testid="contributor-save-button-0"]`).click();
    cy.get(`[data-testid="contributor-for-import-wrapper-0"`).contains('China (Ukjent institusjon');
  });

  it('hides inactive affiliations for authors with cristin-id', () => {
    cy.get('[data-testid="import-table-row-610213"]').click();
    cy.get('[data-testid="duplication-modal-ok-button"]').click();
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

  it('hides inactive affiliations for authors when user is searching for contributors', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[1].pubId}"]`).click();
    cy.get('[data-testid="duplication-modal-ok-button"]').click();
    cy.get('[data-testid="open-contributors-modal-button"]').click();
    cy.get('[data-testid=contributor-search-button-2]').click();
    cy.get(
      `[data-testid=list-item-author-${mockPerson.cristin_person_id}-affiliations-${mockPersonDetailed.affiliations[1].institution.cristin_institution_id}]`
    ).should('exist');
    cy.get(`[data-testid=author-name-${cristinIDWithoutActiveAffiliation}]`).should('exist');
    cy.get(
      `[data-testid=list-item-author-${cristinIDWithoutActiveAffiliation}-affiliations-${mockPersonDetailedWithoutActiveAffiliations.affiliations[1].institution.cristin_institution_id}]`
    ).should('not.exist');
  });

  it('handles contributors without affilations', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[1].pubId}"]`).click();
    cy.get('[data-testid="duplication-modal-ok-button"]').click();
    cy.get('[data-testid="open-contributors-modal-button"]').click();
    cy.get('[data-testid=contributor-search-button-2]').click();
    cy.get(`[data-testid=author-name-${cristinIDWithoutAffiliationAttribute}]`).should('exist');
  });

  it('handles contributors with limited access', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[1].pubId}"]`).click();
    cy.get('[data-testid="duplication-modal-ok-button"]').click();
    cy.get('[data-testid="open-contributors-modal-button"]').click();
    cy.get('[data-testid=contributor-search-button-2]').click();
  });
});
