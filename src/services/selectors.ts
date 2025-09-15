import { RootState } from './reducers';

export const ingredientsSelector = (state: RootState) =>
  state.ingredients.ingredients;
export const ingredientsLoadingSelector = (state: RootState) =>
  state.ingredients.loading;

export const constructorBunSelector = (state: RootState) =>
  state.burgerConstructor.bun;
export const constructorIngredientsSelector = (state: RootState) =>
  state.burgerConstructor.ingredients;

export const orderSelector = (state: RootState) => state.order.order;
export const orderLoadingSelector = (state: RootState) => state.order.loading;
export const orderErrorSelector = (state: RootState) => state.order.error;

export const authUserSelector = (state: RootState) => state.auth.user;
export const authLoadingSelector = (state: RootState) => state.auth.loading;
export const authErrorSelector = (state: RootState) => state.auth.error;
export const isAuthCheckedSelector = (state: RootState) =>
  state.auth.isAuthChecked;

export const feedOrdersSelector = (state: RootState) => state.feed.orders;
export const feedTotalSelector = (state: RootState) => state.feed.total;
export const feedTotalTodaySelector = (state: RootState) =>
  state.feed.totalToday;
export const feedLoadingSelector = (state: RootState) => state.feed.loading;

export const userOrdersSelector = (state: RootState) => state.userOrders.orders;
export const userOrdersLoadingSelector = (state: RootState) =>
  state.userOrders.loading;

export const userOrdersErrorSelector = (state: RootState) =>
  state.userOrders.error;
