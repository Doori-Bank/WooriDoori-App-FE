import React from 'react';
import { img } from '@/assets/img';
import IconButton from '@/components/button/IconButton';

interface DiaryHeaderProps {
  diaryEntry: { emotion: number; content: string } | null;
  selectedDate: number;
  selectedDayOfWeek: string;
  emotionIcons: string[];
  onEditClick: () => void;
}

const DiaryHeader: React.FC<DiaryHeaderProps> = ({
  diaryEntry,
  selectedDate,
  selectedDayOfWeek,
  emotionIcons,
  onEditClick,
}) => {
  return (
    <div className="flex gap-4 items-center mb-4">
      {/* 두리 큰 아이콘 */}
      <img 
        src={diaryEntry ? emotionIcons[diaryEntry.emotion] : img.doori_face1} 
        alt="두리"
        className={`w-20 h-20 ${!diaryEntry ? 'opacity-50' : ''}`}
      />
      
      {/* 날짜 필드 + 수정 아이콘 */}
      <div className="flex flex-1 justify-between items-center px-4 py-3 bg-gray-100 rounded-2xl">
        <span className="text-xl text-gray-700">
          {selectedDate}일 {selectedDayOfWeek}요일
        </span>
        {diaryEntry && (
          <button onClick={onEditClick}>
            <IconButton 
              src={img.EditIcon} 
              alt="수정" 
              height={18}
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default DiaryHeader;

