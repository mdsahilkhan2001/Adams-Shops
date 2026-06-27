import { configureStore } from "@reduxjs/toolkit";
import { api } from "./api.js";
import { authApi } from "./authApi.js";
import authReducer from "./authSlice.js";
import cartReducer from "./cartSlice.js";
import wishlistReducer from "./wishlistSlice.js";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware, authApi.middleware)
});
