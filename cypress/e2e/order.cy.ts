//stellar-burgers\cypress\e2e\order.cy.ts
describe('Order Creation', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.intercept('POST', '**/api/orders', {
      fixture: 'order.json'
    }).as('createOrder');

    cy.intercept('GET', '**/api/auth/user', {
      fixture: 'user.json'
    }).as('getUser');

    cy.setCookie('accessToken', 'test-access-token');
    localStorage.setItem('refreshToken', 'test-refresh-token');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('should create order when user is authenticated', () => {
    cy.wait('@getUser');

    // Добавляем булку
    cy.get('[data-testid=ingredient-item]').first().trigger('dragstart');
    cy.get('[data-testid=constructor-bun-top]').trigger('drop');

    // Добавляем начинку
    cy.get('[data-testid=ingredient-item]').eq(1).trigger('dragstart');
    cy.get('[data-testid=constructor-ingredients]').trigger('drop');

    // Нажимаем кнопку заказа
    cy.get('[data-testid=order-button]').click();

    // Проверяем создание заказа
    cy.wait('@createOrder')
      .its('request.body')
      .should('have.property', 'ingredients');

    // Проверяем модальное окно
    cy.get('[data-testid=modal]').should('be.visible');
    cy.contains('идентификатор заказа').should('be.visible');
    cy.contains('12345').should('be.visible');

    // Закрываем модальное окно
    cy.get('[data-testid=modal-close]').click();
    cy.get('[data-testid=modal]').should('not.exist');

    // Проверяем очистку конструктора
    cy.get('[data-testid=constructor-bun-top]').should(
      'not.contain',
      'Краторная булка N-200i'
    );
    cy.get('[data-testid=constructor-ingredients]').should('be.empty');
  });
});
