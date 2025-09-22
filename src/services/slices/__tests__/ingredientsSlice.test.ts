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
