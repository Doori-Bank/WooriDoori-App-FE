import { img } from "@/assets/img";
import DefaultButton from "@/components/button/DefaultButton";
import DefaultDiv from "@/components/default/DefaultDiv";
import InputBox from "@/components/input/InputBox";
import Title1 from "@/components/title/Title1";
import { useState } from "react";
import BackButton from "@/components/button/BackButton";



const SearchIdView = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // 이름과 전화번호가 모두 유효하면 버튼 활성화
  const isFormValid =
    name.trim().length > 0 && /^[0-9]{11}$/.test(phone.trim());

  return (
    <DefaultDiv>
        <BackButton
            size={20}
            onClick={() => (window.location.href = "/login")}
        />

        <div className="h-12" />
        <img src={img.wooridoorilogo} alt="" className="w-60 mx-auto"/>
        <div className="h-8" />
      <Title1 text="아이디 찾기" />

        <div className="h-8" />

      <h3 className="text-center" >
        이름과 전화번호를 입력하면 가입하신 이메일 주소를 알려드릴게요
      </h3>
        <div className="h-12" />
        
      <div className="mt-6 space-y-6">
        {/* 이름 입력 */}
        <div>
          <p className="font-bold">이름</p>
          <div className="h-4" />
          <InputBox
            placeholder="이름을 입력해주세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="h-4" />

        <div>
          <h3 className="font-bold">전화번호</h3>
          <div className="h-4" />
          <InputBox
            placeholder="'-'를 제외한 숫자만 입력해주세요"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="h-32" />

        <div className="flex justify-center pt-4">
          <DefaultButton 
            text="확인"
            disabled={!isFormValid}
            onClick={() => (window.location.href = "/yourid")}/>
        </div>
      </div>
    </DefaultDiv>
  );
};


export default SearchIdView;