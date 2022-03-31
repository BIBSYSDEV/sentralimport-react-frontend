import { mockDoiForMonsterPublication } from '../../src/utils/mockdata';
import mockMonsterImportPost from '../../src/utils/mockMonsterImportPost.json';

context('monster-posts', () => {
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
    cy.wait(200);
    cy.get('[data-testid="filter-contributors-check"]').should('not.exist');

    //hidden contributor
    cy.get(`[data-testid="show-contributor-button-9"]`).should('exist');
    cy.get(`[data-testid="contributor-line-9"]`).contains(mockMonsterImportPost.authors[9].firstname);

    //hidden contributor
    cy.get(`[data-testid="show-contributor-button-103"]`).should('exist'); //shows more then 100 contributors

    //expanded contributor because norwegian institution
    cy.get(`[data-testid="contributor-line-19"]`).contains(mockMonsterImportPost.authors[19].firstname);
    cy.get(`[data-testid="contributor-line-19"]`).contains(
      mockMonsterImportPost.authors[19].institutions[0].institutionName
    );

    //expanded contributor contributor-form- errors
    cy.get(`[data-testid="contributor-form-102-name"]`).contains(mockMonsterImportPost.authors[102].firstname);
    cy.get(`[data-testid="contributor-line-102"]`).contains(
      mockMonsterImportPost.authors[102].institutions[0].institutionName
    );
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
