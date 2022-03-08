import mockImportData from '../../src/utils/mockImportData.json';
import {
  mockAllJournals,
  mockDoiForPublicationWithoutDoi,
  mockImportPublicationWithoutDoi,
} from '../../src/utils/mockdata';

context('comparePublicationModal', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/');
  });

  it('can show comparePublicationDataModal-form with populated values', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[0].pubId}"]`).click();
    cy.get(`[data-testid="duplication-modal-ok-button"]`).click();

    cy.get(`[data-testid="importdata-pubid"]`).contains(mockImportData[0].pubId);
    cy.get(`[data-testid="cristindata-id"]`).contains('Ingen Cristin-Id');

    cy.get(`[data-testid="importdata-source"]`).contains(mockImportData[0].externalId);
    cy.get(`[data-testid="importdata-source"]`).contains(mockImportData[0].sourceName);
    cy.get(`[data-testid="cristindata-source"]`).contains(mockImportData[0].externalId);
    cy.get(`[data-testid="cristindata-source"]`).contains(mockImportData[0].sourceName);

    cy.get(`[data-testid="importdata-date-registered"]`).contains(mockImportData[0].registered);
    cy.get(`[data-testid="cristindata-created"]`).contains('-');

    cy.get(`[data-testid="importdata-title-EN"]`).contains(mockImportData[0].languages[0].title);
    cy.get(`[data-testid="cristindata-title-EN-textfield"] textarea`).should(
      'have.value',
      mockImportData[0].languages[0].title
    );
    cy.get(`[data-testid="importdata-title-NO"]`).contains(mockImportData[0].languages[1].title);
    cy.get(`[data-testid="cristindata-title-NO-textfield"] textarea`).should(
      'have.value',
      mockImportData[0].languages[1].title
    );

    cy.get(`[data-testid="importdata-journal-title"]`).contains(mockImportData[0].channel.title);
    cy.get(`[data-testid="cristindata-journal-title"]`).contains(mockImportData[0].channel.title);

    cy.get(`[data-testid="importdata-doi"]`).contains(mockImportData[0].doi);
    cy.get(`[data-testid="cristindata-doi-textfield-input"]`).should('have.value', mockImportData[0].doi);

    cy.get(`[data-testid="importdata-year"]`).contains(mockImportData[0].yearPublished);
    cy.get(`[data-testid="cristindata-year-textfield-input"]`).should('have.value', mockImportData[0].yearPublished);

    cy.get(`[data-testid="importdata-category"]`).contains(mockImportData[0].categoryName);
    cy.get(`#cristindata-category`).should('have.value', mockImportData[0].categoryName);

    cy.get(`[data-testid="importdata-volume"]`).contains(mockImportData[0].channel.volume);
    cy.get(`[data-testid="cristindata-volume-textfield"] input`).should('have.value', mockImportData[0].channel.volume);

    cy.get(`[data-testid="importdata-issue"]`).contains(mockImportData[0].channel.issue);
    cy.get(`[data-testid="cristindata-issue-textfield-input"] `).should('have.value', mockImportData[0].channel.issue);

    cy.get(`[data-testid="importdata-pages"]`).contains(mockImportData[0].channel.pageFrom);
    cy.get(`[data-testid="importdata-pages"]`).contains(mockImportData[0].channel.pageTo);
    cy.get(`[data-testid="cristindata-pagesfrom-textfield-input"]`).should(
      'have.value',
      mockImportData[0].channel.pageFrom
    );
    cy.get(`[data-testid="cristindata-pagesto-textfield-input"]`).should(
      'have.value',
      mockImportData[0].channel.pageTo
    );

    cy.get(`[data-testid="open-contributors-modal-button"]`).should('exist').should('not.be.disabled');
    cy.get(`[data-testid="import-publication-button"]`).should('exist').should('not.be.disabled');
    cy.get(`[data-testid="import-publication-cancel-button"]`).should('exist').should('not.be.disabled');
  });

  it('shows error if contributors-errors', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[4].pubId}"]`).click();
    cy.get('[data-testid="duplication-modal-ok-button"]').click();

    cy.get(`[data-testid="import-publication-button"]`).should('be.disabled');
    cy.get(`[data-testid="contributor-errors"]`).contains('Det er feil i bidragsyterlisten');
    cy.get(`[data-testid="contributor-errors"]`).contains('1 (Mangler fornavn)');
    cy.get(`[data-testid="contributor-errors"]`).contains('4, 5, 6 (Duplisert bidragsyter med cristinId: 666666)');
  });

  it('can show validation errors on comparePublicationDataModal-form', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[2].pubId}"]`).click();
    cy.get(`[data-testid="duplication-result-radio-create-new"]`).click();
    cy.get(`[data-testid="duplication-modal-ok-button"]`).click();

    //skal være tidsskrift-feil
    cy.get(`[data-testid="importdata-pubid"]`).contains(mockImportData[2].pubId);
    cy.get(`[data-testid="import-publication-button"]`).should('exist').should('be.disabled');
    cy.get(`[data-testid="compare-form-journal-error"]`).contains('Tidsskrift er et obligatorisk felt');
    cy.get(`[data-testid="compare-form-error"]`).contains('Det er feil i skjema');
    cy.get(`[data-testid="compare-form-journal-action-button"]`).should('be.disabled');

    //legg til tidskrift
    cy.get(`#search-journal-header`).click();
    cy.get(`[data-testid="cristindata-journal-select-textfield"]`).type('per');
    cy.get(`#cristindata-journal-option-0`).click();
    cy.get(`[data-testid="submit-search-journal-button"]`).click();
    cy.get(`[data-testid="compare-form-error"]`).should('not.exist');
    cy.get(`[data-testid="import-publication-button"]`).should('exist').should('not.be.disabled');
    cy.get(`[data-testid="compare-form-journal-action-button"]`).should('be.disabled');
    cy.get(`[data-testid="compare-form-pages-action-equals-icon"]`).should('exist');

    //årstall
    cy.get(`[data-testid="compare-form-year-action-equals-icon"]`).should('exist');
    cy.get(`[data-testid="cristindata-year-textfield-input"]`).clear();
    cy.get(`[data-testid="import-publication-button"]`).focus().should('exist').should('be.disabled');
    cy.get(`#Cristin-year-helper-text`).contains('Årstall er et obligatorisk felt');

    cy.get(`[data-testid="cristindata-year-textfield-input"]`).clear().type('ABC');
    cy.get(`#Cristin-year-helper-text`).contains('Årstall må være et tall fra 1000 til 2999');

    cy.get(`[data-testid="cristindata-year-textfield-input"]`).clear().type('3999');
    cy.get(`#Cristin-year-helper-text`).contains('Årstall må være et tall fra 1000 til 2999');

    cy.get(`[data-testid="cristindata-year-textfield-input"]`).clear().type('20');
    cy.get(`#Cristin-year-helper-text`).contains('Årstall må være et tall fra 1000 til 2999');

    cy.get(`[data-testid="cristindata-year-textfield-input"]`).clear().type('20.1');
    cy.get(`#Cristin-year-helper-text`).contains('Årstall må være et tall fra 1000 til 2999');

    cy.get(`[data-testid="compare-form-year-action-button"]`).should('not.be.disabled').click();
    cy.get(`[data-testid="import-publication-button"]`).focus().should('exist').should('not.be.disabled');

    //originaltittel
    cy.get(`[data-testid="compare-form-title-EN-action-equals-icon"]`).should('exist');
    cy.get(`[data-testid="cristindata-title-EN-textfield-input"]`).clear();
    cy.get(`[data-testid="import-publication-button"]`).focus().should('exist').should('be.disabled');
    cy.get(`#Cristin-title-0-helper-text`).contains('Originaltittel er et obligatorisk felt');
    cy.get(`[data-testid="import-publication-button"]`).focus().should('exist').should('be.disabled');
    cy.get(`[data-testid="compare-form-title-EN-action-button"]`).should('not.be.disabled');
    cy.get(`[data-testid="compare-form-title-EN-action-button"]`).click();
    cy.get(`[data-testid="cristindata-title-EN-textfield-input"]`).contains(mockImportData[2].languages[0].title);
    cy.get(`[data-testid="import-publication-button"]`).focus().should('exist').should('not.be.disabled');

    //tittel - norsk
    cy.get(`[data-testid="compare-form-title-NO-action-equals-icon"]`).should('exist');
    cy.get(`[data-testid="cristindata-title-NO-textfield-input"]`).clear();
    cy.get(`[data-testid="compare-form-title-NO-action-button"]`).should('not.be.disabled');
    cy.get(`[data-testid="import-publication-button"]`).focus().should('exist').should('not.be.disabled');

    //doi
    cy.get(`[data-testid="compare-form-doi-action-equals-icon"]`).should('exist');
    cy.get(`[data-testid="cristindata-doi-textfield-input"]`).clear().type('ABC').blur();
    cy.get(`#Cristin-doi-helper-text`).contains('Doi har galt format');
    cy.get(`[data-testid="compare-form-doi-action-button"]`).should('exist').should('be.disabled');

    //pages
    cy.get(`[data-testid="cristindata-pagesto-textfield-input"]`).should('have.value', '');
    cy.get(`[data-testid="compare-form-pages-action-button"]`).should('not.exist');
    cy.get(`[data-testid="compare-form-pages-action-equals-icon"]`).should('exist');
  });

  it('can registrate a new journal', () => {
    const mockTitle = 'MockJournalTitle';
    const mockIssn = '1234-1234';
    cy.get(`[data-testid="import-table-row-${mockImportData[0].pubId}"]`).click();
    cy.get(`[data-testid="duplication-modal-ok-button"]`).click();
    cy.get(`#create-journal-header`).click();

    cy.get(`[data-testid="new-journal-form-title-input"]`).type(mockTitle);
    cy.get(`[data-testid="new-journal-form-issn-input"]`).type(mockIssn);
    cy.get(`[data-testid="submit-create-journal-button"]`).click();
    cy.get(`[data-testid="cristindata-journal-title"]`).contains(mockTitle);
    cy.get(`[data-testid="submit-create-journal-button"]`).should('not.be.visible');
  });

  it(
    'can validate new journal registration',
    {
      retries: {
        runMode: 2,
        openMode: 1,
      },
    },
    () => {
      const mockInvalidIssn = '123412341234';
      cy.get(`[data-testid="import-table-row-${mockImportData[0].pubId}"]`).click();
      cy.get(`[data-testid="duplication-modal-ok-button"]`).click();
      cy.get(`#create-journal-header`).click();

      cy.get(`[data-testid="new-journal-form-issn-input"]`).type(mockInvalidIssn);
      cy.get(`[data-testid="submit-create-journal-button"]`).click();

      cy.waitFor(`#new-journal-title-helper-text`);
      cy.get(`#new-journal-title-helper-text`).contains('Tittel er et obligatorisk felt');
      cy.get(`#new-journal-issn-helper-text`).contains('SSN er ikke på korrekt format (NNNN-NNNC)');
      cy.get(`[data-testid="new-journal-form-error"]`).contains('Det er feil i tidsskrift-skjema');
      cy.get(`[data-testid="submit-create-journal-button"]`).should('exist');
    }
  );

  it('can search for another journal', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[0].pubId}"]`).click();
    cy.get(`[data-testid="duplication-modal-ok-button"]`).click();
    cy.get(`#search-journal-header`).click();
    cy.get(`[data-testid="cristindata-journal-select-textfield"]`).type('per');
    cy.get(`#cristindata-journal-option-5`).click(); //mock-data is not already filtered
    cy.get(`[data-testid="submit-search-journal-button"]`).click();
    cy.get(`[data-testid="cristindata-journal-title"]`).contains(mockAllJournals[5].title);
    cy.get(`[data-testid="submit-search-journal-button"]`).should('not.be.visible');
  });

  it('can search for another journal with &amp-character in response', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[0].pubId}"]`).click();
    cy.get(`[data-testid="duplication-modal-ok-button"]`).click();
    cy.get(`#search-journal-header`).click();
    cy.get(`[data-testid="cristindata-journal-select-textfield"]`).type('basic');
    cy.get(`#cristindata-journal-option-8`).click(); //mock-data is not already filtered
    cy.get(`[data-testid="submit-search-journal-button"]`).click();
    cy.get(`[data-testid="cristindata-journal-title"]`).contains('Basic & Clinical Pharmacology & Toxicology');
  });

  it('can search for another journal with space and words in random order', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[0].pubId}"]`).click();
    cy.get(`[data-testid="duplication-modal-ok-button"]`).click();
    cy.get(`#search-journal-header`).click();
    cy.get(`[data-testid="cristindata-journal-select-textfield"]`).type('report Final');
    cy.get(`#cristindata-journal-option-3`).click();
    cy.get(`[data-testid="submit-search-journal-button"]`).click();
    cy.get(`[data-testid="cristindata-journal-title"]`).contains(mockAllJournals[3].title); //"Final Case report"
  });

  it('can open a publication without doi', () => {
    cy.get('[data-testid="doi-filter"]').type(mockDoiForPublicationWithoutDoi);
    cy.get(`[data-testid="import-table-row-${mockImportPublicationWithoutDoi.pubId}"]`).click();
    cy.get(`[data-testid="duplication-modal-ok-button"]`).click();
    cy.get(`[data-testid="cristindata-doi-textfield"] input`).should('have.value', '');
    cy.get(`[data-testid="import-publication-button"]`).should('exist').should('not.be.disabled');
  });

  it('can select other categories', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[0].pubId}"]`).click();
    cy.get(`[data-testid="duplication-modal-ok-button"]`).click();

    cy.get(`[data-testid="import-category-error"]`).should('not.exist');
    cy.get(`[data-testid="compare-form-doi-action-equals-icon"]`).should('exist');

    cy.get(`[data-testid="cristindata-category-field-error"]`).should('not.exist');
    cy.get(`#cristindata-category`).click();
    cy.get(`#cristindata-category-option-4`).click();
    cy.get(`[data-testid="compare-form-category-action-button"]`).should('exist').should('be.enabled');
    cy.get(`[data-testid="compare-form-category-action-equals-icon"]`).should('not.exist');
    cy.get(`[data-testid="import-category-error"]`).should('not.exist');
  });

  it('can validate category', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[4].pubId}"]`).click();
    cy.get(`[data-testid="duplication-modal-ok-button"]`).click();

    cy.get(`[data-testid="import-category-error"]`).should('exist');
    cy.get(`[data-testid="cristindata-category-field-error"]`).should('exist');
    cy.get(`[data-testid="compare-form-category-action-button"]`).should('exist').should('be.disabled');

    cy.get(`#cristindata-category`).click();
    cy.get(`#cristindata-category-option-4`).click();
    cy.get(`[data-testid="cristindata-category-field-error"]`).should('not.exist');

    cy.get(`#cristindata-category`).click();
    cy.get(`#cristindata-category-option-0`).click();
    cy.get(`[data-testid="cristindata-category-field-error"]`).should('exist');
  });
});
