import {
  mockImportPublication1,
  mockImportPublication2,
  mockInstitutions,
  mockPersonDetailed,
  mockSimpleUnitResponse,
  mockUnits,
  responseCountryInstitutionCN,
  responseCountryInstitutionIT,
} from '../../src/utils/mockdata';
import mockImportData from '../../src/utils/mockImportData.json';

context('contributor', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/');
  });

  it('handles publication with contributor-errors', () => {
    cy.get('[data-testid="doi-filter"]').type(mockImportPublication2.doi);
    cy.get(`[data-testid="import-table-row-${mockImportPublication2.pubId}"]`).click();
    cy.get(`[data-testid="duplication-result-radio-create-new"]`).click();
    cy.get('[data-testid="duplication-modal-ok-button"]').click();
    cy.get('[data-testid="contributor-loading-error"]').contains(
      'Feil ved lasting av bidragsytere: (Request failed with status code 500)'
    );
  });

  it('handles cristinId not found (404) / does not prevent loading', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[3].pubId}"]`).click();
    cy.get(`[data-testid="duplication-result-radio-create-new"]`).click();
    cy.get('[data-testid="duplication-modal-ok-button"]').click();
    cy.get('[data-testid="open-contributors-modal-button"]').click();
    cy.get(`[data-testid="contributor-form-4-name"]`).contains(mockImportData[3].authors[4].surname);
  });

  it('shows contributor-list', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[0].pubId}"]`).click();
    cy.get(`[data-testid="duplication-modal-ok-button"]`).click();
    cy.get(`[data-testid="open-contributors-modal-button"]`).click();
    cy.get(`[data-testid="creator-name-1"]`).contains(mockImportData[0].authors[0].firstname);
    cy.get(`[data-testid="creator-name-1"]`).contains(mockImportData[0].authors[0].surname);
    cy.get('[data-testid=creator-1-institution-0-institution-name]').contains(
      mockImportData[0].authors[0].institutions[0].institutionName
    );
    cy.get('[data-testid=creator-1-institution-0-list-item-text-unit-0]').contains(
      'The School of Computer Science and Engineering'
    );
    cy.get('[data-testid=creator-1-institution-0-list-item-text-unit-1]').contains(
      'The Key Laboratory of Computer Vision and System (Ministry of Education)'
    );
    cy.get('[data-testid=creator-1-institution-0-list-item-text-unit-2]').contains(
      'Engineering Research Center of Learning-Based Intelligent System (Ministry of Education)'
    );
    cy.get(`[data-testid=creator-1-institution-0-country-code]`).contains(
      `People's Republic of China (${mockImportData[0].authors[0].institutions[0].countryCode})`
    );
    cy.get(`[data-testid="creator-name-2"]`).contains(mockImportData[0].authors[1].firstname);
    cy.get(`[data-testid="creator-name-2"]`).contains(mockImportData[0].authors[1].surname);
    cy.get(`[data-testid="creator-name-3"]`).contains(mockImportData[0].authors[2].firstname);
    cy.get(`[data-testid="creator-name-3"]`).contains(mockImportData[0].authors[2].surname);

    cy.get(`[data-testid="contributor-back-button"]`).should('exist');
    cy.get(`[data-testid="add-contributor-button`).should('exist');
  });

  it('can move contributor', () => {
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

    cy.get(`[data-testid="contributor-line-8"]`).should('not.exist');
    cy.get(`[data-testid="add-contributor-button`).click();
    cy.get(`[data-testid="contributor-line-8"]`).should('exist');
  });

  it('can delete contributor', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[0].pubId}"]`).click();
    cy.get(`[data-testid="duplication-modal-ok-button"]`).click();
    cy.get(`[data-testid="open-contributors-modal-button"]`).click();

    cy.get(`[data-testid="creator-name-1"]`).contains(mockImportData[0].authors[0].firstname);
    cy.get(`[data-testid="creator-name-1"]`).contains(mockImportData[0].authors[0].surname);
    cy.get(`[data-testid="contributor-delete-button-form-0"]`).click();
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
    cy.get(`[data-testid="contributor-form-0"]`).contains(
      mockImportPublication1.authors[0].institutions[0].institutionName
    );
  });

  it('saves contributor with foreign institution without cristin-id - institution should be replaced by nationality', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[0].pubId}"]`).click();
    cy.get(`[data-testid="duplication-modal-ok-button"]`).click();
    cy.get(`[data-testid="open-contributors-modal-button"]`).click();
    cy.get(`[data-testid="contributor-form-1"]`).contains('China (Ukjent institusjon');
  });

  it('hides inactive affiliations for authors with cristin-id', () => {
    cy.get('[data-testid="import-table-row-610213"]').click();
    cy.get(`[data-testid="duplication-result-radio-create-new"]`).click();
    cy.get('[data-testid="duplication-modal-ok-button"]').click();
    cy.get('[data-testid="open-contributors-modal-button"]').click();
    cy.get(
      `[data-testid="list-item-author-${mockPersonDetailed.surname}-affiliations-${mockPersonDetailed.affiliations[1].institution.cristin_institution_id}-list-item-text-unit-${mockPersonDetailed.affiliations[1].unit.cristin_unit_id}"]`
    )
      .first()
      .should('have.text', `${mockUnits.unit_name.en}`);
    cy.get(
      `[data-testid="list-item-author-${mockPersonDetailed.surname}-affiliations-${mockPersonDetailed.affiliations[0].institution.cristin_institution_id}-list-item-text-unit-${mockPersonDetailed.affiliations[0].unit.cristin_unit_id}"]`
    ).should('not.exist');
  });

  it('is not possible to add units for institution without units', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[1].pubId}"]`).click();
    cy.get(`[data-testid="duplication-result-radio-create-new"]`).click();
    cy.get('[data-testid="duplication-modal-ok-button"]').click();
    cy.get('[data-testid="open-contributors-modal-button"]').click();
    cy.get('[data-testid="show-institution-selector-2"]').click(); //adding
    cy.get('[data-testid="filter-institution-select-2"]').click();
    cy.get(`[data-testid="filter-institution-select-${mockInstitutions[1].cristin_institution_id}-option"]`).click(); //velger sintef narvik
    cy.get(
      `[data-testid="list-item-author-${mockImportData[1].authors[2].surname}-affiliations-${mockInstitutions[1].cristin_institution_id}-add-unit"] > .MuiButton-label`
    ).should('not.exist');
  });

  it('is possible to add and delete units for institution with crisin-id for a contributor', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[1].pubId}"]`).click();
    cy.get(`[data-testid="duplication-result-radio-create-new"]`).click();
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
    cy.get(`[data-testid="duplication-result-radio-create-new"]`).click();
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

  it('should handle contributors without firstname, and non divisible single authorName ', () => {
    //EdgeCase :
    //"surname": "Kinshuk",
    //"authorName": "Kinshuk",
    //no firstname
    cy.get(`[data-testid="import-table-row-${mockImportData[4].pubId}"]`).click();
    cy.get(`[data-testid="duplication-result-radio-create-new"]`).click();
    cy.get('[data-testid="duplication-modal-ok-button"]').click();
    cy.get('[data-testid="open-contributors-modal-button"]').click();
    cy.get('[data-testid="contributor-loading-error"]').should('not.exist');
  });

  it('is possible to add more affiliations', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[1].pubId}"]`).click();
    cy.get(`[data-testid="duplication-result-radio-create-new"]`).click();
    cy.get('[data-testid="duplication-modal-ok-button"]').click();
    cy.get('[data-testid="open-contributors-modal-button"]').click();

    //adds institution:
    cy.get(
      `[data-testid="list-item-author-${mockImportData[1].authors[2].surname}-affiliations-${mockInstitutions[0].cristin_institution_id}-institution-name"]`
    ).should('not.exist');
    cy.get('[data-testid="show-institution-selector-2"]').click();
    cy.get('[data-testid="filter-institution-select-2"]').click();
    cy.get(`[data-testid="filter-institution-select-${mockInstitutions[0].cristin_institution_id}-option"]`).click();
    cy.get(
      `[data-testid="list-item-author-${mockImportData[1].authors[2].surname}-affiliations-${mockInstitutions[0].cristin_institution_id}-institution-name"]`
    ).should('exist');

    //not possible to add the same institution twice:
    cy.get('[data-testid="show-institution-selector-2"]').click();
    cy.get('[data-testid="filter-institution-select-2"]').click();
    cy.get(`[data-testid="filter-institution-select-${mockInstitutions[0].cristin_institution_id}-option"]`).click();
    cy.get('[data-testid="add-institution-error-2"]').should('have.text', 'Institusjonen finnes allerede fra før');
  });

  it('Shows a warning about duplicate authors', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[0].pubId}"]`).click();
    cy.get('[data-testid="duplication-modal-ok-button"]').click();
    cy.get('[data-testid="open-contributors-modal-button"]').click();
    cy.get(`[data-testid=contributor-form-1-duplicate-warning]`).contains('Det finnes bidragsytere med samme navn');
  });

  it('Shows an error for authors with same cristinid', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[4].pubId}"]`).click();
    cy.get(`[data-testid="duplication-result-radio-create-new"]`).click();
    cy.get('[data-testid="duplication-modal-ok-button"]').click();
    cy.get('[data-testid="open-contributors-modal-button"]').click();
    cy.get(`[data-testid=contributor-form-6-duplicate-error]`).contains('Det finnes bidragsytere med samme id');
    cy.get(`[data-testid=contributor-form-5-duplicate-error]`).contains('Det finnes bidragsytere med samme id');
  });

  it('Shows an error for authors without affiliation', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[4].pubId}"]`).click();
    cy.get(`[data-testid="duplication-result-radio-create-new"]`).click();
    cy.get('[data-testid="duplication-modal-ok-button"]').click();
    cy.get('[data-testid="open-contributors-modal-button"]').click();
    cy.get(`[data-testid=contributor-form-3-missing-affiliation-error]`).contains('Bidragsyter mangler tilknytning');
    cy.get('[data-testid="show-institution-selector-3"]').click();
    cy.get('[data-testid="filter-institution-select-3"]').click();
    cy.get(`[data-testid="filter-institution-select-${mockInstitutions[0].cristin_institution_id}-option"]`).click();
    cy.get(`[data-testid=contributor-form-3-missing-affiliation-error]`).should('not.exist');
    cy.get('[data-testid="list-item-author-Afzal-affiliations-5737-delete-institution"]').click();
    cy.get(`[data-testid=contributor-form-3-missing-affiliation-error]`).contains('Bidragsyter mangler tilknytning');
  });

  it('retains affiliations for unconfirmed cristin authors', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[1].pubId}"]`).click();
    cy.get(`[data-testid="duplication-result-radio-create-new"]`).click();
    cy.get('[data-testid="duplication-modal-ok-button"]').click();
    cy.get('[data-testid="open-contributors-modal-button"]').click();
    cy.get('[data-testid="list-item-author-Persson-affiliations-184"]').should(
      'contain.text',
      mockImportData[1].authors[5].institutions[0].institutionName
    );
  });

  it('removes duplicate institutions from import data', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[0].pubId}"]`).click();
    cy.get('[data-testid="duplication-modal-ok-button"]').click();
    cy.get('[data-testid="open-contributors-modal-button"]').click();
    cy.get(`[data-testid="creator-name-7"]`).contains(mockImportData[0].authors[6].firstname);
    cy.get(`[data-testid="creator-name-7"]`).contains(mockImportData[0].authors[6].surname);
    cy.get('[data-testid="creator-7-institution-0-institution-name"]').contains(
      mockImportData[0].authors[6].institutions[0].institutionName //grenada
    );
    cy.get('[data-testid="creator-7-institution-1-institution-name"]').contains(
      mockImportData[0].authors[6].institutions[1].institutionName //grenada
    );
    cy.get('[data-testid="list-item-author-Chen-affiliations-13700046"]').contains(
      mockImportData[0].authors[6].institutions[0].institutionName //grenada
    );
    cy.get('[data-testid="list-item-author-Chen-affiliations"]')
      .find('[data-testid="list-item-author-Chen-affiliations-13700046"]')
      .should('have.length', 1);
  });

  it('it handles invalid institution ids from importdata', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[0].pubId}"]`).click();
    cy.get('[data-testid="duplication-modal-ok-button"]').click();
    cy.get('[data-testid="open-contributors-modal-button"]').click();

    //it converts importdata institution with 0 to landcode based institution:
    cy.get(
      `[data-testid="list-item-author-${mockImportData[0].authors[5].surname}-affiliations-${responseCountryInstitutionIT.cristin_institution_id}-institution-name"]`
    ).should('include.text', '(Ukjent institusjon)');
    cy.get(
      `[data-testid="list-item-author-${mockImportData[0].authors[5].surname}-affiliations-0-institution-name"]`
    ).should('not.exist');

    //it does not show landcode based institution IF there is another institution from the same country with a cristin id:
    cy.get(
      `[data-testid="list-item-author-${mockImportData[0].authors[5].surname}-affiliations-${responseCountryInstitutionCN.cristin_institution_id}-institution-name"]`
    ).should('not.exist');
  });

  it('can filter contributors to show only contributors with norwegian affilliation', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[0].pubId}"]`).click();
    cy.get('[data-testid="duplication-modal-ok-button"]').click();
    cy.get('[data-testid="open-contributors-modal-button"]').click();

    cy.get('[data-testid="import-contributor-hidden-9"]').should('not.exist');

    cy.get('[data-testid="filter-contributors-check"]').click();
    cy.get('[data-testid="import-contributor-hidden-0"]').should('exist');
    cy.get('[data-testid="creator-name-1"]').should('not.exist');
    cy.get('[data-testid="contributor-form-0-name"]').should('not.exist');
    cy.get('[data-testid="move-up-button-2"]').should('not.exist');
    cy.get('[data-testid="move-down-button-2"]').should('not.exist');
    cy.get('[data-testid="creator-name-5"]').should('exist');

    cy.get('[data-testid="filter-contributors-check"]').click();
    cy.get('[data-testid="import-contributor-hidden-0"]').should('not.exist');
    cy.get('[data-testid="creator-name-1"]').should('exist');
  });

  it('shows error in duplicatecheck-modal if an contributor is missing affiliation', () => {
    const contributorNumber4IsMissingAffiliation = '4 (Mangler tilknytning)';
    cy.get(`[data-testid="import-table-row-${mockImportData[4].pubId}"]`).click();
    cy.get('[data-testid="duplication-modal-ok-button"]').click();
    cy.get('[data-testid="contributor-errors"]').should('contain.text', contributorNumber4IsMissingAffiliation);
    cy.get('[data-testid="open-contributors-modal-button"]').click();

    //adding institution removes error:
    cy.get('[data-testid="show-institution-selector-3"]').click();
    cy.get('[data-testid="filter-institution-select-3"]').click();
    cy.get(`[data-testid="filter-institution-select-${mockInstitutions[0].cristin_institution_id}-option"]`).click();
    cy.get('[data-testid="contributor-back-button"]').click();
    cy.get('[data-testid="contributor-errors"]').should('not.contain.text', contributorNumber4IsMissingAffiliation);
  });

  it('handles contributor-errors long names', () => {
    cy.get(`#rowsPerPageSelector`).click().type('10{enter}{enter}');
    cy.get(`[data-testid="import-table-row-${mockImportData[8].pubId}"]`).click();
    cy.get(`[data-testid="duplication-result-radio-create-new"]`).click();
    cy.get('[data-testid="duplication-modal-ok-button"]').click();

    cy.get('[data-testid="contributor-errors"]').should('contain.text', '1 (Fornavn er for langt)');
    cy.get('[data-testid="contributor-errors"]').should('contain.text', '1 (Etternavn er for langt)');
    cy.get('[data-testid="open-contributors-modal-button"]').click();
    cy.get('#firstName0-helper-text').should('contain.text', 'Fornavn kan maksimalt være 30 tegn');
    cy.get('#surname0-helper-text').should('contain.text', 'Etternavn kan maksimalt være 30 tegn');

    //changing names removes error:
    cy.get('[data-testid="contributor-0-firstname-text-field-input"]').clear().type('fornavn');
    cy.get('[data-testid="contributor-0-surname-text-field-input"]').clear().type('etternavn');
    cy.get('#firstName0-helper-text').should('not.contain.text', 'Fornavn kan maksimalt være 30 tegn');
    cy.get('#surname0-helper-text').should('not.contain.text', 'Fornavn kan maksimalt være 30 tegn');
    cy.get('[data-testid="choose-text-field-person-0"]').click();
    cy.get('[data-testid="contributor-back-button"]').click();
    cy.get('[data-testid="contributor-errors"]').should('not.contain.text', 'Fornavn er for langt');
    cy.get('[data-testid="contributor-errors"]').should('not.contain.text', 'Etternavn er for langt');
  });

  it('handles contributor-errors missing names', () => {
    cy.get(`#rowsPerPageSelector`).click().type('10{enter}{enter}');
    cy.get(`[data-testid="import-table-row-${mockImportData[8].pubId}"]`).click();
    cy.get(`[data-testid="duplication-result-radio-create-new"]`).click();
    cy.get('[data-testid="duplication-modal-ok-button"]').click();

    cy.get('[data-testid="open-contributors-modal-button"]').click();
    cy.get('#firstName1-helper-text').should('contain.text', 'Fornavn er et obligatorisk felt');
    cy.get('#surname1-helper-text').should('contain.text', 'Etternavn er et obligatorisk felt');
    cy.get('[data-testid="contributor-back-button"]').click();
    cy.get('[data-testid="contributor-errors"]').should('contain.text', '2 (Mangler fornavn, etternavn');

    //changing names removes error:
    cy.get('[data-testid="open-contributors-modal-button"]').click();
    cy.get('[data-testid="contributor-1-firstname-text-field-input"]').clear().type('fornavn');
    cy.get('[data-testid="contributor-1-surname-text-field-input"]').clear().type('etternavn');
    cy.get('#firstName1-helper-text').should('not.contain.text', 'Fornavn er et obligatorisk felt');
    cy.get('#surname1-helper-text').should('not.contain.text', "Etternavn er et obligatorisk felt'");
    cy.get('[data-testid="choose-text-field-person-1"]').click();
    cy.get('[data-testid="contributor-back-button"]').click();
    cy.get('[data-testid="contributor-errors"]').should('not.contain.text', '2 (Mangler fornavn, etternavn');
  });

  it('shows institution-name in english and norwegian in institution list', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[0].pubId}"]`).click();
    cy.get('[data-testid="duplication-modal-ok-button"]').click();
    cy.get('[data-testid="open-contributors-modal-button"]').click();
    cy.get('[data-testid="show-institution-selector-1"]').click();
    cy.get('[data-testid="filter-institution-select-1"]').click();

    cy.get(
      `[data-testid="filter-institution-select-${mockInstitutions[0].cristin_institution_id}-option-english-main"]`
    ).contains(mockInstitutions[0].institution_name.en);
    cy.get(
      `[data-testid="filter-institution-select-${mockInstitutions[0].cristin_institution_id}-option-english-main"]`
    ).contains(mockInstitutions[0].country);
    cy.get(
      `[data-testid="filter-institution-select-${mockInstitutions[0].cristin_institution_id}-option-norwegian-alternative"]`
    ).contains(mockInstitutions[0].institution_name.nb);
  });

  it('shows institution-name in norwegian if english doesnt exist', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[0].pubId}"]`).click();
    cy.get('[data-testid="duplication-modal-ok-button"]').click();
    cy.get('[data-testid="open-contributors-modal-button"]').click();
    cy.get('[data-testid="show-institution-selector-1"]').click();
    cy.get('[data-testid="filter-institution-select-1"]').click();

    cy.get(
      `[data-testid="filter-institution-select-${mockInstitutions[7].cristin_institution_id}-option-english-main"]`
    ).contains('Denne institusjonen har kun norsk navn');
    cy.get(
      `[data-testid="filter-institution-select-${mockInstitutions[7].cristin_institution_id}-option-norwegian-alternative"]`
    ).should('not.exist');
  });
});
