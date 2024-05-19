import axios from "../../axios";
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  logout,
  registerRequest,
  registerSuccess,
  registerFailure,
  getUserDetailsRequest,
  getUserDetailsSuccess,
  getUserDetailsFailure,
  updateProfileRequest,
  updateProfileSuccess,
  updateProfileFailure,
} from "../userSlice";

// @ LOGIN USER
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch(loginRequest());
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.post(
      "/api/user/login",
      { email, password },
      config
    );
    dispatch(loginSuccess(data));
  } catch (err) {
    dispatch(
      loginFailure(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      )
    );
  }
};

// @ LOGOUT USER
// export const logout = () => (dispatch) => {
//   dispatch(logout());
// };

// @ REGISTER USER
export const register = (name, email, password) => async (dispatch) => {
  try {
    dispatch(registerRequest());
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.post(
      "/api/user/signup",
      { name, email, password },
      config
    );
    dispatch(registerSuccess(data));
  } catch (err) {
    dispatch(
      registerFailure(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      )
    );
  }
};

// @ FETCH CURRENT USER DETAILS
export const getUserDetails = () => async (dispatch, getState) => {
  try {
    dispatch(getUserDetailsRequest());
    const { user } = getState();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.userInfo.token}`,
      },
    };
    const { data } = await axios.get(`/api/user/profile`, config);
    dispatch(getUserDetailsSuccess(data));
  } catch (err) {
    dispatch(
      getUserDetailsFailure(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      )
    );
  }
};

// @ UPDATE USER PROFILE
export const updateUserProfile = () => async (dispatch, getState) => {
  try {
    dispatch(updateProfileRequest());
    const { userInfo } = getState();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    const { data } = await axios.patch("/api/user/profile", config);
    dispatch(updateProfileSuccess(data));
  } catch (err) {
    dispatch(
      updateProfileFailure(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      )
    );
  }
};

export const updateAuthCode = () => async (dispatch, getState) => {
  try {
    dispatch(updateProfileRequest());
    const { user } = getState();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.userInfo.token}`,
      },
    };
    const { data } = await axios.get(`/api/user/authCode`, config);
    console.log(data);
    dispatch(updateProfileSuccess(data));
  } catch (err) {
    dispatch(
      updateProfileFailure(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      )
    );
  }
};
