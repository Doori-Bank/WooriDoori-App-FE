import { useState } from 'react';
import DefaultDiv from '@/components/default/DefaultDiv';
import IconButton from '@/components/button/IconButton';
import DiaryConfirmModal from '@/components/modal/DiaryConfirmModal';
import { img } from '@/assets/img';
import { useCalendarStore } from '@/stores/calendarStore';
import { useNavigate } from 'react-router-dom';
import "@/styles/calendar/calendar.styles.css";
import NavBar from '@/components/default/NavBar';

const DiaryView = () => {
  const navigate = useNavigate();
  const currentDate = useCalendarStore((state) => state.currentDate);
  const selectedDate = useCalendarStore((state) => state.selectedDate);
  const setSelectedDate = useCalendarStore((state) => state.setSelectedDate);
  const changeMonth = useCalendarStore((state) => state.changeMonth);
  const getDiaryEntry = useCalendarStore((state) => state.getDiaryEntry);
  
  const [confirmModal, setConfirmModal] = useState<{ type: 'edit' | 'delete'; isOpen: boolean }>({
    type: 'edit',
    isOpen: false,
  });
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();
  
  // 캘린더 날짜 배열 생성
  const calendarDays = [];
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }
  
  // 선택된 날짜의 일기 가져오기
  const selectedDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`;
  const diaryEntry = getDiaryEntry(selectedDateStr);
  
  // 날짜 클릭 핸들러
  const handleDateClick = (day: number | null) => {
    if (day) {
      setSelectedDate(day);
    }
  };
  
  // 작성하기 버튼 클릭 - 감정 선택 페이지로 이동
  const handleWriteClick = () => {
    navigate(`/calendar/diary/emotion?date=${selectedDateStr}`);
  };
  
  // 수정하기 버튼 클릭 - 수정 확인
  const handleEditClick = () => {
    setConfirmModal({ type: 'edit', isOpen: true });
  };
  
  // 삭제하기 버튼 클릭 - 삭제 확인
  const handleDeleteClick = () => {
    setConfirmModal({ type: 'delete', isOpen: true });
  };
  
  // 확인 버튼 핸들러
  const handleConfirm = () => {
    if (confirmModal.type === 'delete') {
      // 삭제 로직
      const newEntries = { ...useCalendarStore.getState().diaryEntries };
      delete newEntries[selectedDateStr];
      useCalendarStore.setState({ diaryEntries: newEntries });
    }
    setConfirmModal({ ...confirmModal, isOpen: false });
  };
  
  // 취소 버튼 핸들러
  const handleModalCancel = () => {
    setConfirmModal({ ...confirmModal, isOpen: false });
  };
  
  const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
  const selectedDayOfWeek = dayOfWeek[new Date(year, month, selectedDate).getDay()];
  
  // 감정 아이콘 매핑
  const emotionIcons = [
    img.doori_face1, // 매우 좋음
    img.doori_face2, // 좋음
    img.doori_face3, // 보통
    img.doori_face4, // 나쁨
    img.doori_face5, // 매우 나쁨
  ];
  
  return (
    <DefaultDiv isPadding={false}>
      <div className="relative dark:bg-gray-700 min-h-screen">
        {/* 헤더 */}
        <div className="py-all px-5 flex items-center justify-between">
          <div className="block items-center gap-2">
            <div className="flex items-center text-center text-3xl font-semibold border-b border-gray-100 dark:border-gray-600 relative">소비 일기</div>
            <div className="text-3xl text-gray-500 font-bold">(전체)</div>
          </div>
          <button onClick={() => navigate('/calendar')}>
            <IconButton
              src={img.BsX}
              alt="닫기"
              height={33}
            />
          </button>
        </div>
        
        {/* 캘린더 */}
        <div className="p-5 dark:bg-gray-700">
          {/* 월 선택 */}
          <div className="flex justify-center items-center mb-5 gap-5">
            <div 
              onClick={() => changeMonth(-1)} 
              className="cursor-pointer text-gray-600 dark:text-gray-300 text-2xl select-none hover:text-gray-800 dark:hover:text-white transition-colors"
            >
              ◀
            </div>
            <span className="text-2xl font-400 dark:text-white">{month + 1}월</span>
            <div 
              onClick={() => changeMonth(1)} 
              className="cursor-pointer text-gray-600 dark:text-gray-300 text-2xl select-none hover:text-gray-800 dark:hover:text-white transition-colors"
            >
              ▶
            </div>
          </div>
          
          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 mb-3 gap-1">
            {['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => (
              <div 
                key={idx} 
                className={`text-center text-5lg font-medium py-2 ${
                  idx === 0 ? 'text-red-500 dark:text-red-400' : 
                  idx === 6 ? 'text-blue-500 dark:text-blue-400' : 
                  'text-gray-600 dark:text-gray-300'
                }`}
              >
                {day}
              </div>
            ))}
          </div>
          
          {/* 날짜 그리드 */}
          <div className="grid grid-cols-7 gap-0.5">
            {calendarDays.map((day, idx) => {
              const isSelected = day === selectedDate;
              const dateStr = day ? `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : null;
              const entry = dateStr ? getDiaryEntry(dateStr) : null;
              const hasDiary = entry !== null;
              
              return (
                <div
                  key={idx}
                  onClick={() => handleDateClick(day)}
                  className={`h-24 flex flex-col items-center justify-start pt-2 rounded-3xl relative cursor-${day ? 'pointer' : 'default'} ${
                    isSelected ? 'shadow-[0_4px_10px_rgba(0,0,0,0.3)]' : ''
                  }`}
                >
                  {day && (
                    <>
                      <div className={`text-5lg text-base mb-1 h-5 leading-5 text-gray-900 ${
                        isSelected ? 'font-semibold' : 'font-normal'
                      }`}>
                        {day}
                      </div>
                      {hasDiary && (
                        <div className="-mt-[0.6rem]">
                          <img 
                            src={emotionIcons[entry?.emotion || 2]} 
                            alt="일기 있음"
                            className="w-20 h-20 object-contain"
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* 일기 표시 영역 */}
        <div className="px-5 pb-8 pt-4">
          <div className="bg-white dark:bg-gray-600 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              {/* 두리 큰 아이콘 */}
              <img 
                src={diaryEntry ? emotionIcons[diaryEntry.emotion] : img.doori_face1} 
                alt="두리"
                className={`w-20 h-20 ${!diaryEntry ? 'opacity-50' : ''}`}
              />
              
              {/* 날짜 필드 + 수정 아이콘 */}
              <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3 flex items-center justify-between">
                <span className="text-xl text-gray-700 dark:text-gray-300">
                  {selectedDate}일 {selectedDayOfWeek}요일
                </span>
                {diaryEntry && (
                  <button onClick={() => navigate(`/calendar/diary/emotion?date=${selectedDateStr}&edit=true`)}>
                    <img 
                      src={img.EditIcon} 
                      alt="수정" 
                      className="w-6 h-6"
                    />
                  </button>
                )}
              </div>
            </div>
            
            {!diaryEntry && (
              <div className="text-center py-12">
                <p className="text-xl text-gray-500 dark:text-gray-400 mb-6">
                  일기가 없어요! 일기를 작성해볼까요?
                </p>
                <button
                  onClick={handleWriteClick}
                  className="bg-blue-600  text-white px-8 py-3 rounded-2xl text-xl font-bold hover:bg-blue-70 transition-colors"
                        style={{ backgroundColor: 'rgb(139, 195, 75)' }}
                >
                  작성하기
                </button>
              </div>
            )}
            
            {diaryEntry && (
              <div>
                {/* 일기 내용 - 큰 녹색 테두리 영역 */}
                <div className="border-2 border-green-500 rounded-2xl p-4 min-h-[200px] bg-white dark:bg-gray-600">
                  <p className="text-lg text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
                    {diaryEntry.content}
                  </p>
                </div>
                
              </div>
            )}
          </div>
        </div>
        
        {/* 확인 모달 */}
        <DiaryConfirmModal
          isOpen={confirmModal.isOpen}
          type={confirmModal.type === 'delete' ? 'delete' : 'edit'}
          onConfirm={handleConfirm}
          onCancel={handleModalCancel}
        />
      </div>
      <NavBar />
    </DefaultDiv>
  );
};

export default DiaryView;