//stellar-burgers\src\services\slices\__tests__\userOrdersSlice.test.ts

import { userOrdersReducer, fetchUserOrders } from '../userOrdersSlice';
import { TOrder } from '@utils-types';

describe('userOrders reducer', () => {
  const mockOrders: TOrder[] = [
    {
      _id: '1',
      status: 'done',
      name: 'Test Order',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      number: 12345,
      ingredients: ['1', '2']
    }
  ];

  it('should handle initial state', () => {
    expect(userOrdersReducer(undefined, { type: 'unknown' })).toEqual({
      orders: [],
      loading: false,
      error: null
    });
  });

  it('should handle fetchUserOrders.pending', () => {
    const state = userOrdersReducer(
      undefined,
      fetchUserOrders.pending('requestId')
    );
    expect(state).toEqual({
      orders: [],
      loading: true,
      error: null
    });
  });

  it('should handle fetchUserOrders.fulfilled', () => {
    const state = userOrdersReducer(
      undefined,
      fetchUserOrders.fulfilled(mockOrders, 'requestId')
    );
    expect(state).toEqual({
      orders: mockOrders,
      loading: false,
      error: null
    });
  });

  it('should handle fetchUserOrders.rejected', () => {
    const error = new Error('Failed to fetch user orders');
    const state = userOrdersReducer(
      undefined,
      fetchUserOrders.rejected(error, 'requestId')
    );
    expect(state).toEqual({
      orders: [],
      loading: false,
      error: error.message
    });
  });
});
