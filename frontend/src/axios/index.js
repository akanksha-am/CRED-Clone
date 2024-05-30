import Axios from "axios";

const axios = Axios.create({
  // baseURL: `${
  //   import.meta.env.VITE_ENV === "development"
  //     ? import.meta.env.VITE_BACKEND_URL_DEV
  //     : import.meta.env.VITE_BACKEND_URL_PROD
  // }`,
  baseURL: `${import.meta.env.VITE_BACKEND_URL}`,
});

export default axios;
