import axios from "../../axios";
import {
  paymentRequest,
  paymentSuccess,
  paymentFailure,
} from "../paymentSlice";

export const payAmount = (cardNo, amount) => async (dispatch, getState) => {
  try {
    dispatch(paymentRequest());
    const { user } = getState();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.userInfo.token}`,
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
