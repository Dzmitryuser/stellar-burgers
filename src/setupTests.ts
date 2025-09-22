//stellar-burgers\src\setupTests.ts
import '@testing-library/jest-dom';

// Моки для модулей
jest.mock('./utils/burger-api', () => ({
  getIngredientsApi: jest.fn(),
  getFeedsApi: jest.fn(),
  getOrdersApi: jest.fn(),
  orderBurgerApi: jest.fn(),
  registerUserApi: jest.fn(),
  loginUserApi: jest.fn(),
  logoutApi: jest.fn(),
  getUserApi: jest.fn(),
  updateUserApi: jest.fn(),
  forgotPasswordApi: jest.fn(),
  resetPasswordApi: jest.fn(),
  getOrderByNumberApi: jest.fn()
}));

jest.mock('./utils/types', () => ({
  TIngredient: {},
  TConstructorIngredient: {},
  TOrder: {},
  TUser: {},
  TOrdersData: {},
  TTabMode: {}
}));
