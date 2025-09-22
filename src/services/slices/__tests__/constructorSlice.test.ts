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
