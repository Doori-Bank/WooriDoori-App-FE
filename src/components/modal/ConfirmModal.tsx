import React from "react";

interface ConfirmModalProps {
  message: string;
  isOpen: boolean;
  onConfirm?: () => void;
  onClose?: () => void;
  btnTitle?: string;
  btnColor?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  message,
  isOpen,
  onConfirm = () => { },
  onClose = () => { },
  btnTitle = "확인",
  btnColor = "#3B82F6", // 기본값: Tailwind blue-500
}) => {
  if (!isOpen) return null;

  return (
    <div className="flex fixed inset-0 z-50 justify-center items-center bg-black/40">
      <div className="w-[350px] rounded-2xl bg-white shadow-lg overflow-hidden">
        <div className="mt-4 p-6 text-center text-gray-800 text-[1.2rem] font-semibold">
          {message}
        </div>
        <div className="mt-4 border-t border-gray-200">
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            style={{ color: btnColor }}
            className="w-full py-3 text-[1rem] font-medium active:bg-gray-100 transition"
          >
            {btnTitle}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
