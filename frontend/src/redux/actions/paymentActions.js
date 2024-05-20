import axios from "../../axios";
import {
  paymentRequest,
  paymentSuccess,
  paymentFailure,
} from "../paymentSlice";

export const payAmount = (cardNo, amount) => async (dispatch, getState) => {
  try {
    dispatch(paymentRequest());
    const {
      userLogin: { userInfo },
    } = getState();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    const { data } = await axios.post(
      `/api/cards/${cardNo}/pay`,
      { amount },
      config
    );
    dispatch(paymentSuccess());
  } catch (err) {
    dispatch(
      paymentFailure(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      )
    );
  }
};
