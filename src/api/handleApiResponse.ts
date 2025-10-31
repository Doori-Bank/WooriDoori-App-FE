import { ERROR_RESPONSE } from "./errorResponse";

export function handleApiResponse(response: any) {
  // ✅ 1. 백엔드에서 result 값이 SUCCESS인 경우
  if (response?.data?.statusCode === "SUCCESS") {
    const msg = response.data.resultMsg || "요청이 성공적으로 처리되었습니다.";
    return {
      success: true,
      message: msg,
      data: response.data.data || null,
      code: response.data.resultCode || null,
    };
  }

  // ✅ 2. 실패한 경우 (errorName 기반)
  const errorName = response?.data?.errorName?.toUpperCase();
  const errorInfo = ERROR_RESPONSE[errorName as keyof typeof ERROR_RESPONSE];

  if (errorInfo) {
    return {
      success: false,
      message: errorInfo.message,
      code: errorInfo.errorCode,
      errorName: errorInfo.errorName,
    };
  }

  // ✅ 3. 정의되지 않은 에러
  return {
    success: false,
    message: response?.data?.resultMsg || "알 수 없는 오류가 발생했습니다.",
    code: response?.data?.errorCode || null,
  };
}
