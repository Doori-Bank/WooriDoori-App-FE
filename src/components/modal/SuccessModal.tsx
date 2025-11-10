import React from 'react';

interface SuccessModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  onConfirm: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  title = '성공',
  message,
  confirmText = '확인',
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/40 px-10">
      <div className="w-full max-w-[350px] rounded-3xl bg-white shadow-2xl overflow-hidden transform transition-all duration-300 scale-100">
        {/* 상단 체크 아이콘 */}
        <div className="flex justify-center pt-8 pb-4">
          <div className="flex justify-center items-center w-16 h-16 bg-green-100 rounded-full">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* 제목과 메시지 */}
        <div className="px-8 pb-6 text-center">
          <h3 className="text-[1.5rem] font-bold text-gray-900 mb-3">{title}</h3>
          <p className="text-[1.2rem] text-gray-600 leading-relaxed whitespace-pre-line">{message}</p>
        </div>

        {/* 확인 버튼 */}
        <div className="px-8 pb-8">
          <button
            className="w-full py-4 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white text-[1.2rem] font-semibold rounded-2xl transition-colors duration-200 shadow-lg"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;


