//stellar-burgers\cypress\e2e\ingredient-modal.cy.ts
import { selectors } from '../constants';

describe('E2E тестирование просмотра деталей ингредиента', () => {
  beforeEach(() => {
    cy.viewport(1280, 720);

    // Мокаем API ингредиентов
    cy.intercept('GET', 'https://norma.nomoreparties.space/api/ingredients', {
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

    // Закрываем модальное окно
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
});
