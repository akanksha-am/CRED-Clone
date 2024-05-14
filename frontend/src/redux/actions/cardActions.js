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
} from "./cardSlice";

export const addCard = (card) => async (dispatch, getState) => {
  try {
    dispatch(addCardRequest());
    const {
      userLogin: { userInfo },
    } = getState();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
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
    const {
      userLogin: { userInfo },
    } = getState();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    const { data } = await axios.get(`/api/cards`, config);
    dispatch(getCardListSuccess(data));
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
    const {
      userLogin: { userInfo },
    } = getState();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    console.log("URL is: ", `/api/cards/${id}`);
    const { data } = await axios.get(`/api/cards/${id}`, config);
    console.log("Card Details", data);
    dispatch(getCardDetailsSuccess(data));
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
