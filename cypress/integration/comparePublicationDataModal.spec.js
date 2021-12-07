import mockImportData from '../../src/utils/mockImportData.json';
import { mockAllJournals } from '../../src/utils/mockdata';

context('importModal', () => {
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

    cy.get(`[data-testid="importdata-title"]`).contains(mockImportData[0].languages[0].title);
    cy.get(`[data-testid="cristindata-title-textfield"] textarea`).should(
      'have.value',
      mockImportData[0].languages[0].title
    );

    cy.get(`[data-testid="importdata-journal-title"]`).contains(mockImportData[0].channel.title);
    cy.get(`[data-testid="cristindata-journal-title"]`).contains(mockImportData[0].channel.title);

    cy.get(`[data-testid="importdata-doi"]`).contains(mockImportData[0].doi);
    cy.get(`[data-testid="cristindata-doi-textfield-input"]`).should('have.value', mockImportData[0].doi);

    cy.get(`[data-testid="importdata-lang"]`).contains(mockImportData[0].languages[0].lang);
    cy.get(`[data-testid="cristindata-lang-buttongroup"]`).contains(mockImportData[0].languages[0].lang);

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

  it('has language-buttons, that shifts publication title view', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[0].pubId}"]`).click();
    cy.get(`[data-testid="duplication-modal-ok-button"]`).click();
    cy.get(`[data-testid="importdata-pubid"]`).contains(mockImportData[0].pubId);
    cy.get(`[data-testid="compare-form-lang-button-EN"]`).contains('EN');
    cy.get(`[data-testid="compare-form-lang-button-NO"]`).contains('NO');
    cy.get(`[data-testid="importdata-title"]`).contains(mockImportData[0].languages[0].title);
    cy.get(`[data-testid="compare-form-lang-button-NO"]`).click();
    cy.get(`[data-testid="importdata-title"]`).contains(mockImportData[0].languages[1].title);
    cy.get(`[data-testid="compare-form-lang-button-EN"]`).click();
    cy.get(`[data-testid="importdata-title"]`).contains(mockImportData[0].languages[0].title);
  });

  it('can show validation errors on comparePublicationDataModal-form', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[2].pubId}"]`).click();
    cy.get(`[data-testid="duplication-modal-ok-button"]`).click();

    //skal være tidsskrift-feil
    cy.get(`[data-testid="importdata-pubid"]`).contains(mockImportData[2].pubId);
    cy.get(`[data-testid="import-publication-button"]`).should('exist').should('be.disabled');
    cy.get(`[data-testid="compare-form-journal-error"]`).contains('Tidsskrift er et obligatorisk felt');
    cy.get(`[data-testid="compare-form-error"]`).contains('Det er feil i skjema');

    //legg til tidskrift
    cy.get(`#search-journal-header`).click();
    cy.get(`[data-testid="cristindata-journal-select-textfield"]`).type('per');
    cy.get(`#cristindata-journal-option-0`).click();
    cy.get(`[data-testid="submit-search-journal-button"]`).click();
    cy.get(`[data-testid="compare-form-error"]`).should('not.exist');
    cy.get(`[data-testid="import-publication-button"]`).should('exist').should('not.be.disabled');

    //årstall
    cy.get(`[data-testid="cristindata-year-textfield-input"]`).clear();
    cy.get(`[data-testid="import-publication-button"]`).focus().should('exist').should('be.disabled');
    cy.get(`#Cristin-year-helper-text`).contains('Årstall er et obligatorisk felt');
    cy.get(`[data-testid="cristindata-year-textfield-input"]`).clear().type('ABC');
    cy.get(`#Cristin-year-helper-text`).contains('Årstall må være et nummer');
    cy.get(`[data-testid="cristindata-year-textfield-input"]`).clear().type('2999');
    cy.get(`#Cristin-year-helper-text`).contains('Årstall kan ikke være et framtidig år');
    cy.get(`[data-testid="cristindata-year-textfield-input"]`).clear().type('20');
    cy.get(`#Cristin-year-helper-text`).contains('Årstall må være større enn');
    cy.get(`[data-testid="cristindata-year-textfield-input"]`).clear().type('20');
    cy.get(`#Cristin-year-helper-text`).contains('Årstall må være større enn');
    cy.get(`[data-testid="cristindata-year-textfield-input"]`).clear().type('20.1');
    cy.get(`#Cristin-year-helper-text`).contains('Årstall må være heltall');

    //tittel
    cy.get(`[data-testid="cristindata-title-textfield-input"]`).clear();
    cy.get(`[data-testid="import-publication-button"]`).focus().should('exist').should('be.disabled');
    cy.get(`#Cristin-title-helper-text`).contains('Tittel er et obligatorisk felt');
    cy.get(`[data-testid="cristindata-title-textfield-input"]`).clear().type('ABC');
    cy.get(`#Cristin-title-helper-text`).contains('Tittel må ha minimum');

    //doi
    cy.get(`[data-testid="cristindata-doi-textfield-input"]`).clear();
    cy.get(`[data-testid="import-publication-button"]`).focus().should('exist').should('be.disabled');
    cy.get(`[data-testid="cristindata-doi-textfield-input"]`).clear().type('ABC');
    cy.get(`#Cristin-doi-helper-text`).contains('Doi har galt format');
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

  it('can validate new journal registration', () => {
    const mockInvalidIssn = '123412341234';
    cy.get(`[data-testid="import-table-row-${mockImportData[0].pubId}"]`).click();
    cy.get(`[data-testid="duplication-modal-ok-button"]`).click();
    cy.get(`#create-journal-header`).click();

    cy.get(`[data-testid="new-journal-form-issn-input"]`).type(mockInvalidIssn);
    cy.get(`[data-testid="submit-create-journal-button"]`).click();
    cy.get(`[data-testid="new-journal-form-title-field"]`).contains('Tittel er et obligatorisk felt');
    cy.get(`[data-testid="new-journal-form-issn-field"]`).contains('SSN er ikke på korrekt format (NNNN-NNNC)');
    cy.get(`[data-testid="new-journal-form-error"]`).contains('Det er feil i tidsskrift-skjema');
    cy.get(`[data-testid="submit-create-journal-button"]`).should('exist');
  });

  it('can search for another journal', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[0].pubId}"]`).click();
    cy.get(`[data-testid="duplication-modal-ok-button"]`).click();
    cy.get(`#search-journal-header`).click();
    cy.get(`[data-testid="cristindata-journal-select-textfield"]`).type('per');
    cy.get(`#cristindata-journal-option-0`).click();
    cy.get(`[data-testid="submit-search-journal-button"]`).click();
    cy.get(`[data-testid="cristindata-journal-title"]`).contains(mockAllJournals[5].title);
    cy.get(`[data-testid="submit-search-journal-button"]`).should('not.be.visible');
  });

  it('can open an publication without doi', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[1].pubId}"]`).click();
    cy.get(`[data-testid="duplication-modal-ok-button"]`).click();
    cy.get(`[data-testid="cristindata-doi-textfield"] input`).should('have.value', '');
    cy.get(`[data-testid="import-publication-button"]`).should('exist').should('not.be.disabled');
  });
});
