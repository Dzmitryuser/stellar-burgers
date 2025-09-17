//src/components/order-info/order-info.tsx
import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../services/hooks';
import { ingredientsSelector } from '../../services/selectors';
import { getOrderByNumberApi } from '@api';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const ingredients = useAppSelector(ingredientsSelector);
  const [orderData, setOrderData] = useState<TOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!number) return;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const orderNumber = parseInt(number, 10);
        const response = await getOrderByNumberApi(orderNumber);

        if (response.orders && response.orders.length > 0) {
          setOrderData(response.orders[0]);
        } else {
          setError('Заказ не найден');
        }
      } catch (err) {
        setError('Ошибка при загрузке заказа');
        console.error('Failed to fetch order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [number]);

  if (loading) {
    return <Preloader />;
  }

  if (error) {
    return <div className='text text_type_main-default p-10'>{error}</div>;
  }

  if (!orderData) {
    return (
      <div className='text text_type_main-default p-10'>Заказ не найден</div>
    );
  }

  return <OrderInfoUI orderData={orderData} ingredients={ingredients} />;
};
