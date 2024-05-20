import axios from "../../axios";
import {
  addCardRequest,
  addCardSuccess,
  addCardFailure,
  getCardListRequest,
  getCardListSuccess,
  getCardListFailure,
  getCardDetailsRequest,
  getCardDetailsSuccess,
  getCardDetailsFailure,
} from "../cardSlice";

export const addCard = (card) => async (dispatch, getState) => {
  try {
    dispatch(addCardRequest());
    const { user } = getState();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.userInfo.token}`,
      },
    };
    const { data } = await axios.post(`/api/cards`, card, config);
    dispatch(addCardSuccess(data));
  } catch (err) {
    dispatch(
      addCardFailure(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      )
    );
  }
};

export const listCards = () => async (dispatch, getState) => {
  try {
    dispatch(getCardListRequest());
    const { user } = getState();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.userInfo.token}`,
      },
    };
    const { data } = await axios.get(`/api/cards`, config);
    dispatch(getCardListSuccess(data.cards));
  } catch (err) {
    dispatch(
      getCardListFailure(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      )
    );
  }
};

export const getCardById = (id) => async (dispatch, getState) => {
  try {
    dispatch(getCardDetailsRequest());
    const { user } = getState();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.userInfo.token}`,
      },
    };
    const { data } = await axios.get(`/api/cards/${id}`, config);
    dispatch(getCardDetailsSuccess(data.card));
  } catch (err) {
    dispatch(
      getCardDetailsFailure(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      )
    );
  }
};
