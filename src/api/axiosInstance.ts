import axios from "axios";
import { handleApiError } from "./handleApiError";


const axiosInstance = axios.create({
  baseURL: "",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// 요청 인터셉터
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => response, // 응답은 그대로 반환
  (error) => {
    handleApiError(error);
    return Promise.reject(error);
  }
);


export default axiosInstance;
