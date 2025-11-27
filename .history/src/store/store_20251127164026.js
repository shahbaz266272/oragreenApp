import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/cart/cartSlice";
import addressReducer from "../features/address/addressCart";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    address: addressReducer,
  },
});
