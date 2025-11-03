import React from 'react';
import { useCalendarStore } from '@/stores/calendarStore';
import { img } from '@/assets/img';
// Payment 타입 - CalendarView의 paymentData 구조에 맞춤
export type Payment = { 
  id: number; // 거래 고유 ID
  date: string; // 날짜+시간 (YYYY-MM-DD HH:MM)
  category: string;
  categoryColor: string;
  company: string; 
  amount: number;
  includeInTotal?: boolean; // 지출 합계 포함 여부
  cardName?: string; // 결제 카드명
  dutchPay?: number; // 더치페이 인원
};

// 카테고리 정보 타입
const categoryInfo: Record<string, { color: string; icon: string }> = {
  '식비': { color: 'FF715B', icon: img.foodIcon },
  '교통/자동차': { color: '34D1BF', icon: img.trafficIcon },
  '편의점': { color: 'FFC456', icon: img.martIcon },
  '쇼핑': { color: '345BD1', icon: img.shoppingIcon },
  '주거': { color: 'FFF1D6', icon: img.residenceIcon },
  '병원': { color: '31BB66', icon: img.hospitalIcon },
  '이체': { color: 'FFF495', icon: img.transferIcon },
  '술/유흥': { color: 'FF715B', icon: img.entertainmentIcon },
  '통신': { color: 'FFF', icon: img.phoneIcon },
  '교육': { color: '969191', icon: img.educationIcon },
  '기타': { color: 'E4EAF0', icon: img.etcIcon },
};

// 카테고리 목록
const categoryList = Object.keys(categoryInfo);

// 날짜+시간 포맷 함수
const formatDateTime = (dateTimeStr: string): string => {
  const [datePart, timePart] = dateTimeStr.split(' ');
  const [year, month, day] = datePart.split('-');
  return `${year}년 ${parseInt(month)}월 ${parseInt(day)}일 ${timePart}`;
};

const Toggle: React.FC<{ value: boolean; onChange: (value: boolean) => void }> = ({ value, onChange }) => {
  return (
    <button 
      onClick={() => onChange(!value)} 
      className={`w-16 h-9 rounded-full border-none relative cursor-pointer transition-colors ${
        value ? 'bg-blue-600' : 'bg-gray-300'
      }`}
    >
      <span 
        className={`absolute top-1 w-7 h-7 rounded-full bg-white transition-all duration-150 shadow-sm ${
          value ? 'left-8' : 'left-1'
        }`}
      />
    </button>
  );
};

// 애니메이션 모달(슬라이드 업)
export const DetailModal: React.FC<{ dateLabel: string }> = ({ dateLabel }) => {
  const detail = useCalendarStore((state) => state.detail);
  const setDetail = useCalendarStore((state) => state.setDetail);
  const setDutchPayModal = useCalendarStore((state) => state.setDutchPayModal);
  const [open, setOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState(detail?.data.category || '식비');
  const [showCategoryDropdown, setShowCategoryDropdown] = React.useState(false);
  const [showExcludeModal, setShowExcludeModal] = React.useState(false);
  
  React.useEffect(() => {
    const id = requestAnimationFrame(() => setOpen(true));
    return () => cancelAnimationFrame(id);
  }, []);

  React.useEffect(() => {
    if (detail) {
      setSelectedCategory(detail.data.category);
    }
  }, [detail]);

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => setDetail(null), 200);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setShowCategoryDropdown(false);
    
    // detail 데이터 업데이트
    if (detail) {
      setDetail({
        ...detail,
        data: {
          ...detail.data,
          category: category,
          categoryColor: categoryInfo[category].color,
        }
      });
    }
  };

  const handleToggleChange = (value: boolean) => {
    // 이체 카테고리이고 제외(false)로 변경하려는 경우 모달 표시
    if (selectedCategory === '이체' && !value) {
      setShowExcludeModal(true);
      return;
    }
    
    // 일반 카테고리 또는 포함(true)으로 변경하는 경우 바로 적용
    if (detail) {
      setDetail({
        ...detail,
        data: {
          ...detail.data,
          includeInTotal: value,
        }
      });
    }
  };

  // 제외 모달에서 "이번만" 선택
  const handleExcludeOnce = () => {
    if (detail) {
      setDetail({
        ...detail,
        data: {
          ...detail.data,
          includeInTotal: false,
        }
      });
    }
    setShowExcludeModal(false);
  };

  // 제외 모달에서 "전체" 선택
  const handleExcludeAll = () => {
    // TODO: 같은 회사명의 모든 이체 내역 제외 기능
    if (detail) {
      setDetail({
        ...detail,
        data: {
          ...detail.data,
          includeInTotal: false,
        }
      });
    }
    setShowExcludeModal(false);
  };

  if (!detail) return null;
  
  const currentCategoryInfo = categoryInfo[selectedCategory] || categoryInfo['식비'];
  const includeInTotal = detail.data.includeInTotal !== undefined ? detail.data.includeInTotal : true;

  return (
    <div 
      onClick={handleClose} 
      className={`fixed inset-0 bg-black transition-colors duration-200 flex items-end justify-center z-[60] ${
        open ? 'bg-opacity-35' : 'bg-opacity-0'
      }`}
    >
      <div 
        onClick={(e) => e.stopPropagation()} 
        className={`w-full max-w-full bg-white dark:bg-gray-700 rounded-t-3xl shadow-xl transform transition-all duration-200 ${
          open ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
        }`}
        style={{ width: '402px', zIndex: 60 }}
      >
        <div className="px-6 pt-8 pb-6">
          <div className="flex items-center justify-between mb-8">
            <div className="w-10"></div>
            <div className="text-3xl font-bold dark:text-white">상세 내역</div>
            <button onClick={handleClose} className="border-none bg-transparent text-xl cursor-pointer dark:text-white">
              닫기
            </button>
          </div>

          <div className="flex items-center gap-4 mb-10">
            <div 
              className="w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: `#${currentCategoryInfo.color}` }}
            >
              <img 
                src={currentCategoryInfo.icon.toString()}
                alt={selectedCategory}
                className="w-16 h-16 object-contain"
              />
            </div>
            <div className="text-3xl font-bold dark:text-white">
              {(() => {
                const displayAmount = detail.data.dutchPay && detail.data.dutchPay > 1 
                  ? Math.ceil(detail.data.amount / detail.data.dutchPay) 
                  : detail.data.amount;
                return displayAmount.toLocaleString();
              })()} 원
              {detail.data.dutchPay && detail.data.dutchPay > 1 && (
                <span className="text-xl text-blue-600 dark:text-blue-400 ml-2">({detail.data.dutchPay}인)</span>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="text-2xl text-gray-600 dark:text-gray-300">카테고리</div>
                <button 
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <span className="text-2xl text-gray-900 dark:text-white font-medium">{selectedCategory}</span>
                  <svg 
                    className={`w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform ${showCategoryDropdown ? 'rotate-90' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              {showCategoryDropdown && (
                <div className="absolute right-0 top-full mt-3 w-64 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl shadow-lg z-10 max-h-96 overflow-y-auto">
                  {categoryList.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategorySelect(category)}
                      className={`w-full px-5 py-4 text-left hover:bg-gray-100 dark:hover:bg-gray-500 flex items-center gap-4 ${
                        selectedCategory === category ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      } first:rounded-t-xl last:rounded-b-xl`}
                    >
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `#${categoryInfo[category].color}` }}
                      >
                        <img 
                          src={categoryInfo[category].icon.toString()}
                          alt={category}
                          className="w-6 h-6 object-contain"
                        />
                      </div>
                      <span className="text-xl text-gray-900 dark:text-white font-medium">{category}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>


            <div className="flex items-center justify-between">
              <div className="text-2xl text-gray-600 dark:text-gray-300">지출 합계에 포함</div>
              <Toggle value={includeInTotal} onChange={handleToggleChange} />
            </div>
          </div>

          <div className="h-px bg-gray-100 dark:bg-gray-600 my-6"></div>

          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="text-2xl text-gray-600 dark:text-gray-300">업체명</div>
              <div className="text-2xl text-gray-900 dark:text-white font-medium">{detail.data.company}</div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-2xl text-gray-600 dark:text-gray-300">결제 카드</div>
              <div className="flex items-center gap-3">
                <span className="text-2xl text-gray-900 dark:text-white font-medium">{detail.data.cardName || '[우리] 네이버페이 우리 카드'}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-xl text-gray-600 dark:text-gray-300">거래일시</div>
              <div className="text-xl text-gray-900 dark:text-white font-medium">{formatDateTime(dateLabel)}</div>
            </div>
          </div>

          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
              setTimeout(() => {
                const currentData = detail?.data;
                if (currentData) {
                  setDutchPayModal(currentData);
                }
              }, 200);
            }}
            className="w-full py-5 bg-gray-100 dark:bg-gray-600 rounded-2xl border-none text-2xl text-gray-900 dark:text-white font-bold cursor-pointer mt-10 hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
          >
            더치페이 하기
          </button>
        </div>
      </div>

      {/* 제외 확인 모달 */}
      {showExcludeModal && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50"
          onClick={() => setShowExcludeModal(false)}
        >
          <div 
            className="bg-white dark:bg-gray-700 rounded-3xl p-8 mx-6 w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              지출 합계 제외
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              앞으로 이와 같은 건은 미포함할까요?
            </p>
            <div className="space-y-3">
              <button
                onClick={handleExcludeOnce}
                className="w-full py-4 bg-gray-100 dark:bg-gray-600 rounded-2xl text-xl text-gray-900 dark:text-white font-medium hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
              >
                이번만 제외
              </button>
              <button
                onClick={handleExcludeAll}
                className="w-full py-4 bg-blue-500 dark:bg-blue-600 rounded-2xl text-xl text-white font-bold hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
              >
                같은 이체 모두 제외
              </button>
              <button
                onClick={() => setShowExcludeModal(false)}
                className="w-full py-4 bg-transparent rounded-2xl text-xl text-gray-500 dark:text-gray-400 font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};