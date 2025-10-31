import { ERROR_RESPONSE } from "./errorResponse";

export function handleApiError(error: any) {
  const errorName = error?.response?.data?.errorName?.toUpperCase();
  const errorInfo = ERROR_RESPONSE[errorName as keyof typeof ERROR_RESPONSE];

  if (errorInfo) {
    alert(errorInfo.message);
  } else {
    alert("알 수 없는 오류가 발생했습니다.");
  }
}
