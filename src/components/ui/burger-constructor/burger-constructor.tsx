// src/components/ui/burger-constructor/burger-constructor.tsx
import React, { FC } from 'react';
import {
  Button,
  ConstructorElement,
  CurrencyIcon
} from '@zlden/react-developer-burger-ui-components';
import styles from './burger-constructor.module.css';
import { BurgerConstructorUIProps } from './type';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorElement, Modal } from '@components';
import { Preloader, OrderDetailsUI } from '@ui';

export const BurgerConstructorUI: FC<BurgerConstructorUIProps> = ({
  constructorItems,
  orderRequest,
  price,
  orderModalData,
  onOrderClick,
  closeOrderModal,
  orderError
}) => (
  <section className={styles.burger_constructor} data-testid='constructor'>
    {/* Верхняя булка */}
    {constructorItems.bun ? (
      <div
        className={`${styles.element} mb-4 mr-4`}
        data-testid='constructor-bun-top'
      >
        <ConstructorElement
          type='top'
          isLocked
          text={`${constructorItems.bun.name} (верх)`}
          price={constructorItems.bun.price}
          thumbnail={constructorItems.bun.image}
        />
      </div>
    ) : (
      <div
        className={`${styles.noBuns} ${styles.noBunsTop} ml-8 mb-4 mr-5 text text_type_main-default`}
        data-testid='no-bun-placeholder'
      >
        Выберите булки
      </div>
    )}

    {/* Начинка */}
    <ul className={styles.elements} data-testid='constructor-ingredients'>
      {constructorItems.ingredients.length > 0 ? (
        constructorItems.ingredients.map(
          (item: TConstructorIngredient, index: number) => (
            <BurgerConstructorElement
              ingredient={item}
              index={index}
              totalItems={constructorItems.ingredients.length}
              key={item.id}
            />
          )
        )
      ) : (
        <div
          className={`${styles.noBuns} ml-8 mb-4 mr-5 text text_type_main-default`}
          data-testid='no-ingredients-placeholder'
        >
          Выберите начинку
        </div>
      )}
    </ul>

    {/* Нижняя булка */}
    {constructorItems.bun ? (
      <div
        className={`${styles.element} mt-4 mr-4`}
        data-testid='constructor-bun-bottom'
      >
        <ConstructorElement
          type='bottom'
          isLocked
          text={`${constructorItems.bun.name} (низ)`}
          price={constructorItems.bun.price}
          thumbnail={constructorItems.bun.image}
        />
      </div>
    ) : (
      <div
        className={`${styles.noBuns} ${styles.noBunsBottom} ml-8 mb-4 mr-5 text text_type_main-default`}
        data-testid='no-bun-placeholder-bottom'
      >
        Выберите булки
      </div>
    )}

    {/* Итоговая цена и кнопка */}
    <div className={`${styles.total} mt-10 mr-4`}>
      <div className={`${styles.cost} mr-10`}>
        <p className={`text ${styles.text} mr-2`} data-testid='total-price'>
          {price}
        </p>
        <CurrencyIcon type='primary' />
      </div>
      <Button
        data-testid='order-button'
        htmlType='button'
        type='primary'
        size='large'
        children='Оформить заказ'
        onClick={onOrderClick}
        disabled={!constructorItems.bun}
      />
    </div>

    {/* Модалка с прелоадером */}
    {orderRequest && (
      <Modal onClose={closeOrderModal} title='Оформляем заказ...'>
        <Preloader data-testid='preloader' />
      </Modal>
    )}

    {/* Модалка с номером заказа */}
    {orderModalData && (
      <Modal
        onClose={closeOrderModal}
        title={orderRequest ? 'Оформляем заказ...' : ''}
        data-testid='order-modal'
      >
        <OrderDetailsUI orderNumber={orderModalData.number} />
      </Modal>
    )}

    {/* Ошибка заказа */}
    {orderError && (
      <div
        className='text text_type_main-medium text_color_error mt-10 ml-8'
        data-testid='order-error'
      >
        Произошла ошибка при создании заказа
      </div>
    )}
  </section>
);
