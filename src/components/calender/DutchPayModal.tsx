import React from 'react';
import { useCalendarStore } from '@/stores/calendarStore';

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

