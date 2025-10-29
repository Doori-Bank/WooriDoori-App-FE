import { useState } from "react";
import DefaultDiv from "../../../components/default/DefaultDiv";
import DefaultButton from "../../../components/button/DefaultButton";
import Header from "../../../components/default/Header";
import image from "../assets/login/signUp.png";
import AgreementForm from "../../../components/signUp/AgreementForm";
import { useNavigate } from "react-router-dom";

const SignUpAgreementView = () => {
  const navigate = useNavigate();
  const [isAgreed, setIsAgreed] = useState(false);

  return (
    <DefaultDiv>
      <Header
        title="회원가입"
        showBack
        showClose
        onBack={() => navigate(-1)}
        onClose={() => navigate("/login")}
      />

      {/* 본문 */}
      <div className="pt-[8rem] flex flex-col items-center">
        <div className="w-[34rem] text-left mb-[3rem]">
          <p className="text-[2rem] font-bold text-gray-800 leading-relaxed">
            아래 약관을 동의하신 후<br /> 다음을 눌러주세요.
          </p>
        </div>

        <img src={image} alt="회원가입 일러스트" className="w-[20rem] mb-[4rem] select-none" />

        {/* 필수 2항목 동의 여부 전달 */}
        <AgreementForm onValidChange={setIsAgreed} />

        <div className="w-[34rem] mx-auto flex justify-center">
          <DefaultButton
            text="다음"
            className={`max-w-[33.5rem] w-full py-[1.3rem] text-[1.2rem] rounded-lg transition ${isAgreed
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            disabled={!isAgreed}
            onClick={() => {
              if (!isAgreed) {
                alert("필수 항목(회원약관, 개인정보)에 모두 동의해주세요.");
                return;
              }
              navigate("/signUp/signUp");
            }}
          />
        </div>
      </div>
    </DefaultDiv>
  );
};

export default SignUpAgreementView;
