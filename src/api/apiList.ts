import axiosInstance from "./axiosInstance";
import axios from "axios";
import { ERROR_RESPONSE } from "./errorResponse";

export const apiList = {
  // 로그인 API
  login: async (memberId: string, password: string) => {
    try {
      const response = await axiosInstance.post("/auth/login", { 
        id: memberId, 
        password: password
      });
      
      // 백엔드 응답 구조: { statusCode, resultMsg, resultData: { name, tokens: { accessToken, refreshToken } } }
      const resultData = response.data.resultData;
      
      if (resultData && resultData.tokens && resultData.tokens.accessToken) {
        return {
          success: true,
          data: {
            name: resultData.name,
            accessToken: resultData.tokens.accessToken,
            refreshToken: resultData.tokens.refreshToken,
          },
        };
      } else {
        return {
          success: false,
          result: "FAIL",
          resultMsg: "토큰을 받지 못했습니다.",
        };
      }
    } catch (err: any) {
      console.error("로그인 에러:", err);
      
      // 백엔드 에러 응답 구조: { statusCode, errorName, errorResultMsg }
      const errorName = err?.response?.data?.errorName;
      const errorResultMsg = err?.response?.data?.errorResultMsg;
      
      // ERROR_RESPONSE에서 에러 메시지 찾기
      let errorMessage = errorResultMsg;
      if (errorName && ERROR_RESPONSE[errorName]) {
        errorMessage = ERROR_RESPONSE[errorName].message;
      }
      
      return {
        success: false,
        result: "FAIL",
        resultMsg: errorMessage || err?.response?.data?.resultMsg || err?.message || "로그인에 실패했습니다.",
        resultCode: err?.response?.data?.statusCode,
        errorName: errorName,
      };
    }
  },

  // 회원가입
  signup: (data: { email: string; password: string; name: string }) => axiosInstance.post("/test2", data),

  // 메인 페이지 데이터
  getMain: async () => {
    const response = await axiosInstance.get("/main");
    return response.data.resultData;
  },

  // 토큰 재발급 API
  // interceptor를 거치지 않도록 기본 axios 사용 (순환 참조 및 재발급 무한 루프 방지)
  reissue: async (accessToken: string, refreshToken: string) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/reissue`,
        {
          accessToken,
          refreshToken,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      
      // 백엔드 응답 구조: { grantType, accessToken, refreshToken, accessTokenExpiresIn }
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
      
      if (newAccessToken && newRefreshToken) {
        return {
          success: true,
          data: {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          },
        };
      } else {
        return {
          success: false,
          resultMsg: "토큰 재발급 실패: 응답에 토큰이 없습니다",
        };
      }
    } catch (err: any) {
      console.error("토큰 재발급 에러:", err);
      return {
        success: false,
        resultMsg: err?.response?.data?.errorResultMsg || err?.message || "토큰 재발급에 실패했습니다.",
      };
    }
  },

// 목표 API
goal: {
  getCurrentGoal: () => axiosInstance.get("/goal/current"),
  setGoal: (payload: any) => {
    console.log("📡 보내는 payload:", payload);
    return axiosInstance.put("/goal/setgoal", payload);
  },
},

  goalhistory: {
    getGoalHistory: () => 
      axiosInstance.get("/goal/getgoalhistory")
        .then(res => {
          const goalList = res.data.resultData; // List<GetGoalDto>
          console.log(goalList); // 화면 표시나 상태 업데이트로 사용
          return goalList;
        })
  },


  goaldetail: {
  // year, month를 받아서 해당 월의 상세 정보 조회
  getGoalDetail: (year: number, month: number) =>
    axiosInstance
      .get(`/goal/past?year=${year}&month=${month}`)
      .then(res => res.data.resultData),
},

};
