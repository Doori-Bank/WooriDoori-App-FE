import { useState } from "react";
import { img } from "@/assets/img";
import DefaultButton from "@/components/button/DefaultButton";
import DefaultDiv from "@/components/default/DefaultDiv";
import Title1 from "@/components/title/Title1";
import InputBox from "@/components/input/InputBox";
import ConfirmModal from "@/components/modal/ConfirmModal";
import ChoiceModal from "@/components/modal/ChoiceModal";

const NewPwView = () => {
  const [tempPw, setTempPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showChoiceModal, setShowChoiceModal] = useState(false);

  // ✅ 비밀번호 유효성 검사 (영문 또는 숫자, 10자 이상)
  const isValidPassword = (pw: string) => /^[A-Za-z0-9]{10,}$/.test(pw);

  const handleConfirm = () => {
    if (!isValidPassword(newPw)) {
      setErrorMsg("비밀번호는 숫자 또는 영문 10자 이상으로 설정해야 합니다.");
      return;
    }

    if (newPw !== confirmPw) {
      setErrorMsg("비밀번호가 일치하지 않습니다!");
      return;
    }

    setErrorMsg("");
    setShowConfirmModal(true);
  };

  const handleConfirmModalConfirm = () => {
    setShowConfirmModal(false);
    window.location.href = "/login";
  };

  const handleChoiceModalConfirm = () => {
    setShowChoiceModal(false);
    window.location.href = "/login";
  };

  const handleChoiceModalCancel = () => {
    setShowChoiceModal(false);
  };

  return (
    <DefaultDiv>
      <div className="h-16" />
      <img src={img.wooridoorilogo} alt="" className="w-60 mx-auto" />
      <div className="h-8" />

      <Title1 text="비밀번호 재설정" />
      <div className="h-16" />

      <div>
        <h3 className="font-bold">임시비밀번호</h3>
        <div className="h-4" />
        <InputBox
          placeholder="임시비밀번호를 입력해주세요"
          value={tempPw}
          onChange={(e) => setTempPw(e.target.value)}
        />
        <div className="h-12" />

        <h3 className="font-bold">새 비밀번호</h3>
        <div className="h-4" />
        <InputBox
          placeholder="새로 설정할 비밀번호를 입력해주세요"
          value={newPw}
          onChange={(e) => setNewPw(e.target.value)}
        />
        <div className="h-12" />

        <h3 className="font-bold">새 비밀번호 확인</h3>
        <div className="h-4" />
        <InputBox
          placeholder="새로 설정할 비밀번호를 재입력해주세요"
          value={confirmPw}
          onChange={(e) => {
            setConfirmPw(e.target.value);
            setErrorMsg("");
          }}
        />

        {errorMsg && <p className="text-red-500 mt-2">{errorMsg}</p>}

        <div className="h-32" />

        <div className="flex justify-center pt-4 gap-8">
          <DefaultButton
            text="SKIP"
            className="bg-gray-300 text-gray-600 hover:bg-gray-400 active:scale-[0.98] flex-[0.6]"
            onClick={() => setShowChoiceModal(true)}
          />
          <DefaultButton
            text="확인"
            className="flex-[1.5]"
            onClick={handleConfirm}
          />
        </div>
      </div>

      {showConfirmModal && (
        <ConfirmModal
          isOpen
          message="비밀번호 재설정이 완료되었습니다."
          onConfirm={handleConfirmModalConfirm}
        />
      )}

      {showChoiceModal && (
        <ChoiceModal
          isOpen
          message="비밀번호 재설정을 건너뛰시겠습니까?"
          subMessage="확인하면 로그인 페이지로 돌아갑니다."
          onConfirm={handleChoiceModalConfirm}
          onCancel={handleChoiceModalCancel}
          btnTitle="확인"
          btnColor="text-blue-500"
        />
      )}
    </DefaultDiv>
  );
};

export default NewPwView;
