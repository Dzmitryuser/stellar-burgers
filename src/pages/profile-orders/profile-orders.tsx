//src/pages/profile-orders/profile-orders.tsx
import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../services/hooks';
import { fetchUserOrders } from '../../services/slices/userOrdersSlice';
import {
  userOrdersSelector,
  userOrdersLoadingSelector
} from '../../services/selectors';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useAppDispatch();
  const orders: TOrder[] = useAppSelector(userOrdersSelector);
  const loading = useAppSelector(userOrdersLoadingSelector);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  if (loading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
