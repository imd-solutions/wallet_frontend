import { configureStore } from '@reduxjs/toolkit';
import { useDispatch as reduxDispatch } from 'react-redux';
import { createLogger } from 'redux-logger';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
import userReducer from './user';
import authReducer from './auth';
import storage from 'redux-persist/lib/storage';

const authPersistConfig = {
  key: 'auth',
  storage: storage,
  whitelist: ['phoneNumber', 'email', 'accessToken', 'uid'],
};

const userPersistConfig = {
  key: 'user',
  storage: storage,
  whitelist: ['walletConfig'],
};

const rootReducer = {
  auth: persistReducer(authPersistConfig, authReducer),
  user: persistReducer(userPersistConfig, userReducer),
};

const logger = createLogger();

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    if (process.env.NODE_ENV === `development`) {
      return getDefaultMiddleware({ serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      } }).concat(logger);
    }
    return getDefaultMiddleware({ serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      } });
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export const useDispatch: () => AppDispatch = reduxDispatch;

export const persistor = persistStore(store);

export default store;
