import Axios from "axios";

const axios = Axios.create({
  baseURL: `${
    import.meta.env.process.env.NODE_ENV === "development"
      ? import.meta.env.process.env.REACT_APP_BACKEND_URL_DEV
      : import.meta.env.process.env.REACT_APP_BACKEND_URL_PROD
  }`,
});

export default axios;
