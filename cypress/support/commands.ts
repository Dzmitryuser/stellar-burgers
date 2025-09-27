// cypress/support/commands.ts
import '@4tw/cypress-drag-drop';

// Кастомные команды для тестов
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
});

Cypress.Commands.add(
  'addIngredientToConstructor',
  (ingredientSelector: string) => {
    cy.get(ingredientSelector).drag('[data-testid="constructor"]');
  }
);

Cypress.Commands.add('createOrder', () => {
  cy.get('[data-testid="order-button"]').click();
});

// Объявление типов для кастомных команд
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      addIngredientToConstructor(ingredientSelector: string): Chainable<void>;
      createOrder(): Chainable<void>;
    }
  }
}
