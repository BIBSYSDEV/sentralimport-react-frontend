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

    cy.get(`[data-testid="contributor-line-9"]`).contains('Forfatter-info er skjult');
    cy.get(`[data-testid="contributor-line-19"]`).contains('Mockfirstname Mocklastname');
    cy.get(`[data-testid="contributor-line-102"]`).contains('Forfatter-info er skjult'); //shows more then 100 contributors
    cy.get('[data-testid="filter-contributors-check"]').should('have.class', 'Mui-disabled'); //filter disabled
  });

  it('shows contributors without affiliations when monster-post', () => {
    cy.get('[data-testid="doi-filter"]').type(mockDoiForMonsterPublication, { delay: 0 });
    cy.get('[data-testid="import-table-panel"]').contains(mockMonsterImportPost.languages[0].title);
    cy.get('[data-testid="importdata-author-presentation-610220"]').click();
    cy.get(`[data-testid="duplication-modal-ok-button"]`).click();

    cy.get(`[data-testid="contributor-errors"]`).contains('43 (Mangler tilknytning)');
    cy.get(`[data-testid="open-contributors-modal-button"]`).click();

    cy.get(`[data-testid="creator-name-43"]`).contains('Gunnar Bottolf');
    cy.get(`[data-testid="contributor-form-42-missing-affiliation-error"]`).contains('Bidragsyter mangler tilknytning');
  });

  it('shows contributors that have duplicate errors', () => {
    cy.get('[data-testid="doi-filter"]').type(mockDoiForMonsterPublication, { delay: 0 });
    cy.get('[data-testid="import-table-panel"]').contains(mockMonsterImportPost.languages[0].title);
    cy.get('[data-testid="importdata-author-presentation-610220"]').click();
    cy.get(`[data-testid="duplication-modal-ok-button"]`).click();

    cy.get(`[data-testid="contributor-errors"]`).contains('11, 12 (Duplisert bidragsyter med cristinId: 234)');
    cy.get(`[data-testid="contributor-errors"]`).contains('13, 14 (Duplisert bidragsyter med cristinId: 666)');

    cy.get(`[data-testid="open-contributors-modal-button"]`).click();

    cy.get(`[data-testid="contributor-line-13"]`).contains(mockMonsterImportPost.authors[13].surname);
    cy.get(`[data-testid="contributor-line-13"]`).contains(mockMonsterImportPost.authors[13].firstname);
    cy.get(`[data-testid="contributor-form-13-duplicate-error"]`).contains(
      'Det finnes bidragsytere med samme id på plass: 13'
    );

    cy.get(`[data-testid="contributor-line-12"]`).contains(mockMonsterImportPost.authors[12].surname);
    cy.get(`[data-testid="contributor-line-12"]`).contains(mockMonsterImportPost.authors[12].firstname);
    cy.get(`[data-testid="contributor-form-12-duplicate-error"]`).contains(
      'Det finnes bidragsytere med samme id på plass: 14'
    );

    cy.get(`[data-testid="contributor-line-10"]`).contains(mockMonsterImportPost.authors[10].surname);
    cy.get(`[data-testid="contributor-line-10"]`).contains(mockMonsterImportPost.authors[10].firstname);
    cy.get(`[data-testid="contributor-form-10-duplicate-error"]`).contains(
      'Det finnes bidragsytere med samme id på plass: 12'
    );
  });
});
