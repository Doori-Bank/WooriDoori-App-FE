import React, { useState, useEffect } from 'react';

interface SecureKeypadProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  onClose: () => void;
  isVisible: boolean;
}

const SecureKeypad: React.FC<SecureKeypadProps> = ({ onKeyPress, onBackspace, onClose, isVisible }) => {
  const [shuffledNumbers, setShuffledNumbers] = useState<string[]>([]);

  useEffect(() => {
    if (isVisible) {
      // 숫자 배열을 랜덤하게 섞기
      const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
      const shuffled = [...numbers].sort(() => Math.random() - 0.5);
      setShuffledNumbers(shuffled);
    }
  }, [isVisible]);

  return (
    <div 
      className={`absolute inset-0 z-50 bg-black/50 flex items-end transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
    >
      <div 
        className={`w-full bg-white rounded-t-3xl p-6 transform transition-transform duration-300 ease-out ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 상단 바 */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-1 bg-gray-300 rounded-lg" />
        </div>
        
        {/* 키패드 */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {shuffledNumbers.map((num, index) => (
            <button
              key={`${num}-${index}`}
              onClick={() => onKeyPress(num)}
              className="h-16 text-2xl font-semibold text-gray-800 bg-gray-100 rounded-xl active:bg-gray-200"
            >
              {num}
            </button>
          ))}
        </div>
        
        {/* 하단 버튼들 */}
        <div className="flex gap-4">
          <button
            onClick={onBackspace}
            className="flex-1 h-16 text-lg font-semibold text-gray-800 bg-gray-200 rounded-xl active:bg-gray-300"
          >
            삭제
          </button>
          <button
            onClick={onClose}
            className="flex-1 h-16 text-lg font-semibold text-white bg-gray-800 rounded-xl active:bg-gray-700"
          >
            완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecureKeypad;
