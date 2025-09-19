//src/components/burger-constructor/burger-constructor.tsx
import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../services/hooks';
import {
  constructorBunSelector,
  constructorIngredientsSelector,
  orderSelector,
  orderLoadingSelector,
  authUserSelector
} from '../../services/selectors';
import { createOrder, clearOrder } from '../../services/slices/orderSlice';
import { clearConstructor } from '../../services/slices/constructorSlice';
import { fetchUserOrders } from '../../services/slices/userOrdersSlice';
import { fetchFeeds } from '../../services/slices/feedSlice';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

export const BurgerConstructor: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const constructorItems = {
    bun: useAppSelector(constructorBunSelector),
    ingredients: useAppSelector(constructorIngredientsSelector)
  };

  const orderRequest = useAppSelector(orderLoadingSelector);
  const orderModalData = useAppSelector(orderSelector);
  const user = useAppSelector(authUserSelector);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    if (!user) {
      navigate('/login');
      return;
    }

    const ingredients = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];

    dispatch(createOrder(ingredients))
      .unwrap()
      .then(() => {
        dispatch(clearConstructor());
        // Обновляем ленту заказов и историю заказов
        dispatch(fetchFeeds());
        dispatch(fetchUserOrders());
      })
      .catch((err) => {
        console.error('Order creation failed:', err);
      });
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
