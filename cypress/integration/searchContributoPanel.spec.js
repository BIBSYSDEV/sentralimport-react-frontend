import mockImportData from '../../src/utils/mockImportData.json';
import {
  cristinIDWithoutActiveAffiliation,
  mockCristinIdForbiddenPerson,
  mockCristinIDWithoutAffiliationAttribute,
  mockPerson,
  mockPersonDetailed,
  mockPersonDetailedWithoutActiveAffiliations,
} from '../../src/utils/mockdata';
import { Colors } from '../../src/assets/styles/StyleConstants';

context('Search contributor panel', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/');
  });

  it('handles contributors without affilations', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[1].pubId}"]`).click();
    cy.get('[data-testid="duplication-modal-ok-button"]').click();
    cy.get('[data-testid="open-contributors-modal-button"]').click();
    cy.get('[data-testid=contributor-search-button-2]').click();
    cy.get(`[data-testid=author-name-${mockCristinIDWithoutAffiliationAttribute}]`).should('exist');
  });

  it('hides inactive affiliations for authors when user is searching for contributors', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[1].pubId}"]`).click();
    cy.get('[data-testid="duplication-modal-ok-button"]').click();
    cy.get('[data-testid="open-contributors-modal-button"]').click();
    cy.get('[data-testid=contributor-search-button-2]').click();
    cy.get(
      `[data-testid=list-item-author-${mockPerson.surname}-affiliations-${mockPersonDetailed.affiliations[1].institution.cristin_institution_id}]`
    ).should('exist');
    cy.get(`[data-testid=author-name-${cristinIDWithoutActiveAffiliation}]`).should('exist');
    cy.get(
      `[data-testid=list-item-author-${cristinIDWithoutActiveAffiliation}-affiliations-${mockPersonDetailedWithoutActiveAffiliations.affiliations[1].institution.cristin_institution_id}]`
    ).should('not.exist');
  });

  it('displays verified and unverified contributors differently', () => {
    //active contributors are defined as person with identified_cristin_person = true AND atleast one active affiliation.
    //getPersonDetailed may respond with not-authorized, in which case it is not possible to assert whether or not a contributor is verified
    const VerifiedText = 'Verifisert';
    const notVerifiedText = 'Ikke verifisert';
    const unknownVerificationText = 'Ukjent verifikasjonsstatus';
    cy.get(`[data-testid="import-table-row-${mockImportData[0].pubId}"]`).click();
    cy.get(`[data-testid="duplication-modal-ok-button"]`).click();
    cy.get(`[data-testid="open-contributors-modal-button"]`).click();
    cy.get('[data-testid=contributor-search-button-2]').click();
    cy.get(`[data-testid="author-name-${mockPerson.cristin_person_id}-verified-badge"]`)
      .children('title')
      .should('have.text', VerifiedText);
    cy.get(`[data-testid="author-name-${mockPerson.cristin_person_id}"]`).should(
      'have.css',
      'color',
      Colors.Text.GREEN
    );
    cy.get(`[data-testid="author-name-${cristinIDWithoutActiveAffiliation}-not-verified-badge"]`)
      .children('title')
      .should('have.text', notVerifiedText);
    cy.get(`[data-testid="author-name-${cristinIDWithoutActiveAffiliation}"]`).should(
      'have.css',
      'color',
      Colors.Text.OPAQUE_41_BLACK
    );
    cy.get(`[data-testid="author-name-${mockCristinIdForbiddenPerson}-uknown-verified-badge"]`)
      .children('title')
      .should('have.text', unknownVerificationText);
    cy.get(`[data-testid="author-name-${mockCristinIdForbiddenPerson}"]`).should(
      'have.css',
      'color',
      Colors.Text.OPAQUE_41_BLACK
    );
  });

  it('handles contributors with limited access', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[1].pubId}"]`).click();
    cy.get('[data-testid="duplication-modal-ok-button"]').click();
    cy.get('[data-testid="open-contributors-modal-button"]').click();
    cy.get('[data-testid=contributor-search-button-2]').click();
    cy.get(`[data-testid=person-limited-access-${mockCristinIdForbiddenPerson}]`).should(
      'have.text',
      'Kan ikke hente inn institusjoner for denne bidragsyteren.'
    );
  });

  it('is possible to choose search and select a cristin person without also getting their affiliation', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[1].pubId}"]`).click();
    cy.get('[data-testid="duplication-modal-ok-button"]').click();
    cy.get('[data-testid="open-contributors-modal-button"]').click();
    cy.get(
      `[data-testid="list-item-author-${mockImportData[1].authors[4].surname}-affiliations-${mockImportData[1].authors[4].institutions[0].cristinInstitutionNr}-institution-name"]`
    ).should('exist');
    cy.get('[data-testid="contributor-search-button-2"]').click();
    cy.get(`[data-testid="add-only-person-${mockPersonDetailed.cristin_person_id}"]`).click();
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
    cy.get('[data-testid="contributor-search-button-2"]').click();
    cy.get(`[data-testid="add-person-and-affiliations-${mockPersonDetailed.cristin_person_id}"]`).click();
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
    cy.get('[data-testid="contributor-search-button-2"]').click();
    cy.get(
      `[data-testid="add-only-affiliation-button-institution-${mockPersonDetailed.affiliations[1].institution.cristin_institution_id}"]`
    ).click();
    cy.get(
      `[data-testid="add-affiliation-success-institution-${mockPersonDetailed.affiliations[1].institution.cristin_institution_id}"]`
    ).should('exist');
    cy.get(
      `[data-testid="add-only-affiliation-button-institution-${mockPersonDetailed.affiliations[1].institution.cristin_institution_id}"]`
    ).click();
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
    cy.get('#firstName5').should('have.value', '');
  });
});
