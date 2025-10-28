import { useState, useEffect } from "react";
import InputBox from "../input/InputBox";

interface EmailVerificationProps {
  email: string;
  setEmail: (value: string) => void;
  onVerified?: () => void;
}

const EmailVerification = ({ email, setEmail, onVerified }: EmailVerificationProps) => {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [inputCode, setInputCode] = useState(""); // 사용자가 입력한 코드
  const [serverCode, setServerCode] = useState(""); // 실제 서버에서 받은 코드 (예시용)
  const [isVerified, setIsVerified] = useState(false);

  // 타이머
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isCodeSent && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isCodeSent, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // 이메일 형식 검사
  const validateEmailFormat = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 이메일 중복확인
  const handleEmailCheck = () => {
    if (!email) {
      alert("이메일을 입력해주세요.");
      return;
    }
    if (!validateEmailFormat(email)) {
      alert("올바른 이메일 형식이 아닙니다.");
      return;
    }

    const available = email !== "test@example.com";
    setIsAvailable(available);

    if (!available) {
      alert("이미 사용 중인 이메일입니다.");
      setIsCodeSent(false);
      setTimeLeft(0);
    } else {
      handleSendCode(true);
    }
  };

  // 인증번호 전송
  const handleSendCode = (forceSend = false) => {
    if (!forceSend && isAvailable !== true) {
      return alert("먼저 사용 가능한 이메일을 확인해주세요.");
    }
    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    setServerCode(generatedCode);
    console.log("✅ [테스트용 인증번호]", generatedCode);
    setIsCodeSent(true);
    setTimeLeft(180);
    setIsVerified(false);
    setInputCode("");
  };

  // 인증번호 확인
  const handleVerifyCode = () => {
    if (!inputCode) return alert("인증번호를 입력해주세요.");

    // 타이머 만료 시 인증 불가
    if (timeLeft <= 0) {
      alert("인증 시간이 만료되었습니다. 인증번호를 다시 요청해주세요.");
      setIsCodeSent(false);
      setInputCode("");
      return;
    }

    if (inputCode === serverCode) {
      alert("인증이 완료되었습니다!");
      setIsVerified(true);
      setIsCodeSent(false);
      setTimeLeft(0);
      onVerified?.();
    } else {
      alert("인증번호가 일치하지 않습니다.");
      setIsVerified(false);
    }
  };

  return (
    <div className="space-y-[1.6rem]">
      {/* 이메일 입력 */}
      <div>
        <label className="block text-[1.4rem] font-bold text-gray-700 mb-[0.8rem]">
          아이디
        </label>
        <div className="flex gap-[1rem] items-start">
          <div className="flex-1 relative">
            <InputBox
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력해주세요"
              borderColor={
                isAvailable === false
                  ? "border-red-400"
                  : isAvailable === true
                  ? "border-blue-400"
                  : "border-gray-300"
              }
            />
            {isAvailable === false && (
              <p className="text-[1rem] text-red-500 mt-[0.4rem]">
                사용 중인 아이디가 있습니다.
              </p>
            )}
            {isAvailable === true && (
              <p className="text-[1rem] text-blue-500 mt-[0.4rem]">
                사용 가능한 아이디입니다. 인증번호를 입력해주세요.
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleEmailCheck}
            className="px-[1rem] py-[0.8rem] border rounded-lg text-[1rem] font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
          >
            중복확인
          </button>
        </div>
      </div>

      {/* 인증번호 입력 */}
      <div className="mt-[1rem]">
        <label className="block text-[1.4rem] font-bold text-gray-700 mb-[0.8rem]">
          인증번호
        </label>
        <div className="flex gap-[1rem] items-center">
          <div className="relative w-[27rem]">
            <InputBox
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="인증번호를 입력해주세요"
            />
            {isCodeSent && timeLeft > 0 && (
              <span className="absolute right-[1rem] top-1/2 -translate-y-1/2 text-red-500 text-[1.2rem]">
                {formatTime(timeLeft)}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => handleSendCode()}
            className={`font-medium underline transition ${
              isAvailable === true
                ? "text-gray-800 hover:text-gray-500"
                : "text-gray-400 cursor-not-allowed"
            }`}
          >
            {isCodeSent ? "재전송" : "재전송"}
          </button>
        </div>

        <button
          type="button"
          onClick={handleVerifyCode}
          className={`px-[1rem] py-[0.8rem] float-right border rounded-lg text-[1rem] font-medium transition ${
            isVerified
              ? "text-white bg-gray-500 border-gray-500"
              : "text-gray-700 bg-gray-100 hover:bg-gray-200"
          }`}
        >
          {isVerified ? "인증 완료" : "확인하기"}
        </button>
      </div>
    </div>
  );
};

export default EmailVerification;
