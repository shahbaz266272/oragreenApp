import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  item: null, // ✅ single selected address
};

const LoginInfoSlice = createSlice({
  name: "loginInfo",
  initialState,
  reducers: {
    setLoginInfo(state, action) {
      state.item = action.payload;
    },

    clearLoginInfo(state) {
      state.item = null;
    },
  },
});

export const { setLoginInfo, clearLoginInfo } = LoginInfoSlice.actions;

export default LoginInfoSlice.reducer;
