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
    // Очищаем localStorage и cookies после каждого теста
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('Проверка невозможности оформить заказ для неавторизованного пользователя', () => {
    // Добавляем ингредиенты через кнопки "Добавить"
    cy.contains('Краторная булка N-200i').parent().contains('Добавить').click();
    cy.contains('Говяжий метеорит (отбивная)')
      .parent()
      .contains('Добавить')
      .click();

    // Проверяем что ингредиенты добавились в конструктор (внутри DOM-элемента конструктора)
    cy.get(selectors.constructor_container)
      .contains('Краторная булка N-200i (верх)')
      .should('be.visible');
    cy.get(selectors.constructor_container)
      .contains('Краторная булка N-200i (низ)')
      .should('be.visible');
    cy.get(selectors.constructor_container)
      .contains('Говяжий метеорит (отбивная)')
      .should('be.visible');

    // Проверяем что кнопка активна
    cy.get(selectors.order_button).should('not.be.disabled');

    // Пытаемся оформить заказ
    cy.get(selectors.order_button).click();

    // Должны быть перенаправлены на страницу логина
    cy.url().should('include', '/login');
    cy.contains(selectors.login_page_text).should('be.visible');
  });

  it('Проверка оформления заказа для авторизованного пользователя', () => {
    // Мокаем что пользователь авторизован
    cy.intercept('GET', api.user, (req) => {
      req.reply({
        statusCode: 200,
        body: {
          success: true,
          user: {
            email: 'test@example.com',
            name: 'Test User'
          }
        }
      });
    }).as('getUser');

    // Устанавливаем токен в localStorage
    cy.window().then((win) => {
      win.localStorage.setItem('accessToken', 'Bearer test-access-token');
    });

    cy.visit('/');

    // Ждем загрузки ингредиентов
    cy.contains('Краторная булка N-200i', { timeout: 10000 }).should(
      'be.visible'
    );

    // Добавляем ингредиенты через кнопки "Добавить"
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

    // Проверяем что кнопка заказа активна
    cy.get(selectors.order_button).should('not.be.disabled');

    // Оформляем заказ
    cy.get(selectors.order_button).click();

    // Ожидаем что НЕ произойдет редирект на логин
    cy.wait(1000);

    // Проверяем что остались на главной странице
    cy.url().should('eq', 'http://localhost:4000/');
    cy.url().should('not.include', '/login');

    // Логируем успешное выполнение
    cy.log('✅ Авторизованный пользователь успешно попытался оформить заказ');
    cy.log('✅ Редирект на логин не произошел');
  });

  it('Проверка добавления ингредиента в конструктор', () => {
    // Добавляем ингредиент через кнопку "Добавить"
    cy.contains('Краторная булка N-200i').parent().contains('Добавить').click();

    // Проверяем что ингредиент добавился именно в конструктор
    cy.get(selectors.constructor_container)
      .contains('Краторная булка N-200i (верх)')
      .should('be.visible');
    cy.get(selectors.constructor_container)
      .contains('Краторная булка N-200i (низ)')
      .should('be.visible');
  });

  it('Проверка отображения ингредиентов', () => {
    cy.contains('Краторная булка N-200i').should('be.visible');
    cy.contains('Говяжий метеорит (отбивная)').should('be.visible');
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
