import { useState } from "react";
import DefaultDiv from "../../../components/default/DefaultDiv";
import Header from "../../../components/default/Header";
import InputBox from "../../../components/input/InputBox";
import DefaultButton from "../../../components/button/DefaultButton";
import EmailVerification from "../../../components/signUp/EmailVerification";
import PasswordFields from "../../../components/signUp/PasswordFields";
import BirthInput from "../../../components/signUp/BirthInput";
import SuccessModal from "../../../components/modal/SuccessModal";
import { useNavigate } from "react-router-dom";

const SignUpFormView = () => {
  const navigate = useNavigate();

  // 상태 정의
  const [email, setEmail] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
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
    name &&
    phone.length === 11 &&
    !nameError &&
    !phoneError &&
    birthValid;

  // 완료 버튼 클릭
  const handleSubmitClick = async () => {
    if (!isFormValid) {
      alert("모든 항목을 올바르게 입력해주세요.");
      return;
    }

    try {
      // 실제 서버 요청이 들어간다고 가정 (테스트용)
      // await api.post("/signup", { email, password, name, phone });

      // 테스트용 성공 시뮬레이션
      const success = Math.random() > 0.1; // 10% 확률로 실패
      if (!success) throw new Error("서버 응답 오류");

      // 회원가입 성공 모달 표시
      setShowSignUpSuccess(true);
    } catch (error) {
      console.error("회원가입 중 오류:", error);
      alert("예기치 못한 오류로 회원가입에 실패했습니다.");
      navigate("/signUp/Fail");
    }
  };

  return (
    <DefaultDiv>
      <Header
        title="회원가입"
        showBack
        showClose
        onBack={() => navigate(-1)}
        onClose={() => navigate("/login")}
      />

      <div className="pt-[4rem] flex flex-col items-center">
        <form className="w-full max-w-[34rem] flex flex-col gap-[2rem]">
          {/* 이메일 인증 */}
          <EmailVerification
            email={email}
            setEmail={setEmail}
            onVerified={() => setIsEmailVerified(true)}
          />

          {/* 비밀번호 입력 */}
          <PasswordFields onValidChange={setIsPasswordValid} />

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
          <BirthInput onValidChange={setBirthValid} />

          {/* 완료 버튼 */}
          <div className="mt-[3rem] w-full">
            <DefaultButton
              text="완료"
              className={`max-w-[33.5rem] w-full py-[1.4rem] text-[1.3rem] rounded-2xl transition ${isFormValid
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              disabled={!isFormValid}
              onClick={handleSubmitClick}
            />
          </div>
        </form>

        {/* 회원가입 성공 모달 */}
        <SuccessModal
          isOpen={showSignUpSuccess}
          title="회원가입 완료!"
          message="축하합니다! 회원가입이 성공적으로 완료되었습니다.\n이제 로그인하여 서비스를 이용해보세요."
          confirmText="로그인하기"
          onConfirm={() => navigate('/login')}
        />
      </div>
    </DefaultDiv>
  );
};

export default SignUpFormView;
