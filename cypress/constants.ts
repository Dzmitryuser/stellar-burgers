// stellar-burgers/cypress/constants.ts
export const selectors = {
  // Ингредиенты по их _id
  ingredient_bun: '[data-testid="60666c42cc7b410027a1a9b1"]',
  ingredient_main: '[data-testid="60666c42cc7b410027a1a9b5"]',

  // Конструктор
  constructor_container: '[data-testid="constructor"]',
  constructor_ingredients: '[data-testid="constructor-ingredients"]',
  constructor_bun_top: '[data-testid="constructor-bun-top"]',
  constructor_bun_bottom: '[data-testid="constructor-bun-bottom"]',
  constructor_empty: '[data-testid="constructor-empty"]',

  // Модальные окна
  close_modal: '[data-testid="modal-close"]',
  modal: '[data-testid="modal"]',
  order_modal: '[data-testid="order-modal"]',
  modal_overlay: '[data-testid="modal-overlay"]',
  modal_content: '[data-testid="modal-content"]',

  // Кнопки и элементы
  order_button: '[data-testid="order-button"]',
  total_price: '[data-testid="total-price"]',
  preloader: '[data-testid="preloader"]',
  order_details: '[data-testid="order-details"]',

  // Текст
  login_page_text: 'Вход',
  order_modal_text: 'идентификатор заказа',
  choose_buns_text: 'Выберите булки'
};

export const api = {
  ingredients: 'https://norma.nomoreparties.space/api/ingredients',
  order: 'https://norma.nomoreparties.space/api/orders',
  login: 'https://norma.nomoreparties.space/api/auth/login',
  user: 'https://norma.nomoreparties.space/api/auth/user'
};
