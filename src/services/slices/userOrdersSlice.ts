import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrdersApi } from '@api';
import { TOrder } from '@utils-types';

export const fetchUserOrders = createAsyncThunk(
  'userOrders/fetchAll',
  async () => {
    console.log('Fetching user orders from API...');
    try {
      const response = await getOrdersApi();
      console.log('User orders fetched successfully:', response.length);
      return response;
    } catch (error) {
      console.error('Failed to fetch user orders:', error);
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
        console.log('User orders loading started');
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        console.log('User orders loaded:', action.payload.length);
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        console.log('User orders loading failed:', action.error);
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user orders';
      });
  }
});

export const userOrdersReducer = userOrdersSlice.reducer;
