//stellar-burgers\src\services\hooks.ts
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { AppDispatch } from './store';
import type { RootState } from './reducers'; // Импорт из reducers

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
