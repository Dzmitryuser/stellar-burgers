// cypress/support/e2e.ts
import './commands';

// Глобальные настройки
beforeEach(() => {
  // Очищаем состояние перед каждым тестом
  cy.window().then((win) => {
    win.localStorage.clear();
  });
  cy.clearCookies();
});
