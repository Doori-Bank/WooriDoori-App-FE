import axiosInstance from "./axiosInstance";

export const apiList = {
  // TODO: 사용 예시
  // const data = await apiList.login({ email, password })

  login: async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post("/test", { email, password });
      const data = response.data;
      return {
        data: data.data, // 이런식으로 추천
        // 데이터 반환값..
      };
    } catch (err: any) {
      // 네트워크/서버 에러 catch 시에도 같은 구조 반환
      return {
        result: "FAIL",
        resultMsg: err?.message || "알 수 없는 오류",
        resultCode: err?.code,
        errorName: err?.response?.data?.errorName,
      };
    }
  },

// ===============================================================================

  
  // TODO: 사용 예시
  // const loginApi = useApi(apiList.signup);
  // const SigupView = async () => {
  //    const res = await loginApi.call({ email, password }); ....
  signup: (data: { email: string; password: string; name: string }) => axiosInstance.post("/test2", data),

};
