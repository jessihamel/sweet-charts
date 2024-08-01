import { configureStore } from '@reduxjs/toolkit';

import mapReducer from './mapSlice';

const middleware = [];

if (process.env.NODE_ENV === `development`) {
  const { logger } = require(`redux-logger`);

  middleware.push(logger);
}

const store = configureStore({
  reducer: {
    map: mapReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
