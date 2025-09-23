// stellar-burgers/cypress/e2e/ingredient-modal.cy.ts
import { selectors, api } from '../constants';

describe('E2E тестирование просмотра деталей ингредиента', () => {
  beforeEach(() => {
    cy.viewport(1280, 720);

    // Мокаем API ингредиентов
    cy.intercept('GET', api.ingredients, {
      fixture: 'ingredients.json'
    });

    cy.visit('/');
  });

  it('Проверка работоспособности модального окна с деталями ингредиента', () => {
    // Кликаем на ингредиент
    cy.get(selectors.ingredient_bun).click();

    // Проверяем что модальное окно открылось
    cy.get(selectors.modal).should('be.visible');
    cy.contains('Детали ингредиента').should('be.visible');
    cy.contains('Краторная булка N-200i').should('be.visible');

    // Закрываем модальное окно через кнопку
    cy.get(selectors.close_modal).click();
    cy.get(selectors.modal).should('not.exist');
  });

  it('Проверка работоспособности модального окна после перезагрузки страницы', () => {
    // Кликаем на ингредиент
    cy.get(selectors.ingredient_bun).click();

    // Проверяем что модальное окно открылось
    cy.get(selectors.modal).should('be.visible');

    // Перезагружаем страницу
    cy.reload();

    // Модальное окно должно остаться открытым
    cy.get(selectors.modal).should('be.visible');

    // Закрываем модальное окно
    cy.get(selectors.close_modal).click();
    cy.get(selectors.modal).should('not.exist');
  });

  it('Проверка закрытия модального окна через оверлей', () => {
    // Кликаем на ингредиент
    cy.get(selectors.ingredient_bun).click();

    // Проверяем что модальное окно открылось
    cy.get(selectors.modal).should('be.visible');

    // Закрываем через оверлей
    cy.get(selectors.modal_overlay).click({ force: true });
    cy.get(selectors.modal).should('not.exist');
  });

  it('Проверка закрытия модального окна через ESC', () => {
    // Кликаем на ингредиент
    cy.get(selectors.ingredient_bun).click();

    // Проверяем что модальное окно открылось
    cy.get(selectors.modal).should('be.visible');

    // Закрываем через ESC
    cy.get('body').type('{esc}');
    cy.get(selectors.modal).should('not.exist');
  });
});
