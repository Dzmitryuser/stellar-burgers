import '@4tw/cypress-drag-drop';
import { selectors, api } from '../constants';

describe('E2E тестирование конструктора', () => {
  beforeEach(() => {
    cy.viewport(1280, 720);
    cy.visit('/');
  });

  it('Проверка невозможности оформить заказ для неавторизованного пользователя', () => {
    cy.get(selectors.ingredient_bun).drag(selectors.constructor_container);
    cy.get(selectors.constructor_ingredient_bun).should('be.visible');
    cy.get(selectors.ingredient_main).drag(selectors.constructor_container);
    cy.get(selectors.constructor_ingredient_main).should('be.visible');
    cy.get(selectors.ingredient_sauce).drag(selectors.constructor_container);
    cy.get(selectors.constructor_ingredient_sauce).should('be.visible');
    cy.get('button').contains(selectors.order_button).click();
    cy.get('p').contains(selectors.login_page_text).should('be.visible');
  });

  it('Проверка оформления заказа для авторизованного пользователя', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type(Cypress.env('email'));
    cy.get('input[name="password"]').type(Cypress.env('password'));
    cy.intercept('POST', api.login).as('login');
    cy.get('button[type="submit"]').click();
    cy.wait('@login', { timeout: 50000 })
      .its('response.statusCode')
      .should('eq', 200);
    cy.getCookie('accessToken').get('value').should('not.be.empty');
    cy.getCookie('refreshToken').get('value').should('not.be.empty');
    cy.get(selectors.ingredient_bun).drag(selectors.constructor_container);
    cy.get(selectors.constructor_ingredient_bun).should('be.visible');
    cy.get(selectors.ingredient_main).drag(selectors.constructor_container);
    cy.get(selectors.constructor_ingredient_main).should('be.visible');
    cy.get(selectors.ingredient_sauce).drag(selectors.constructor_container);
    cy.get(selectors.constructor_ingredient_sauce).should('be.visible');
    cy.intercept('POST', api.order).as('order');
    cy.get('button').contains(selectors.order_button).click();
    cy.wait('@order', { timeout: 50000 })
      .its('response.statusCode')
      .should('eq', 200);
    cy.get('p').contains(selectors.order_modal_text).should('be.visible');
  });
});


import '@4tw/cypress-drag-drop';
import { selectors } from '../constants';

describe('E2E тестирование просмотра деталей ингредиента', () => {
  beforeEach(() => {
    cy.viewport(1280, 720);
    cy.visit('/');
  });

  it('Проверка работоспособности модального окна с деталями ингредиента', () => {
    cy.get(selectors.ingredient_bun).click();
    cy.get(selectors.close_modal).should('be.visible');
    cy.get(selectors.close_modal).click();
    cy.get(selectors.close_modal).should('not.exist');
  });

  it('Проверка работоспособности модального окна после перезагрузки страницы', () => {
    cy.get(selectors.ingredient_bun).click();
    cy.get(selectors.close_modal).should('be.visible');
    cy.reload();
    cy.get(selectors.close_modal).should('be.visible');
  });
});



import { constantsMap, apiMap } from '../src/shared/model';

const base_url = constantsMap.shared.config.apiUrl;

export const selectors = {
  ingredient_bun: '[data-cy="643d69a5c3f7b9001cfa093c"]',
  ingredient_sauce: '[data-cy="643d69a5c3f7b9001cfa0942"]',
  ingredient_main: '[data-cy="643d69a5c3f7b9001cfa0940"]',
  constructor_ingredient_bun: '[data-cy="set-643d69a5c3f7b9001cfa093c"]',
  constructor_ingredient_sauce: '[data-cy="set-643d69a5c3f7b9001cfa0942"]',
  constructor_ingredient_main: '[data-cy="set-643d69a5c3f7b9001cfa0940"]',
  close_modal: '[data-cy="close-modal"]',
  constructor_container: '[data-cy="constructor-container"]',
  order_button: constantsMap.features.order.orderButton,
  login_page_text: constantsMap.pages.login.mainText,
  order_modal_text: constantsMap.entities.order.modal.mainText,
};

export const api = {
  order: base_url + apiMap.postOrder,
  login: base_url + apiMap.postLogin,
};




{
    "compilerOptions": {
      "target": "es5",
      "lib": ["es5", "dom"],
      "types": ["cypress", "@4tw/cypress-drag-drop"]
    },
    "include": [
      "**/*.ts"
    ]
  }




  import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    supportFile: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});



{
    "email": "your@email.com",
    "password": "password"
}




{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "typeRoots": ["node_modules/@types", "types/"],

    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": "./src",
    "paths": {
      "@/*": ["*"]
    },
  },
  "include": ["src", "types"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
