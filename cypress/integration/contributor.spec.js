import {
  mockImportPublication1,
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
      mockImportData[0].authors[0].institutions[0].countryCode
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
    //cy.get('[data-testid="list-item-author-Capriolo-affiliations-12300052-institution-name"]')
    //cy.get(`[data-testid="list-item-author-Capriolo-affiliations-12300052-institution-name"]`);
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

  it('should handle contributors without firstname, and non divisible single authorName ', () => {
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
    cy.get(
      `[data-testid="list-item-author-${mockImportData[1].authors[2].surname}-affiliations-${mockInstitutions[0].cristin_institution_id}-institution-name"]`
    ).should('not.exist');
    cy.get('[data-testid="show-institution-selector-2"]').click();
    cy.get('[data-testid="filter-institution-select-2"]').click();
    cy.get(`[data-testid="${mockInstitutions[0].cristin_institution_id}-option"]`).click();
    cy.get('[data-testid="add-institution-button-2"]').click();
    cy.get(
      `[data-testid="list-item-author-${mockImportData[1].authors[2].surname}-affiliations-${mockInstitutions[0].cristin_institution_id}-institution-name"]`
    ).should('exist');

    //not possible to add the same institution twice:
    cy.get('[data-testid="show-institution-selector-2"]').click();
    cy.get('[data-testid="filter-institution-select-2"]').click();
    cy.get(`[data-testid="${mockInstitutions[0].cristin_institution_id}-option"]`).click();
    cy.get('[data-testid="add-institution-button-2"]').click();
    cy.get('[data-testid="add-institution-error-2"]').should('have.text', 'institusjonen finnes allerede fra før av');
  });

  it('Shows a warning about duplicate authors', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[0].pubId}"]`).click();
    cy.get('[data-testid="duplication-modal-ok-button"]').click();
    cy.get('[data-testid="open-contributors-modal-button"]').click();
    cy.get(`[data-testid=contributor-form-1-duplicate-warning]`).contains('Det finnes bidragsytere med samme navn');
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
});
