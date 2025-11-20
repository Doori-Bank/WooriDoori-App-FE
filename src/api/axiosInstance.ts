import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { handleApiError } from "./handleApiError";
import { useCookieManager } from "@/hooks/useCookieManager";
import { apiList } from "./apiList";

const { getCookies, setCookies, removeCookies } = useCookieManager();


const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
  // withCredentials: true,
});

// 토큰 재발급 중 플래그 (중복 요청 방지)
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

// 재발급 대기 중인 요청들을 처리
const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// 요청 인터셉터
axiosInstance.interceptors.request.use((config) => {
  const { accessToken: token } = getCookies();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => response, // 응답은 그대로 반환
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // 401 에러이고, reissue API가 아니고, 이미 재시도한 요청이 아닐 때
    if (
      error.response?.status === 401 &&
      !originalRequest.url?.includes('/auth/reissue') &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest._retry
    ) {
      // 이미 재발급 중이면 대기
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const { accessToken, refreshToken } = getCookies();

      // refreshToken이 없으면 로그인 페이지로 이동
      if (!refreshToken || !accessToken) {
        isRefreshing = false;
        removeCookies();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        // 토큰 재발급 요청 (apiList의 reissue 함수 사용)
        const reissueResult = await apiList.reissue(accessToken, refreshToken);

        // 재발급 성공
        if (reissueResult.success && reissueResult.data) {
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = reissueResult.data;

          // 새 토큰 저장
          setCookies(newAccessToken, newRefreshToken);

          // 원래 요청 헤더에 새 토큰 설정
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }

          // 대기 중인 요청들 처리
          processQueue(null, newAccessToken);
          isRefreshing = false;

          // 원래 요청 재시도
          return axiosInstance(originalRequest);
        } else {
          throw new Error(reissueResult.resultMsg || "토큰 재발급 실패");
        }
      } catch (refreshError) {
        // 재발급 실패 시 로그인 페이지로 이동
        isRefreshing = false;
        processQueue(refreshError as AxiosError, null);
        removeCookies();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // 에러를 컴포넌트에서 직접 처리하는 API들은 alert를 띄우지 않음
    const isLoginApi = error?.config?.url?.includes('/auth/login');
    const isSpendingApi = error?.config?.url?.includes('/history/calendar');
    
    if (!isLoginApi && !isSpendingApi) {
      handleApiError(error);
    }
    
    return Promise.reject(error);
  }
);


export default axiosInstance;
