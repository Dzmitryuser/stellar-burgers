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
    cy.contains('Краторная булка N-200i').should('be.visible');

    // Закрытие по крестику
    cy.get('[data-testid=modal-close]').click();
    cy.get('[data-testid=modal]').should('not.exist');

    // Закрытие по оверлею
    cy.get('[data-testid=ingredient-item]').first().click();
    cy.get('[data-testid=modal]').should('be.visible');
    cy.get('[data-testid=modal-overlay]').click({ force: true });
    cy.get('[data-testid=modal]').should('not.exist');
  });

  it('should add bun to constructor', () => {
    cy.get('[data-testid=ingredient-item]').first().as('bun');
    cy.get('[data-testid=constructor-bun-top]').as('bunTop');
    cy.get('[data-testid=constructor-bun-bottom]').as('bunBottom');

    // Перетаскивание булки
    cy.get('@bun').trigger('dragstart');
    cy.get('@bunTop').trigger('drop');

    cy.get('@bunTop').should('contain', 'Краторная булка N-200i');
    cy.get('@bunBottom').should('contain', 'Краторная булка N-200i');
  });

  it('should add ingredient to constructor', () => {
    cy.get('[data-testid=ingredient-item]').eq(1).as('ingredient');
    cy.get('[data-testid=constructor-ingredients]').as('constructor');

    // Перетаскивание начинки
    cy.get('@ingredient').trigger('dragstart');
    cy.get('@constructor').trigger('drop');

    cy.get('@constructor').should('contain', 'Говяжий метеорит (отбивная)');
  });

  it('should enable order button when bun is added', () => {
    cy.get('[data-testid=order-button]').should('be.disabled');

    // Добавляем булку
    cy.get('[data-testid=ingredient-item]').first().trigger('dragstart');
    cy.get('[data-testid=constructor-bun-top]').trigger('drop');

    cy.get('[data-testid=order-button]').should('not.be.disabled');
  });
});
