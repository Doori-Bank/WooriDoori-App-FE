import { img } from "@/assets/img";
import DefaultButton from "@/components/button/DefaultButton";
import IconButton from "@/components/button/IconButton";
import DefaultDiv from "@/components/default/DefaultDiv";
import InputBox from "@/components/input/InputBox";
import Title1 from "@/components/title/Title1";
import { useState } from "react";

const ResetPwView = () => {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isFormValid = name.trim().length > 0 && emailRegex.test(id.trim());

  const handleConfirm = () => {
    if (!emailRegex.test(id.trim())) {
      setErrorMsg("유효한 이메일 주소를 입력해주세요.");
      return;
    }

    if (id !== "example@gmail.com") {
      setErrorMsg("존재하지 않는 아이디입니다.");
      return;
    }

    window.location.href = "/newpw";
  };

  return (
    <DefaultDiv>
      {/* 뒤로가기 버튼 */}
      <IconButton
        src={img.Vector}
        alt="뒤로가기"
        width={6}
        height={18}
        onClick={() => (window.location.href = "/login")}
      />

      <div className="h-8" />

      {/* 로고 */}
      <img src={img.wooridoorilogo} alt="" className="w-60 mx-auto" />
      <div className="h-8" />

      {/* 컨텐츠 영역 */}
      <div className="flex flex-col items-center space-y-6 mt-6 w-full max-w-[30rem] mx-auto">
        <Title1 text="비밀번호 찾기" />

        <h3 className="text-center">
          임시 비밀번호를 발급받을 계정을 입력해주세요
        </h3>

      <div className="h-8" />
        <InputBox
          placeholder="이름을 입력해주세요"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setErrorMsg("");
          }}
        />

        {/* 이메일 입력 */}
        <InputBox
          placeholder="이메일을 입력해주세요"
          value={id}
          onChange={(e) => {
            setId(e.target.value);
            setErrorMsg("");
          }}
        />

        {/* 에러 메시지 */}
        {errorMsg && <p className="text-red-500 mt-2 text-center">{errorMsg}</p>}
      <div className="h-48" />
        {/* 확인 버튼 */}
        <DefaultButton
          text="확인"
          disabled={!isFormValid}
          onClick={handleConfirm}
        />
      </div>
    </DefaultDiv>
  );
};

export default ResetPwView;
