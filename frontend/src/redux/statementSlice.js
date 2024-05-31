import { createSlice } from "@reduxjs/toolkit";

const statementSlice = createSlice({
  name: "statement",
  initialState: {
    loading: false,
    error: null,
    statements: [],
    recentStatements: [],
    smartStatementsByMonth: null,
    pages: 0,
    page: 0,
  },
  reducers: {
    getStatementsByDateRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getStatementsByDateSuccess: (state, action) => {
      state.loading = false;
      state.statements = action.payload.statements;
      state.pages = action.payload.pages;
      state.page = action.payload.page;
    },
    getStatementsByDateFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getStatementsByDateReset: (state) => {
      state.statements = [];
      state.pages = 0;
      state.page = 0;
    },
    getRecentStatementsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getRecentStatementsSuccess: (state, action) => {
      state.loading = false;
      state.recentStatements = action.payload;
    },
    getRecentStatementsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getRecentStatementsReset: (state) => {
      state.recentStatements = [];
    },
    getSmartStatementsByMonthRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getSmartStatementsByMonthSuccess: (state, action) => {
      state.loading = false;
      state.smartStatementsByMonth = action.payload;
    },
    getSmartStatementsByMonthFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getSmartStatementsByMonthReset: (state) => {
      state.smartStatementsByMonth = null;
    },
  },
});

export const {
  getStatementsByDateRequest,
  getStatementsByDateSuccess,
  getStatementsByDateFailure,
  getStatementsByDateReset,
  getRecentStatementsRequest,
  getRecentStatementsSuccess,
  getRecentStatementsFailure,
  getRecentStatementsReset,
  getSmartStatementsByMonthRequest,
  getSmartStatementsByMonthSuccess,
  getSmartStatementsByMonthFailure,
  getSmartStatementsByMonthReset,
} = statementSlice.actions;

export default statementSlice.reducer;
