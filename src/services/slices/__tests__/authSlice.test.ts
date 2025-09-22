//stellar-burgers\src\services\slices\__tests__\authSlice.test.ts

import { authReducer, loginUser, registerUser, getUser } from '../authSlice';
import { TUser } from '@utils-types';

describe('auth reducer', () => {
  const mockUser: TUser = {
    email: 'test@example.com',
    name: 'Test User'
  };

  it('should handle initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual({
      user: null,
      isAuthChecked: false,
      loading: false,
      error: null
    });
  });

  it('should handle loginUser.pending', () => {
    const state = authReducer(
      undefined,
      loginUser.pending('requestId', {
        email: 'test@example.com',
        password: 'password'
      })
    );
    expect(state).toEqual({
      user: null,
      isAuthChecked: false,
      loading: true,
      error: null
    });
  });

  it('should handle loginUser.fulfilled', () => {
    const state = authReducer(
      undefined,
      loginUser.fulfilled(mockUser, 'requestId', {
        email: 'test@example.com',
        password: 'password'
      })
    );
    expect(state).toEqual({
      user: mockUser,
      isAuthChecked: true,
      loading: false,
      error: null
    });
  });

  it('should handle loginUser.rejected', () => {
    const error = new Error('Login failed');
    const state = authReducer(
      undefined,
      loginUser.rejected(error, 'requestId', {
        email: 'test@example.com',
        password: 'password'
      })
    );
    expect(state).toEqual({
      user: null,
      isAuthChecked: true,
      loading: false,
      error: error.message
    });
  });

  it('should handle registerUser.pending', () => {
    const state = authReducer(
      undefined,
      registerUser.pending('requestId', {
        email: 'test@example.com',
        password: 'password',
        name: 'Test User'
      })
    );
    expect(state).toEqual({
      user: null,
      isAuthChecked: false,
      loading: true,
      error: null
    });
  });

  it('should handle getUser.fulfilled', () => {
    const state = authReducer(
      undefined,
      getUser.fulfilled(mockUser, 'requestId')
    );
    expect(state).toEqual({
      user: mockUser,
      isAuthChecked: true,
      loading: false,
      error: null
    });
  });

  it('should handle getUser.rejected', () => {
    const state = authReducer(
      undefined,
      getUser.rejected(new Error(), 'requestId')
    );
    expect(state).toEqual({
      user: null,
      isAuthChecked: true,
      loading: false,
      error: null
    });
  });
});
