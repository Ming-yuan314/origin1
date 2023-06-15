import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';
// import {createLogger} from 'redux-logger'
import { useDispatch } from 'react-redux';
import { load, save } from 'redux-localstorage-simple';

import { reducer as globalConfig } from './globalConfig';
import transactions from './transactions/reducer';
import { reducer as user } from './user';

const reducer = { globalConfig, user, transactions };

const PERSISTED_KEYS: string[] = ['user', 'transactions'];
// const customizedMiddleware = getDefaultMiddleware({
//     serializableCheck: false,
// })
// const middleware = [...getDefaultMiddleware()]

// if ((window as any).__DEBUG__) {
//   const logger = createLogger({
//     collapsed: true,
//   })
//   middleware.push(logger)
// }

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: true, serializableCheck: false }).concat(
      save({ states: PERSISTED_KEYS, debounce: 1000 }),
    ),
  preloadedState: load({
    states: PERSISTED_KEYS,
    disableWarnings: process.env.NODE_ENV === 'test',
  }),
  devTools: (window as any).__DEBUG__,
});

// export const globalDataReset = () => {
//   store.dispatch(resetBanners());
// };
setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;
export const useTypedDispatch = () => useDispatch<AppDispatch>();
export type IStoreState = ReturnType<typeof store.getState>;
export type ThunkConfig = { state: IStoreState; dispatch: AppDispatch };

export default store;
