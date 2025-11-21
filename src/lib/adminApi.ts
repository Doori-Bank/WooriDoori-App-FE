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
  birthDate?: string; // 옵셔널로 변경
  status?: string; // 옵셔널로 변경
  authority?: string; // 옵셔널로 변경
}

// 카드 정보 타입 (API 응답)
export interface ApiCard {
  id: number;
  cardName: string;
  cardUrl: string;
  cardBenef: string;
  cardType: string; // "CREDIT" 등
  cardSvc: string; // "YES" 등
  annualFee1: string;
  annualFee2: string;
  cardImageFileId: number;
  cardBannerFileId: number;
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

// 관리자 로그인 API
export interface AdminLoginResponse {
  name?: string;
  authority?: string;
  tokens?: {
    accessToken: string;
    refreshToken: string;
  };
}

export const adminLogin = async (
  email: string,
  password: string
): Promise<{ success: boolean; data?: { accessToken: string; refreshToken?: string; name?: string; authority?: string }; error?: string }> => {
  try {
    // 로그인 시에는 토큰이 없으므로 인터셉터를 거치지 않는 기본 axios 사용
    const response = await axios.post<ApiResponse<AdminLoginResponse>>(
      `${API_BASE_URL}/auth/login`,
      {
        id: email, // 일반 로그인 API와 동일하게 id 필드 사용
        password: password,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // 백엔드 응답 구조: { statusCode, resultMsg, resultData: { name, authority, tokens: { accessToken, refreshToken } } }
    const resultData = response.data.resultData;

    if (resultData && resultData.tokens && resultData.tokens.accessToken) {
      return {
        success: true,
        data: {
          name: resultData.name,
          authority: resultData.authority,
          accessToken: resultData.tokens.accessToken,
          refreshToken: resultData.tokens.refreshToken,
        },
      };
    } else {
      return {
        success: false,
        error: response.data.resultMsg || '토큰을 받지 못했습니다.',
      };
    }
  } catch (error: any) {
    console.error('관리자 로그인 에러:', error);
    
    // 백엔드 에러 응답 구조: { statusCode, errorName, errorResultMsg }
    const errorResultMsg = error?.response?.data?.errorResultMsg;
    
    const errorMessage =
      errorResultMsg ||
      error?.response?.data?.resultMsg ||
      error?.message ||
      '로그인에 실패했습니다.';
    
    return {
      success: false,
      error: errorMessage,
    };
  }
};

// 전체 사용자 조회 API
export const getUserList = async (): Promise<ApiResponse<ApiUser[]>> => {
  try {
    const response = await apiClient.get<ApiResponse<ApiUser[]>>('/admin/members');
    return response.data;
  } catch (error: any) {
    console.error('사용자 목록 조회 에러:', error);
    
    // 에러 응답이 있는 경우 그대로 throw하여 상위에서 처리할 수 있도록 함
    if (error.response) {
      // 백엔드에서 에러 응답을 보낸 경우
      throw error;
    }
    
    // 네트워크 에러 등 기타 에러
    throw new Error(error?.message || '사용자 목록을 불러오는데 실패했습니다.');
  }
};

// 특정 회원 조회 API (memberName은 string)
export const getMemberByName = async (memberName: string): Promise<ApiResponse<ApiUser>> => {
  try {
    const response = await apiClient.get<ApiResponse<ApiUser>>(`/admin/members/${encodeURIComponent(memberName)}`);
    return response.data;
  } catch (error: any) {
    console.error('회원 조회 에러:', error);
    
    // 에러 응답이 있는 경우 그대로 throw하여 상위에서 처리할 수 있도록 함
    if (error.response) {
      throw error;
    }
    
    // 네트워크 에러 등 기타 에러
    throw new Error(error?.message || '회원 조회에 실패했습니다.');
  }
};

// 회원 권한 변경 API
export interface UpdateAuthorityRequest {
  memberId: string;
  authority: 'USER' | 'ADMIN';
}

export const updateMemberAuthority = async (
  memberId: string,
  authority: 'USER' | 'ADMIN'
): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await apiClient.put<ApiResponse<void>>('/admin/members/authority', {
      memberId,
      authority,
    });

    if (response.data.statusCode === 200) {
      return { success: true };
    } else {
      return {
        success: false,
        error: response.data.resultMsg || '권한 변경에 실패했습니다.',
      };
    }
  } catch (error: any) {
    console.error('권한 변경 에러:', error);
    
    const errorMessage =
      error?.response?.data?.errorResultMsg ||
      error?.response?.data?.resultMsg ||
      error?.message ||
      '권한 변경에 실패했습니다.';
    
    return {
      success: false,
      error: errorMessage,
    };
  }
};

// 전체 카드 조회 API
export const getCardList = async (): Promise<ApiResponse<ApiCard[]>> => {
  try {
    const response = await apiClient.get<ApiResponse<ApiCard[]>>('/admin/card');
    return response.data;
  } catch (error: any) {
    console.error('카드 목록 조회 에러:', error);
    
    // 에러 응답이 있는 경우 그대로 throw하여 상위에서 처리할 수 있도록 함
    if (error.response) {
      throw error;
    }
    
    // 네트워크 에러 등 기타 에러
    throw new Error(error?.message || '카드 목록을 불러오는데 실패했습니다.');
  }
};

// 카드 생성 요청 정보 타입
export interface CreateCardRequest {
  cardName: string;
  cardBenefit: string;
  cardType: string; // "CREDIT" 등
  cardSvc: string; // "YES" 또는 "NO"
  annualFee1: string;
  annualFee2: string;
}

// 카드 신규 등록 API
export const createCard = async (
  cardInfo: CreateCardRequest,
  cardImage: File,
  cardBanner?: File
): Promise<{ success: boolean; data?: ApiCard; error?: string }> => {
  try {
    const formData = new FormData();
    
    // 카드 이미지 파일 추가
    formData.append('cardImage', cardImage);
    
    // 카드 배너 이미지 파일 추가 (선택)
    if (cardBanner) {
      formData.append('cardBanner', cardBanner);
    }
    
    // 카드 정보를 JSON 문자열로 변환하여 추가
    // cardSvc는 YES/NO로 그대로 전송 (백엔드가 YESNO enum을 사용)
    formData.append('cardInfo', JSON.stringify(cardInfo));
    
    const response = await apiClient.post<ApiResponse<ApiCard>>('/admin/createCard', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data.statusCode === 200) {
      return {
        success: true,
        data: response.data.resultData,
      };
    } else {
      return {
        success: false,
        error: response.data.resultMsg || '카드 등록에 실패했습니다.',
      };
    }
  } catch (error: any) {
    console.error('카드 등록 에러:', error);
    
    const errorMessage =
      error?.response?.data?.errorResultMsg ||
      error?.response?.data?.resultMsg ||
      error?.message ||
      '카드 등록에 실패했습니다.';
    
    return {
      success: false,
      error: errorMessage,
    };
  }
};

// 카드 수정 요청 정보 타입
export interface UpdateCardRequest {
  cardId: number;
  cardName: string;
  cardBenefit: string;
  cardType: string; // "CREDIT" 등
  cardSvc: string; // "YES" 또는 "NO"
  annualFee1: string;
  annualFee2: string;
}

// 카드 정보 수정 API (multipart/form-data)
export const updateCard = async (
  cardInfo: UpdateCardRequest,
  cardImage?: File,
  cardBanner?: File
): Promise<{ success: boolean; data?: ApiCard; error?: string }> => {
  try {
    const formData = new FormData();
    
    // 카드 이미지 파일 추가 (선택)
    if (cardImage) {
      formData.append('cardImage', cardImage);
    }
    
    // 카드 배너 이미지 파일 추가 (선택)
    if (cardBanner) {
      formData.append('cardBanner', cardBanner);
    }
    
    // 카드 정보를 JSON 문자열로 변환하여 추가
    // cardSvc는 YES/NO로 그대로 전송 (백엔드가 YESNO enum을 사용)
    formData.append('cardInfo', JSON.stringify(cardInfo));
    
    const response = await apiClient.put<ApiResponse<ApiCard>>('/admin/editCard', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data.statusCode === 200) {
      return {
        success: true,
        data: response.data.resultData,
      };
    } else {
      return {
        success: false,
        error: response.data.resultMsg || '카드 수정에 실패했습니다.',
      };
    }
  } catch (error: any) {
    console.error('카드 수정 에러:', error);
    
    const errorMessage =
      error?.response?.data?.errorResultMsg ||
      error?.response?.data?.resultMsg ||
      error?.message ||
      '카드 수정에 실패했습니다.';
    
    return {
      success: false,
      error: errorMessage,
    };
  }
};

// 카드 삭제 API (soft delete - status를 UNABLE로 변경)
export const deleteCard = async (cardId: number): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await apiClient.delete<ApiResponse<{}>>(`/admin/deleteCard/${cardId}`);

    if (response.data.statusCode === 200) {
      return {
        success: true,
      };
    } else {
      return {
        success: false,
        error: response.data.resultMsg || '카드 삭제에 실패했습니다.',
      };
    }
  } catch (error: any) {
    console.error('카드 삭제 에러:', error);
    
    const errorMessage =
      error?.response?.data?.errorResultMsg ||
      error?.response?.data?.resultMsg ||
      error?.message ||
      '카드 삭제에 실패했습니다.';
    
    return {
      success: false,
      error: errorMessage,
    };
  }
};

// 알림 전송 요청 타입
export interface SendCustomNotificationRequest {
  memberId: string;
  message: string;
}

export interface SendNotificationRequest {
  memberId: string;
}

// 커스텀 알림 전송 API
export const sendCustomNotification = async (
  request: SendCustomNotificationRequest
): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await apiClient.post<ApiResponse<{}>>('/admin/send/custom', request);

    if (response.data.statusCode === 200) {
      return {
        success: true,
      };
    } else {
      return {
        success: false,
        error: response.data.resultMsg || '알림 전송에 실패했습니다.',
      };
    }
  } catch (error: any) {
    console.error('커스텀 알림 전송 에러:', error);
    
    const errorMessage =
      error?.response?.data?.errorResultMsg ||
      error?.response?.data?.resultMsg ||
      error?.message ||
      '알림 전송에 실패했습니다.';
    
    return {
      success: false,
      error: errorMessage,
    };
  }
};

// 일기 알림 전송 API
export const sendDiaryNotification = async (
  request: SendNotificationRequest
): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await apiClient.post<ApiResponse<{}>>('/admin/send/diary', request);

    if (response.data.statusCode === 200) {
      return {
        success: true,
      };
    } else {
      return {
        success: false,
        error: response.data.resultMsg || '일기 알림 전송에 실패했습니다.',
      };
    }
  } catch (error: any) {
    console.error('일기 알림 전송 에러:', error);
    
    const errorMessage =
      error?.response?.data?.errorResultMsg ||
      error?.response?.data?.resultMsg ||
      error?.message ||
      '일기 알림 전송에 실패했습니다.';
    
    return {
      success: false,
      error: errorMessage,
    };
  }
};

// 리포트 알림 전송 API
export const sendReportNotification = async (
  request: SendNotificationRequest
): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await apiClient.post<ApiResponse<{}>>('/admin/send/report', request);

    if (response.data.statusCode === 200) {
      return {
        success: true,
      };
    } else {
      return {
        success: false,
        error: response.data.resultMsg || '리포트 알림 전송에 실패했습니다.',
      };
    }
  } catch (error: any) {
    console.error('리포트 알림 전송 에러:', error);
    
    const errorMessage =
      error?.response?.data?.errorResultMsg ||
      error?.response?.data?.resultMsg ||
      error?.message ||
      '리포트 알림 전송에 실패했습니다.';
    
    return {
      success: false,
      error: errorMessage,
    };
  }
};

// 전체 사용자 커스텀 알림 전송 API
export interface SendAllCustomNotificationRequest {
  message: string;
}

export const sendAllCustomNotification = async (
  request: SendAllCustomNotificationRequest
): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await apiClient.post<ApiResponse<{}>>('/admin/send/allcustom', request);

    if (response.data.statusCode === 200) {
      return {
        success: true,
      };
    } else {
      return {
        success: false,
        error: response.data.resultMsg || '전체 커스텀 알림 전송에 실패했습니다.',
      };
    }
  } catch (error: any) {
    console.error('전체 커스텀 알림 전송 에러:', error);
    
    const errorMessage =
      error?.response?.data?.errorResultMsg ||
      error?.response?.data?.resultMsg ||
      error?.message ||
      '전체 커스텀 알림 전송에 실패했습니다.';
    
    return {
      success: false,
      error: errorMessage,
    };
  }
};

// 전체 사용자 일기 알림 전송 API
export const sendAllDiaryNotification = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await apiClient.post<ApiResponse<{}>>('/admin/send/alldiary');

    if (response.data.statusCode === 200) {
      return {
        success: true,
      };
    } else {
      return {
        success: false,
        error: response.data.resultMsg || '전체 일기 알림 전송에 실패했습니다.',
      };
    }
  } catch (error: any) {
    console.error('전체 일기 알림 전송 에러:', error);
    
    const errorMessage =
      error?.response?.data?.errorResultMsg ||
      error?.response?.data?.resultMsg ||
      error?.message ||
      '전체 일기 알림 전송에 실패했습니다.';
    
    return {
      success: false,
      error: errorMessage,
    };
  }
};

// 전체 사용자 리포트 알림 전송 API
export const sendAllReportNotification = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await apiClient.post<ApiResponse<{}>>('/admin/send/allreport');

    if (response.data.statusCode === 200) {
      return {
        success: true,
      };
    } else {
      return {
        success: false,
        error: response.data.resultMsg || '전체 리포트 알림 전송에 실패했습니다.',
      };
    }
  } catch (error: any) {
    console.error('전체 리포트 알림 전송 에러:', error);
    
    const errorMessage =
      error?.response?.data?.errorResultMsg ||
      error?.response?.data?.resultMsg ||
      error?.message ||
      '전체 리포트 알림 전송에 실패했습니다.';
    
    return {
      success: false,
      error: errorMessage,
    };
  }
};

export default apiClient;

