//stellar-burgers\cypress\constants.ts
// Константы для селекторов и API
export const selectors = {
  // Ингредиенты по их _id
  ingredient_bun: '[data-testid="60666c42cc7b410027a1a9b1"]',
  ingredient_main: '[data-testid="60666c42cc7b410027a1a9b5"]',

  // Конструктор
  constructor_container: '[data-testid="constructor"]',
  constructor_ingredients: '[data-testid="constructor-ingredients"]',

  // Модальные окна
  close_modal: '[data-testid="modal-close"]',
  modal: '[data-testid="modal"]',

  // Кнопки и текст
  order_button: 'Оформить заказ',
  login_page_text: 'Вход',
  order_modal_text: 'идентификатор заказа'
};

export const api = {
  ingredients: 'https://norma.nomoreparties.space/api/ingredients',
  order: 'https://norma.nomoreparties.space/api/orders',
  login: 'https://norma.nomoreparties.space/api/auth/login',
  user: 'https://norma.nomoreparties.space/api/auth/user'
};
