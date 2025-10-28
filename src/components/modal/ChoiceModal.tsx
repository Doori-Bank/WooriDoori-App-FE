import React from "react";

interface ChoiceModalProps {
  message: string;
  subMessage?: string;

  isOpen: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;

  btnTitle?: string;
  btnColor?: string;

  // 입력폼 옵션
  inputVisible?: boolean;
  inputValue?: string;
  onInputChange?: (value: string) => void;
  inputPlaceholder?: string;
}

const ChoiceModal: React.FC<ChoiceModalProps> = ({
  message,
  subMessage,

  isOpen,
  onConfirm = () => { },
  onCancel = () => { },
  btnTitle = "확인",
  btnColor = "text-blue-500",

  inputVisible = false,
  inputValue = "",
  onInputChange = () => { },
  inputPlaceholder = "",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent">
      <div className="w-[350px] rounded-2xl bg-white shadow-lg overflow-hidden">
        {/* 메시지 영역 */}
        <div className="mt-4 p-6 text-center">
          <p className="text-gray-900 text-[1.1rem] font-semibold mb-1">
            {message}
          </p>

          {/* subMessage 조건부 렌더링 */}
          {subMessage && (
            <p className="text-gray-400 text-[0.9rem] leading-tight">
              {subMessage}
            </p>
          )}
        </div>

        {/* 입력폼 (선택적 표시) */}
        {inputVisible && (
          <div className="px-6 pb-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder={inputPlaceholder}
              className="w-full mb-3 border-b border-gray-300 focus:outline-none focus:border-blue-400 text-start py-2 text-gray-700"
            />
          </div>
        )}

        {/* 버튼 영역 */}
        <div className="mt-4 flex border-t border-gray-200 text-[1rem] font-medium">
          <button
            onClick={onCancel}
            className="flex-1 py-3 text-gray-400 active:bg-gray-100 border-r border-gray-200"
          >
            취소
          </button>

          <button
            onClick={onConfirm}
            className={`flex-1 py-4 active:bg-gray-100 ${btnColor}`}
          >
            {btnTitle}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChoiceModal;
