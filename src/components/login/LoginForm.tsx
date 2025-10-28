import { useState, forwardRef, useImperativeHandle } from "react";

export interface LoginFormRef {
  handleLogin: () => boolean;
}

const LoginForm = forwardRef<LoginFormRef>((_, ref) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [pwError, setPwError] = useState("");

  // 이메일 정규식
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // 이메일 입력 처리
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setEmail(value);

    if (!value) {
      setEmailError("이메일을 입력해주세요.");
    } else if (!emailRegex.test(value)) {
      setEmailError("올바른 이메일 주소를 입력해주세요.");
    } else {
      setEmailError("");
    }
  };

  // 비밀번호 입력 처리
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    if (!value) setPwError("비밀번호를 입력해주세요.");
    else if (value.length < 6)
      setPwError("비밀번호는 6자리 이상이어야 합니다.");
    else setPwError("");
  };

  // 외부에서 실행할 수 있는 로그인 검증 로직
  useImperativeHandle(ref, () => ({
    handleLogin: () => {
      // 이메일 검증
      if (!email) {
        setEmailError("이메일을 입력해주세요.");
        return false;
      }
      if (!emailRegex.test(email)) {
        setEmailError("올바른 이메일 주소를 입력해주세요.");
        return false;
      }

      // 비밀번호 검증
      if (!password) {
        setPwError("비밀번호를 입력해주세요.");
        return false;
      }
      if (password.length < 6) {
        setPwError("비밀번호는 6자리 이상이어야 합니다.");
        return false;
      }

      // 테스트용 계정
      if (email === "123@test.com" && password === "123456") {
        alert("로그인 성공! (테스트 계정)");
        return true;
      } else {
        alert("로그인 실패: 이메일 또는 비밀번호를 확인해주세요.");
        return false;
      }
    },
  }));

  return (
    <div className="w-full mx-auto mb-[24rem] flex flex-col gap-[1.4rem] items-center">
      {/* 이메일 입력 */}
      <div className="w-full max-w-[33.5rem]">
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="이메일 주소를 입력해주세요"
          className={`w-full px-4 py-3 rounded-lg outline-none border text-gray-800 bg-white transition ${
            emailError ? "border-red-400" : "border-gray-300"
          }`}
        />
        {emailError && (
          <p className="text-[1.2rem] text-red-500 mt-[0.4rem]">
            {emailError}
          </p>
        )}
      </div>

      {/* 비밀번호 입력 */}
      <div className="relative w-full max-w-[33.5rem]">
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="비밀번호를 입력해주세요"
          className={`w-full px-4 py-3 rounded-lg outline-none border text-gray-800 bg-white transition ${
            pwError ? "border-red-400" : "border-gray-300"
          }`}
        />
        {pwError && (
          <p className="text-[1.2rem] text-red-500 mt-[0.4rem]">{pwError}</p>
        )}

        {/* 아이디 / 비밀번호 찾기 */}
        <div className="absolute right-0 bottom-[-2.8rem] flex gap-[1.6rem] text-[1.2rem] text-gray-500">
          <a
            href="/find-id"
            className="hover:text-green-600 hover:underline transition"
          >
            아이디 찾기
          </a>
          <span>|</span>
          <a
            href="/find-password"
            className="hover:text-green-600 hover:underline transition"
          >
            비밀번호 찾기
          </a>
        </div>
      </div>
    </div>
  );
});

export default LoginForm;
