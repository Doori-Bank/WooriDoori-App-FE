import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { img } from "@/assets/img";
import Title1 from "@/components/title/Title1";
import DefaultButton from "@/components/button/DefaultButton";
import BottomButtonWrapper from "@/components/button/BottomButtonWrapper";
import DefaultDiv from "@/components/default/DefaultDiv";
import SuccessModal from "@/components/modal/SuccessModal";
import LoginForm, { LoginFormRef } from "@/components/login/LoginForm";
import { useApi } from "@/hooks/useApi";
import { apiList } from "@/api/apiList";
import { useCookieManager } from "@/hooks/useCookieManager";

const LoginView = () => {
  const navigate = useNavigate();
  const loginFormRef = useRef<LoginFormRef>(null);
  const { setCookies, getCookies } = useCookieManager();
  const loginApi = useApi(apiList.login);

  const [showSuccess, setShowSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 토큰이 있으면 메인 페이지로 리다이렉트
  useEffect(() => {
    const { accessToken } = getCookies();
    if (accessToken) {
      navigate("/home");
    }
  }, [navigate]);

  const submit = async () => {
    // 폼 검증
    if (!loginFormRef.current?.validate()) {
      setIsError(true);
      setErrorMessage("입력 정보를 확인해주세요.");
      return;
    }

    const formData = loginFormRef.current.getFormData();
    if (!formData) {
      setIsError(true);
      setErrorMessage("입력 정보를 확인해주세요.");
      return;
    }

    setIsError(false);
    setErrorMessage("");

    // 로그인 API 호출
    const result = await loginApi.call(formData.email, formData.password);

    console.log("로그인 결과:", result);

    if (result?.success && result.data) {
      // 로그인 성공 - 쿠키에 토큰 저장
      const { accessToken, refreshToken } = result.data;
      console.log("토큰 받음:", accessToken ? "있음" : "없음");
      
      if (accessToken && refreshToken) {
        try {
          setCookies(accessToken, refreshToken);
          console.log("로그인 성공!");
          
          setShowSuccess(true);
        } catch (cookieError) {
          console.error("쿠키 저장 실패:", cookieError);
          setIsError(true);
          setErrorMessage("로그인 정보 저장에 실패했습니다. 다시 시도해주세요.");
        }
      } else {
        console.error("토큰이 없습니다.");
        setIsError(true);
        setErrorMessage("로그인 정보를 받지 못했습니다. 다시 시도해주세요.");
      }
    } else {
      // 로그인 실패 - 에러 메시지 표시
      const errorMsg = result?.resultMsg || "로그인에 실패했습니다. 다시 시도해주세요.";
      console.error("로그인 실패:", errorMsg);
      setIsError(true);
      setErrorMessage(errorMsg);
    }
  };

  return (
    <DefaultDiv>
      <div className="h-full flex flex-col items-center justify-center gap-14 pb-5">
        <div>
          {/* 로고 */}
          <img
            src={img.woori_logo}
            alt="login logo"
            className="w-[18rem] mb-[5rem] select-none"
          />

          {/* 타이틀 */}
          <Title1 text="로그인" />
        </div>

        {/* 로그인 입력 영역 */}
        <LoginForm ref={loginFormRef} isError={isError} />
        
        {/* 에러 메시지 표시 */}
        {isError && errorMessage && (
          <div className="w-full max-w-[33.5rem] mt-2">
            <p className="text-[1.2rem] text-red-500 text-center">
              {errorMessage}
            </p>
          </div>
        )}


        {/* 로그인 버튼 */}
        <div className="w-full">
          <p className="text-[1.2rem] text-gray-500 fixed bottom-[12.5rem] left-[50%] -translate-x-[50%] text-center w-full z-3">
            아직 회원이 아니신가요?{" "}
            <Link
              to="/signup/agreement"
              className="text-[1.2rem] font-medium text-green-600 transition hover:text-green-700 hover:underline"
            >
              회원가입하기
            </Link>
          </p>

          <BottomButtonWrapper>
            <DefaultButton 
              text={loginApi.loading ? "로그인 중..." : "로그인"} 
              onClick={submit}
              disabled={loginApi.loading}
            />
          </BottomButtonWrapper>
        </div>

        {/* 로그인 성공 모달 */}
        <SuccessModal
          isOpen={showSuccess}
          title="로그인 성공"
          message={`두리와 함께 즐거운 소비 관리 시작해볼까요?`}
          confirmText="시작하기"
          onConfirm={() => navigate('/home')}
        />
      </div>
    </DefaultDiv>
  );
};

export default LoginView;
