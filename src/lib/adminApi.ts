/// <reference types="vite/client" />
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// API 응답 타입
export interface ApiResponse<T> {
  statusCode: number;
  resultMsg: string;
  resultData: T;
}

// 사용자 정보 타입 (API 응답)
export interface ApiUser {
  id: number;
  memberId: string;
  memberName: string;
  phone: string;
  birthDate: string;
  status: string;
  authority: string;
}

// axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: Authorization 헤더 추가
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('admin_accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 전체 사용자 조회 API
export const getUserList = async (): Promise<ApiResponse<ApiUser[]>> => {
  const response = await apiClient.get<ApiResponse<ApiUser[]>>('/api/users');
  return response.data;
};

export default apiClient;

