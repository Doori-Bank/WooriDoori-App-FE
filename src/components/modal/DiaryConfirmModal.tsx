import React from 'react';

interface DiaryConfirmModalProps {
  isOpen: boolean;
  type: 'edit' | 'save' | 'delete';
  onConfirm: () => void;
  onCancel: () => void;
}

const DiaryConfirmModal: React.FC<DiaryConfirmModalProps> = ({ isOpen, type, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  
  const messages = {
    edit: '내용을 수정하시겠습니까?',
    save: '내용을 저장하시겠습니까?',
    delete: '내용을 삭제하시겠습니까?',
  };
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onCancel}
    >
      <div 
        className="bg-white dark:bg-gray-700 rounded-2xl p-6 w-[85%] max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-xl text-center text-gray-900 dark:text-white mb-6">
          {messages[type]}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl text-lg font-bold hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-xl text-lg font-bold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiaryConfirmModal;
