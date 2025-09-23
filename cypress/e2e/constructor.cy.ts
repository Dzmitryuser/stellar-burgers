//stellar-burgers\cypress\e2e\constructor.cy.ts
// cypress/e2e/constructor.cy.ts
// cypress/e2e/constructor.cy.ts
describe('Burger Constructor', () => {
  // Функция для drag and drop
  const dragAndDrop = (sourceSelector: string, targetSelector: string) => {
    const dataTransfer = new DataTransfer();
    cy.get(sourceSelector).trigger('dragstart', { dataTransfer });
    cy.get(targetSelector).trigger('drop', { dataTransfer });
  };

  beforeEach(() => {
    // Мокаем API ингредиентов
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('should display ingredients list', () => {
    cy.get('[data-testid=ingredient-item]').should('have.length.at.least', 2);
    cy.contains('Краторная булка N-200i').should('be.visible');
    cy.contains('Говяжий метеорит (отбивная)').should('be.visible');
  });

  it('should open and close ingredient modal', () => {
    cy.get('[data-testid=ingredient-item]').first().click();

    // Проверяем модальное окно
    cy.get('[data-testid=modal]').should('be.visible');
    cy.contains('Детали ингредиента').should('be.visible');

    // Закрываем через кнопку (ищем первую кнопку в модалке)
    cy.get('[data-testid=modal]').within(() => {
      cy.get('button').first().click();
    });

    cy.get('[data-testid=modal]').should('not.exist');
  });

  it('should add bun to constructor', () => {
    // Проверяем плейсхолдер до добавления
    cy.get('[data-testid=no-bun-placeholder]').should('be.visible');

    // Перетаскиваем булку
    dragAndDrop(
      '[data-testid=ingredient-item]:first',
      '[data-testid=constructor]'
    );

    // Проверяем что булка добавилась
    cy.get('[data-testid=constructor-bun-top]').should(
      'contain',
      'Краторная булка N-200i'
    );

    cy.get('[data-testid=no-bun-placeholder]').should('not.exist');
  });

  it('should add ingredient to constructor', () => {
    // Сначала добавляем булку
    dragAndDrop(
      '[data-testid=ingredient-item]:first',
      '[data-testid=constructor]'
    );

    // Затем добавляем начинку
    dragAndDrop(
      '[data-testid=ingredient-item]:eq(1)',
      '[data-testid=constructor-ingredients]'
    );

    cy.get('[data-testid=constructor-ingredients]').should(
      'contain',
      'Говяжий метеорит (отбивная)'
    );
  });

  it('should enable order button when bun is added', () => {
    cy.get('[data-testid=order-button]').should('be.disabled');

    dragAndDrop(
      '[data-testid=ingredient-item]:first',
      '[data-testid=constructor]'
    );

    cy.get('[data-testid=order-button]').should('not.be.disabled');
  });

  it('should show order modal after creating order', () => {
    // Мокаем авторизацию
    cy.intercept('GET', '**/api/auth/user', {
      statusCode: 200,
      body: {
        success: true,
        user: { email: 'test@example.com', name: 'Test User' }
      }
    }).as('getUser');

    // Мокаем создание заказа
    cy.intercept('POST', '**/api/orders', {
      fixture: 'order.json'
    }).as('createOrder');

    // Устанавливаем токен
    cy.setCookie('accessToken', 'test-token');

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
});
