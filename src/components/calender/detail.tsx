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
  '식비': { color: 'FF715B', icon: img.food },
  '교통/자동차': { color: '34D1BF', icon: img.traffic },
  '편의점': { color: 'FFC456', icon: img.storeIcon },
  '쇼핑': { color: '345BD1', icon: img.shopping },
  '주거': { color: 'FFF1D6', icon: img.homeIcon },
  '병원': { color: 'FF715B', icon: img.hospitalIcon },
  '이체': { color: 'FFF495', icon: img.transfer },
  '술/유흥': { color: 'FF715B', icon: img.drinkIcon },
  '통신': { color: 'FFF', icon: img.phoneIcon },
  '교육': { color: 'FF715B', icon: img.education },
  '기타': { color: 'FFF', icon: img.etc },
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

// 더치페이 모달
export const DutchPayModal: React.FC = () => {
  const dutchPayModal = useCalendarStore((state) => state.dutchPayModal);
  const setDutchPayModal = useCalendarStore((state) => state.setDutchPayModal);
  const setDetail = useCalendarStore((state) => state.setDetail);
  const [open, setOpen] = React.useState(false);
  const [participants, setParticipants] = React.useState(dutchPayModal?.dutchPay || 1);
  const [isEditingAmount, setIsEditingAmount] = React.useState(false);
  const [editedAmount, setEditedAmount] = React.useState(Math.abs(dutchPayModal?.amount || 0));
  
  React.useEffect(() => {
    if (dutchPayModal) {
      const id = requestAnimationFrame(() => setOpen(true));
      setParticipants(dutchPayModal.dutchPay || 1);
      setIsEditingAmount(false); // 금액 수정 모드 초기화
      return () => cancelAnimationFrame(id);
    }
  }, [dutchPayModal]);

  React.useEffect(() => {
    if (dutchPayModal) {
      setParticipants(dutchPayModal.dutchPay || 1);
      setIsEditingAmount(false); // 금액 수정 모드 초기화
    }
  }, [dutchPayModal]);

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setDutchPayModal(null);
      // 원래 detail 모달 다시 열기
      if (dutchPayModal) {
        setDetail({ day: new Date(dutchPayModal.date).getDate().toString(), data: dutchPayModal });
      }
    }, 200);
  };

  const handleComplete = () => {
    if (dutchPayModal) {
      // 원본 데이터는 수정하지 않고, 더치페이 인원과 금액만 UI 표시용으로 저장
      const updatedAmount = isEditingAmount ? -editedAmount : dutchPayModal.amount;
      const updatedData = {
        ...dutchPayModal,
        dutchPay: participants,
        amount: updatedAmount,
      };
      
      // 업데이트된 데이터를 전달 (UI에 표시되도록)
      setDutchPayModal(updatedData);
      
      // 모달 닫기
      setOpen(false);
      
      // detail 모달을 열고 더치페이 모달을 닫음
      setTimeout(() => {
        setDutchPayModal(null);
        setDetail({ 
          day: new Date(updatedData.date).getDate().toString(), 
          data: updatedData 
        });
      }, 100);
    }
  };

  React.useEffect(() => {
    if (dutchPayModal) {
      setEditedAmount(Math.abs(dutchPayModal.amount));
    }
  }, [dutchPayModal]);

  if (!dutchPayModal) return null;

  const totalAmount = isEditingAmount ? editedAmount : Math.abs(dutchPayModal.amount);
  const perPersonAmount = Math.ceil(totalAmount / participants);

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
            <div className="text-3xl font-bold dark:text-white">더치페이 설정</div>
            <button onClick={handleClose} className="border-none bg-transparent text-xl cursor-pointer dark:text-white">
              취소
            </button>
          </div>

          <div className="mb-8">
            <div className="mb-4">
              {isEditingAmount ? (
                <div className="flex items-center justify-center gap-3">
                  <input
                    type="number"
                    value={editedAmount}
                    onChange={(e) => setEditedAmount(parseInt(e.target.value) || 0)}
                    className="text-2xl font-bold dark:text-white text-center border-b-2 border-blue-600 dark:border-blue-400 outline-none w-40 bg-transparent"
                    autoFocus
                  />
                  <span className="text-2xl font-bold dark:text-white">원</span>
                  <button
                    onClick={() => setIsEditingAmount(false)}
                    className="text-blue-600 dark:text-blue-400 text-lg px-3 py-1"
                  >
                    ✓
                  </button>
                </div>
              ) : (
                <div className="text-2xl font-bold mb-2 dark:text-white text-center">
                  {totalAmount.toLocaleString()}원
                </div>
              )}
              <div className="text-xl text-gray-600 dark:text-gray-400 text-center">
                {dutchPayModal.company}
              </div>
            </div>
          </div>

          {!isEditingAmount && (
            <div className="mb-8">
              <div className="mb-3">
                <div className="text-2xl text-gray-600 dark:text-gray-300 mb-2">인원 수</div>
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 text-center mt-3">{participants}명</div>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={participants}
                onChange={(e) => setParticipants(parseInt(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600"
                style={{
                  background: `linear-gradient(to right, #2563eb 0%, #2563eb ${(participants - 1) * 11.11}%, #d1d5db ${(participants - 1) * 11.11}%, #d1d5db 100%)`
                }}
              />
              <div className="flex justify-between mt-2">
                <span className="text-base text-gray-500">1명</span>
                <span className="text-base text-gray-500">10명</span>
              </div>
            </div>
          )}

          <div className="mb-8 bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-5">
            <div className="text-xl text-gray-600 dark:text-gray-300 mb-2">1인당 금액</div>
            <div className="text-3xl font-bold dark:text-white">
              {perPersonAmount.toLocaleString()}원
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setIsEditingAmount(!isEditingAmount)}
              className="flex-1 py-5 bg-gray-300 dark:bg-gray-600 rounded-2xl border-none text-2xl text-gray-700 dark:text-white font-bold cursor-pointer hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
            >
              {isEditingAmount ? '인원수로 수정' : '금액 직접수정'}
            </button>
            <button 
              onClick={handleComplete}
              className="flex-1 py-5 bg-blue-600 dark:bg-blue-500 rounded-2xl border-none text-2xl text-white font-bold cursor-pointer hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              설정 완료
            </button>
          </div>
        </div>
      </div>
    </div>
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
    </div>
  );
};