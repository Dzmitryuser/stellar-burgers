import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrdersApi } from '@api';
import { TOrder } from '@utils-types';

export const fetchUserOrders = createAsyncThunk(
  'userOrders/fetchAll',
  async () => {
    try {
      const response = await getOrdersApi();
      return response;
    } catch (error) {
      throw error;
    }
  }
);

type TUserOrdersState = {
  orders: TOrder[];
  loading: boolean;
  error: string | null;
};

const initialState: TUserOrdersState = {
  orders: [],
  loading: false,
  error: null
};

const userOrdersSlice = createSlice({
  name: 'userOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user orders';
      });
  }
});

export const userOrdersReducer = userOrdersSlice.reducer;
