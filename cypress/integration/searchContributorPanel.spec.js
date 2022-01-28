import mockImportData from '../../src/utils/mockImportData.json';
import {
  cristinIDWithoutActiveAffiliation,
  mockCristinIdForbiddenPerson,
  mockCristinIDWithoutAffiliationAttribute,
  mockPerson,
  mockPerson6,
  mockPersonDetailed,
  mockPersonDetailedWithoutActiveAffiliations,
} from '../../src/utils/mockdata';
import { Colors } from '../../src/assets/styles/StyleConstants';

context('Search contributor panel', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/');
  });

  it('handles searching manually', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[1].pubId}"]`).click();
    cy.get('[data-testid="duplication-modal-ok-button"]').click();
    cy.get('[data-testid="open-contributors-modal-button"]').click();

    cy.get('[data-testid="expand-contributor-accordion-button-0"]').click();
    cy.get(`[data-testid="contributor-retry-search-button-0"]`).click();
    cy.get(` [data-testid="author-name-9456892"]`).should('exist');
    cy.get(` [data-testid="author-name-1234567"]`).should('exist');
  });

  it('can validate search parameters', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[1].pubId}"]`).click();
    cy.get('[data-testid="duplication-modal-ok-button"]').click();
    cy.get('[data-testid="open-contributors-modal-button"]').click();

    cy.get('[data-testid="expand-contributor-accordion-button-0"]').click();
    cy.get('[data-testid="contributor-0-firstname-text-field-input"]').clear();
    cy.get(`[data-testid="contributor-retry-search-button-0"]`).click();
    cy.get(`[data-testid="contributor-0-form-error"]`).should('exist');

    cy.get('[data-testid="contributor-0-firstname-text-field-input"]').type('test');
    cy.get(`[data-testid="contributor-retry-search-button-0"]`).click();
    cy.get(`[data-testid="contributor-0-form-error"]`).should('not.exist');

    cy.get('[data-testid="contributor-0-firstname-text-field-input"]')
      .clear()
      .type('very veryveryveryveryveryveryvery long first name');
    cy.get(`[data-testid="contributor-retry-search-button-0"]`).click();
    cy.get(`[data-testid="contributor-0-form-error"]`).should('exist');

    cy.get('[data-testid="contributor-0-firstname-text-field-input"]').clear().type('test');
    cy.get('[data-testid="contributor-0-surname-text-field-input"]').clear();
    cy.get(`[data-testid="contributor-retry-search-button-0"]`).click();
    cy.get(`[data-testid="contributor-0-form-error"]`).should('exist');

    cy.get('[data-testid="contributor-0-surname-text-field-input"]')
      .clear()
      .type('very veryveryveryveryveryveryvery long last name');
    cy.get(`[data-testid="contributor-retry-search-button-0"]`).click();
    cy.get(`[data-testid="contributor-0-form-error"]`).should('exist');
  });

  it('handles contributors without affilations', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[1].pubId}"]`).click();
    cy.get('[data-testid="duplication-modal-ok-button"]').click();
    cy.get('[data-testid="open-contributors-modal-button"]').click();
    cy.get(`[data-testid=author-name-${mockCristinIDWithoutAffiliationAttribute}]`).first().should('exist');
  });

  it('hides inactive affiliations for authors when user is searching for contributors', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[1].pubId}"]`).click();
    cy.get('[data-testid="duplication-modal-ok-button"]').click();
    cy.get('[data-testid="open-contributors-modal-button"]').click();
    cy.get(
      `[data-testid=list-item-author-${mockPerson.surname}-affiliations-${mockPersonDetailed.affiliations[1].institution.cristin_institution_id}]`
    ).should('exist');
    cy.get(`[data-testid=author-name-${cristinIDWithoutActiveAffiliation}]`).should('exist');
    cy.get(
      `[data-testid=list-item-author-${cristinIDWithoutActiveAffiliation}-affiliations-${mockPersonDetailedWithoutActiveAffiliations.affiliations[1].institution.cristin_institution_id}]`
    ).should('not.exist');
  });

  it('displays verified and unverified contributors differently', () => {
    //active contributors are defined as person with identified_cristin_person = true AND at least one active affiliation.
    //getPersonDetailed may respond with not-authorized, in which case it is not possible to assert whether or not a contributor is verified
    const VerifiedText = 'Verifisert';
    const notVerifiedText = 'Ikke verifisert';
    const unknownVerificationText = 'Ukjent verifikasjonsstatus';
    cy.get(`[data-testid="import-table-row-${mockImportData[0].pubId}"]`).click();
    cy.get(`[data-testid="duplication-modal-ok-button"]`).click();
    cy.get(`[data-testid="open-contributors-modal-button"]`).click();
    cy.get(`[data-testid="author-name-${mockPerson.cristin_person_id}-verified-badge"]`)
      .first()
      .children('title')
      .first()
      .should('have.text', VerifiedText);
    cy.get(`[data-testid="author-name-${mockPerson.cristin_person_id}"]`).should(
      'have.css',
      'color',
      Colors.Text.GREEN
    );
    cy.get(`[data-testid="author-name-${cristinIDWithoutActiveAffiliation}-not-verified-badge"]`)
      .first()
      .children('title')
      .first()
      .should('have.text', notVerifiedText);
    cy.get(`[data-testid="author-name-${cristinIDWithoutActiveAffiliation}"]`)
      .first()
      .should('have.css', 'color', Colors.Text.OPAQUE_41_BLACK);
    cy.get(`[data-testid="author-name-${mockCristinIdForbiddenPerson}-uknown-verified-badge"]`)
      .first()
      .children('title')
      .first()
      .should('have.text', unknownVerificationText);
    cy.get(`[data-testid="author-name-${mockCristinIdForbiddenPerson}"]`)
      .first()
      .should('have.css', 'color', Colors.Text.OPAQUE_41_BLACK);
  });

  it('handles contributors with limited access', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[1].pubId}"]`).click();
    cy.get('[data-testid="duplication-modal-ok-button"]').click();
    cy.get('[data-testid="open-contributors-modal-button"]').click();
    cy.get(`[data-testid=person-limited-access-${mockCristinIdForbiddenPerson}]`)
      .first()
      .should('have.text', 'Kan ikke hente inn institusjoner for denne bidragsyteren.');
  });

  it('is possible to choose search and select a cristin person without also getting their affiliation', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[1].pubId}"]`).click();
    cy.get('[data-testid="duplication-modal-ok-button"]').click();
    cy.get('[data-testid="open-contributors-modal-button"]').click();
    cy.get(
      `[data-testid="list-item-author-${mockImportData[1].authors[4].surname}-affiliations-${mockImportData[1].authors[4].institutions[0].cristinInstitutionNr}-institution-name"]`
    ).should('exist');
    cy.get(`[data-testid="add-only-person-${mockPersonDetailed.cristin_person_id}"]`).first().click();
    cy.get(
      `[data-testid="list-item-author-${mockImportData[1].authors[4].surname}-affiliations-${mockImportData[1].authors[4].institutions[0].cristinInstitutionNr}-institution-name"]`
    );
  });

  it('is possible to search and replace both person and affiliations', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[1].pubId}"]`).click();
    cy.get('[data-testid="duplication-modal-ok-button"]').click();
    cy.get('[data-testid="open-contributors-modal-button"]').click();
    cy.get(
      `[data-testid="list-item-author-${mockImportData[1].authors[2].surname}-affiliations-${mockImportData[1].authors[2].institutions[0].cristinInstitutionNr}-institution-name"]`
    ).should('exist');
    cy.get(`[data-testid="add-person-and-affiliations-${mockPersonDetailed.cristin_person_id}"]`).first().click();
    cy.get(
      `[data-testid="list-item-author-${mockImportData[1].authors[2].surname}-affiliations-${mockImportData[1].authors[2].institutions[0].cristinInstitutionNr}-institution-name"]`
    ).should('not.exist');
  });

  it('is possible to search and replace only affiliation', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[1].pubId}"]`).click();
    cy.get('[data-testid="duplication-modal-ok-button"]').click();
    cy.get('[data-testid="open-contributors-modal-button"]').click();
    cy.get(
      `[data-testid="list-item-author-${mockImportData[1].authors[2].surname}-affiliations-${mockImportData[1].authors[2].institutions[0].cristinInstitutionNr}-institution-name"]`
    ).should('exist');
    cy.get(
      `[data-testid="add-only-affiliation-button-institution-${mockPersonDetailed.affiliations[1].institution.cristin_institution_id}"]`
    )
      .first()
      .click();
    cy.get(
      `[data-testid="add-affiliation-success-institution-${mockPersonDetailed.affiliations[1].institution.cristin_institution_id}"]`
    ).should('exist');
    cy.get(
      `[data-testid="add-only-affiliation-button-institution-${mockPersonDetailed.affiliations[1].institution.cristin_institution_id}"]`
    )
      .first()
      .click();
    cy.get(
      `[data-testid="add-only-affiliation-error-institution-${mockPersonDetailed.affiliations[1].institution.cristin_institution_id}"]`
    ).should('exist');
    cy.get('[data-testid="contributor-form-2-name"]').should('include.text', mockImportData[1].authors[2].surname);
  });

  it('shows the searchPanel expanded after adding new contributor', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[1].pubId}"]`).click();
    cy.get('[data-testid="duplication-modal-ok-button"]').click();
    cy.get('[data-testid="open-contributors-modal-button"]').click();
    cy.get('[data-testid="add-contributor-button"]').click();
    cy.get('#firstName6').should('have.value', '');
  });

  it('makes initial search not take up entire page by hiding excess searchResult', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[0].pubId}"]`).click();
    cy.get('[data-testid="duplication-modal-ok-button"]').click();
    cy.get('[data-testid="open-contributors-modal-button"]').click();
    cy.get(`[data-testid="author-name-${mockPerson6.cristin_person_id}"]`).should('not.exist');
    cy.get('[data-testid="search-panel-show-more-button-1"]').click();
    cy.get(`[data-testid="author-name-${mockPerson6.cristin_person_id}"]`).should('exist');
  });

  it('can validate long author names from import', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[4].pubId}"]`).click();
    cy.get('[data-testid="duplication-modal-ok-button"]').click();
    cy.get('[data-testid="open-contributors-modal-button"]').click();
    cy.get(`[data-testid="contributor-1-form-error"]`).should('exist');
  });

  it('makes initial search on non-active contributors', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[1].pubId}"]`).click();
    cy.get('[data-testid="duplication-modal-ok-button"]').click();
    cy.get('[data-testid="open-contributors-modal-button"]').click();
    cy.get(`[data-testid="contributor-search-results-header-for-0"]`).should('not.exist'); //active
    cy.get(`[data-testid="contributor-search-results-header-for-2"]`).should('exist'); //no cristin id
    cy.get(`[data-testid="contributor-search-results-header-for-5"]`).should('exist'); //verified cristin id but no active institutions
  });
});
