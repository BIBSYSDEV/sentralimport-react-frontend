declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to set localStorage items necessary for authorization
     * @example cy.login()
     */
    login: typeof login;
  }
}
