import React from 'react';

interface DiaryEmptyStateProps {
  onWriteClick: () => void;
}

const DiaryEmptyState: React.FC<DiaryEmptyStateProps> = ({ onWriteClick }) => {
  return (
    <div className="py-12 text-center">
      <p className="mb-6 text-xl text-gray-500">
        일기가 없어요! 일기를 작성해볼까요?
      </p>
      <button
        onClick={onWriteClick}
        className="px-8 py-3 text-xl font-bold text-white bg-blue-600 rounded-2xl transition-colors hover:bg-blue-70"
        style={{ backgroundColor: 'rgb(139, 195, 75)' }}
      >
        작성하기
      </button>
    </div>
  );
};

export default DiaryEmptyState;

