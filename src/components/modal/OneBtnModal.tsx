import React from 'react';

interface OneBtnModalProps {
    message?: React.ReactNode;
    isOpen: boolean;
    onConfirm?: () => void;
    confirmTitle?: string;
    confirmColor?: string;
}

export const OneBtnModal: React.FC<OneBtnModalProps> = ({
    message,
    isOpen,
    onConfirm = () => { },
    confirmTitle = "확인",
    confirmColor = "#3B82F6",
}) => {
    if (!isOpen) return null;

    return (
        <div className="flex fixed inset-0 z-50 justify-center items-center px-10 bg-black/40">
            <div className="w-full max-w[350px] rounded-2xl bg-white shadow-lg overflow-hidden">
                <div className="mt-4 p-6 text-center text-gray-800 text-[1.2rem] font-semibold">
                    {message}
                </div>
                <div className="flex py-2 mt-4 border-t border-gray-200">
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
