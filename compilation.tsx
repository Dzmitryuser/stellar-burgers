//stellar-burgers\cypress\e2e\constructor.cy.ts
describe('Burger Constructor', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/api/ingredients', {
        fixture: 'ingredients.json'
      }).as('getIngredients');
  
      cy.visit('/');
      cy.wait('@getIngredients');
    });
  
    it('should display ingredients list', () => {
      cy.get('[data-testid=ingredient-item]').should('have.length.at.least', 2);
      cy.contains('Краторная булка N-200i').should('be.visible');
      cy.contains('Говяжий метеорит (отбивная)').should('be.visible');
    });
  
    it('should open and close ingredient modal', () => {
      cy.get('[data-testid=ingredient-item]').first().click();
  
      cy.get('[data-testid=modal]').should('be.visible');
      cy.contains('Детали ингредиента').should('be.visible');
      cy.contains('Краторная булка N-200i').should('be.visible');
  
      // Закрытие по крестику
      cy.get('[data-testid=modal-close]').click();
      cy.get('[data-testid=modal]').should('not.exist');
  
      // Закрытие по оверлею
      cy.get('[data-testid=ingredient-item]').first().click();
      cy.get('[data-testid=modal]').should('be.visible');
      cy.get('[data-testid=modal-overlay]').click({ force: true });
      cy.get('[data-testid=modal]').should('not.exist');
    });
  
    it('should add bun to constructor', () => {
      cy.get('[data-testid=ingredient-item]').first().as('bun');
      cy.get('[data-testid=constructor-bun-top]').as('bunTop');
      cy.get('[data-testid=constructor-bun-bottom]').as('bunBottom');
  
      // Перетаскивание булки
      cy.get('@bun').trigger('dragstart');
      cy.get('@bunTop').trigger('drop');
  
      cy.get('@bunTop').should('contain', 'Краторная булка N-200i');
      cy.get('@bunBottom').should('contain', 'Краторная булка N-200i');
    });
  
    it('should add ingredient to constructor', () => {
      cy.get('[data-testid=ingredient-item]').eq(1).as('ingredient');
      cy.get('[data-testid=constructor-ingredients]').as('constructor');
  
      // Перетаскивание начинки
      cy.get('@ingredient').trigger('dragstart');
      cy.get('@constructor').trigger('drop');
  
      cy.get('@constructor').should('contain', 'Говяжий метеорит (отбивная)');
    });
  
    it('should enable order button when bun is added', () => {
      cy.get('[data-testid=order-button]').should('be.disabled');
  
      // Добавляем булку
      cy.get('[data-testid=ingredient-item]').first().trigger('dragstart');
      cy.get('[data-testid=constructor-bun-top]').trigger('drop');
  
      cy.get('[data-testid=order-button]').should('not.be.disabled');
    });
  });
  


  //stellar-burgers\cypress\e2e\order.cy.ts
describe('Order Creation', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/api/ingredients', {
        fixture: 'ingredients.json'
      }).as('getIngredients');
  
      cy.intercept('POST', '**/api/orders', {
        fixture: 'order.json'
      }).as('createOrder');
  
      cy.intercept('GET', '**/api/auth/user', {
        fixture: 'user.json'
      }).as('getUser');
  
      cy.setCookie('accessToken', 'test-access-token');
      localStorage.setItem('refreshToken', 'test-refresh-token');
  
      cy.visit('/');
      cy.wait('@getIngredients');
    });
  
    afterEach(() => {
      cy.clearCookies();
      cy.clearLocalStorage();
    });
  
    it('should create order when user is authenticated', () => {
      cy.wait('@getUser');
  
      // Добавляем булку
      cy.get('[data-testid=ingredient-item]').first().trigger('dragstart');
      cy.get('[data-testid=constructor-bun-top]').trigger('drop');
  
      // Добавляем начинку
      cy.get('[data-testid=ingredient-item]').eq(1).trigger('dragstart');
      cy.get('[data-testid=constructor-ingredients]').trigger('drop');
  
      // Нажимаем кнопку заказа
      cy.get('[data-testid=order-button]').click();
  
      // Проверяем создание заказа
      cy.wait('@createOrder')
        .its('request.body')
        .should('have.property', 'ingredients');
  
      // Проверяем модальное окно
      cy.get('[data-testid=modal]').should('be.visible');
      cy.contains('идентификатор заказа').should('be.visible');
      cy.contains('12345').should('be.visible');
  
      // Закрываем модальное окно
      cy.get('[data-testid=modal-close]').click();
      cy.get('[data-testid=modal]').should('not.exist');
  
      // Проверяем очистку конструктора
      cy.get('[data-testid=constructor-bun-top]').should(
        'not.contain',
        'Краторная булка N-200i'
      );
      cy.get('[data-testid=constructor-ingredients]').should('be.empty');
    });
  });
  


  //stellar-burgers\cypress\fixtures\ingredients.json
  {
    "data": [
      {
        "_id": "60666c42cc7b410027a1a9b1",
        "name": "Краторная булка N-200i",
        "type": "bun",
        "proteins": 80,
        "fat": 24,
        "carbohydrates": 53,
        "calories": 420,
        "price": 1255,
        "image": "https://code.s3.yandex.net/react/code/bun-02.png",
        "image_mobile": "https://code.s3.yandex.net/react/code/bun-02-mobile.png",
        "image_large": "https://code.s3.yandex.net/react/code/bun-02-large.png",
        "__v": 0
      },
      {
        "_id": "60666c42cc7b410027a1a9b5",
        "name": "Говяжий метеорит (отбивная)",
        "type": "main",
        "proteins": 800,
        "fat": 800,
        "carbohydrates": 300,
        "calories": 2674,
        "price": 3000,
        "image": "https://code.s3.yandex.net/react/code/meat-04.png",
        "image_mobile": "https://code.s3.yandex.net/react/code/meat-04-mobile.png",
        "image_large": "https://code.s3.yandex.net/react/code/meat-04-large.png",
        "__v": 0
      }
    ]
  }



  //stellar-burgers\cypress\support\e2e.ts
  //empty file

//stellar-burgers\cypress\fixtures\order.json
  {
    "order": {
      "number": 12345
    }
  }


//stellar-burgers\cypress\fixtures\user.json
  {
    "user": {
      "email": "test@example.com",
      "name": "Test User"
    }
  }
  

  //stellar-burgers\cypress\support\commands.ts
/// <reference types="cypress" />

export {};


//stellar-burgers\src\components\app\app.tsx
import { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../services/hooks';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { AppHeader } from '@components';
import {
  ConstructorPage,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  Feed,
  NotFound404
} from '@pages';
import { ProtectedRoute } from '../protected-route/protected-route';
import { IngredientDetails } from '../ingredient-details/ingredient-details';
import { Modal } from '../modal/modal';
import { OrderInfo } from '../order-info/order-info';
import '../../index.css';
import styles from './app.module.css';

const App = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state?.background;

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  const handleModalClose = () => {
    navigate(-1);
  };

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={background || location}>
        {/* Основные маршруты */}
        <Route path='/' element={<ConstructorPage />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route path='/feed' element={<Feed />} />

        {/* Маршруты для отдельных страниц (без модалок) */}
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />

        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {/* Модальные окна поверх основного контента */}
      {background && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={handleModalClose}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal title='' onClose={handleModalClose}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal title='' onClose={handleModalClose}>
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;


//src/components/app-header/app-header.tsx
import { FC } from 'react';
import { useAppSelector } from '../../services/hooks';
import { authUserSelector } from '../../services/selectors';
import { AppHeaderUI } from '@ui';

export const AppHeader: FC = () => {
  const user = useAppSelector(authUserSelector);

  return <AppHeaderUI userName={user?.name || ''} />;
};




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



//stellar-burgers\src\components\burger-constructor-element\burger-constructor-element.tsx
import { FC, memo } from 'react';
import { useAppDispatch } from '../../services/hooks';
import {
  removeIngredient,
  moveIngredient
} from '../../services/slices/constructorSlice';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useAppDispatch();

    const handleMoveDown = () => {
      if (index < totalItems - 1) {
        dispatch(moveIngredient({ fromIndex: index, toIndex: index + 1 }));
      }
    };

    const handleMoveUp = () => {
      if (index > 0) {
        dispatch(moveIngredient({ fromIndex: index, toIndex: index - 1 }));
      }
    };

    const handleClose = () => {
      dispatch(removeIngredient(ingredient.id));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);



//stellar-burgers\src\components\burger-ingredient\burger-ingredient.tsx
import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppDispatch } from '../../services/hooks';
import { addBun, addIngredient } from '../../services/slices/constructorSlice';
import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const dispatch = useAppDispatch();
    const location = useLocation();

    const handleAdd = () => {
      if (ingredient.type === 'bun') {
        dispatch(addBun(ingredient));
      } else {
        dispatch(addIngredient(ingredient));
      }
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);



//stellar-burgers\src\components\burger-ingredients\burger-ingredients.tsx
import { useState, useRef, useEffect, FC } from 'react';
import { useInView } from 'react-intersection-observer';
import { useAppSelector } from '../../services/hooks';
import {
  ingredientsSelector,
  ingredientsLoadingSelector
} from '../../services/selectors';
import { TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';

export const BurgerIngredients: FC = () => {
  const ingredients = useAppSelector(ingredientsSelector);
  const isLoading = useAppSelector(ingredientsLoadingSelector);

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  const [bunsRef, inViewBuns] = useInView({ threshold: 0 });
  const [mainsRef, inViewFilling] = useInView({ threshold: 0 });
  const [saucesRef, inViewSauces] = useInView({ threshold: 0 });

  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab('bun');
    } else if (inViewSauces) {
      setCurrentTab('sauce');
    } else if (inViewFilling) {
      setCurrentTab('main');
    }
  }, [inViewBuns, inViewFilling, inViewSauces]);

  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);
    if (tab === 'bun')
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'main')
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'sauce')
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const buns = ingredients.filter((item) => item.type === 'bun');
  const mains = ingredients.filter((item) => item.type === 'main');
  const sauces = ingredients.filter((item) => item.type === 'sauce');

  if (isLoading) {
    return <div>Загрузка ингредиентов...</div>;
  }

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
    />
  );
};



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

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={{ total, totalToday }}
    />
  );
};



//stellar-burgers\src\components\ingredient-details\ingredient-details.tsx
import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../services/hooks';
import { ingredientsSelector } from '../../services/selectors';
import { TIngredient } from '@utils-types';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';

export const IngredientDetails: FC = () => {
  const { id } = useParams();
  const ingredients = useAppSelector(ingredientsSelector);
  const ingredientData = ingredients.find(
    (item: TIngredient) => item._id === id
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};



//src/components/ingredients-category/ingredients-category.tsx
import { forwardRef, useMemo } from 'react';
import { useAppSelector } from '../../services/hooks';
import {
  constructorBunSelector,
  constructorIngredientsSelector
} from '../../services/selectors';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  const bun = useAppSelector(constructorBunSelector);
  const constructorIngredients = useAppSelector(constructorIngredientsSelector);

  const ingredientsCounters = useMemo(() => {
    const counters: { [key: string]: number } = {};

    constructorIngredients.forEach((ingredient: TIngredient) => {
      if (!counters[ingredient._id]) counters[ingredient._id] = 0;
      counters[ingredient._id]++;
    });

    if (bun) counters[bun._id] = 2;

    return counters;
  }, [bun, constructorIngredients]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});



//src/components/modal/modal.tsx
import { FC, memo, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { TModalProps } from './type';
import { ModalUI } from '@ui';

const modalRoot = document.getElementById('modals');

export const Modal: FC<TModalProps> = memo(({ title, onClose, children }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      e.key === 'Escape' && onClose();
    };

    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return ReactDOM.createPortal(
    <ModalUI title={title} onClose={onClose}>
      {children}
    </ModalUI>,
    modalRoot as HTMLDivElement
  );
});



//src/components/order-card/order-card.tsx
import { FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppSelector } from '../../services/hooks';
import { ingredientsSelector } from '../../services/selectors';
import { OrderCardProps } from './type';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '../ui/order-card';

const maxIngredients = 6;

export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const location = useLocation();
  const ingredients: TIngredient[] = useAppSelector(ingredientsSelector);

  const orderInfo = useMemo(() => {
    if (!ingredients.length) return null;

    const ingredientsInfo = order.ingredients.reduce(
      (acc: TIngredient[], item: string) => {
        const ingredient = ingredients.find((ing) => ing._id === item);
        if (ingredient) return [...acc, ingredient];
        return acc;
      },
      []
    );

    const total = ingredientsInfo.reduce((acc, item) => acc + item.price, 0);

    const ingredientsToShow = ingredientsInfo.slice(0, maxIngredients);

    const remains =
      ingredientsInfo.length > maxIngredients
        ? ingredientsInfo.length - maxIngredients
        : 0;

    const date = new Date(order.createdAt);

    return {
      ...order,
      ingredientsInfo,
      ingredientsToShow,
      remains,
      total,
      date
    };
  }, [order, ingredients]);

  if (!orderInfo) {
    return null;
  }

  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={maxIngredients}
      locationState={{ background: location }}
    />
  );
});



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



//src/components/order-status/order-status.tsx
import React, { FC } from 'react';
import { OrderStatusProps } from './type';
import { OrderStatusUI } from '@ui';

const statusText: { [key: string]: string } = {
  pending: 'Готовится',
  done: 'Выполнен',
  created: 'Создан'
};

export const OrderStatus: FC<OrderStatusProps> = ({ status }) => {
  let textStyle = '';
  switch (status) {
    case 'pending':
      textStyle = '#E52B1A';
      break;
    case 'done':
      textStyle = '#00CCCC';
      break;
    default:
      textStyle = '#F2F2F3';
  }

  return <OrderStatusUI textStyle={textStyle} text={statusText[textStyle]} />;
};




//src/components/orders-list/orders-list.tsx
import { FC, memo } from 'react';
import { OrdersListProps } from './type';
import { OrdersListUI } from '@ui';

export const OrdersList: FC<OrdersListProps> = memo(({ orders }) => {
  const orderByDate = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return <OrdersListUI orderByDate={orderByDate} />;
});



//src/components/profile-menu/profile-menu.tsx
import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppDispatch } from '../../services/hooks';
import { logoutUser } from '../../services/slices/authSlice';
import { ProfileMenuUI } from '@ui';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};



//stellar-burgers\src\components\protected-route\protected-route.tsx
import { FC, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../services/hooks';
import { getUser } from '../../services/slices/authSlice';
import {
  authUserSelector,
  isAuthCheckedSelector
} from '../../services/selectors';
import { Preloader } from '@ui';

type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute: FC<TProtectedRouteProps> = ({
  onlyUnAuth = false,
  children
}) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const user = useAppSelector(authUserSelector);
  const isAuthChecked = useAppSelector(isAuthCheckedSelector);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && user) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate to={from} />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  return children;
};



//stellar-burgers\src\pages\constructor-page\constructor-page.tsx
import { FC } from 'react';
import { useAppSelector } from '../../services/hooks';
import { ingredientsLoadingSelector } from '../../services/selectors';
import { BurgerIngredients, BurgerConstructor } from '@components';
import { Preloader } from '@ui';
import styles from './constructor-page.module.css';

export const ConstructorPage: FC = () => {
  const isIngredientsLoading = useAppSelector(ingredientsLoadingSelector);

  return (
    <>
      {isIngredientsLoading ? (
        <Preloader />
      ) : (
        <main className={styles.containerMain}>
          <h1
            className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
          >
            Соберите бургер
          </h1>
          <div className={styles.main}>
            <BurgerIngredients />
            <BurgerConstructor />
          </div>
        </main>
      )}
    </>
  );
};



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



//src/pages/forgot-password/forgot-password.tsx
import { FC, useState, SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { forgotPasswordApi } from '@api';
import { ForgotPasswordUI } from '@ui-pages';

export const ForgotPassword: FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<Error | null>(null);

  const navigate = useNavigate();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    setError(null);
    forgotPasswordApi({ email })
      .then(() => {
        localStorage.setItem('resetPassword', 'true');
        navigate('/reset-password', { replace: true });
      })
      .catch((err) => setError(err));
  };

  return (
    <ForgotPasswordUI
      errorText={error?.message}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};


//src/pages/login/login.tsx
import { FC, SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { loginUser } from '../../services/slices/authSlice';
import {
  authErrorSelector,
  authLoadingSelector
} from '../../services/selectors';
import { LoginUI } from '@ui-pages';

export const Login: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const errorText = useAppSelector(authErrorSelector);
  const loading = useAppSelector(authLoadingSelector);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(
      loginUser({
        email,
        password
      })
    )
      .unwrap()
      .then(() => {
        navigate('/');
      })
      .catch((err) => {
        console.error('Login failed:', err);
      });
  };

  return (
    <LoginUI
      errorText={errorText || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
      loading={loading}
    />
  );
};


//stellar-burgers\src\pages\not-fount-404\not-fount-404.tsx
export { NotFound404 } from './not-fount-404';



//src/pages/profile/profile.tsx
import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../services/hooks';
import { updateUser } from '../../services/slices/authSlice';
import { authUserSelector } from '../../services/selectors';

export const Profile: FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(authUserSelector);

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  useEffect(() => {
    if (user) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: ''
      });
    }
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(updateUser(formValue));
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};



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



//src/pages/register/register.tsx
import { FC, SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../services/hooks';
import { registerUser } from '../../services/slices/authSlice';
import {
  authErrorSelector,
  authLoadingSelector
} from '../../services/selectors';
import { RegisterUI } from '@ui-pages';

export const Register: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const errorText = useAppSelector(authErrorSelector);
  const loading = useAppSelector(authLoadingSelector);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(
      registerUser({
        name: userName,
        email,
        password
      })
    )
      .unwrap()
      .then(() => {
        navigate('/');
      })
      .catch((err) => {
        console.error('Registration failed:', err);
      });
  };

  return (
    <RegisterUI
      errorText={errorText || ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
      loading={loading} // Передаем loading
    />
  );
};



//src/pages/reset-password/reset-password.tsx
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { resetPasswordApi } from '@api';
import { ResetPasswordUI } from '@ui-pages';

export const ResetPassword: FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState<Error | null>(null);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setError(null);
    resetPasswordApi({ password, token })
      .then(() => {
        localStorage.removeItem('resetPassword');
        navigate('/login');
      })
      .catch((err) => setError(err));
  };

  useEffect(() => {
    if (!localStorage.getItem('resetPassword')) {
      navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  return (
    <ResetPasswordUI
      errorText={error?.message}
      password={password}
      token={token}
      setPassword={setPassword}
      setToken={setToken}
      handleSubmit={handleSubmit}
    />
  );
};



//stellar-burgers\src\services\hooks.ts
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { AppDispatch } from './store';
import type { RootState } from './reducers'; // Импорт из reducers

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


//stellar-burgers\src\services\reducers.ts
import { combineReducers } from 'redux';
import { ingredientsReducer } from './slices/ingredientsSlice';
import { constructorReducer } from './slices/constructorSlice';
import { orderReducer } from './slices/orderSlice';
import { authReducer } from './slices/authSlice';
import { feedReducer } from './slices/feedSlice';
import { userOrdersReducer } from './slices/userOrdersSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  order: orderReducer,
  auth: authReducer,
  feed: feedReducer,
  userOrders: userOrdersReducer
});

export type RootState = ReturnType<typeof rootReducer>;



//stellar-burgers\src\services\selectors.ts
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



//stellar-burgers\src\services\store.ts
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer, RootState } from './reducers';

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type AppDispatch = typeof store.dispatch;

export default store;



//stellar-burgers\src\services\slices\authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  registerUserApi,
  loginUserApi,
  logoutApi,
  getUserApi,
  updateUserApi,
  TRegisterData,
  TLoginData
} from '../../utils/burger-api';
import { setCookie, deleteCookie, getCookie } from '../../utils/cookie';
import { TUser } from '../../utils/types';

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: TRegisterData) => {
    const response = await registerUserApi(userData);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (userData: TLoginData) => {
    const response = await loginUserApi(userData);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

export const getUser = createAsyncThunk('auth/getUser', async () => {
  const response = await getUserApi();
  return response.user;
});

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (userData: Partial<TRegisterData>) => {
    const response = await updateUserApi(userData);
    return response.user;
  }
);

type TAuthState = {
  user: TUser | null;
  isAuthChecked: boolean;
  loading: boolean;
  error: string | null;
};

const initialState: TAuthState = {
  user: null,
  isAuthChecked: false,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authCheck: (state) => {
      state.isAuthChecked = true;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthChecked = true; // ДОБАВЛЕНО
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Registration failed';
        state.isAuthChecked = true; // ДОБАВЛЕНО
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthChecked = true; // ДОБАВЛЕНО
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
        state.isAuthChecked = true; // ДОБАВЛЕНО
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthChecked = true; // ДОБАВЛЕНО
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(getUser.rejected, (state) => {
        state.isAuthChecked = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.error.message || 'Update failed';
      });
  }
});

export const { authCheck, clearError } = authSlice.actions;
export const authReducer = authSlice.reducer;



//stellar-burgers\src\services\slices\constructorSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

type TConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addBun: (state, action: PayloadAction<TIngredient>) => {
      state.bun = action.payload;
    },
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        state.ingredients.push(action.payload);
      },
      prepare: (ingredient: TIngredient) => {
        const id = uuidv4();
        return { payload: { ...ingredient, id } };
      }
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      const item = state.ingredients[fromIndex];
      state.ingredients.splice(fromIndex, 1);
      state.ingredients.splice(toIndex, 0, item);
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = constructorSlice.actions;
export const constructorReducer = constructorSlice.reducer;




//stellar-burgers\src\services\slices\feedSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi } from '../../utils/burger-api';
import { TOrder, TOrdersData } from '@utils-types';

export const fetchFeeds = createAsyncThunk('feed/fetchAll', async () => {
  const response = await getFeedsApi();
  return response;
});

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;
  error: string | null;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch feeds';
      });
  }
});

export const feedReducer = feedSlice.reducer;



//stellar-burgers\src\services\slices\ingredientsSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';
import { TIngredient } from '@utils-types';

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchAll',
  async () => {
    const response = await getIngredientsApi();
    return response;
  }
);

type TIngredientsState = {
  ingredients: TIngredient[];
  loading: boolean;
  error: string | null;
};

const initialState: TIngredientsState = {
  ingredients: [],
  loading: false,
  error: null
};

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch ingredients';
      });
  }
});

export const ingredientsReducer = ingredientsSlice.reducer;




//stellar-burgers\src\services\slices\orderSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { orderBurgerApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';

export const createOrder = createAsyncThunk(
  'order/create',
  async (ingredients: string[]) => {
    const response = await orderBurgerApi(ingredients);
    return response.order;
  }
);

type TOrderState = {
  order: TOrder | null;
  loading: boolean;
  error: string | null;
};

const initialState: TOrderState = {
  order: null,
  loading: false,
  error: null
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create order';
      });
  }
});

export const { clearOrder } = orderSlice.actions;
export const orderReducer = orderSlice.reducer;




//stellar-burgers\src\services\slices\userOrdersSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrdersApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';

export const fetchUserOrders = createAsyncThunk(
  'userOrders/fetchAll',
  async () => {
    try {
      const response = await getOrdersApi();
      return response;
    } catch (error) {
      throw error;
    }
  }
);

type TUserOrdersState = {
  orders: TOrder[];
  loading: boolean;
  error: string | null;
};

const initialState: TUserOrdersState = {
  orders: [],
  loading: false,
  error: null
};

const userOrdersSlice = createSlice({
  name: 'userOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user orders';
      });
  }
});

export const userOrdersReducer = userOrdersSlice.reducer;


{
    "name": "react-canonical",
    "version": "0.1.0",
    "private": true,
    "dependencies": {
      "@reduxjs/toolkit": "^2.9.0",
      "@types/node": "^16.18.23",
      "@types/react": "^18.0.31",
      "@types/react-dom": "^18.0.11",
      "@types/uuid": "^9.0.8",
      "@zlden/react-developer-burger-ui-components": "^1.15.0",
      "clsx": "^2.0.0",
      "react": "^18.2.0",
      "react-dom": "^18.2.0",
      "react-intersection-observer": "^9.4.3",
      "react-redux": "^9.2.0",
      "react-router-dom": "^6.30.1",
      "redux-thunk": "^3.1.0",
      "typescript": "^5.3.3",
      "uuid": "^9.0.1",
      "web-vitals": "^2.1.4",
      "webpack": "^5.89.0",
      "webpack-cli": "^5.1.4",
      "webpack-dev-server": "^4.15.1"
    },
    "devDependencies": {
      "@babel/core": "^7.23.6",
      "@babel/eslint-parser": "^7.23.3",
      "@babel/preset-env": "^7.23.6",
      "@babel/preset-react": "^7.23.3",
      "@babel/preset-typescript": "^7.23.3",
      "@cypress/webpack-dev-server": "^5.1.2",
      "@storybook/addon-essentials": "^7.6.10",
      "@storybook/addon-interactions": "^7.6.10",
      "@storybook/addon-links": "^7.6.10",
      "@storybook/addon-onboarding": "^1.0.11",
      "@storybook/blocks": "^7.6.10",
      "@storybook/react": "^7.6.10",
      "@storybook/react-webpack5": "^7.6.10",
      "@storybook/test": "^7.6.10",
      "@testing-library/jest-dom": "^6.8.0",
      "@testing-library/react": "^14.3.1",
      "@testing-library/user-event": "^14.6.1",
      "@types/cypress": "^0.1.6",
      "@types/jest": "^29.5.14",
      "@types/node": "^20.10.5",
      "@types/react": "^18.2.45",
      "@types/react-dom": "^18.2.18",
      "@types/react-test-renderer": "^18.0.7",
      "@types/webpack-env": "^1.18.4",
      "@typescript-eslint/eslint-plugin": "^6.15.0",
      "@typescript-eslint/parser": "^6.15.0",
      "babel-jest": "^29.7.0",
      "babel-loader": "^9.1.3",
      "css-loader": "^6.8.1",
      "cypress": "^15.2.0",
      "dotenv-webpack": "^8.0.1",
      "eslint": "^8.56.0",
      "eslint-config-airbnb": "^19.0.4",
      "eslint-config-prettier": "^9.1.0",
      "eslint-plugin-cypress": "^2.15.1",
      "eslint-plugin-import": "^2.29.1",
      "eslint-plugin-jsx-a11y": "^6.8.0",
      "eslint-plugin-prettier": "^5.1.2",
      "eslint-plugin-react": "^7.33.2",
      "eslint-plugin-react-hooks": "^4.6.0",
      "eslint-plugin-storybook": "^0.6.15",
      "eslint-webpack-plugin": "^4.0.1",
      "fetch-mock": "^9.11.0",
      "html-webpack-plugin": "^5.6.0",
      "jest": "^29.7.0",
      "jest-css-modules-transform": "^4.4.2",
      "jest-environment-jsdom": "^29.7.0",
      "jsdom": "^23.0.1",
      "prettier": "^3.1.1",
      "prettier-eslint": "^16.2.0",
      "prettier-eslint-cli": "^8.0.1",
      "react-test-renderer": "^18.2.0",
      "storybook": "^7.6.10",
      "storybook-addon-react-router-v6": "^2.0.10",
      "style-loader": "^3.3.3",
      "ts-jest": "^29.4.4",
      "ts-loader": "^9.5.1",
      "ts-node": "^10.9.2",
      "url-loader": "^4.1.1"
    },
    "scripts": {
      "start": "webpack serve --mode=development --port 4000",
      "storybook": "storybook dev -p 6006",
      "build-storybook": "storybook build",
      "lint": "eslint --ext .js,.jsx,.ts,.tsx ./src",
      "lint:fix": "npm run lint -- --fix",
      "format": "prettier ./src --write",
      "test": "jest",
      "test:watch": "jest --watch",
      "test:coverage": "jest --coverage",
      "cypress:open": "cypress open",
      "cypress:run": "cypress run"
    },
    "eslintConfig": {
      "extends": [
        "plugin:storybook/recommended"
      ]
    }
  
  }

  


  {
    "compilerOptions": {
      "target": "es5",
      "lib": ["dom", "dom.iterable", "esnext"],
      "allowJs": true,
      "skipLibCheck": true,
      "esModuleInterop": true,
      "allowSyntheticDefaultImports": true,
      "strict": true,
      "forceConsistentCasingInFileNames": true,
      "noFallthroughCasesInSwitch": true,
      "module": "esnext",
      "moduleResolution": "node",
      "resolveJsonModule": true,
      "isolatedModules": true,
      "noEmit": false,
      "jsx": "react-jsx",
      "types": ["node", "jest"],
      "baseUrl": ".",
      "paths": {
        "@pages": ["src/pages"],
        "@components": ["src/components"],
        "@ui": ["src/components/ui"],
        "@ui-pages": ["src/components/ui/pages"],
        "@utils-types": ["src/utils/types"],
        "@api": ["src/utils/burger-api.ts"],
        "@slices": ["src/services/slices"],
        "@selectors": ["src/services/selectors"]
      }
    },
    "include": ["src", "src/cypress.d.ts", "cypress/**/*.ts"]
  }
  