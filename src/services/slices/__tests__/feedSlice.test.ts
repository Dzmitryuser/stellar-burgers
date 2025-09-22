//stellar-burgers\src\services\slices\__tests__\feedSlice.test.ts
jest.mock('../../../utils/burger-api', () => ({
  getFeedsApi: jest.fn()
}));

jest.mock('../../../utils/types', () => ({
  TOrder: {},
  TOrdersData: {}
}));

import { feedReducer, fetchFeeds } from '../feedSlice';
import { TOrder } from '@utils-types';

describe('feed reducer', () => {
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
    expect(feedReducer(undefined, { type: 'unknown' })).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      loading: false,
      error: null
    });
  });

  it('should handle fetchFeeds.pending', () => {
    const state = feedReducer(undefined, fetchFeeds.pending('requestId'));
    expect(state).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      loading: true,
      error: null
    });
  });

  it('should handle fetchFeeds.fulfilled', () => {
    const response = {
      success: true,
      orders: mockOrders,
      total: 100,
      totalToday: 10
    };
    const state = feedReducer(
      undefined,
      fetchFeeds.fulfilled(response, 'requestId')
    );
    expect(state).toEqual({
      orders: mockOrders,
      total: 100,
      totalToday: 10,
      loading: false,
      error: null
    });
  });

  it('should handle fetchFeeds.rejected', () => {
    const error = new Error('Failed to fetch feeds');
    const state = feedReducer(
      undefined,
      fetchFeeds.rejected(error, 'requestId')
    );
    expect(state).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      loading: false,
      error: error.message
    });
  });
});
