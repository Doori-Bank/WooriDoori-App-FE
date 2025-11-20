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

// 채팅 API
chat: async (message: string) => {
  try {
    // baseURL 확인 (디버깅용)
    const baseURL = import.meta.env.VITE_API_BASE_URL;
    if (!baseURL) {
      console.error("⚠️ VITE_API_BASE_URL 환경 변수가 설정되지 않았습니다.");
      return {
        success: false,
        resultMsg: "API 서버 주소가 설정되지 않았습니다. 환경 변수를 확인해주세요.",
      };
    }
    
    const response = await axiosInstance.post("/api/chat", { message });
    
    // 디버깅: 응답 구조 확인
    console.log("📨 채팅 API 응답:", response.data);
    
    // 백엔드 응답 구조 확인
    const responseData = response.data;
    
    // 채팅 API 응답 구조: {response: '메시지 내용'}
    // 또는 {statusCode: "SUCCESS", resultData: {message: '...'}} 형태일 수도 있음
    if (responseData.response) {
      // 직접 response 필드가 있는 경우
      return {
        success: true,
        data: {
          message: responseData.response,
        },
        resultMsg: "성공",
      };
    } else if (responseData.statusCode === "SUCCESS") {
      // statusCode가 "SUCCESS"인 경우 (다른 API와 동일한 구조)
      const chatMessage = 
        responseData.resultData?.message || 
        responseData.resultData?.response || 
        responseData.resultData?.content ||
        responseData.message ||
        "";
      
      if (!chatMessage) {
        console.warn("⚠️ 채팅 응답에 메시지가 없습니다:", responseData);
        return {
          success: false,
          resultMsg: "응답에 메시지가 없습니다.",
        };
      }
      
      return {
        success: true,
        data: {
          message: chatMessage,
        },
        resultMsg: responseData.resultMsg,
      };
    } else {
      // statusCode가 "SUCCESS"가 아닌 경우
      return {
        success: false,
        resultMsg: responseData.resultMsg || responseData.errorResultMsg || "채팅 전송에 실패했습니다.",
      };
    }
  } catch (err: any) {
    console.error("채팅 API 에러:", err);
    
    const errorName = err?.response?.data?.errorName;
    const errorResultMsg = err?.response?.data?.errorResultMsg;
    
    let errorMessage = errorResultMsg;
    if (errorName && ERROR_RESPONSE[errorName]) {
      errorMessage = ERROR_RESPONSE[errorName].message;
    }
    
    return {
      success: false,
      resultMsg: errorMessage || err?.response?.data?.resultMsg || err?.message || "채팅 전송에 실패했습니다.",
      resultCode: err?.response?.data?.statusCode,
      errorName: errorName,
    };
  }
},

// 카드 API
card: {
  // 카드 목록 조회
  getCardList: async () => {
    try {
      console.log("🔵 getCardList API 호출:", {
        url: "/card",
        method: "GET",
      });

      const response = await axiosInstance.get("/card");
      
      console.log("🟢 getCardList API 성공 응답:", {
        statusCode: response.data.statusCode,
        resultMsg: response.data.resultMsg,
        resultData: response.data.resultData,
      });

      return {
        success: true,
        data: response.data.resultData,
        resultMsg: response.data.resultMsg,
      };
    } catch (err: any) {
      console.error("🔴 카드 목록 조회 에러:", {
        message: err?.message,
        status: err?.response?.status,
        statusText: err?.response?.statusText,
        data: err?.response?.data,
        config: {
          url: err?.config?.url,
          method: err?.config?.method,
        },
      });
      
      const errorName = err?.response?.data?.errorName;
      const errorResultMsg = err?.response?.data?.errorResultMsg;
      
      let errorMessage = errorResultMsg;
      if (errorName && ERROR_RESPONSE[errorName]) {
        errorMessage = ERROR_RESPONSE[errorName].message;
      }
      
      return {
        success: false,
        resultMsg: errorMessage || err?.response?.data?.resultMsg || err?.message || "카드 목록 조회에 실패했습니다.",
        resultCode: err?.response?.data?.statusCode,
        errorName: errorName,
      };
    }
  },

  // 카드 삭제
  deleteCard: async (cardId: number) => {
    try {
      console.log("🔵 deleteCard API 호출:", {
        url: "/card/deleteCard",
        method: "PATCH",
        data: { id: cardId },
      });

      const response = await axiosInstance.patch("/card/deleteCard", { id: cardId });
      
      console.log("🟢 deleteCard API 성공 응답:", {
        statusCode: response.data.statusCode,
        resultMsg: response.data.resultMsg,
        resultData: response.data.resultData,
      });

      return {
        success: true,
        data: response.data.resultData,
        resultMsg: response.data.resultMsg,
      };
    } catch (err: any) {
      console.error("🔴 카드 삭제 에러:", {
        message: err?.message,
        status: err?.response?.status,
        statusText: err?.response?.statusText,
        data: err?.response?.data,
        config: {
          url: err?.config?.url,
          method: err?.config?.method,
        },
      });
      
      const errorName = err?.response?.data?.errorName;
      const errorResultMsg = err?.response?.data?.errorResultMsg;
      
      let errorMessage = errorResultMsg;
      if (errorName && ERROR_RESPONSE[errorName]) {
        errorMessage = ERROR_RESPONSE[errorName].message;
      }
      
      return {
        success: false,
        resultMsg: errorMessage || err?.response?.data?.resultMsg || err?.message || "카드 삭제에 실패했습니다.",
        resultCode: err?.response?.data?.statusCode,
        errorName: errorName,
      };
    }
  },

  // 카드 별명 수정
  editCard: async (cardData: {
    id: number;
    cardAlias: string;
  }) => {
    try {
      console.log("🔵 editCard API 호출:", {
        url: "/card/editCard",
        method: "PATCH",
        data: cardData,
      });

      const response = await axiosInstance.patch("/card/editCard", cardData);
      
      console.log("🟢 editCard API 성공 응답:", {
        statusCode: response.data.statusCode,
        resultMsg: response.data.resultMsg,
        resultData: response.data.resultData,
      });

      return {
        success: true,
        data: response.data.resultData,
        resultMsg: response.data.resultMsg,
      };
    } catch (err: any) {
      console.error("🔴 카드 별명 수정 에러:", {
        message: err?.message,
        status: err?.response?.status,
        statusText: err?.response?.statusText,
        data: err?.response?.data,
        config: {
          url: err?.config?.url,
          method: err?.config?.method,
        },
      });
      
      const errorName = err?.response?.data?.errorName;
      const errorResultMsg = err?.response?.data?.errorResultMsg;
      
      let errorMessage = errorResultMsg;
      if (errorName && ERROR_RESPONSE[errorName]) {
        errorMessage = ERROR_RESPONSE[errorName].message;
      }
      
      return {
        success: false,
        resultMsg: errorMessage || err?.response?.data?.resultMsg || err?.message || "카드 별명 수정에 실패했습니다.",
        resultCode: err?.response?.data?.statusCode,
        errorName: errorName,
      };
    }
  },

  // 카드 검증 및 불러오기
  putCard: async (cardData: {
    cardNum: string;
    cardPw: string;
    expiryMmYy: string;
    cardUserRegistNum: string;
    cardUserRegistBack: string;
    cardCvc: string;
    cardAlias?: string;
  }) => {
    try {
      console.log("🔵 putCard API 호출:", {
        url: "/card/putCard",
        method: "PATCH",
        data: {
          ...cardData,
          cardNum: cardData.cardNum.replace(/\d(?=\d{4})/g, '*'), // 마스킹
          cardPw: '**',
          cardCvc: '***',
        },
      });

      const response = await axiosInstance.patch("/card/putCard", cardData);
      
      console.log("🟢 putCard API 성공 응답:", {
        statusCode: response.data.statusCode,
        resultMsg: response.data.resultMsg,
        resultData: response.data.resultData,
      });

      return {
        success: true,
        data: response.data.resultData,
        resultMsg: response.data.resultMsg,
      };
    } catch (err: any) {
      console.error("🔴 카드 검증 에러:", {
        message: err?.message,
        status: err?.response?.status,
        statusText: err?.response?.statusText,
        data: err?.response?.data,
        config: {
          url: err?.config?.url,
          method: err?.config?.method,
        },
      });
      
      const errorName = err?.response?.data?.errorName;
      const errorResultMsg = err?.response?.data?.errorResultMsg;
      
      let errorMessage = errorResultMsg;
      if (errorName && ERROR_RESPONSE[errorName]) {
        errorMessage = ERROR_RESPONSE[errorName].message;
      }
      
      return {
        success: false,
        resultMsg: errorMessage || err?.response?.data?.resultMsg || err?.message || "카드 검증에 실패했습니다.",
        resultCode: err?.response?.data?.statusCode,
        errorName: errorName,
      };
    }
  },
},
};
