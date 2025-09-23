//stellar-burgers\cypress\e2e\constructor.cy.ts
import '@4tw/cypress-drag-drop';
import { selectors, api } from '../constants';

describe('E2E тестирование конструктора', () => {
  beforeEach(() => {
    cy.viewport(1280, 720);

    // Мокаем API ингредиентов
    cy.intercept('GET', api.ingredients, {
      fixture: 'ingredients.json'
    });

    cy.visit('/');
  });

  it('Проверка невозможности оформить заказ для неавторизованного пользователя', () => {
    // Перетаскиваем ингредиенты в конструктор
    cy.get(selectors.ingredient_bun).drag(selectors.constructor_container);
    cy.get(selectors.ingredient_main).drag(selectors.constructor_ingredients);

    // Проверяем что ингредиенты добавились
    cy.contains('Краторная булка N-200i (верх)').should('be.visible');
    cy.contains('Говяжий метеорит (отбивная)').should('be.visible');

    // Пытаемся оформить заказ
    cy.get('button').contains(selectors.order_button).click();

    // Должны быть перенаправлены на страницу логина
    cy.url().should('include', '/login');
    cy.contains(selectors.login_page_text).should('be.visible');
  });

  it('Проверка оформления заказа для авторизованного пользователя', () => {
    // Сначала логинимся
    cy.visit('/login');
    cy.get('input[name="email"]').type(Cypress.env('email'));
    cy.get('input[name="password"]').type(Cypress.env('password'));

    // Мокаем логин
    cy.intercept('POST', api.login, {
      fixture: 'user.json'
    }).as('login');

    cy.get('button[type="submit"]').click();
    cy.wait('@login').its('response.statusCode').should('eq', 200);

    // Проверяем токены
    cy.getCookie('accessToken').should('exist');

    // Возвращаемся на главную
    cy.visit('/');

    // Добавляем ингредиенты в конструктор
    cy.get(selectors.ingredient_bun).drag(selectors.constructor_container);
    cy.get(selectors.ingredient_main).drag(selectors.constructor_ingredients);

    // Мокаем создание заказа
    cy.intercept('POST', api.order, {
      fixture: 'order.json'
    }).as('order');

    // Оформляем заказ
    cy.get('button').contains(selectors.order_button).click();

    // Ждем создания заказа
    cy.wait('@order').its('response.statusCode').should('eq', 200);

    // Проверяем модальное окно с номером заказа
    cy.get(selectors.modal).should('be.visible');
    cy.contains(selectors.order_modal_text).should('be.visible');
    cy.contains('12345').should('be.visible');
  });
});
