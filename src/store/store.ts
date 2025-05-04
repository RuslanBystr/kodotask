import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import { baseApi } from '@/services/base';
import { fileUploadApi } from '@/services/file';
import { usersApi } from '@/services/users';

import { authReducer } from './auth';
import { onlineUsersReducer } from './users';

const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  [usersApi.reducerPath]: usersApi.reducer,
  [fileUploadApi.reducerPath]: fileUploadApi.reducer,
  auth: authReducer,
  onlineUsers: onlineUsersReducer,
});
export const setupStore = () =>
  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat([baseApi.middleware, fileUploadApi.middleware, usersApi.middleware]),
  });

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
