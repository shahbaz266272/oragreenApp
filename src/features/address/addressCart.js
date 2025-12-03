import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  item: null, // ✅ single selected address
};

const selectedAddressSlice = createSlice({
  name: "selectedAddress",
  initialState,
  reducers: {
    setSelectedAddress(state, action) {
      state.item = action.payload;
    },
    setSelectedAddress(state, action) {
      state.item = action.payload;
    },

    clearSelectedAddress(state) {
      state.item = null;
    },
  },
});

export const { setSelectedAddress, clearSelectedAddress } =
  selectedAddressSlice.actions;

export default selectedAddressSlice.reducer;
