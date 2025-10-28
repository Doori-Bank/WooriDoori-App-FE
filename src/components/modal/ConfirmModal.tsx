import React from "react";

interface ConfirmModalProps {
  message: React.ReactNode;
  isOpen: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmTitle?: string;
  cancelTitle?: string;
  confirmColor?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  message,
  isOpen,
  onConfirm = () => { },
  onCancel = () => { },
  confirmTitle = "확인",
  cancelTitle = "취소",
  confirmColor = "#3B82F6",
}) => {
  if (!isOpen) return null;

  return (
    <div className="flex fixed inset-0 z-50 justify-center items-center bg-black/40">
      <div className="w-[350px] rounded-2xl bg-white shadow-lg overflow-hidden">
        <div className="mt-4 p-6 text-center text-gray-800 text-[1.2rem] font-semibold">
          {message}
        </div>
        <div className="mt-4 border-t border-gray-200 flex">
          <button
            onClick={onCancel}
            className="flex-1 py-3 text-[1rem] font-medium text-gray-600 active:bg-gray-100 transition"
          >
            {cancelTitle}
          </button>
          <button
            onClick={() => {
              onConfirm();
            }}
            style={{ color: confirmColor }}
            className="flex-1 py-3 text-[1rem] font-medium active:bg-gray-100 transition border-l border-gray-200"
          >
            {confirmTitle}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
