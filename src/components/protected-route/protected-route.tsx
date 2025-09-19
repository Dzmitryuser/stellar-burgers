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
