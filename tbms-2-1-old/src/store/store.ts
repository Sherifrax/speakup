import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../services/authApi";
import { apiService } from "../services/apiService";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [apiService.reducerPath]: apiService.reducer,
  },
  // @ts-ignore - RTK Query middleware type compatibility issue
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(apiService.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
