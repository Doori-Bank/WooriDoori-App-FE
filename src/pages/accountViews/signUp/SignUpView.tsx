import { useState, useEffect } from "react";
import DefaultDiv from "../../../components/default/DefaultDiv";
import InputBox from "../../../components/input/InputBox";
import DefaultButton from "../../../components/button/DefaultButton";
import BottomButtonWrapper from "@/components/button/BottomButtonWrapper";
import EmailVerification from "../../../components/signUp/EmailVerification";
import PasswordFields from "../../../components/signUp/PasswordFields";
import BirthInput from "../../../components/signUp/BirthInput";
import SuccessModal from "../../../components/modal/SuccessModal";
import { useNavigate } from "react-router-dom";

import axiosInstance from "@/api/axiosInstance";

const SignUpFormView = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 🔥 이전 로그인 사용자 완전 로그아웃
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    
  }, []);

  // 상태 정의
  const [email, setEmail] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const [password, setPassword] = useState(""); // 추가: 비밀번호 저장

  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  // 추가: birthDate / birthBack 저장
  const [birthDate, setBirthDate] = useState("");
  const [birthBack, setBirthBack] = useState("");

  const [birthValid, setBirthValid] = useState(false);
  const [showSignUpSuccess, setShowSignUpSuccess] = useState(false);

  // 이름: 한글/영문만 허용
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const native = e.nativeEvent as InputEvent | any;

    if (native?.isComposing || native?.inputType === "insertCompositionText") {
      setName(value);
      return;
    }

    if (/^[가-힣a-zA-Z]*$/.test(value)) {
      setName(value);
      setNameError("");
    } else {
      setNameError("이름은 한글 또는 영문만 입력 가능합니다.");
    }
  };

  // 전화번호: 숫자만 + 11자리
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/[^0-9]/g, "").slice(0, 11);
    setPhone(digits);

    if (digits.length === 0) {
      setPhoneError("");
    } else if (digits.length < 11) {
      setPhoneError("전화번호는 11자리여야 합니다.");
    } else {
      setPhoneError("");
    }
  };

  // 모든 항목이 통과해야 true
  const isFormValid =
    isEmailVerified &&
    isPasswordValid &&
    password &&
    name &&
    phone.length === 11 &&
    !nameError &&
    !phoneError &&
    birthValid;

  const handleSubmitClick = async () => {
    if (!isFormValid) {
      alert("모든 항목을 올바르게 입력해주세요.");
      return;
    }

    try {
      const res = await axiosInstance.post("/auth/join", {
        id: email,
        password: password,
        name: name,
        phone: phone,
        birthDate: birthDate,
        birthBack: birthBack,
      }
        , {
          headers: {
            Authorization: ""
          }
        }
      );


      console.log("회원가입 성공:", res.data);

      // 🔥 가입 후 자동 로그인 토큰 저장
      const tokens = res.data.resultData?.tokens;
      if (tokens) {
        localStorage.setItem("accessToken", tokens.accessToken);
        localStorage.setItem("refreshToken", tokens.refreshToken);
      }

      setShowSignUpSuccess(true);

    } catch (error) {
      console.error("회원가입 중 오류:", error);
      navigate("/signUp/Fail");
    }
  };

  return (
    <DefaultDiv
      isHeader={true}
      title="회원가입"
      isShowBack={true}
      isShowClose={true}
      isShowSetting={false}
      onBack={() => navigate(-1)}
      onClose={() => navigate("/login")}
      isMainTitle={false}
    >

      <div className="pt-[4rem] flex flex-col items-center">
        <div className="w-full max-w-[34rem] flex flex-col gap-[2rem]">
          {/* 이메일 인증 */}
          <EmailVerification
            email={email}
            setEmail={setEmail}
            onVerified={() => setIsEmailVerified(true)}
          />

          {/* 비밀번호 입력 */}
          <PasswordFields
            onValidChange={setIsPasswordValid}
            onPasswordChange={setPassword}
          />

          {/* 이름 */}
          <div>
            <label className="block text-[1.4rem] font-bold text-gray-700 mb-[0.8rem]">
              이름
            </label>
            <InputBox
              value={name}
              onChange={handleNameChange}
              placeholder="이름을 입력해주세요"
            />
            {nameError && (
              <p className="text-red-500 text-[1.2rem] mt-[0.4rem]">
                {nameError}
              </p>
            )}
          </div>

          {/* 전화번호 */}
          <div>
            <label className="block text-[1.4rem] font-bold text-gray-700 mb-[0.8rem]">
              전화번호
            </label>
            <InputBox
              value={phone}
              onChange={handlePhoneChange}
              placeholder="‘-’를 제외한 숫자만 입력해주세요"
            />
            {phoneError && (
              <p className="text-red-500 text-[1.2rem] mt-[0.4rem]">
                {phoneError}
              </p>
            )}
          </div>

          {/* 생년월일 */}
          <BirthInput
            onValidChange={setBirthValid}
            setBirthDate={setBirthDate}
            setBirthBack={setBirthBack}

          />

          {/* 완료 버튼 */}
          <BottomButtonWrapper>
            <DefaultButton
              text="완료"
              disabled={!isFormValid}
              onClick={handleSubmitClick}
            />
          </BottomButtonWrapper>
        </div>

        {/* 회원가입 성공 모달 */}
        <SuccessModal
          isOpen={showSignUpSuccess}
          title="회원가입 완료!"
          message="축하합니다! 회원가입이 성공적으로 완료되었습니다."
          confirmText="홈으로 이동"
          onConfirm={() => navigate('/home')}
        />
      </div>
    </DefaultDiv>
  );
};

export default SignUpFormView;
