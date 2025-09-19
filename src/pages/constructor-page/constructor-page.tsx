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
