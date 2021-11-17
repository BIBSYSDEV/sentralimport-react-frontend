import mockImportData from '../../src/utils/mockImportData.json';
import mockCristinPublications from '../../src/utils/mockCristinPublications.json';
import { mockDoiForEmptyCristinSearch, mockTitleForEmptyCristinSearch } from '../../src/utils/mock-interceptor';

context('duplication-check-modal', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/');
  });

  it('can show duplication-modal', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[0].pubId}"]`).click();
    cy.wait(500); //To make modal visible (tests works without, but is more difficult to view with cypress open)

    //import-publication-data shows //TODO: test for exact text-match ?
    cy.get(`[data-testid="duplicate-check-importdata"]`).contains(mockImportData[0].doi);
    cy.get(`[data-testid="duplicate-check-importdata"]`).contains(mockImportData[0].authors[0].firstname);
    cy.get(`[data-testid="duplicate-check-importdata"]`).contains(mockImportData[0].languages[0].title);
    cy.get(`[data-testid="duplicate-check-importdata"]`).contains(mockImportData[0].channel.title);
    cy.get(`[data-testid="duplicate-check-importdata"]`).contains(mockImportData[0].channel.pageFrom);
    cy.get(`[data-testid="duplicate-check-importdata"]`).contains(mockImportData[0].channel.pageTo);
    cy.get(`[data-testid="duplicate-check-importdata"]`).contains(mockImportData[0].channel.volume);
    cy.get(`[data-testid="duplicate-check-importdata"]`).contains(mockImportData[0].yearPublished);

    //checkboxes
    cy.get(`[data-testid="search-panel-doi-checkbox"]`).should('exist');
    cy.get(`[data-testid="search-panel-doi-checkbox"].Mui-checked`).should('not.exist'); //not checked
    cy.get(`[data-testid="search-panel-title-checkbox"]`).should('exist');
    cy.get(`[data-testid="search-panel-title-checkbox"].Mui-checked`).should('not.exist');
    cy.get(`[data-testid="search-panel-year-checkbox"]`).should('exist');
    cy.get(`[data-testid="search-panel-year-checkbox"].Mui-checked`).should('not.exist');
    cy.get(`[data-testid="search-panel-author-checkbox"]`).should('exist');
    cy.get(`[data-testid="search-panel-author-checkbox"].Mui-checked`).should('not.exist');

    cy.get(`[data-testid="search-panel-issn-checkbox"]`).should('not.exist');

    //inputfields
    cy.get(`[data-testid="search-panel-title-textfield"] .MuiInputBase-input`).should(
      'have.value',
      mockImportData[0].languages[0].title
    );
    cy.get(`[data-testid="search-panel-year-textfield"] .MuiInputBase-input`).should(
      'have.value',
      mockImportData[0].yearPublished
    );
    cy.get(`[data-testid="search-panel-author-textfield"] .MuiInputBase-input`).should('have.value', 'Jia C.');
    cy.get(`[data-testid="search-panel-doi-textfield"] .MuiInputBase-input`).should(
      'have.value',
      mockImportData[0].doi
    );

    //resultlist
    cy.get(`[data-testid="duplication-result-${mockCristinPublications[0].cristin_result_id}"]`).contains(
      mockCristinPublications[0].title[mockCristinPublications[0].original_language]
    );
    cy.get(`[data-testid="duplication-result-${mockCristinPublications[0].cristin_result_id}"]`).contains(
      mockCristinPublications[0].year_published
    );

    //buttons
    cy.get(`[data-testid="duplication-modal-cancel-button"]`).scrollIntoView().should('be.visible');
    cy.get(`[data-testid="duplication-modal-ok-button"]`).scrollIntoView().should('be.visible');
  });

  it('can search for duplicates using doi', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[0].pubId}"]`).click();
    cy.get(`[data-testid="search-panel-doi-checkbox"]`).click();
    cy.get(`[data-testid="search-panel-doi-textfield"]`).type('{selectall}{backspace}');
    cy.get(`[data-testid="search-panel-doi-textfield"]`).type(mockDoiForEmptyCristinSearch);
    cy.get(`[data-testid="search-panel-retry-search-button"]`).click();
    cy.get(`[data-testid="duplicates-result-list"]`).should(
      'not.contain',
      mockCristinPublications[0].title[mockCristinPublications[0].original_language]
    );
  });

  it('can search for duplicates using title', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[0].pubId}"]`).click();
    cy.get(`[data-testid="search-panel-title-checkbox"]`).click();
    cy.get(`[data-testid="search-panel-title-textfield"]`).type('{selectall}{backspace}');
    cy.get(`[data-testid="search-panel-title-textfield"]`).type(mockTitleForEmptyCristinSearch);
    cy.get(`[data-testid="search-panel-retry-search-button"]`).click();
    cy.get(`[data-testid="duplicates-result-list"]`).should(
      'not.contain',
      mockCristinPublications[0].title[mockCristinPublications[0].original_language]
    );
  });
});