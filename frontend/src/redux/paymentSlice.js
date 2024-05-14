import { createSlice } from "@reduxjs/toolkit";

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    paymentRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    paymentSuccess: (state) => {
      state.loading = false;
      state.success = true;
    },
    paymentFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    paymentReset: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
});

export const { paymentRequest, paymentSuccess, paymentFailure, paymentReset } =
  paymentSlice.actions;

export default paymentSlice.reducer;
