import mockImportData from '../../src/utils/mockImportData.json';
import mockCristinPublications from '../../src/utils/mockCristinPublications.json';
import {
  mockCristinPublicationWithDoi,
  mockDoiForEmptyCristinSearch,
  mockSearchTitleForCristinPubWithDoi,
} from '../../src/utils/mockdata';

context('duplication-check-modal', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/');
  });

  it('can show duplication-modal with initial search', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[0].pubId}"]`).click();

    //import-publication-data shows //TODO: test for exact text-match ?
    cy.get(`[data-testid="duplicate-check-importdata"]`).contains(mockImportData[0].doi);
    cy.get(`[data-testid="duplicate-check-importdata"]`).contains(mockImportData[0].authors[0].surname);
    cy.get(`[data-testid="duplicate-check-importdata"]`).contains(mockImportData[0].languages[0].title);
    cy.get(`[data-testid="duplicate-check-importdata"]`).contains(mockImportData[0].channel.title);
    cy.get(`[data-testid="duplicate-check-importdata"]`).contains(mockImportData[0].channel.pageFrom);
    cy.get(`[data-testid="duplicate-check-importdata"]`).contains(mockImportData[0].channel.pageTo);
    cy.get(`[data-testid="duplicate-check-importdata"]`).contains(mockImportData[0].channel.volume);
    cy.get(`[data-testid="duplicate-check-importdata"]`).contains(mockImportData[0].yearPublished);
    //checkboxes
    cy.get(`[data-testid="search-panel-doi-checkbox"]`).should('exist');
    cy.get(`[data-testid="search-panel-doi-checkbox"].Mui-checked`).should('exist'); // checked
    cy.get(`[data-testid="search-panel-title-checkbox"]`).should('exist');
    cy.get(`[data-testid="search-panel-title-checkbox"].Mui-checked`).should('not.exist'); //not checked
    cy.get(`[data-testid="search-panel-year-checkbox"]`).should('exist');
    cy.get(`[data-testid="search-panel-year-checkbox"].Mui-checked`).should('not.exist');
    cy.get(`[data-testid="search-panel-author-checkbox"]`).should('exist');
    cy.get(`[data-testid="search-panel-author-checkbox"].Mui-checked`).should('not.exist');
    cy.get(`[data-testid="search-panel-issn-checkbox"]`).should('exist');
    cy.get(`[data-testid="search-panel-issn-checkbox"].Mui-checked`).should('not.exist');
    //inputfields
    cy.get(`[data-testid="search-panel-title-textfield"] .MuiInputBase-input`).should(
      'have.value',
      mockImportData[0].languages[0].title
    );
    cy.get(`[data-testid="search-panel-year-textfield"] .MuiInputBase-input`).should(
      'have.value',
      mockImportData[0].yearPublished
    );
    cy.get(`[data-testid="search-panel-author-textfield"] .MuiInputBase-input`).should(
      'have.value',
      mockImportData[0].authors[0].surname
    );
    cy.get(`[data-testid="search-panel-doi-textfield"] .MuiInputBase-input`).should(
      'have.value',
      mockImportData[0].doi
    );
    cy.get(`[data-testid="search-panel-issn-textfield"] .MuiInputBase-input`).should(
      'have.value',
      mockImportData[0].channel.issn
    );
    //buttons
    cy.get(`[data-testid="duplication-modal-cancel-button"]`).scrollIntoView().should('be.visible');
    cy.get(`[data-testid="duplication-modal-ok-button"]`).scrollIntoView().should('be.visible');
  });

  it('can search for duplicates using doi - should return empty', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[0].pubId}"]`).click();
    cy.get(`[data-testid="search-panel-doi-textfield"]`).clear().type(mockDoiForEmptyCristinSearch);
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
    cy.get(`[data-testid="search-panel-title-textfield"]`).type('some text');
    cy.get(`[data-testid="search-panel-retry-search-button"]`).click();
    cy.get(`[data-testid="duplicates-result-list"]`).should(
      'contain',
      mockCristinPublications[0].title[mockCristinPublications[0].original_language]
    );
    cy.get(`[data-testid="duplicates-result-list"]`).should(
      'contain',
      mockCristinPublications[2].title[mockCristinPublications[1].original_language]
    );
  });

  it('has logic for searching only doi or with combined metadata', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[0].pubId}"]`).click();

    cy.get(`[data-testid="search-panel-doi-checkbox"].Mui-checked`).should('exist');
    cy.get(`[data-testid="search-panel-title-checkbox"].Mui-checked`).should('not.exist');
    cy.get(`[data-testid="search-panel-year-checkbox"].Mui-checked`).should('not.exist');
    cy.get(`[data-testid="search-panel-author-checkbox"].Mui-checked`).should('not.exist');
    cy.get(`[data-testid="search-panel-issn-checkbox"].Mui-checked`).should('not.exist');

    cy.get(`[data-testid="search-panel-title-checkbox"]`).click();
    cy.get(`[data-testid="search-panel-doi-checkbox"].Mui-checked`).should('not.exist');
    cy.get(`[data-testid="search-panel-year-checkbox"]`).click();
    cy.get(`[data-testid="search-panel-doi-checkbox"].Mui-checked`).should('not.exist');

    cy.get(`[data-testid="search-panel-doi-checkbox"]`).click();
    //uncheck others
    cy.get(`[data-testid="search-panel-title-checkbox"].Mui-checked`).should('not.exist');
    cy.get(`[data-testid="search-panel-year-checkbox"].Mui-checked`).should('not.exist');
    cy.get(`[data-testid="search-panel-author-checkbox"].Mui-checked`).should('not.exist');
    cy.get(`[data-testid="search-panel-issn-checkbox"].Mui-checked`).should('not.exist');
  });

  it('can search for duplicates with doi using title', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[0].pubId}"]`).click();
    cy.get(`[data-testid="search-panel-title-checkbox"]`).click();
    cy.get(`[data-testid="search-panel-title-textfield"]`).clear().type(mockSearchTitleForCristinPubWithDoi);
    cy.get(`[data-testid="search-panel-retry-search-button"]`).click();

    cy.get(`[data-testid="duplicates-result-list"]`).should('contain', mockCristinPublicationWithDoi.journal.name);
    cy.get(`[data-testid="duplicates-result-list"]`).should(
      'contain',
      mockCristinPublicationWithDoi.links[1].url.substring(17, 30)
    );
  });

  it('can show no journal-warning in search results', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[1].pubId}"]`).click();
    cy.get(`[data-testid="duplication-result-689770-journal-warning"]`).should('contain', 'Tidskrift mangler');
    cy.get(`[data-testid="duplication-result-688231-journal-warning"]`).should('not.exist');
  });

  it('can search for duplicates with doi using title - when title and authors does not exist', () => {
    cy.get(`#rowsPerPageSelector`).click().type('10{enter}{enter}');
    cy.get(`[data-testid="import-table-row-${mockImportData[7].pubId}"]`).click();
    cy.get(`[data-testid="search-panel-title-checkbox"]`).click();
    cy.get(`[data-testid="search-panel-retry-search-button"]`).click();
    cy.get(`[data-testid="duplicates-result-list"]`).should('contain', mockCristinPublications[0].title.de);
  });
});
