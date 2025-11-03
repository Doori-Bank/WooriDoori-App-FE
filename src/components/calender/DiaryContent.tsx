import React from 'react';

interface DiaryContentProps {
  content: string;
}

const DiaryContent: React.FC<DiaryContentProps> = ({ content }) => {
  return (
    <div>
      {/* 일기 내용 - 일기 스타일 표시 영역 */}
      <div
        className="rounded-2xl border border-gray-200 shadow-sm bg-[#FFFEFB] min-h-[100px]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(transparent, transparent 30px, rgba(16,24,40,0.06) 31px)',
          backgroundSize: '100% 31px',
          backgroundPositionY: '12px',
        }}
      >
        <p className="p-6 text-[1.1rem] leading-7 font-serif italic text-gray-800 whitespace-pre-wrap break-words bg-transparent">
          {content}
        </p>
      </div>
    </div>
  );
};

export default DiaryContent;

