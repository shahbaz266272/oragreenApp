import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/cart/cartSlice";
import addressReducer from "../features/address/addressCart";
import loginInforReducer from "../features/loginInfo/LoginInfo";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    selectedAddress: addressReducer,
    loginInfo: loginInforReducer,
  },
});
