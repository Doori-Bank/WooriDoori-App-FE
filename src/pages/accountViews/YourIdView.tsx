import { img } from "@/assets/img";
import DefaultButton from "@/components/button/DefaultButton";
import BottomButtonWrapper from "@/components/button/BottomButtonWrapper";
import DefaultDiv from "@/components/default/DefaultDiv";
import Title1 from "@/components/title/Title1";

const YourIdView = () => {
  return (
    <DefaultDiv>
      <div className="h-16" />
      <img src={img.woori_logo} alt="" className="w-60 mx-auto" />
      <div className="h-8" />

      <div>
        <Title1 text="아이디 찾기" />
        <div className="h-4" />
        <h3 className="text-center">
          회원님의 아이디를 찾았어요👏
        </h3>

        <div className="h-16" />
        <div className="relative w-[300px] h-[250px] mx-auto">
          <img
            src={img.goindol}
            alt="고인돌 이미지"
            className="w-full h-full object-none"
          />
          <p className="absolute left-1/2 top-1/4 -translate-x-1/2 text-white text-3xl font-bold">
            example@gmail.com
          </p>
        </div>

        <BottomButtonWrapper>
          <DefaultButton
            text="확인"
            onClick={() => (window.location.href = "/login")}
          />
        </BottomButtonWrapper>
      </div>
    </DefaultDiv>
  );
};

export default YourIdView;
