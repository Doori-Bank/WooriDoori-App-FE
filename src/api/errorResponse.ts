export type ErrorResponse = {
  errorName: string;
  errorCode?: string;
  message: string;
};

export const ERROR_RESPONSE: Record<string, ErrorResponse> = {
  // 공통
  INVALID_TOKEN: {
    errorName: "invalid_token",
    errorCode: "COMMON-001",
    message: "토큰이 잘못되었습니다.",
  },
  INTERNAL_SERVER_ERROR: {
    errorName: "INTERNAL_SERVER_ERROR",
    errorCode: "COMMON-002",
    message: "서버에서 처리할 수 없습니다.",
  },

  // 회원관리 - 본인인증
  AUTH_FAIL: {
    errorName: "AUTH_FAIL",
    errorCode: "ACCOUNT-001",
    message: "인증번호가 일치하지 않습니다.",
  },
  TIME_OUT: {
    errorName: "TIME_OUT",
    message: "인증 시간이 초과되었습니다. 다시 시도해주세요.",
  },
  UNAUTHORIZED_REQUEST: {
    errorName: "UNAUTHORIZED_REQUEST",
    message: "인증이 확인되지 않았습니다.",
  },
  UNAUTHORIZED: {
    errorName: "UNAUTHORIZED",
    message: "인증에 실패하였습니다.",
  },

  // 회원관리 - 회원가입
  DUPLICATE_LOGIN_ID: {
    errorName: "DUPLICATE_LOGIN_ID",
    message: "이미 사용 중인 이메일이 있습니다.",
  },
  INVALID_PASSWORD: {
    errorName: "INVALID_PASSWORD",
    message: "비밀번호가 동일하지 않습니다.",
  },
  REQUIRED_MISSING: {
    errorName: "REQUIRED_MISSING",
    message: "필수 요소가 입력되지 않았습니다.",
  },
  INVALID_FORMAT: {
    errorName: "INVALID_FORMAT",
    message: "형식에 맞지 않는 입력입니다.",
  },
  SIGNIN_FAIL: {
    errorName: "SIGNIN_FAIL",
    message: "회원가입에 실패하였습니다.",
  },

  // 회원관리 - 로그인
  USER_NOT_FOUND: {
    errorName: "USER_NOT_FOUND",
    message: "아이디가 존재하지 않습니다.",
  },
  WRONG_PASSWORD: {
    errorName: "WRONG_PASSWORD",
    message: "비밀번호가 틀립니다.",
  },

  // 회원관리 - 아이디/비밀번호 찾기
  INVALID_USER: {
    errorName: "INVALID_USER",
    message: "등록되지 않은 사용자입니다.",
  },
  INVALID_PHONE: {
    errorName: "INVALID_PHONE",
    message: "등록되지 않은 전화번호입니다.",
  },
  ACCOUNT_SUSPENDED: {
    errorName: "ACCOUNT_SUSPENDED",
    message: "비활성화된 계정입니다.",
  },

  // 비밀번호 재설정
  TEMP_PASSWORD_GEN_FAILED: {
    errorName: "TEMP_PASSWORD_GEN_FAILED",
    message: "임시 비밀번호 생성에 실패했습니다.",
  },
  UPDATE_FAILED: {
    errorName: "UPDATE_FAILED",
    message: "임시 비밀번호 저장에 실패했습니다.",
  },
};
