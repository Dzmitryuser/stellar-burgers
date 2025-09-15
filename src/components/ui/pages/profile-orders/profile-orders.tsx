//src/components/ui/pages/profile-orders/profile-orders.tsx
import { FC } from 'react';
import styles from './profile-orders.module.css';
import { ProfileOrdersUIProps } from './type';
import { OrdersList } from '@components';

export const ProfileOrdersUI: FC<ProfileOrdersUIProps> = ({ orders }) => (
  <div className={styles.container}>
    <div className={styles.ordersContainer}>
      <OrdersList orders={orders} />
    </div>
  </div>
);
