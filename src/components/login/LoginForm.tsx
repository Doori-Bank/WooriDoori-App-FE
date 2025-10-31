import { useState, forwardRef } from "react";
import { Link } from "react-router-dom";

// export interface LoginFormRef {
//   handleLogin: () => Promise<boolean>;
//   isError?: boolean,
// }

const LoginForm = ({isError = false}:{ isError?: boolean })  => {
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
  // useImperativeHandle(ref, () => ({
  //   handleLogin: async () => {
  //     // 이메일 검증
  //     if (!email) {
  //       setEmailError("이메일을 입력해주세요.");
  //       return false;
  //     }
  //     if (!emailRegex.test(email)) {
  //       setEmailError("올바른 이메일 주소를 입력해주세요.");
  //       return false;
  //     }

  //     // 비밀번호 검증
  //     if (!password) {
  //       setPwError("비밀번호를 입력해주세요.");
  //       return false;
  //     }
  //     if (password.length < 6) {
  //       setPwError("비밀번호는 6자리 이상이어야 합니다.");
  //       return false;
  //     }

  //     try {
  //       // API 호출
  //       const result = await loginUser(email, password);

  //       if (result.success) {
  //         // 로그인 성공 시 사용자 정보를 localStorage에 저장
  //         localStorage.setItem('userInfo', JSON.stringify(result.data));
  //         return true;
  //       } else {
  //         return false;
  //       }
  //     } catch (error) {
  //       return false;
  //     }
  //   },
  // }));

  return (
    <div className="w-full mx-auto mb-[10rem] flex flex-col gap-[1rem] items-center">
      {/* 이메일 입력 */}
      <div className="w-full max-w-[33.5rem]">
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="이메일 주소를 입력해주세요"
          className={`w-full px-6 py-4 rounded-lg outline-none border text-gray-800 bg-white transition text-[1.3rem] ${
            emailError || isError ? "border-red-400" : "border-gray-300"
          }`}
        />
              <p
          className={`text-[1.2rem] mt-[0.4rem] h-[1.6rem] transition-colors duration-200 ${
            emailError ? "text-red-500" : "text-transparent"
          }`}
        >
          {emailError || "placeholder"}
        </p>

      </div>

      {/* 비밀번호 입력 */}
      <div className="relative w-full max-w-[33.5rem]">
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="비밀번호를 입력해주세요"
          className={`w-full px-6 py-4 rounded-lg outline-none border text-gray-800 bg-white transition text-[1.3rem] ${
            pwError || isError  ? "border-red-400" : "border-gray-300"
          }`}
        />

         <p
          className={`text-[1.2rem] mt-[0.4rem] h-[1.6rem] transition-colors duration-200 ${
            pwError ? "text-red-500" : "text-transparent"
          }`}
        >
          {pwError || "placeholder"}
        </p>

        {/* 아이디 / 비밀번호 찾기 */}
        <div className="absolute right-0 bottom-[-2rem] flex gap-[1.6rem] text-gray-500">
          <Link
            to="/searchid"
            className="text-xl transition hover:text-green-600 hover:underline"
          >
            아이디 찾기
          </Link>
          <span className="text-xl">|</span>
          <Link
            to="/resetpw"
            className="text-xl transition hover:text-green-600 hover:underline"
          >
            비밀번호 찾기
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
