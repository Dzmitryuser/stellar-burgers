//src/components/feed-info/feed-info.tsx
import { FC } from 'react';
import { useAppSelector } from '../../services/hooks';
import {
  feedTotalSelector,
  feedTotalTodaySelector,
  feedOrdersSelector
} from '../../services/selectors';
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const orders: TOrder[] = useAppSelector(feedOrdersSelector);
  const total = useAppSelector(feedTotalSelector);
  const totalToday = useAppSelector(feedTotalTodaySelector);

  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');

  console.log('FeedInfo data:', {
    total,
    totalToday,
    readyOrders: readyOrders.length,
    pendingOrders: pendingOrders.length
  });

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={{ total, totalToday }}
    />
  );
};
