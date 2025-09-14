//src/components/app-header/app-header.tsx
import { FC } from 'react';
import { useAppSelector } from '../../services/hooks';
import { authUserSelector } from '../../services/selectors';
import { AppHeaderUI } from '@ui';

export const AppHeader: FC = () => {
  const user = useAppSelector(authUserSelector);

  return <AppHeaderUI userName={user?.name || ''} />;
};
