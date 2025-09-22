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


//stellar-burgers\src\services\__tests__\rootReducer.test.ts
import { rootReducer } from '../reducers';

describe('rootReducer', () => {
  it('should return initial state for unknown action', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toEqual({
      ingredients: {
        ingredients: [],
        loading: false,
        error: null
      },
      burgerConstructor: {
        bun: null,
        ingredients: []
      },
      order: {
        order: null,
        loading: false,
        error: null
      },
      auth: {
        user: null,
        isAuthChecked: false,
        loading: false,
        error: null
      },
      feed: {
        orders: [],
        total: 0,
        totalToday: 0,
        loading: false,
        error: null
      },
      userOrders: {
        orders: [],
        loading: false,
        error: null
      }
    });
  });
});


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
} from '@api';
import { setCookie, deleteCookie, getCookie } from '../../utils/cookie';
import { TUser } from '@utils-types';

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
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Registration failed';
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
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
import { getFeedsApi } from '@api';
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
import { getIngredientsApi } from '@api';
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
import { orderBurgerApi } from '@api';
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
import { getOrdersApi } from '@api';
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




//stellar-burgers\src\services\slices\__tests__\authSlice.test.ts
import { authReducer, loginUser } from '../authSlice';
import { TUser } from '@utils-types';

describe('auth reducer', () => {
  const mockUser: TUser = {
    email: 'test@example.com',
    name: 'Test User'
  };

  it('should handle loginUser.pending', () => {
    const state = authReducer(
      undefined,
      loginUser.pending('requestId', {
        email: 'test@example.com',
        password: 'password'
      })
    );
    expect(state).toEqual({
      user: null,
      isAuthChecked: false,
      loading: true,
      error: null
    });
  });

  it('should handle loginUser.fulfilled', () => {
    const state = authReducer(
      undefined,
      loginUser.fulfilled(mockUser, 'requestId', {
        email: 'test@example.com',
        password: 'password'
      })
    );
    expect(state).toEqual({
      user: mockUser,
      isAuthChecked: true,
      loading: false,
      error: null
    });
  });

  it('should handle loginUser.rejected', () => {
    const error = new Error('Login failed');
    const state = authReducer(
      undefined,
      loginUser.rejected(error, 'requestId', {
        email: 'test@example.com',
        password: 'password'
      })
    );
    expect(state).toEqual({
      user: null,
      isAuthChecked: true,
      loading: false,
      error: error.message
    });
  });
});




//stellar-burgers\src\services\slices\__tests__\constructorSlice.test.ts
import { constructorReducer } from '../constructorSlice';
import {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from '../constructorSlice';
import { TIngredient } from '@utils-types';

describe('constructor reducer', () => {
  const mockBun: TIngredient = {
    _id: '1',
    name: 'Булка',
    type: 'bun',
    proteins: 10,
    fat: 5,
    carbohydrates: 15,
    calories: 100,
    price: 50,
    image: '',
    image_mobile: '',
    image_large: '',
    __v: 0
  };

  const mockIngredient: TIngredient = {
    _id: '2',
    name: 'Начинка',
    type: 'main',
    proteins: 20,
    fat: 10,
    carbohydrates: 5,
    calories: 150,
    price: 75,
    image: '',
    image_mobile: '',
    image_large: '',
    __v: 0
  };

  it('should return initial state', () => {
    expect(constructorReducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual({
      bun: null,
      ingredients: []
    });
  });

  it('should handle addBun', () => {
    const state = constructorReducer(undefined, addBun(mockBun));
    expect(state.bun).toEqual(mockBun);
  });

  it('should handle addIngredient', () => {
    const state = constructorReducer(undefined, addIngredient(mockIngredient));
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toMatchObject(mockIngredient);
    expect(state.ingredients[0]).toHaveProperty('id');
  });

  it('should handle removeIngredient', () => {
    let state = constructorReducer(undefined, addIngredient(mockIngredient));
    const ingredientId = state.ingredients[0].id;

    state = constructorReducer(state, removeIngredient(ingredientId));
    expect(state.ingredients).toHaveLength(0);
  });

  it('should handle moveIngredient', () => {
    const mockIngredient2: TIngredient = {
      ...mockIngredient,
      _id: '3'
    };

    let state = constructorReducer(undefined, addIngredient(mockIngredient));
    state = constructorReducer(state, addIngredient(mockIngredient2));

    const fromIndex = 0;
    const toIndex = 1;
    state = constructorReducer(state, moveIngredient({ fromIndex, toIndex }));

    expect(state.ingredients[0]._id).toBe('3');
    expect(state.ingredients[1]._id).toBe('2');
  });

  it('should handle clearConstructor', () => {
    let state = constructorReducer(undefined, addBun(mockBun));
    state = constructorReducer(state, addIngredient(mockIngredient));

    state = constructorReducer(state, clearConstructor());
    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(0);
  });
});




//stellar-burgers\src\services\slices\__tests__\feedSlice.test.ts
import { feedReducer, fetchFeeds } from '../feedSlice';
import { TOrder } from '@utils-types';

describe('feed reducer', () => {
  const mockOrders: TOrder[] = [
    {
      _id: '1',
      status: 'done',
      name: 'Test Order',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      number: 12345,
      ingredients: ['1', '2']
    }
  ];

  it('should handle fetchFeeds.pending', () => {
    const state = feedReducer(undefined, fetchFeeds.pending('requestId'));
    expect(state).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      loading: true,
      error: null
    });
  });

  it('should handle fetchFeeds.fulfilled', () => {
    const response = {
      success: true,
      orders: mockOrders,
      total: 100,
      totalToday: 10
    };
    const state = feedReducer(
      undefined,
      fetchFeeds.fulfilled(response, 'requestId')
    );
    expect(state).toEqual({
      orders: mockOrders,
      total: 100,
      totalToday: 10,
      loading: false,
      error: null
    });
  });

  it('should handle fetchFeeds.rejected', () => {
    const error = new Error('Failed to fetch feeds');
    const state = feedReducer(
      undefined,
      fetchFeeds.rejected(error, 'requestId')
    );
    expect(state).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      loading: false,
      error: error.message
    });
  });
});




//stellar-burgers\src\services\slices\__tests__\ingredientsSlice.test.ts
import { ingredientsReducer, fetchIngredients } from '../ingredientsSlice';
import { TIngredient } from '@utils-types';

describe('ingredients reducer', () => {
  const mockIngredients: TIngredient[] = [
    {
      _id: '1',
      name: 'Булка',
      type: 'bun',
      proteins: 10,
      fat: 5,
      carbohydrates: 15,
      calories: 100,
      price: 50,
      image: '',
      image_mobile: '',
      image_large: '',
      __v: 0
    }
  ];

  it('should handle fetchIngredients.pending', () => {
    const state = ingredientsReducer(
      undefined,
      fetchIngredients.pending('requestId')
    );
    expect(state).toEqual({
      ingredients: [],
      loading: true,
      error: null
    });
  });

  it('should handle fetchIngredients.fulfilled', () => {
    const state = ingredientsReducer(
      undefined,
      fetchIngredients.fulfilled(mockIngredients, 'requestId')
    );
    expect(state).toEqual({
      ingredients: mockIngredients,
      loading: false,
      error: null
    });
  });

  it('should handle fetchIngredients.rejected', () => {
    const error = new Error('Failed to fetch');
    const state = ingredientsReducer(
      undefined,
      fetchIngredients.rejected(error, 'requestId')
    );
    expect(state).toEqual({
      ingredients: [],
      loading: false,
      error: error.message
    });
  });
});




//stellar-burgers\src\services\slices\__tests__\orderSlice.test.ts
import { orderReducer, createOrder } from '../orderSlice';
import { TOrder } from '@utils-types';

describe('order reducer', () => {
  const mockOrder: TOrder = {
    _id: '1',
    status: 'done',
    name: 'Test Order',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    number: 12345,
    ingredients: ['1', '2']
  };

  it('should handle createOrder.pending', () => {
    const state = orderReducer(
      undefined,
      createOrder.pending('requestId', ['1', '2'])
    );
    expect(state).toEqual({
      order: null,
      loading: true,
      error: null
    });
  });

  it('should handle createOrder.fulfilled', () => {
    const state = orderReducer(
      undefined,
      createOrder.fulfilled(mockOrder, 'requestId', ['1', '2'])
    );
    expect(state).toEqual({
      order: mockOrder,
      loading: false,
      error: null
    });
  });

  it('should handle createOrder.rejected', () => {
    const error = new Error('Order failed');
    const state = orderReducer(
      undefined,
      createOrder.rejected(error, 'requestId', ['1', '2'])
    );
    expect(state).toEqual({
      order: null,
      loading: false,
      error: error.message
    });
  });
});



//jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapping: {
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@pages/(.*)$': '<rootDir>/src/pages/$1',
    '^@ui/(.*)$': '<rootDir>/src/components/ui/$1',
    '^@ui-pages/(.*)$': '<rootDir>/src/components/ui-pages/$1',
    '^@utils-types$': '<rootDir>/src/utils/types',
    '^@api$': '<rootDir>/src/utils/burger-api',
    '^@services/(.*)$': '<rootDir>/src/services/$1'
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  }
};



//stellar-burgers\cypress\e2e\constructor.cy.ts
describe('Burger Constructor', () => {
  beforeEach(() => {
    // Мокаем API ингредиентов
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

    cy.get('[data-testid=modal-close]').click();
    cy.get('[data-testid=modal]').should('not.exist');
  });

  it('should show empty constructor initially', () => {
    cy.get('[data-testid=no-bun-placeholder]').should('be.visible');
    cy.get('[data-testid=constructor-ingredients]').should('be.empty');
  });

  it('should enable order button when bun is added', () => {
    // Здесь будет тест добавления ингредиентов
    // Пока проверяем, что кнопка disabled
    cy.get('[data-testid=order-button]').should('be.disabled');
  });
});



//stellar-burgers\cypress\e2e\order.cy.ts
describe('Order Creation', () => {
  beforeEach(() => {
    // Мокаем все необходимые API
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.intercept('POST', '**/api/orders', {
      fixture: 'order.json'
    }).as('createOrder');

    cy.intercept('GET', '**/api/auth/user', {
      fixture: 'user.json'
    }).as('getUser');

    // Устанавливаем токены
    cy.setCookie('accessToken', 'test-access-token');
    localStorage.setItem('refreshToken', 'test-refresh-token');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('should create order when user is authenticated', () => {
    // Проверяем, что пользователь авторизован
    cy.wait('@getUser');

    // Добавляем ингредиенты в конструктор (симуляция)
    cy.get('[data-testid=constructor]').should('be.visible');

    // Нажимаем кнопку заказа
    cy.get('[data-testid=order-button]').click();

    // Проверяем, что запрос на создание заказа отправлен
    cy.wait('@createOrder')
      .its('request.body')
      .should('have.property', 'ingredients');

    // Проверяем модальное окно с номером заказа
    cy.get('[data-testid=modal]').should('be.visible');
    cy.contains('идентификатор заказа').should('be.visible');
    cy.contains('12345').should('be.visible'); // из order.json

    // Закрываем модальное окно
    cy.get('[data-testid=modal-close]').click();
    cy.get('[data-testid=modal]').should('not.exist');
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

//stellar-burgers\cypress\fixtures\order.json
  {
    "order": {
      "number": 12345
    }
  }


  //stellar-burgers\cypress\support\commands.ts
/// <reference types="cypress" />

export {};

//________________________________________________________________________
//________________________________________________________________________
//________________________________________________________________________


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


//stellar-burgers\src\utils\types.ts
export type TIngredient = {
  _id: string;
  name: string;
  type: string;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_mobile: string;
  image_large: string;
  __v: number;
};

export type TConstructorIngredient = TIngredient & {
  id: string;
};

export type TOrder = {
  _id: string;
  ingredients: string[];
  status: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
};

export type TUser = {
  email: string;
  name: string;
};

export type TOrdersData = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

export type TTabMode = 'bun' | 'main' | 'sauce';



//src/utils/cookie.ts
export function getCookie(name: string): string | undefined {
  const matches = document.cookie.match(
    new RegExp(
      '(?:^|; )' +
        // eslint-disable-next-line no-useless-escape
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') +
        '=([^;]*)'
    )
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

export function setCookie(
  name: string,
  value: string,
  props: { [key: string]: string | number | Date | boolean } = {}
) {
  props = {
    path: '/',
    ...props
  };

  let exp = props.expires;
  if (exp && typeof exp === 'number') {
    const d = new Date();
    d.setTime(d.getTime() + exp * 1000);
    exp = props.expires = d;
  }

  if (exp && exp instanceof Date) {
    props.expires = exp.toUTCString();
  }
  value = encodeURIComponent(value);
  let updatedCookie = name + '=' + value;
  for (const propName in props) {
    updatedCookie += '; ' + propName;
    const propValue = props[propName];
    if (propValue !== true) {
      updatedCookie += '=' + propValue;
    }
  }
  document.cookie = updatedCookie;
}

export function deleteCookie(name: string) {
  setCookie(name, '', { expires: -1 });
}


//src/utils/burger-api.ts
import { setCookie, getCookie } from './cookie';
import { TIngredient, TOrder, TOrdersData, TUser } from './types';

const URL = process.env.BURGER_API_URL;

const checkResponse = <T>(res: Response): Promise<T> =>
  res.ok ? res.json() : res.json().then((err) => Promise.reject(err));

type TServerResponse<T> = {
  success: boolean;
} & T;

type TRefreshResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
}>;

export const refreshToken = (): Promise<TRefreshResponse> =>
  fetch(`${URL}/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  })
    .then((res) => checkResponse<TRefreshResponse>(res))
    .then((refreshData) => {
      if (!refreshData.success) {
        return Promise.reject(refreshData);
      }
      localStorage.setItem('refreshToken', refreshData.refreshToken);
      setCookie('accessToken', refreshData.accessToken);
      return refreshData;
    });

export const fetchWithRefresh = async <T>(
  url: RequestInfo,
  options: RequestInit
) => {
  try {
    const res = await fetch(url, options);
    return await checkResponse<T>(res);
  } catch (err) {
    if ((err as { message: string }).message === 'jwt expired') {
      const refreshData = await refreshToken();
      if (options.headers) {
        (options.headers as { [key: string]: string }).authorization =
          refreshData.accessToken;
      }
      const res = await fetch(url, options);
      return await checkResponse<T>(res);
    } else {
      return Promise.reject(err);
    }
  }
};

type TIngredientsResponse = TServerResponse<{
  data: TIngredient[];
}>;

type TFeedsResponse = TServerResponse<{
  orders: TOrder[];
  total: number;
  totalToday: number;
}>;

type TOrdersResponse = TServerResponse<{
  data: TOrder[];
}>;

export const getIngredientsApi = () =>
  fetch(`${URL}/ingredients`)
    .then((res) => checkResponse<TIngredientsResponse>(res))
    .then((data) => {
      if (data?.success) return data.data;
      return Promise.reject(data);
    });

export const getFeedsApi = () =>
  fetch(`${URL}/orders/all`)
    .then((res) => checkResponse<TFeedsResponse>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

export const getOrdersApi = () =>
  fetchWithRefresh<TFeedsResponse>(`${URL}/orders`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken')
    } as HeadersInit
  }).then((data) => {
    if (data?.success) return data.orders;
    return Promise.reject(data);
  });

type TNewOrderResponse = TServerResponse<{
  order: TOrder;
  name: string;
}>;

export const orderBurgerApi = (data: string[]) =>
  fetchWithRefresh<TNewOrderResponse>(`${URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken')
    } as HeadersInit,
    body: JSON.stringify({
      ingredients: data
    })
  }).then((data) => {
    if (data?.success) return data;
    return Promise.reject(data);
  });

type TOrderResponse = TServerResponse<{
  orders: TOrder[];
}>;

export const getOrderByNumberApi = (number: number): Promise<TOrderResponse> =>
  fetch(`${URL}/orders/${number}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((res) => checkResponse<TOrderResponse>(res));

export type TRegisterData = {
  email: string;
  name: string;
  password: string;
};

type TAuthResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
  user: TUser;
}>;

export const registerUserApi = (data: TRegisterData) =>
  fetch(`${URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TAuthResponse>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

export type TLoginData = {
  email: string;
  password: string;
};

export const loginUserApi = (data: TLoginData) =>
  fetch(`${URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TAuthResponse>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

export const forgotPasswordApi = (data: { email: string }) =>
  fetch(`${URL}/password-reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TServerResponse<{}>>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

export const resetPasswordApi = (data: { password: string; token: string }) =>
  fetch(`${URL}/password-reset/reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TServerResponse<{}>>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

type TUserResponse = TServerResponse<{ user: TUser }>;

export const getUserApi = () =>
  fetchWithRefresh<TUserResponse>(`${URL}/auth/user`, {
    headers: {
      authorization: getCookie('accessToken')
    } as HeadersInit
  });

export const updateUserApi = (user: Partial<TRegisterData>) =>
  fetchWithRefresh<TUserResponse>(`${URL}/auth/user`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken')
    } as HeadersInit,
    body: JSON.stringify(user)
  });

export const logoutApi = () =>
  fetch(`${URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  }).then((res) => checkResponse<TServerResponse<{}>>(res));


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
    "start": "webpack serve --mode=development",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "lint": "eslint --ext .js,.jsx,.ts,.tsx ./src",
    "lint:fix": "npm run lint -- --fix",
    "format": "prettier ./src --write",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "cypress:open": "cypress open",
    "cypress:run": "cypress run",
    "cypress:component": "cypress open --component"
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



//stellar-burgers\src\setupTests.ts
import '@testing-library/jest-dom';
