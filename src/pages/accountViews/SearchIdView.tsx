import { img } from "@/assets/img";
import DefaultButton from "@/components/button/DefaultButton";
import BottomButtonWrapper from "@/components/button/BottomButtonWrapper";
import IconButton from "@/components/button/IconButton";
import DefaultDiv from "@/components/default/DefaultDiv";
import InputBox from "@/components/input/InputBox";
import Title1 from "@/components/title/Title1";
import { useState } from "react";

const SearchIdView = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // 이름과 전화번호가 모두 유효하면 버튼 활성화
  const isFormValid = name.trim().length > 0 && /^[0-9]{11}$/.test(phone.trim());

  return (
    <DefaultDiv>
      {/* 뒤로가기 버튼 */}
      <IconButton
        src={img.Vector} // 실제 이미지 파일
        alt="뒤로가기"
        width={6}
        height={18}
        onClick={() => (window.location.href = "/login")}
      />

      <div className="h-8" />

      <img src={img.woori_logo} alt="" className="w-60 mx-auto" />

      <div className="h-12" />

      <Title1 text="아이디 찾기" />

      <div className="h-8" />

      <h3 className="text-center">
        이름과 전화번호를 입력하면 가입하신 이메일 주소를 알려드릴게요
      </h3>
      <div className="h-8" />

      <div className="mt-6 space-y-6 flex flex-col items-center">

        <div className="w-full max-w-[30rem]">
          <p className="font-bold">이름</p>
          <div className="h-4" />
          <InputBox
            placeholder="이름을 입력해주세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="w-full max-w-[30rem]">
          <p className="font-bold">전화번호</p>
          <div className="h-4" />
          <InputBox
            placeholder="'-'를 제외한 숫자만 입력해주세요"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="h-40" />

        {/* 확인 버튼 */}
        <BottomButtonWrapper>
          <DefaultButton 
            text="확인"
            disabled={!isFormValid}
            onClick={() => (window.location.href = "/yourid")} 
          />
        </BottomButtonWrapper>
      </div>
    </DefaultDiv>
  );
};

export default SearchIdView;
