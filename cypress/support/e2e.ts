// cypress/support/e2e.ts
import './commands';

// Глобальные настройки для всех тестов
beforeEach(() => {
  // Очищаем cookies и localStorage перед каждым тестом
  cy.clearCookies();
  cy.clearLocalStorage();
});

// Глобальные перехватчики
before(() => {
  // Перехватываем основные API запросы
  cy.intercept('GET', 'https://norma.nomoreparties.space/api/ingredients', {
    fixture: 'ingredients.json'
  }).as('getIngredients');

  cy.intercept('GET', 'https://norma.nomoreparties.space/api/auth/user', {
    statusCode: 401
  }).as('getUser');
});
