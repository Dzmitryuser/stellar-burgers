//stellar-burgers\src\services\__tests__\rootReducer.test.ts
jest.mock('../../utils/burger-api', () => ({
  getIngredientsApi: jest.fn()
}));

jest.mock('../../utils/types', () => ({
  TIngredient: {}
}));

import { rootReducer } from '../reducers';

describe('rootReducer', () => {
  it('should return initial state for unknown action', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toEqual({
      ingredients: {
        ingredients: [],
        loading: false,
        error: null
      },
      burgerConstructor: {
        bun: null,
        ingredients: []
      },
      order: {
        order: null,
        loading: false,
        error: null
      },
      auth: {
        user: null,
        isAuthChecked: false,
        loading: false,
        error: null
      },
      feed: {
        orders: [],
        total: 0,
        totalToday: 0,
        loading: false,
        error: null
      },
      userOrders: {
        orders: [],
        loading: false,
        error: null
      }
    });
  });
});
