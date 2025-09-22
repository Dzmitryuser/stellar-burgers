//stellar-burgers\cypress\e2e\constructor.cy.ts
describe('Burger Constructor', () => {
  beforeEach(() => {
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

    cy.get('[data-testid=modal-close]').click();
    cy.get('[data-testid=modal]').should('not.exist');
  });

  it('should add bun to constructor', () => {
    const dataTransfer = new DataTransfer();

    cy.get('[data-testid=ingredient-item]')
      .first()
      .trigger('dragstart', { dataTransfer });

    cy.get('[data-testid=constructor-bun-top]').trigger('drop', {
      dataTransfer
    });

    cy.get('[data-testid=constructor-bun-top]').should(
      'contain',
      'Краторная булка N-200i'
    );
  });

  it('should add ingredient to constructor', () => {
    const dataTransfer = new DataTransfer();

    cy.get('[data-testid=ingredient-item]')
      .eq(1)
      .trigger('dragstart', { dataTransfer });

    cy.get('[data-testid=constructor-ingredients]').trigger('drop', {
      dataTransfer
    });

    cy.get('[data-testid=constructor-ingredients]').should(
      'contain',
      'Говяжий метеорит (отбивная)'
    );
  });

  it('should enable order button when bun is added', () => {
    cy.get('[data-testid=order-button]').should('be.disabled');

    const dataTransfer = new DataTransfer();
    cy.get('[data-testid=ingredient-item]')
      .first()
      .trigger('dragstart', { dataTransfer });
    cy.get('[data-testid=constructor-bun-top]').trigger('drop', {
      dataTransfer
    });

    cy.get('[data-testid=order-button]').should('not.be.disabled');
  });
});
