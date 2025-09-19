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
