// stellar-burgers/cypress/e2e/constructor.cy.ts
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

  afterEach(() => {
    // Очистка после каждого теста
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('Проверка невозможности оформить заказ для неавторизованного пользователя', () => {
    // Ждем загрузки ингредиентов
    cy.contains('Краторная булка N-200i', { timeout: 10000 }).should(
      'be.visible'
    );

    // Добавляем ингредиенты через кнопки "Добавить" (рабочий способ)
    cy.contains('Краторная булка N-200i').parent().contains('Добавить').click();
    cy.contains('Говяжий метеорит (отбивная)')
      .parent()
      .contains('Добавить')
      .click();

    // Проверяем что ингредиенты добавились в конструктор
    cy.get(selectors.constructor_container)
      .contains('Краторная булка N-200i (верх)')
      .should('be.visible');
    cy.get(selectors.constructor_container)
      .contains('Краторная булка N-200i (низ)')
      .should('be.visible');
    cy.get(selectors.constructor_container)
      .contains('Говяжий метеорит (отбивная)')
      .should('be.visible');

    // Проверяем активность кнопки
    cy.get(selectors.order_button).should('not.be.disabled');

    // Пытаемся оформить заказ
    cy.get(selectors.order_button).click();

    // Должны быть перенаправлены на логин
    cy.url().should('include', '/login');
    cy.contains(selectors.login_page_text).should('be.visible');
  });

  it('Проверка оформления заказа для авторизованного пользователя', () => {
    // Сначала добавляем ингредиенты
    cy.contains('Краторная булка N-200i', { timeout: 10000 }).should(
      'be.visible'
    );

    cy.contains('Краторная булка N-200i').parent().contains('Добавить').click();
    cy.contains('Говяжий метеорит (отбивная)')
      .parent()
      .contains('Добавить')
      .click();

    // Проверяем добавление
    cy.get(selectors.constructor_container)
      .contains('Краторная булка N-200i (верх)')
      .should('be.visible');

    // Теперь логинимся
    cy.visit('/login');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password');

    // Мокаем логин
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

    // Ждем логина и редиректа на главную
    cy.wait('@login').its('response.statusCode').should('eq', 200);
    cy.url().should('eq', 'http://localhost:4000/');

    // Снова добавляем ингредиенты на главной (после логина)
    cy.contains('Краторная булка N-200i').parent().contains('Добавить').click();
    cy.contains('Говяжий метеорит (отбивная)')
      .parent()
      .contains('Добавить')
      .click();

    // Мокаем создание заказа
    cy.intercept('POST', api.order, {
      statusCode: 200,
      body: {
        success: true,
        name: 'Флюоресцентный бургер',
        order: { number: 12345 }
      }
    }).as('order');

    // Оформляем заказ
    cy.get(selectors.order_button).click();

    // Ждем создания заказа
    cy.wait('@order', { timeout: 15000 })
      .its('response.statusCode')
      .should('eq', 200);

    // ✅ ПРОВЕРКА: модальное окно с номером заказа
    cy.get('[data-testid="modal"]', { timeout: 10000 }).should('be.visible');
    cy.contains('идентификатор заказа').should('be.visible');
    cy.contains('12345').should('be.visible');

    // ✅ ПРОВЕРКА: закрываем модальное окно
    cy.get(selectors.close_modal).click();
    cy.get(selectors.order_modal).should('not.exist');

    // ✅ ПРОВЕРКА: конструктор очистился
    cy.get(selectors.constructor_container)
      .contains('Выберите булки')
      .should('be.visible');
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
    // Кнопка должна быть disabled без булки
    cy.get(selectors.order_button).should('be.disabled');

    // Добавляем только начинку
    cy.contains('Говяжий метеорит (отбивная)')
      .parent()
      .contains('Добавить')
      .click();

    // Кнопка все еще должна быть disabled (нет булки)
    cy.get(selectors.order_button).should('be.disabled');

    // Добавляем булку
    cy.contains('Краторная булка N-200i').parent().contains('Добавить').click();

    // Теперь кнопка должна быть активна
    cy.get(selectors.order_button).should('not.be.disabled');
  });
});
