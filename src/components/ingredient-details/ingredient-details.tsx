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
