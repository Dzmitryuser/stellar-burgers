//src/pages/profile-orders/profile-orders.tsx
import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../services/hooks';
import { fetchUserOrders } from '../../services/slices/userOrdersSlice';
import {
  userOrdersSelector,
  userOrdersLoadingSelector,
  userOrdersErrorSelector
} from '../../services/selectors';
import { Preloader } from '@ui';
import { ProfileMenu } from '@components';
import styles from './profile-orders.module.css';

export const ProfileOrders: FC = () => {
  const dispatch = useAppDispatch();
  const orders: TOrder[] = useAppSelector(userOrdersSelector);
  const loading = useAppSelector(userOrdersLoadingSelector);
  const error = useAppSelector(userOrdersErrorSelector);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  if (loading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <div className='text text_type_main-default p-10'>Ошибка: {error}</div>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.menu}>
        <ProfileMenu />
      </div>
      <div className={styles.content}>
        <ProfileOrdersUI orders={orders} />
      </div>
    </main>
  );
};
