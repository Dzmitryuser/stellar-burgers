// src/services/slices/userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getUserApi } from '../../utils/burger-api';
import { TUser } from '../../utils/types';

interface IUserState {
  user: TUser | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: IUserState = {
  user: null,
  isLoading: false,
  error: null
};

export const fetchUser = createAsyncThunk<TUser, void, { rejectValue: string }>(
  'user/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserApi();
      if (response.success) {
        return response.user;
      }
      return rejectWithValue('Не удалось получить данные пользователя');
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logoutUser(state) {
      state.user = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<TUser>) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Ошибка загрузки пользователя';
      });
  }
});

export const { logoutUser } = userSlice.actions;
export default userSlice.reducer;
