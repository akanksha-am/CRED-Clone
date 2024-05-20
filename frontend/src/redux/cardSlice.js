import { createSlice } from "@reduxjs/toolkit";

const cardSlice = createSlice({
  name: "card",
  initialState: {
    loading: false,
    error: null,
    success: false,
    cards: [],
    card: null,
  },
  reducers: {
    addCardRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    addCardSuccess: (state, action) => {
      state.loading = false;
      state.card = action.payload;
      state.success = true;
    },
    addCardFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    addCardReset: (state) => {
      state.card = null;
      state.success = false;
    },
    getCardListRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getCardListSuccess: (state, action) => {
      state.loading = false;
      state.cards = action.payload;
    },
    getCardListFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getCardDetailsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getCardDetailsSuccess: (state, action) => {
      state.loading = false;
      state.card = action.payload;
    },
    getCardDetailsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    resetCardDetails: (state) => {
      state.cards = [];
      state.card = null;
    },
  },
});

export const {
  addCardRequest,
  addCardSuccess,
  addCardFailure,
  addCardReset,
  getCardListRequest,
  getCardListSuccess,
  getCardListFailure,
  getCardDetailsRequest,
  getCardDetailsSuccess,
  getCardDetailsFailure,
  resetCardDetails,
} = cardSlice.actions;

export default cardSlice.reducer;
