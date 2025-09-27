//stellar-burgers\src\services\slices\__tests__\orderSlice.test.ts
jest.mock('../../../utils/burger-api', () => ({
  orderBurgerApi: jest.fn()
}));

jest.mock('../../../utils/types', () => ({
  TOrder: {}
}));

import { orderReducer, createOrder } from '../orderSlice';
import { TOrder } from '@utils-types';

describe('order reducer', () => {
  const mockOrder: TOrder = {
    _id: '1',
    status: 'done',
    name: 'Test Order',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    number: 12345,
    ingredients: ['1', '2']
  };

  it('should handle initial state', () => {
    expect(orderReducer(undefined, { type: 'unknown' })).toEqual({
      order: null,
      loading: false,
      error: null
    });
  });

  it('should handle createOrder.pending', () => {
    const state = orderReducer(
      undefined,
      createOrder.pending('requestId', ['1', '2'])
    );
    expect(state).toEqual({
      order: null,
      loading: true,
      error: null
    });
  });

  it('should handle createOrder.fulfilled', () => {
    const state = orderReducer(
      undefined,
      createOrder.fulfilled(mockOrder, 'requestId', ['1', '2'])
    );
    expect(state).toEqual({
      order: mockOrder,
      loading: false,
      error: null
    });
  });

  it('should handle createOrder.rejected', () => {
    const error = new Error('Order failed');
    const state = orderReducer(
      undefined,
      createOrder.rejected(error, 'requestId', ['1', '2'])
    );
    expect(state).toEqual({
      order: null,
      loading: false,
      error: error.message
    });
  });
});
