import { useState } from "react";
import DefaultDiv from "@/components/default/DefaultDiv";
import DefaultButton from "@/components/button/DefaultButton";
import BottomButtonWrapper from "@/components/button/BottomButtonWrapper";
import image from "@/assets/login/signUp.png";
import AgreementForm from "@/components/signUp/AgreementForm";
import { useNavigate } from "react-router-dom";

const SignUpAgreementView = () => {
  const navigate = useNavigate();
  const [isAgreed, setIsAgreed] = useState(false);

  const handleClose = () => navigate("/login");

  return (
    <DefaultDiv
      isHeader={true}
      title="회원가입"
      isShowBack={false}
      isShowClose={true}
      isShowSetting={false}
      onClose={handleClose}
      isMainTitle={false}
      className="overflow-hidden"
    >

      {/* 본문 */}
      <div className="flex flex-col flex-1 items-center justify-start pt-[3rem] h-ful">
        <div className="flex flex-col items-center h-[50%] justify-end">
          <div className="w-[34rem] text-left mb-[3rem]">
            <p className="text-[2rem] font-bold text-gray-800 leading-relaxed">
              아래 약관을 동의하신 후<br /> 다음을 눌러주세요.
            </p>
          </div>

          <img src={image} alt="회원가입 일러스트" className="w-[20rem]" />
        </div>

        {/* 필수 2항목 동의 여부 전달 */}
        <div>
          <div className="w-full fixed bottom-[12.5rem] left-[50%] -translate-x-[50%] flex flex-col items-center">
            <AgreementForm onValidChange={setIsAgreed} />
          </div>

          <BottomButtonWrapper>
            <DefaultButton
              text="다음"
              disabled={!isAgreed}
              onClick={() => {
                if (!isAgreed) {
                  alert("필수 항목(회원약관, 개인정보)에 모두 동의해주세요.");
                  return;
                }
                navigate("/signUp/signUp");
              }}
            />
          </BottomButtonWrapper>
        </div>
      </div>
    </DefaultDiv>
  );
};

export default SignUpAgreementView;
