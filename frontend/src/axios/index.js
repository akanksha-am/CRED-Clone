import Axios from "axios";

console.log(import.meta.env.VITE_BACKEND_URL_DEV);
console.log(import.meta.env.VITE_ENV === "development");

const axios = Axios.create({
  baseURL: `${
    import.meta.env.VITE_ENV === "development"
      ? import.meta.env.VITE_BACKEND_URL_DEV
      : import.meta.env.VITE_BACKEND_URL_PROD
  }`,
});

export default axios;
