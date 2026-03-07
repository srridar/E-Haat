import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import cartReducer from "./cartSlice";
import authReducer from "./authSlice";

const persistConfig = {
  key: "cart",
  storage,
};

const persistedCartReducer = persistReducer(persistConfig, cartReducer);

export const store = configureStore({
  reducer: {
    cart: persistedCartReducer,
    auth: authReducer,
  },
});


export const persistor = persistStore(store);