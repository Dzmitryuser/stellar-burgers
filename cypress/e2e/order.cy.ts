describe('Order Creation', () => {
    beforeEach(() => {
      // Мокаем все необходимые API
      cy.intercept('GET', '**/api/ingredients', {
        fixture: 'ingredients.json'
      }).as('getIngredients');
  
      cy.intercept('POST', '**/api/orders', {
        fixture: 'order.json'
      }).as('createOrder');
  
      cy.intercept('GET', '**/api/auth/user', {
        fixture: 'user.json'
      }).as('getUser');
  
      // Устанавливаем токены
      cy.setCookie('accessToken', 'test-access-token');
      localStorage.setItem('refreshToken', 'test-refresh-token');
  
      cy.visit('/');
      cy.wait('@getIngredients');
    });
  
    it('should create order when user is authenticated', () => {
      // Проверяем, что пользователь авторизован
      cy.wait('@getUser');
  
      // Добавляем ингредиенты в конструктор (симуляция)
      cy.get('[data-testid=constructor]').should('be.visible');
      
      // Нажимаем кнопку заказа
      cy.get('[data-testid=order-button]').click();
  
      // Проверяем, что запрос на создание заказа отправлен
      cy.wait('@createOrder').its('request.body').should('have.property', 'ingredients');
  
      // Проверяем модальное окно с номером заказа
      cy.get('[data-testid=modal]').should('be.visible');
      cy.contains('идентификатор заказа').should('be.visible');
      cy.contains('12345').should('be.visible'); // из order.json
  
      // Закрываем модальное окно
      cy.get('[data-testid=modal-close]').click();
      cy.get('[data-testid=modal]').should('not.exist');
    });
  });
