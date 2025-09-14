import { combineReducers } from 'redux';
import { ingredientsReducer } from './slices/ingredientsSlice';
import { constructorReducer } from './slices/constructorSlice';
import { orderReducer } from './slices/orderSlice';
import { authReducer } from './slices/authSlice';
import { feedReducer } from './slices/feedSlice';
import { userOrdersReducer } from './slices/userOrdersSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  order: orderReducer,
  auth: authReducer,
  feed: feedReducer,
  userOrders: userOrdersReducer
});

export type RootState = ReturnType<typeof rootReducer>;
