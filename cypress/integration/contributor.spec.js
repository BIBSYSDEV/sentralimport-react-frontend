import {
  mockImportPublication1,
  mockPerson,
  mockPersonDetailed,
  mockPersonDetailedWithoutActiveAffiliations,
  mockUnits,
  cristinIDWithoutActiveAffiliation,
  cristinIDWithoutAffiliationAttribute,
  cristinIdForbiddenPerson,
} from '../../src/utils/mockdata';
import mockImportData from '../../src/utils/mockImportData.json';

context('contributor', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/');
  });

  it('shows contributor-list', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[0].pubId}"]`).click();
    cy.get(`[data-testid="duplication-modal-ok-button"]`).click();
    cy.get(`[data-testid="open-contributors-modal-button"]`).click();

    cy.get(`[data-testid="creator-name-1"]`).contains(mockImportData[0].authors[0].firstname);
    cy.get(`[data-testid="creator-name-1"]`).contains(mockImportData[0].authors[0].surname);

    cy.get(`[data-testid="creator-institutions-1"]`).contains(mockImportData[0].authors[0].institutions[0].unitName);
    cy.get(`[data-testid="creator-institutions-1"]`).contains(mockImportData[0].authors[0].institutions[0].countryCode);
    cy.get(`[data-testid="creator-institutions-1"]`).contains(
      mockImportData[0].authors[0].institutions[0].institutionName
    );
    cy.get(`[data-testid="creator-name-2"]`).contains(mockImportData[0].authors[1].firstname);
    cy.get(`[data-testid="creator-name-2"]`).contains(mockImportData[0].authors[1].surname);
    cy.get(`[data-testid="creator-name-3"]`).contains(mockImportData[0].authors[2].firstname);
    cy.get(`[data-testid="creator-name-3"]`).contains(mockImportData[0].authors[2].surname);

    cy.get(`[data-testid="contributor-back-button"]`).should('exist');
    cy.get(`[data-testid="add-contributor-button`).should('exist');
  });

  it('can move contrinutor', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[0].pubId}"]`).click();
    cy.get(`[data-testid="duplication-modal-ok-button"]`).click();
    cy.get(`[data-testid="open-contributors-modal-button"]`).click();

    cy.get(`[data-testid="creator-name-1"]`).contains(mockImportData[0].authors[0].firstname);
    cy.get(`[data-testid="creator-name-1"]`).contains(mockImportData[0].authors[0].surname);
    cy.get(`[data-testid="creator-name-2"]`).contains(mockImportData[0].authors[1].firstname);
    cy.get(`[data-testid="creator-name-2"]`).contains(mockImportData[0].authors[1].surname);
    cy.get(`[data-testid="move-down-button-1"]`).click();
    cy.get(`[data-testid="creator-name-1"]`).contains(mockImportData[0].authors[1].firstname);
    cy.get(`[data-testid="creator-name-1"]`).contains(mockImportData[0].authors[1].surname);
    cy.get(`[data-testid="creator-name-2"]`).contains(mockImportData[0].authors[0].firstname);
    cy.get(`[data-testid="creator-name-2"]`).contains(mockImportData[0].authors[0].surname);
    cy.get(`[data-testid="move-up-button-2"]`).click();
    cy.get(`[data-testid="creator-name-1"]`).contains(mockImportData[0].authors[0].firstname);
    cy.get(`[data-testid="creator-name-1"]`).contains(mockImportData[0].authors[0].surname);
    cy.get(`[data-testid="creator-name-2"]`).contains(mockImportData[0].authors[1].firstname);
    cy.get(`[data-testid="creator-name-2"]`).contains(mockImportData[0].authors[1].surname);
  });

  it('can add contributor', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[0].pubId}"]`).click();
    cy.get(`[data-testid="duplication-modal-ok-button"]`).click();
    cy.get(`[data-testid="open-contributors-modal-button"]`).click();

    cy.get(`[data-testid="contributor-line-7"]`).should('not.exist');
    cy.get(`[data-testid="add-contributor-button`).click();
    cy.get(`[data-testid="contributor-line-7"]`).should('exist');
  });

  it('can delete contributor', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[0].pubId}"]`).click();
    cy.get(`[data-testid="duplication-modal-ok-button"]`).click();
    cy.get(`[data-testid="open-contributors-modal-button"]`).click();

    cy.get(`[data-testid="creator-name-1"]`).contains(mockImportData[0].authors[0].firstname);
    cy.get(`[data-testid="creator-name-1"]`).contains(mockImportData[0].authors[0].surname);
    cy.get(`[data-testid="contributor-delete-button-0"]`).click();
    cy.get(`[data-testid="dialog-confirm-button"]`).click();
    cy.get(`[data-testid="creator-name-1"]`).contains(mockImportData[0].authors[1].firstname);
    cy.get(`[data-testid="creator-name-1"]`).contains(mockImportData[0].authors[1].surname);
  });

  it('saves contributor with foreign institution with cristin-id - institution should be kept', () => {
    cy.get('[data-testid="doi-filter"]').type(mockImportPublication1.doi);
    cy.get(`[data-testid="import-table-row-${mockImportPublication1.pubId}"]`).click();
    cy.get(`[data-testid="duplication-modal-ok-button"]`).click();
    cy.get(`[data-testid="open-contributors-modal-button"]`).click();
    //institusjon skal ikke skifte navn
    cy.get(`[data-testid="contributor-form-0"]`).contains(
      mockImportPublication1.authors[0].institutions[0].institutionName
    );
    cy.get(`[data-testid="contributor-save-button-0"]`).click();
    cy.get(`[data-testid="contributor-for-import-wrapper-0"]`).contains(
      mockImportPublication1.authors[0].institutions[0].institutionName
    );
  });

  it('saves contributor with foreign institution without cristin-id - institution should be replaced by nationality', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[0].pubId}"]`).click();
    cy.get(`[data-testid="duplication-modal-ok-button"]`).click();
    cy.get(`[data-testid="open-contributors-modal-button"]`).click();

    cy.get(`[data-testid="contributor-form-1"]`).contains('China (Ukjent institusjon');
    cy.get(`[data-testid="contributor-save-button-1"]`).click();
    cy.get(`[data-testid="contributor-for-import-wrapper-1"]`).contains('China (Ukjent institusjon');
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
    cy.get(`[data-testid=person-limited-access-${cristinIdForbiddenPerson}]`).should(
      'have.text',
      'Kan ikke hente inn institusjoner for denne bidragsyteren.'
    );
  });
});
