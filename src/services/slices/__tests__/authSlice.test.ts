import { authReducer, loginUser } from '../authSlice';
import { TUser } from '@utils-types';

describe('auth reducer', () => {
  const mockUser: TUser = {
    email: 'test@example.com',
    name: 'Test User'
  };

  it('should handle loginUser.pending', () => {
    const state = authReducer(
      undefined, 
      loginUser.pending('requestId', { email: 'test@example.com', password: 'password' })
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
      loginUser.fulfilled(mockUser, 'requestId', { email: 'test@example.com', password: 'password' })
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
      loginUser.rejected(error, 'requestId', { email: 'test@example.com', password: 'password' })
    );
    expect(state).toEqual({
      user: null,
      isAuthChecked: true,
      loading: false,
      error: error.message
    });
  });
});
