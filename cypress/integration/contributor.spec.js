import {
  mockImportPublication1,
  mockPerson,
  mockPersonDetailed,
  mockPersonDetailedWithoutActiveAffiliations,
  mockUnits,
  cristinIDWithoutActiveAffiliation,
  mockSimpleUnitResponse,
  mockCristinIDWithoutAffiliationAttribute,
  mockCristinIdForbiddenPerson,
} from '../../src/utils/mockdata';
import mockImportData from '../../src/utils/mockImportData.json';
import { Colors } from '../../src/assets/styles/StyleConstants';

context('contributor', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/');
  });

  it('handles publication with contributor-errors', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[3].pubId}"]`).click();
    cy.get('[data-testid="duplication-modal-ok-button"]').click();
    cy.get('[data-testid="open-contributors-modal-button"]').click();
    cy.get('[data-testid="contributor-loading-error"]').contains(
      'Feil ved lasting av bidragsytere: (Request failed with status code 404)'
    );
  });

  it('shows contributor-list', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[0].pubId}"]`).click();
    cy.get(`[data-testid="duplication-modal-ok-button"]`).click();
    cy.get(`[data-testid="open-contributors-modal-button"]`).click();

    cy.get(`[data-testid="creator-name-1"]`).contains(mockImportData[0].authors[0].firstname);
    cy.get(`[data-testid="creator-name-1"]`).contains(mockImportData[0].authors[0].surname);
    cy.get('[data-testid=creator-institutions-1-institution-name]').contains(
      mockImportData[0].authors[0].institutions[0].institutionName
    );
    cy.get('[data-testid=creator-institutions-1-list-item-text-unit-0]').contains(
      'The School of Computer Science and Engineering'
    );
    cy.get('[data-testid=creator-institutions-1-list-item-text-unit-1]').contains(
      'The Key Laboratory of Computer Vision and System (Ministry of Education)'
    );
    cy.get('[data-testid=creator-institutions-1-list-item-text-unit-2]').contains(
      'Engineering Research Center of Learning-Based Intelligent System (Ministry of Education)'
    );
    cy.get(`[data-testid=creator-institutions-1-country-code]`).contains(
      mockImportData[0].authors[0].institutions[0].countryCode
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
    cy.get(`[data-testid="contributor-save-and-close-button-0"]`).click();
    cy.get(`[data-testid="contributor-for-import-wrapper-0"]`).contains(
      mockImportPublication1.authors[0].institutions[0].institutionName
    );
  });

  it('saves contributor with foreign institution without cristin-id - institution should be replaced by nationality', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[0].pubId}"]`).click();
    cy.get(`[data-testid="duplication-modal-ok-button"]`).click();
    cy.get(`[data-testid="open-contributors-modal-button"]`).click();
    cy.get(`[data-testid="contributor-form-1"]`).contains('China (Ukjent institusjon');
    cy.get(`[data-testid="contributor-save-and-close-button-1"]`).click();
    cy.get(`[data-testid="contributor-for-import-wrapper-1"]`).contains('China (Ukjent institusjon');
  });

  it('hides inactive affiliations for authors with cristin-id', () => {
    cy.get('[data-testid="import-table-row-610213"]').click();
    cy.get('[data-testid="duplication-modal-ok-button"]').click();
    cy.get('[data-testid="open-contributors-modal-button"]').click();
    cy.get(
      `[data-testid="list-item-author-${mockPersonDetailed.cristin_person_id}-affiliations-${mockPersonDetailed.affiliations[1].institution.cristin_institution_id}-list-item-text-unit-${mockPersonDetailed.affiliations[1].unit.cristin_unit_id}"]`
    )
      .first()
      .should('have.text', `${mockUnits.unit_name.en}`);
    cy.get(
      `[data-testid="list-item-author-${mockPersonDetailed.cristin_person_id}-affiliations-${mockPersonDetailed.affiliations[0].institution.cristin_institution_id}-list-item-text-unit-${mockPersonDetailed.affiliations[0].unit.cristin_unit_id}"]`
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
    cy.get(`[data-testid=author-name-${mockCristinIDWithoutAffiliationAttribute}]`).should('exist');
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

  it('is possible to add and delete units for institution with crisin-id for a contributor', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[1].pubId}"]`).click();
    cy.get('[data-testid="duplication-modal-ok-button"]').click();
    cy.get('[data-testid="open-contributors-modal-button"]').click();
    cy.get(
      `[data-testid="list-item-author-${mockImportData[1].authors[2].surname}-affiliations-${mockImportData[1].authors[2].institutions[0].cristinInstitutionNr}-add-unit"]`
    ).click();
    cy.get('[data-testid="unit-select"]').click();
    cy.get(`[data-testid=${mockSimpleUnitResponse[7].unit_name.en.replaceAll(' ', '-')}-option]`).should('exist');
    //search in norwegian gives hits in english
    cy.get('[data-testid="filter-unit-select"]').type('rektor og styre');
    cy.get(`[data-testid=${mockSimpleUnitResponse[7].unit_name.en.replaceAll(' ', '-')}-option]`).should('not.exist');
    cy.get(`[data-testid=${mockSimpleUnitResponse[1].unit_name.en.replaceAll(' ', '-')}-option]`).click();
    cy.get(
      `[data-testid="list-item-author-${mockImportData[1].authors[2].surname}-affiliations-${mockImportData[1].authors[2].institutions[0].cristinInstitutionNr}-list-item-text-unit-${mockSimpleUnitResponse[1].cristin_unit_id}"]`
    ).should('have.text', mockSimpleUnitResponse[1].unit_name.en);

    //cannot add the same unit twice
    cy.get(
      `[data-testid="list-item-author-${mockImportData[1].authors[2].surname}-affiliations-${mockImportData[1].authors[2].institutions[0].cristinInstitutionNr}-add-unit"]`
    ).click();
    cy.get('[data-testid="unit-select"]').click();
    cy.get('[data-testid="filter-unit-select"]').type('rektor og styre');
    cy.get(`[data-testid=${mockSimpleUnitResponse[1].unit_name.en.replaceAll(' ', '-')}-option]`).click();
    cy.get(
      `[data-testid="list-item-author-${mockImportData[1].authors[2].surname}-affiliations-${mockImportData[1].authors[2].institutions[0].cristinInstitutionNr}-error"]`
    ).should('include.text', 'Enhet eksisterer allerede');

    //deletes works:
    cy.get(
      `[data-testid="list-item-author-${mockImportData[1].authors[2].surname}-affiliations-${mockImportData[1].authors[2].institutions[0].cristinInstitutionNr}-delete-unit-0"]`
    ).click();
    cy.get(
      `[data-testid="list-item-author-${mockImportData[1].authors[2].surname}-affiliations-${mockImportData[1].authors[2].institutions[0].cristinInstitutionNr}-list-item-text-unit-${mockSimpleUnitResponse[1].cristin_unit_id}"]`
    ).should('not.exist');
  });

  it('is possible to remove affiliations for a contributor', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[1].pubId}"]`).click();
    cy.get('[data-testid="duplication-modal-ok-button"]').click();
    cy.get('[data-testid="open-contributors-modal-button"]').click();
    cy.get(
      `[data-testid="list-item-author-${mockImportData[1].authors[2].surname}-affiliations-${mockImportData[1].authors[2].institutions[0].cristinInstitutionNr}"]`
    ).should('exist');
    cy.get(
      `[data-testid="list-item-author-${mockImportData[1].authors[2].surname}-affiliations-${mockImportData[1].authors[2].institutions[0].cristinInstitutionNr}-delete-institution"]`
    ).click();
    cy.get(
      `[data-testid="list-item-author-${mockImportData[1].authors[2].surname}-affiliations-${mockImportData[1].authors[2].institutions[0].cristinInstitutionNr}"]`
    ).should('not.exist');
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

  it('is possible to swap verified contributor with non-verified contributor', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[1].pubId}"]`).click();
    cy.get('[data-testid="duplication-modal-ok-button"]').click();
    cy.get('[data-testid="open-contributors-modal-button"]').click();
    cy.get('[data-testid="contributor-search-button-2"]').click();
    cy.get('[data-testid="add-only-person-9456892"]').click();
    cy.get('[data-testid="verified-contributor-badge-9456892"]').should('exist');
    cy.get('[data-testid="contributor-search-button-2"]').click();
    cy.get('[data-testid="choose-text-field-person-2"]').click();
    cy.get('[data-testid="verified-contributor-badge-9456892"]').should('not.exist');
  });

  it('should handle countributors without firstname, and non divisible single authorName ', () => {
    //EdgeCase :
    //"surname": "Kinshuk",
    //"authorName": "Kinshuk",
    //no firstname
    cy.get(`[data-testid="import-table-row-${mockImportData[4].pubId}"]`).click();
    cy.get('[data-testid="duplication-modal-ok-button"]').click();
    cy.get('[data-testid="open-contributors-modal-button"]').click();
    cy.get('[data-testid="contributor-loading-error"]').should('not.exist');
  });

  it('is possible to add more affiliations', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[1].pubId}"]`).click();
    cy.get('[data-testid="duplication-modal-ok-button"]').click();
    cy.get('[data-testid="open-contributors-modal-button"]').click();

    //adds institution:
    cy.get('[data-testid="list-item-author-Saus-affiliations-5737-institution-name"]').should('not.exist');
    cy.get('[data-testid="show-institution-selector-2"]').click();
    cy.get('[data-testid="filter-institution-select-2"]').click();
    cy.get('[data-testid="5737-option"]').click();
    cy.get('[data-testid="add-institution-button-2"]').click();
    cy.get('[data-testid="list-item-author-Saus-affiliations-5737-institution-name"]').should('exist');

    //not possible to add the same institution twice:
    cy.get('[data-testid="show-institution-selector-2"]').click();
    cy.get('[data-testid="filter-institution-select-2"]').click();
    cy.get('[data-testid="5737-option"]').click();
    cy.get('[data-testid="add-institution-button-2"]').click();
    cy.get('[data-testid="add-institution-error-2"]').should('have.text', 'institusjonen finnes alerede fra før av');
  });
});
