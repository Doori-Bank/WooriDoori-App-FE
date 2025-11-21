import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { img } from "@/assets/img";
import DefaultButton from "@/components/button/DefaultButton";
import DefaultDiv from "@/components/default/DefaultDiv";
import Title1 from "@/components/title/Title1";
import InputBox from "@/components/input/InputBox";
import ConfirmModal from "@/components/modal/ConfirmModal";
import ChoiceModal from "@/components/modal/ChoiceModal";
import { useApi } from "@/hooks/useApi";
import { apiList } from "@/api/apiList";

const NewPwView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [tempPw, setTempPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  // 각 입력창별 오류 메시지
  const [newPwError, setNewPwError] = useState("");
  const [confirmPwError, setConfirmPwError] = useState("");
  const [tempPwError, setTempPwError] = useState("");
  const [apiError, setApiError] = useState("");

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showChoiceModal, setShowChoiceModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const changePasswordApi = useApi(apiList.changePassword);

  // URL 파라미터에서 memberId 가져오기
  const searchParams = new URLSearchParams(location.search);
  const memberId = searchParams.get("id") || "";

  // 비밀번호 유효성 검사 (영문 또는 숫자, 10자 이상)
  const isValidPassword = (pw: string) => /^[A-Za-z0-9]{10,}$/.test(pw);

  // 확인 버튼
  const handleConfirm = async () => {
    let hasError = false;
    setApiError("");

    // 임시 비밀번호 체크
    if (!tempPw.trim()) {
      setTempPwError("임시 비밀번호를 입력해주세요.");
      hasError = true;
    } else {
      setTempPwError("");
    }

    // 새 비밀번호 유효성 체크
    if (!isValidPassword(newPw)) {
      setNewPwError("비밀번호는 숫자 또는 영문 10자 이상으로 설정해야 합니다.");
      hasError = true;
    } else {
      setNewPwError("");
    }

    if (newPw !== confirmPw) {
      setConfirmPwError("비밀번호가 일치하지 않습니다.");
      hasError = true;
    } else {
      setConfirmPwError("");
    }

    if (!memberId) {
      setApiError("회원 정보를 찾을 수 없습니다. 다시 시도해주세요.");
      hasError = true;
    }

    if (hasError) return;

    // 비밀번호 변경 API 호출
    setIsLoading(true);
    const result = await changePasswordApi.call(memberId, tempPw, newPw);
    setIsLoading(false);

    if (result?.success) {
      setShowConfirmModal(true);
    } else {
      setApiError(result?.resultMsg || "비밀번호 변경에 실패했습니다.");
    }
  };

  const handleConfirmModalConfirm = () => {
    setShowConfirmModal(false);
    navigate("/login");
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

      <img src={img.woori_logo} alt="" className="w-60 mx-auto" />
      <div className="h-8" />

      <div className="w-full max-w-[30rem] mx-auto flex flex-col space-y-6">
        {/* 제목 */}
        <Title1 text="비밀번호 재설정" />

        <div className="h-8" />
        <div>
          <h3 className="font-bold text-left">임시비밀번호</h3>
          <div className="h-2" />
          <InputBox
            type="password"
            placeholder="임시비밀번호를 입력해주세요"
            value={tempPw}
            isError={!!tempPwError}
            onChange={(e) => {
              setTempPw(e.target.value);
              setTempPwError("");
            }}
          />
          {tempPwError && <p className="text-red-500 mt-2">{tempPwError}</p>}
        </div>
        <div className="h-4" />

        {/* 새 비밀번호 */}
        <div>
          <h3 className="font-bold text-left">새 비밀번호</h3>
          <div className="h-2" />
          <InputBox
            type="password"
            placeholder="새로 설정할 비밀번호를 입력해주세요"
            value={newPw}
            onChange={(e) => {
              setNewPw(e.target.value);
              setNewPwError("");
            }}
          />
          {newPwError && <p className="text-red-500 mt-2">{newPwError}</p>}
        </div>
        <div className="h-4" />

        {/* 새 비밀번호 확인 */}
        <div>
          <h3 className="font-bold text-left">새 비밀번호 확인</h3>
          <div className="h-2" />
          <InputBox
            type="password"
            placeholder="새로 설정할 비밀번호를 재입력해주세요"
            value={confirmPw}
            onChange={(e) => {
              setConfirmPw(e.target.value);
              setConfirmPwError("");
            }}
          />
          {confirmPwError && <p className="text-red-500 mt-2">{confirmPwError}</p>}
        </div>

        {/* API 에러 메시지 */}
        {apiError && (
          <div className="mt-4">
            <p className="text-red-500 text-center">{apiError}</p>
          </div>
        )}
      </div>

        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[32rem] bg-white py-10 pb-[4rem]">
          <div className="flex justify-center pt-4 gap-8">
            <DefaultButton
              text="SKIP"
              className="bg-gray-300 text-gray-600 hover:bg-gray-400 active:scale-[0.98] flex-[0.6]"
              onClick={() => setShowChoiceModal(true)}
            />
            <DefaultButton
              text={isLoading ? "처리 중..." : "확인"}
              className="flex-[1.5]"
              onClick={handleConfirm}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Confirm Modal */}
        {showConfirmModal && (
          <ConfirmModal
            isOpen
            message="비밀번호 재설정이 완료되었습니다."
            onConfirm={handleConfirmModalConfirm}
          />
        )}

        {/* Choice Modal */}
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
