//src/pages/feed/feed.tsx
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../services/hooks';
import { fetchFeeds } from '../../services/slices/feedSlice';
import {
  feedOrdersSelector,
  feedLoadingSelector
} from '../../services/selectors';

export const Feed: FC = () => {
  const dispatch = useAppDispatch();
  const orders: TOrder[] = useAppSelector(feedOrdersSelector);
  const loading = useAppSelector(feedLoadingSelector);

  useEffect(() => {
    dispatch(fetchFeeds());

    // Автоматическое обновление каждые 30 секунд
    const interval = setInterval(() => {
      dispatch(fetchFeeds());
    }, 30000);

    return () => clearInterval(interval);
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(fetchFeeds());
  };

  if (loading) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
