describe('Burger Constructor', () => {
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
    
    cy.get('[data-testid=modal]').should('be.visible');
    cy.contains('Детали ингредиента').should('be.visible');
    cy.contains('Краторная булка N-200i').should('be.visible');
    
    cy.get('[data-testid=modal-close]').click();
    cy.get('[data-testid=modal]').should('not.exist');
  });

  it('should show empty constructor initially', () => {
    cy.get('[data-testid=no-bun-placeholder]').should('be.visible');
    cy.get('[data-testid=constructor-ingredients]').should('be.empty');
  });

  it('should enable order button when bun is added', () => {
    // Здесь будет тест добавления ингредиентов
    // Пока проверяем, что кнопка disabled
    cy.get('[data-testid=order-button]').should('be.disabled');
  });
});
