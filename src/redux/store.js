import {
  configureStore,
  createImmutableStateInvariantMiddleware,
} from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { logger } from "./middlewares/logger";
import reducer from "./reducers/index";

const immutableInvariantMiddleware = createImmutableStateInvariantMiddleware({
  ignoredPaths: ["ignoredPath", "ignoredNested.one", "ignoredNested.two"],
});
const persistConfig = {
  key: "root",
  storage,
  timeout: null,
  version: 1,
  whitelist: [""],
};
const persistedReducer = persistReducer(persistConfig, reducer);
const store = configureStore({
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware({
      serializableCheck: false
      //  {
        // ignoredActionPaths: ["payload.onFail", "payload.onSuccess"],
        // ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      // },
    }),
    logger,
    immutableInvariantMiddleware,
  ],
  reducer: persistedReducer,
});
const persistor = persistStore(store);

export { persistor, store };
