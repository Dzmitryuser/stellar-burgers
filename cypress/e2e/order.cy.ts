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
      statusCode: 200,
      body: {
        success: true,
        user: {
          email: "test@example.com",
          name: "Test User"
        }
      }
    }).as('getUser');

    cy.setCookie('accessToken', 'test-access-token');
    localStorage.setItem('refreshToken', 'test-refresh-token');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('should create order when user is authenticated', () => {
    cy.wait('@getUser');

    // Добавляем булку
    const bunTransfer = new DataTransfer();
    cy.get('[data-testid=ingredient-item]').first()
      .trigger('dragstart', { dataTransfer: bunTransfer });
    cy.get('[data-testid=constructor-bun-top]')
      .trigger('drop', { dataTransfer: bunTransfer });

    // Добавляем начинку
    const ingredientTransfer = new DataTransfer();
    cy.get('[data-testid=ingredient-item]').eq(1)
      .trigger('dragstart', { dataTransfer: ingredientTransfer });
    cy.get('[data-testid=constructor-ingredients]')
      .trigger('drop', { dataTransfer: ingredientTransfer });

    // Нажимаем кнопку заказа
    cy.get('[data-testid=order-button]').click();

    // Проверяем создание заказа
    cy.wait('@createOrder')
      .its('request.body')
      .should('have.property', 'ingredients');

    cy.get('[data-testid=modal]').should('be.visible');
    cy.contains('идентификатор заказа').should('be.visible');
  });
});
