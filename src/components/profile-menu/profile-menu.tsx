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
