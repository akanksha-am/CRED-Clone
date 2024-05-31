import axios from "../../axios";
import {
  getStatementsByDateRequest,
  getStatementsByDateSuccess,
  getStatementsByDateFailure,
  getRecentStatementsRequest,
  getRecentStatementsSuccess,
  getRecentStatementsFailure,
  getSmartStatementsByMonthRequest,
  getSmartStatementsByMonthSuccess,
  getSmartStatementsByMonthFailure,
} from "../statementSlice";

export const getStatementsByMonth =
  (cardNo, year, month, pageNumber) => async (dispatch, getState) => {
    try {
      dispatch(getStatementsByDateRequest());
      const { user } = getState();
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.userInfo.token}`,
        },
      };
      const { data } = await axios.get(
        `/api/cards/${cardNo}/statements/${year}/${month}?pageNumber=${pageNumber}`,
        config
      );
      dispatch(getStatementsByDateSuccess(data));
    } catch (err) {
      dispatch(
        getStatementsByDateFailure(
          err.response && err.response.data.message
            ? err.response.data.message
            : err.message
        )
      );
    }
  };

export const getRecentStatements =
  (cardNo, count = 3) =>
  async (dispatch, getState) => {
    try {
      dispatch(getRecentStatementsRequest());
      const { user } = getState();
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.userInfo.token}`,
        },
      };
      let { data } = await axios.get(
        `/api/cards/${parseInt(cardNo)}/statements`,
        config
      );
      let { transactions } = data;
      transactions.reverse();
      if (transactions.length > count) {
        transactions = transactions.slice(0, count);
      }
      dispatch(getRecentStatementsSuccess(transactions));
    } catch (err) {
      dispatch(
        getRecentStatementsFailure(
          err.response && err.response.data.message
            ? err.response.data.message
            : err.message
        )
      );
    }
  };

export const getSmartStatementsByMonth =
  (cardNo, year, month) => async (dispatch, getState) => {
    try {
      dispatch(getSmartStatementsByMonthRequest());
      const { user } = getState();
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.userInfo.token}`,
        },
      };
      const { data } = await axios.get(
        `/api/cards/${cardNo}/smartStatement/${year}/${month}`,
        config
      );
      dispatch(getSmartStatementsByMonthSuccess(data.data));
    } catch (err) {
      dispatch(
        getSmartStatementsByMonthFailure(
          err.response && err.response.data.message
            ? err.response.data.message
            : err.message
        )
      );
    }
  };
