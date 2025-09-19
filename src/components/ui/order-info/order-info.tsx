//src/components/ui/order-info/order-info.tsx
import React, { FC, memo, useMemo } from 'react';
import {
  CurrencyIcon,
  FormattedDate
} from '@zlden/react-developer-burger-ui-components';

import styles from './order-info.module.css';

import { OrderInfoUIProps } from './type';
import { OrderStatus } from '@components';
import { TIngredient } from '@utils-types';

export const OrderInfoUI: FC<OrderInfoUIProps> = memo(
  ({ orderData, ingredients }) => {
    const orderInfo = useMemo(() => {
      if (!orderData || !ingredients.length) return null;

      const date = new Date(orderData.createdAt);

      type TIngredientsWithCount = {
        [key: string]: TIngredient & { count: number };
      };

      const ingredientsInfo = orderData.ingredients.reduce(
        (acc: TIngredientsWithCount, item: string) => {
          if (!acc[item]) {
            const ingredient = ingredients.find(
              (ing: TIngredient) => ing._id === item
            );
            if (ingredient) {
              acc[item] = {
                ...ingredient,
                count: 1
              };
            }
          } else {
            acc[item].count++;
          }

          return acc;
        },
        {}
      );

      const total = Object.values(ingredientsInfo).reduce(
        (acc: number, item: TIngredient & { count: number }) =>
          acc + item.price * item.count,
        0
      );

      return {
        ...orderData,
        ingredientsInfo,
        date,
        total
      };
    }, [orderData, ingredients]);

    if (!orderInfo) {
      return <div>Загрузка информации о заказе...</div>;
    }

    return (
      <div className={styles.wrap}>
        <h3
          className={`text text_type_main-medium  pb-3 pt-10 ${styles.header}`}
        >
          {orderInfo.name}
        </h3>
        <OrderStatus status={orderInfo.status} />
        <p className={`text text_type_main-medium pt-15 pb-6`}>Состав:</p>
        <ul className={`${styles.list} mb-8`}>
          {Object.values(orderInfo.ingredientsInfo).map(
            (item: TIngredient & { count: number }, index: number) => (
              <li className={`pb-4 pr-6 ${styles.item}`} key={index}>
                <div className={styles.img_wrap}>
                  <div className={styles.border}>
                    <img
                      className={styles.img}
                      src={item.image_mobile}
                      alt={item.name}
                    />
                  </div>
                </div>
                <span className='text text_type_main-default pl-4'>
                  {item.name}
                </span>
                <span
                  className={`text text_type_digits-default pl-4 pr-4 ${styles.quantity}`}
                >
                  {item.count} x {item.price}
                </span>
                <CurrencyIcon type={'primary'} />
              </li>
            )
          )}
        </ul>
        <div className={styles.bottom}>
          <p className='text text_type_main-default text_color_inactive'>
            <FormattedDate date={orderInfo.date} />
          </p>
          <span
            className={`text text_type_digits-default pr-4 ${styles.total}`}
          >
            {orderInfo.total}
          </span>
          <CurrencyIcon type={'primary'} />
        </div>
      </div>
    );
  }
);
