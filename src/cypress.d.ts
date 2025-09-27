/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      intercept(
        method: string,
        url: string,
        options?: Partial<Cypress.InterceptOptions>
      ): Chainable<null>;
    }
  }
}

export {};
