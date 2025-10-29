import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import Title1 from "@/components/title/Title1";
import DefaultButton from "@/components/button/DefaultButton";
import logo from "../assets/login/logo_login.png";
import DefaultDiv from "@/components/default/DefaultDiv";
import SuccessModal from "@/components/modal/SuccessModal";
import LoginForm, { LoginFormRef } from "@/components/login/LoginForm";

const LoginView = () => {
  const navigate = useNavigate();
  const formRef = useRef<LoginFormRef>(null);

  const [showSuccess, setShowSuccess] = useState(false);

  const handleLoginClick = async () => {
    const success = await formRef.current?.handleLogin();

    if (success) {
      setShowSuccess(true);
    } else {
      // 로그인 실패 시, 현재 화면 유지
      console.log("로그인 실패");
    }
  };

  return (
    <DefaultDiv>
      <div className="pt-[1rem] flex flex-col items-center">
        {/* 로고 */}
        <img
          src={logo}
          alt="login logo"
          className="w-[18rem] mb-[8rem] select-none"
        />

        {/* 타이틀 */}
        <div className="mb-[8rem]">
          <Title1 text="로그인" />
        </div>

        {/* 로그인 입력 영역 */}
        <LoginForm ref={formRef} />

        {/* 하단 회원가입 링크 */}
        <p className="text-[1.2rem] text-gray-500 mb-[1rem]">
          아직 회원이 아니신가요?{" "}
          <Link
            to="/signup/agreement"
            className="text-[1.2rem] font-medium text-green-600 transition hover:text-green-700 hover:underline"
          >
            회원가입하기
          </Link>
        </p>

        {/* 로그인 버튼 */}
        <div className="w-full max-w-[33.5rem] mx-auto">
          <DefaultButton
            text="로그인"
            className="max-w-[33.5rem] w-full"
            onClick={handleLoginClick}
          />
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
