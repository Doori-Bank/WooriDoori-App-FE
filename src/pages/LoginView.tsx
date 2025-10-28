import { Link, useNavigate } from "react-router-dom";
import { useRef } from "react";
import Title1 from "../components/title/Title1";
import DefaultButton from "../components/button/DefaultButton";
import logo from "../assets/login/logo_login.png";
import DefaultDiv from "../components/default/DefaultDiv";
import LoginForm, { LoginFormRef } from "../components/login/LoginForm";

const LoginView = () => {
  const navigate = useNavigate();
  const formRef = useRef<LoginFormRef>(null);

  const handleLoginClick = () => {
    const success = formRef.current?.handleLogin();

    if (success) {
      navigate("/home");
    } else {
      // 로그인 실패 시, 현재 화면 유지 + 입력 리셋
      navigate("/login"); // 현재 페이지 다시 로드
    }
  };

  return (
    <DefaultDiv>
      <div className="pt-[3rem] flex flex-col items-center">
        {/* 로고 */}
        <img
          src={logo}
          alt="login logo"
          className="w-[18rem] mb-[1.5rem] select-none"
        />

        {/* 타이틀 */}
        <div className="mb-[10rem]">
          <Title1 text="로그인" />
        </div>

        {/* 로그인 입력 영역 */}
        <LoginForm ref={formRef} />

        {/* 하단 회원가입 링크 */}
        <p className="text-[1rem] text-gray-500 mb-[1rem]">
          아직 회원이 아니신가요?{" "}
          <Link
            to="/signup/agreement"
            className="text-green-600 font-medium hover:text-green-700 hover:underline transition"
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
      </div>
    </DefaultDiv>
  );
};

export default LoginView;
