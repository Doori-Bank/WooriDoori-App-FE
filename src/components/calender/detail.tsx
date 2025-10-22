import React from 'react';
import cardIcon from '@/assets/card-icon.svg';
import naverSquare from '@/assets/card-icon.svg';
import { useCalendarStore } from '@/stores/calendarStore';
import { useThemeStore } from '@/stores/useThemeStore';

// Payment 타입
export type Payment = { 
  merchant: string; 
  company: string; 
  amount: number; 
  reward: number 
};

// 상세 내역 보조 컴포넌트
const Field: React.FC<{ 
  label: string; 
  value: React.ReactNode; 
  clickable?: boolean; 
  accent?: boolean 
}> = ({ label, value, clickable, accent }) => (
  <div className="flex items-center justify-between">
    <div className="text-gray-600 dark:text-gray-300">{label}</div>
    <div className={`font-medium ${accent ? 'text-blue-700 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
      {value}
      {clickable}
    </div>
  </div>
);

const Toggle: React.FC = () => {
  const [on, setOn] = React.useState(true);
  return (
    <button 
      onClick={() => setOn(!on)} 
      className={`w-12 h-6 rounded-full border-none relative cursor-pointer transition-colors ${
        on ? 'bg-blue-600' : 'bg-gray-300'
      }`}
    >
      <span 
        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-150 shadow-sm ${
          on ? 'left-6' : 'left-0.5'
        }`}
      />
    </button>
  );
};

// 애니메이션 모달(슬라이드 업)
export const DetailModal: React.FC<{ dateLabel: string }> = ({ dateLabel }) => {
  const detail = useCalendarStore((state) => state.detail);
  const setDetail = useCalendarStore((state) => state.setDetail);
  const [open, setOpen] = React.useState(false);
  const { isDark } = useThemeStore();
  
  React.useEffect(() => {
    const id = requestAnimationFrame(() => setOpen(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => setDetail(null), 200);
  };

  if (!detail) return null;

  return (
    <div 
      onClick={handleClose} 
      className={`fixed inset-0 bg-black transition-colors duration-200 flex items-end justify-center z-50 ${
        open ? 'bg-opacity-35' : 'bg-opacity-0'
      }`}
    >
      <div 
        onClick={(e) => e.stopPropagation()} 
        className={`w-full max-w-full bg-white dark:bg-gray-700 rounded-t-3xl shadow-xl transform transition-all duration-200 ${
          open ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
        }`}
        style={{ width: '402px' }}
      >
        <div className="px-5 pt-6 pb-4">
          <div className="flex items-center justify-between mb-6">
            <div className="w-8"></div>
            <div className="text-lg font-bold dark:text-white">상세 내역</div>
            <button onClick={handleClose} className="border-none bg-transparent text-lg cursor-pointer dark:text-white">
              닫기
            </button>
          </div>

          <div className="flex items-center gap-3 mb-8">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              detail.data.merchant.includes('네이버페이') ? 'overflow-hidden bg-green-500' : 'bg-blue-500'
            }`}>
              <img 
                src={detail.data.merchant.includes('네이버페이') ? naverSquare : cardIcon} 
                alt={detail.data.merchant.includes('네이버페이') ? 'naver' : 'card'} 
                className={`${
                  detail.data.merchant.includes('네이버페이') ? 'w-full h-full object-cover' : 'w-6 h-4 object-contain'
                }`}
              />
            </div>
            <div className="text-2xl font-bold dark:text-white">{detail.data.amount.toLocaleString()} 원</div>
          </div>

          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="text-gray-600 dark:text-gray-300">카테고리 설정</div>
              <div className="flex items-center gap-2">
                <span className="text-gray-900 dark:text-white font-medium">식비</span>
                <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-gray-600 dark:text-gray-300">메모</div>
              <div className="flex items-center gap-2">
                <span className="text-blue-600 dark:text-blue-400 font-medium">메모를 남겨보세요</span>
                <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-gray-600 dark:text-gray-300">지출 합계에 포함</div>
              <Toggle />
            </div>
          </div>

          <div className="h-px bg-gray-100 dark:bg-gray-600 my-5"></div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-gray-600 dark:text-gray-300">입금처</div>
              <div className="text-gray-900 dark:text-white font-medium">{detail.data.merchant}</div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-gray-600 dark:text-gray-300">출금처</div>
              <div className="flex items-center gap-2">
                <span className="text-gray-900 dark:text-white font-medium">[우리] 네이버페이 우리 카드</span>
                <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-gray-600 dark:text-gray-300">이체일시</div>
              <div className="text-gray-900 dark:text-white font-medium">{dateLabel}</div>
            </div>
          </div>

          <button className="w-full py-4 bg-gray-100 dark:bg-gray-600 rounded-2xl border-none text-gray-900 dark:text-white font-bold cursor-pointer mt-8 hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors">
            더치페이 하기
          </button>
        </div>
      </div>
    </div>
  );
};