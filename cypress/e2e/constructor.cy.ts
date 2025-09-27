// stellar-burgers/cypress/e2e/constructor.cy.ts
import '@4tw/cypress-drag-drop';
import { selectors, api } from '../constants';

describe('E2E тестирование конструктора', () => {
  beforeEach(() => {
    cy.viewport(1280, 720);

    cy.intercept('GET', api.ingredients, {
      fixture: 'ingredients.json'
    });

    cy.visit('/');
  });

  afterEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('Проверка невозможности оформить заказ для неавторизованного пользователя', () => {
    cy.contains('Краторная булка N-200i', { timeout: 10000 }).should(
      'be.visible'
    );

    cy.contains('Краторная булка N-200i').parent().contains('Добавить').click();
    cy.contains('Говяжий метеорит (отбивная)')
      .parent()
      .contains('Добавить')
      .click();

    cy.get(selectors.constructor_container)
      .contains('Краторная булка N-200i (верх)')
      .should('be.visible');
    cy.get(selectors.constructor_container)
      .contains('Краторная булка N-200i (низ)')
      .should('be.visible');
    cy.get(selectors.constructor_container)
      .contains('Говяжий метеорит (отбивная)')
      .should('be.visible');

    cy.get(selectors.order_button).should('not.be.disabled');
    cy.get(selectors.order_button).click();

    cy.url().should('include', '/login');
    cy.contains(selectors.login_page_text).should('be.visible');
  });

  it('Проверка оформления заказа для авторизованного пользователя', () => {
    cy.contains('Краторная булка N-200i', { timeout: 10000 }).should(
      'be.visible'
    );
    cy.contains('Краторная булка N-200i').parent().contains('Добавить').click();
    cy.contains('Говяжий метеорит (отбивная)')
      .parent()
      .contains('Добавить')
      .click();

    cy.get(selectors.constructor_container)
      .contains('Краторная булка N-200i (верх)')
      .should('be.visible');

    cy.visit('/login');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password');

    cy.intercept('POST', api.login, {
      statusCode: 200,
      body: {
        success: true,
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
        user: {
          email: 'test@example.com',
          name: 'Test User'
        }
      }
    }).as('login');

    cy.get('button[type="submit"]').click();
    cy.wait('@login').its('response.statusCode').should('eq', 200);
    cy.url().should('eq', 'http://localhost:4000/');

    cy.contains('Краторная булка N-200i').parent().contains('Добавить').click();
    cy.contains('Говяжий метеорит (отбивная)')
      .parent()
      .contains('Добавить')
      .click();

    cy.intercept('POST', api.order, {
      statusCode: 200,
      body: {
        success: true,
        name: 'Флюоресцентный бургер',
        order: { number: 12345 }
      }
    }).as('order');

    cy.get(selectors.order_button).click();
    cy.wait('@order', { timeout: 15000 })
      .its('response.statusCode')
      .should('eq', 200);

    cy.get(selectors.modal, { timeout: 10000 }).should('be.visible');
    cy.get(selectors.modal)
      .contains('идентификатор заказа')
      .should('be.visible');
    cy.get(selectors.modal).contains('12345').should('be.visible');

    cy.get(selectors.close_modal).click();
    cy.get(selectors.modal).should('not.exist');

    cy.get(selectors.constructor_container)
      .contains('Выберите булки')
      .should('be.visible');
    cy.get(selectors.constructor_container)
      .contains('Краторная булка N-200i (верх)')
      .should('not.exist');
    cy.get(selectors.constructor_container)
      .contains('Говяжий метеорит (отбивная)')
      .should('not.exist');
  });

  it('Оформление заказа с токенами и моками пользователя', () => {
    // Сначала логинимся через UI с моками API
    cy.visit('/login');

    // Мокаем запрос логина
    cy.intercept('POST', api.login, {
      statusCode: 200,
      body: {
        success: true,
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        user: {
          email: 'mock@example.com',
          name: 'Mock User'
        }
      }
    }).as('login');

    // Заполняем форму логина
    cy.get('input[name="email"]').type('mock@example.com');
    cy.get('input[name="password"]').type('mockpassword');
    cy.get('button[type="submit"]').click();

    // Ждем завершения логина и редиректа на главную
    cy.wait('@login');
    cy.url().should('eq', 'http://localhost:4000/');

    // Ждем загрузки ингредиентов (убеждаемся, что страница загрузилась)
    cy.contains('Соберите бургер', { timeout: 10000 }).should('be.visible');
    cy.contains('Краторная булка N-200i', { timeout: 10000 }).should(
      'be.visible'
    );

    // Добавляем ингредиенты через кнопки "Добавить"
    cy.contains('Краторная булка N-200i')
      .parent()
      .within(() => {
        cy.contains('Добавить').click();
      });

    cy.contains('Говяжий метеорит (отбивная)')
      .parent()
      .within(() => {
        cy.contains('Добавить').click();
      });

    // Проверяем добавление в конструктор
    cy.get(selectors.constructor_container)
      .contains('Краторная булка N-200i (верх)')
      .should('be.visible');

    // Мокаем создание заказа
    cy.intercept('POST', api.order, {
      statusCode: 200,
      body: {
        success: true,
        name: 'Флюоресцентный бургер',
        order: { number: 67890 }
      }
    }).as('order');

    // Убеждаемся, что кнопка заказа активна
    cy.get(selectors.order_button).should('not.be.disabled');

    // Оформляем заказ
    cy.get(selectors.order_button).click();

    // Ждем создания заказа
    cy.wait('@order', { timeout: 15000 })
      .its('response.statusCode')
      .should('eq', 200);

    // Проверяем модальное окно с номером заказа
    cy.get(selectors.modal, { timeout: 10000 }).should('be.visible');
    cy.get(selectors.modal)
      .contains('идентификатор заказа')
      .should('be.visible');
    cy.get(selectors.modal).contains('67890').should('be.visible');

    // Закрываем модальное окно
    cy.get(selectors.close_modal).click();
    cy.get(selectors.modal).should('not.exist');

    // Проверяем очистку конструктора
    cy.get(selectors.constructor_container)
      .contains('Выберите булки')
      .should('be.visible');
    cy.get(selectors.constructor_container)
      .contains('Краторная булка N-200i (верх)')
      .should('not.exist');
  });

  it('Проверка добавления ингредиентов в конструктор', () => {
    cy.contains('Краторная булка N-200i', { timeout: 10000 }).should(
      'be.visible'
    );
    cy.contains('Краторная булка N-200i').parent().contains('Добавить').click();

    cy.get(selectors.constructor_container)
      .contains('Краторная булка N-200i (верх)')
      .should('be.visible');
    cy.get(selectors.constructor_container)
      .contains('Краторная булка N-200i (низ)')
      .should('be.visible');
  });

  it('Проверка кнопки заказа до добавления булки', () => {
    cy.get(selectors.order_button).should('be.disabled');

    cy.contains('Говяжий метеорит (отбивная)')
      .parent()
      .contains('Добавить')
      .click();
    cy.get(selectors.order_button).should('be.disabled');

    cy.contains('Краторная булка N-200i').parent().contains('Добавить').click();
    cy.get(selectors.order_button).should('not.be.disabled');
  });
});
