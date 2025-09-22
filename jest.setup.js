// Используем правильные абсолютные пути 
jest.mock('./src/utils/burger-api', () => ({
  getIngredientsApi: jest.fn(),
  getFeedsApi: jest.fn(),
  getOrdersApi: jest.fn(),
  orderBurgerApi: jest.fn(),
  registerUserApi: jest.fn(),
  loginUserApi: jest.fn(),
  logoutApi: jest.fn(),
  getUserApi: jest.fn(),
  updateUserApi: jest.fn()
}));

jest.mock('./src/utils/types', () => ({
  TIngredient: {},
  TConstructorIngredient: {},
  TOrder: {},
  TUser: {},
  TOrdersData: {},
  TTabMode: {}
}));
