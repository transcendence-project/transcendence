import axios from "axios";
import router from "./router";

const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_FRONTEND_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status == 401) {
      localStorage.removeItem("token");
      router.push("/login");
    }
    return error;
  },
);

export default axiosInstance;
