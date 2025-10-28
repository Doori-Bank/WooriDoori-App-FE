// 임시 유저 데이터
const mockUserData = {
  "statusCode": 200,
  "resultMsg": "SUCCESS",
  "resultData": {
    "name": "김두리",
    "memberId": "example@naver.com",
    "memberPw": "examplepw",
    "phone": "010-0000-0000",
    "birth": "980521",
    "gender": "1"
  }
};

// 로그인 API 시뮬레이션
export const loginUser = async (memberId: string, memberPw: string): Promise<any> => {
  // 실제 API 호출을 시뮬레이션하기 위한 딜레이
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 로그인 검증 로직
  if (memberId === mockUserData.resultData.memberId && memberPw === mockUserData.resultData.memberPw) {
    return {
      success: true,
      data: mockUserData.resultData
    };
  } else {
    return {
      success: false,
      message: "아이디 또는 비밀번호가 올바르지 않습니다."
    };
  }
};

// 유저 정보 조회 API
export const getUserInfo = async (): Promise<any> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockUserData;
};
