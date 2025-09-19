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
