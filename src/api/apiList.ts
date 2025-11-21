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

  // 소비 내역 API
  // 월별 소비 내역 조회
  getMonthlySpendings: async (targetDate: string) => {
    try {
      const response = await axiosInstance.get("/history/calendar", {
        params: { targetDate },
      });
      return {
        success: true,
        data: response.data.resultData,
      };
    } catch (err: any) {
      console.error("월별 소비 내역 조회 에러:", err);
      return {
        success: false,
        resultMsg: err?.response?.data?.errorResultMsg || err?.response?.data?.resultMsg || "소비 내역 조회에 실패했습니다.",
      };
    }
  },

  // 소비 내역 상세 조회
  getSpendingDetail: async (historyId: number) => {
    try {
      const response = await axiosInstance.get(`/history/calendar/detail/${historyId}`);
      return {
        success: true,
        data: response.data.resultData,
      };
    } catch (err: any) {
      console.error("소비 내역 상세 조회 에러:", err);
      return {
        success: false,
        resultMsg: err?.response?.data?.errorResultMsg || err?.response?.data?.resultMsg || "상세 내역 조회에 실패했습니다.",
      };
    }
  },

  // 지출 합계 포함 여부 수정
  updateIncludeTotal: async (historyId: number, includeInTotal: boolean) => {
    try {
      const response = await axiosInstance.patch(`/history/calendar/${historyId}/${includeInTotal}`);
      return {
        success: true,
        data: response.data.resultData,
      };
    } catch (err: any) {
      console.error("지출 합계 포함 여부 수정 에러:", err);
      return {
        success: false,
        resultMsg: err?.response?.data?.errorResultMsg || err?.response?.data?.resultMsg || "수정에 실패했습니다.",
      };
    }
  },

  // 카테고리 수정
  updateCategory: async (historyId: number, category: string) => {
    try {
      const response = await axiosInstance.patch(`/history/calendar/${historyId}/category`, {
        category,
      });
      return {
        success: true,
        data: response.data.resultData,
      };
    } catch (err: any) {
      console.error("카테고리 수정 에러:", err);
      return {
        success: false,
        resultMsg: err?.response?.data?.errorResultMsg || err?.response?.data?.resultMsg || "카테고리 수정에 실패했습니다.",
      };
    }
  },

  // 더치페이 인원 수정
  updateDutchpay: async (historyId: number, count: number) => {
    try {
      const response = await axiosInstance.patch(`/history/calendar/${historyId}/dutchpay`, {
        count,
      });
      return {
        success: true,
        data: response.data.resultData,
      };
    } catch (err: any) {
      console.error("더치페이 수정 에러:", err);
      return {
        success: false,
        resultMsg: err?.response?.data?.errorResultMsg || err?.response?.data?.resultMsg || "더치페이 수정에 실패했습니다.",
      };
    }
  },

  // 소비 금액 수정
  updatePrice: async (historyId: number, price: number) => {
    try {
      const response = await axiosInstance.patch(`/history/calendar/${historyId}/price`, {
        price,
      });
      return {
        success: true,
        data: response.data.resultData,
      };
    } catch (err: any) {
      console.error("금액 수정 에러:", err);
      return {
        success: false,
        resultMsg: err?.response?.data?.errorResultMsg || err?.response?.data?.resultMsg || "금액 수정에 실패했습니다.",
      };
    }
  },

  // 소비 일기 API
  // 월별 일기 조회
  getMonthlyDiaries: async (targetDate: string) => {
    try {
      const response = await axiosInstance.get("/diary", {
        params: { targetDate },
      });
      return {
        success: true,
        data: response.data.resultData,
      };
    } catch (err: any) {
      console.error("월별 일기 조회 에러:", err);
      return {
        success: false,
        resultMsg: err?.response?.data?.errorResultMsg || err?.response?.data?.resultMsg || "일기 조회에 실패했습니다.",
      };
    }
  },

  // 일기 상세 조회
  getDiaryDetail: async (diaryId: number) => {
    try {
      const response = await axiosInstance.get(`/diary/${diaryId}`);
      return {
        success: true,
        data: response.data.resultData,
      };
    } catch (err: any) {
      console.error("일기 상세 조회 에러:", err);
      return {
        success: false,
        resultMsg: err?.response?.data?.errorResultMsg || err?.response?.data?.resultMsg || "일기 상세 조회에 실패했습니다.",
      };
    }
  },

  // 일기 생성
  createDiary: async (diaryDay: string, diaryEmotion: string, diaryContent: string) => {
    try {
      const response = await axiosInstance.post("/diary/insertDiary", {
        diaryDay,
        diaryEmotion,
        diaryContent,
      });
      return {
        success: true,
        data: response.data.resultData,
      };
    } catch (err: any) {
      console.error("일기 생성 에러:", err);
      return {
        success: false,
        resultMsg: err?.response?.data?.errorResultMsg || err?.response?.data?.resultMsg || "일기 생성에 실패했습니다.",
      };
    }
  },

  // 일기 수정
  updateDiary: async (diaryId: number, diaryEmotion?: string, diaryContent?: string) => {
    try {
      const requestBody: { diaryEmotion?: string; diaryContent?: string } = {};
      if (diaryEmotion !== undefined) requestBody.diaryEmotion = diaryEmotion;
      if (diaryContent !== undefined) requestBody.diaryContent = diaryContent;

      const response = await axiosInstance.put(`/diary/updateDiary/${diaryId}`, requestBody);
      return {
        success: true,
        data: response.data.resultData,
      };
    } catch (err: any) {
      console.error("일기 수정 에러:", err);
      return {
        success: false,
        resultMsg: err?.response?.data?.errorResultMsg || err?.response?.data?.resultMsg || "일기 수정에 실패했습니다.",
      };
    }
  },

  // 일기 삭제
  deleteDiary: async (diaryId: number) => {
    try {
      const response = await axiosInstance.delete(`/diary/${diaryId}`);
      return {
        success: true,
        data: response.data.resultData,
      };
    } catch (err: any) {
      console.error("일기 삭제 에러:", err);
      return {
        success: false,
        resultMsg: err?.response?.data?.errorResultMsg || err?.response?.data?.resultMsg || "일기 삭제에 실패했습니다.",
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

// 카드 추천 API
cardRecommend: async () => {
  try {
    console.log("🔵 getCardRecommend API 호출:", {
      url: "/card/recommend",
      method: "GET",
    });

    const response = await axiosInstance.get("/card/recommend");
    
    console.log("🟢 getCardRecommend API 성공 응답:", {
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
    console.error("🔴 카드 추천 조회 에러:", {
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
      resultMsg: errorMessage || err?.response?.data?.resultMsg || err?.message || "카드 추천 조회에 실패했습니다.",
      resultCode: err?.response?.data?.statusCode,
      errorName: errorName,
    };
  }
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

  // 비밀번호 변경 (임시 비밀번호로 로그인 후 새 비밀번호로 변경)
  changePassword: async (memberId: string, oldPassword: string, newPassword: string) => {
    try {
      const response = await axiosInstance.patch("/auth/resetPw", {
        id: memberId,
        oldPassword: oldPassword,
        newPassword: newPassword,
      });
      
      
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
        data: response.data.resultData || [],
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
editCard: async (cardData: { id: number; cardAlias: string }) => {
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
      resultMsg:
        errorMessage ||
        err?.response?.data?.resultMsg ||
        err?.message ||
        "카드 별명 수정에 실패했습니다.",
      resultCode: err?.response?.data?.statusCode,
      errorName: errorName,
    };
  }
},

// 임시 비밀번호 발급 요청
requestTemporaryPassword: async (memberId: string, memberName: string) => {
  try {
    const response = await axiosInstance.patch("/auth/genPw", {
      id: memberId,
      name: memberName,
    });

    return {
      success: true,
      data: response.data.resultData,
      resultMsg: response.data.resultMsg,
    };
  } catch (err: any) {
    console.error("임시 비밀번호 발급 에러:", err);

    const errorName = err?.response?.data?.errorName;
    const errorResultMsg = err?.response?.data?.errorResultMsg;

    let errorMessage = errorResultMsg;
    if (errorName && ERROR_RESPONSE[errorName]) {
      errorMessage = ERROR_RESPONSE[errorName].message;
    }

    return {
      success: false,
      resultMsg:
        errorMessage ||
        err?.response?.data?.resultMsg ||
        err?.message ||
        "임시 비밀번호 발급에 실패했습니다.",
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
        cardNum: cardData.cardNum.replace(/\d(?=\d{4})/g, "*"), // 마스킹
        cardPw: "**",
        cardCvc: "***",
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
      resultMsg:
        errorMessage ||
        err?.response?.data?.resultMsg ||
        err?.message ||
        "카드 검증에 실패했습니다.",
      resultCode: err?.response?.data?.statusCode,
      errorName: errorName,
    };
  }
},

};
