import mockImportData from '../../src/utils/mockImportData.json';

context('importModal', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/');
  });

  it('can open an publication without doi', () => {
    cy.get(`[data-testid="import-table-row-${mockImportData[1].pubId}"]`).click();
    cy.get(`[data-testid="duplication-modal-ok-button"]`).click();

    cy.get(`[data-testid="cristindata-doi-textfield"] input`).should('have.value', '');
    cy.get(`[data-testid="import-publication-button"]`).should('exist').should('not.be.disabled');
  });

  it('can show an importmodal with populated values', () => {
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
    cy.get(`#cristindata-journal`).contains(mockImportData[0].channel.title);

    cy.get(`[data-testid="importdata-doi"]`).contains(mockImportData[0].doi);
    cy.get(`[data-testid="cristindata-doi-textfield"] input`).should('have.value', mockImportData[0].doi);

    cy.get(`[data-testid="importdata-lang"]`).contains(mockImportData[0].languages[0].lang);
    cy.get(`[data-testid="cristindata-lang-buttongroup"]`).contains(mockImportData[0].languages[0].lang);

    cy.get(`[data-testid="importdata-year"]`).contains(mockImportData[0].yearPublished);
    cy.get(`[data-testid="cristindata-year-textfield"] input`).should('have.value', mockImportData[0].yearPublished);

    cy.get(`[data-testid="importdata-category"]`).contains(mockImportData[0].categoryName);
    cy.get(`[data-testid="cristindata-category-select"]`).contains(mockImportData[0].categoryName); //NB! data-testid not supported on react-select component

    cy.get(`[data-testid="importdata-volume"]`).contains(mockImportData[0].channel.volume);
    cy.get(`[data-testid="cristindata-volume-textfield"] input`).should('have.value', mockImportData[0].channel.volume);

    cy.get(`[data-testid="importdata-issue"]`).contains(mockImportData[0].channel.issue);
    cy.get(`[data-testid="cristindata-issue-textfield"] input`).should('have.value', mockImportData[0].channel.issue);

    cy.get(`[data-testid="importdata-pages"]`).contains(mockImportData[0].channel.pageFrom);
    cy.get(`[data-testid="importdata-pages"]`).contains(mockImportData[0].channel.pageTo);
    cy.get(`[data-testid="cristindata-pagefrom-textfield"] input`).should(
      'have.value',
      mockImportData[0].channel.pageFrom
    );
    cy.get(`[data-testid="cristindata-pageto-textfield"] input`).should('have.value', mockImportData[0].channel.pageTo);

    cy.get(`[data-testid="open-contributors-modal-button"]`).should('exist').should('not.be.disabled');
    cy.get(`[data-testid="import-publication-button"]`).should('exist').should('not.be.disabled');
    cy.get(`[data-testid="import-publication-cancel-button"]`).should('exist').should('not.be.disabled');
  });

  it('can registrate a new journal', () => {
    const mockTitle = 'MockJournalTitle';
    const mockIssn = '1234-1234';
    cy.get(`[data-testid="import-table-row-${mockImportData[0].pubId}"]`).click();
    cy.get(`[data-testid="duplication-modal-ok-button"]`).click();
    cy.get(`#cristindata-journal`).contains(mockImportData[0].channel.title);
    cy.get(`[data-testid="submit-journal-button"]`).should('not.exist');
    cy.get(`[data-testid="add-journal-button"]`).click();
    cy.get(`[data-testid="new-journal-form-title-input"]`).type(mockTitle);
    cy.get(`[data-testid="new-journal-form-issn-input"]`).type(mockIssn);
    cy.get(`[data-testid="submit-journal-button"]`).click();
    cy.get(`#cristindata-journal`).contains(mockTitle);
    cy.get(`[data-testid="submit-journal-button"]`).should('not.exist');
  });

  it('can validate new journal registration', () => {
    const mockInvalidIssn = '123412341234';
    cy.get(`[data-testid="import-table-row-${mockImportData[0].pubId}"]`).click();
    cy.get(`[data-testid="duplication-modal-ok-button"]`).click();
    cy.wait(500);
    cy.get(`[data-testid="add-journal-button"]`).click();
    cy.get(`[data-testid="new-journal-form-issn-input"]`).type(mockInvalidIssn);
    cy.get(`[data-testid="submit-journal-button"]`).click();
    cy.get(`[data-testid="new-journal-form-title-field"]`).contains('Tittel er et obligatorisk felt');
    cy.get(`[data-testid="new-journal-form-issn-field"]`).contains('SSN er ikke på korrekt format (NNNN-NNNC)');
    cy.get(`[data-testid="new-journal-form-error"]`).contains('Det er feil i tidskrift-skjema');
    cy.get(`[data-testid="submit-journal-button"]`).should('exist');
  });
});
