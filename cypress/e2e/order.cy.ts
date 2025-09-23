// cypress/e2e/order.cy.ts
describe('Order Creation', () => {
  const dragAndDrop = (sourceSelector: string, targetSelector: string) => {
    const dataTransfer = new DataTransfer();
    cy.get(sourceSelector).trigger('dragstart', { dataTransfer });
    cy.get(targetSelector).trigger('drop', { dataTransfer });
  };

  beforeEach(() => {
    // Мокаем API
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.intercept('POST', '**/api/orders', {
      fixture: 'order.json'
    }).as('createOrder');

    // Мокаем авторизацию
    cy.intercept('GET', '**/api/auth/user', {
      statusCode: 200,
      body: {
        success: true,
        user: { email: 'test@example.com', name: 'Test User' }
      }
    }).as('getUser');

    cy.setCookie('accessToken', 'test-token');
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('should create order when user is authenticated', () => {
    cy.wait('@getUser');

    // Добавляем ингредиенты
    dragAndDrop(
      '[data-testid=ingredient-item]:first',
      '[data-testid=constructor]'
    );
    dragAndDrop(
      '[data-testid=ingredient-item]:eq(1)',
      '[data-testid=constructor-ingredients]'
    );

    // Создаем заказ
    cy.get('[data-testid=order-button]').click();

    cy.wait('@createOrder');
    cy.get('[data-testid=modal]').should('be.visible');
    cy.contains('идентификатор заказа').should('be.visible');
  });

  it('should redirect to login when user is not authenticated', () => {
    // Убираем авторизацию
    cy.clearCookies();
    cy.intercept('GET', '**/api/auth/user', {
      statusCode: 401
    }).as('getUserUnauthorized');

    // Добавляем булку
    dragAndDrop(
      '[data-testid=ingredient-item]:first',
      '[data-testid=constructor]'
    );

    // Пытаемся создать заказ
    cy.get('[data-testid=order-button]').click();

    // Должны быть перенаправлены на логин
    cy.url().should('include', '/login');
  });
});
