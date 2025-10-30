import DefaultDiv from "@/components/default/DefaultDiv";
import DefaultButton from "@/components/button/DefaultButton";
import BottomButtonWrapper from "@/components/button/BottomButtonWrapper";
import image from "@/assets/doori/doori_crying.png";

const SignUpSuccessView = () => {
  return (
    <DefaultDiv>
      <div className="flex flex-col items-center justify-center mt-[10rem]">
        {/* 실패 이미지 */}
        <img
          src={image}
          alt="회원가입 실패 도리"
          className="w-[22rem] mb-[4rem] select-none"
        />

        {/* 메인 텍스트 */}
        <h1 className="text-[2rem] font-bold text-gray-800 mb-[1rem] text-center">
          회원가입에 실패했습니다
        </h1>

        {/* 서브 텍스트 */}
        <p className="text-[1.4rem] text-gray-500 mb-[8rem] text-center">
          일시적인 오류로 회원가입에 실패했습니다. <br />
          다시 시도해 주세요.
        </p>

        {/* 완료 버튼 */}
        <BottomButtonWrapper>
          <DefaultButton
            text="홈으로"
            onClick={() => (window.location.href = "/login")}
          />
        </BottomButtonWrapper>
      </div>
    </DefaultDiv>
  );
};

export default SignUpSuccessView;
