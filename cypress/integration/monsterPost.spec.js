import { mockDoiForMonsterPublication } from '../../src/utils/mockdata';
import mockMonsterImportPost from '../../src/utils/mockMonsterImportPost.json';

context('application', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/');
  });

  it('can search monsterpost with doi and tells that it is a monsterpost', () => {
    cy.get('[data-testid="doi-filter"]').type(mockDoiForMonsterPublication, { delay: 0 }); //fast typing
    cy.get('[data-testid="import-table-panel"]').contains(mockMonsterImportPost.languages[0].title);
    cy.get('[data-testid="importdata-author-presentation-610220-monster-warning"]').contains(
      'Stort antall bidragsytere'
    );
  });

  it('hides contributors with foreign institutions by default when monster-post', () => {
    cy.get('[data-testid="doi-filter"]').type(mockDoiForMonsterPublication, { delay: 0 });
    cy.get('[data-testid="import-table-panel"]').contains(mockMonsterImportPost.languages[0].title);
    cy.get('[data-testid="importdata-author-presentation-610220"]').click();
    cy.get(`[data-testid="duplication-modal-ok-button"]`).click();
    cy.get(`[data-testid="open-contributors-modal-button"]`).click();
    cy.get(`[data-testid="contributor-line-13"]`).contains('Forfatter-info er skjult');
    cy.get(`[data-testid="contributor-line-19"]`).contains('Mockfirstname Mocklastname');
    cy.get(`[data-testid="contributor-line-102"]`).contains('Forfatter-info er skjult'); //shows more then 100 contributors
    cy.get('[data-testid="filter-contributors-check"]').should('have.class', 'Mui-disabled'); //filter disabled
  });
});
