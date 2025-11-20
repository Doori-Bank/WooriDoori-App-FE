import React, { useState } from 'react';
import DefaultDiv from '@/components/default/DefaultDiv';
import DiaryConfirmModal from '@/components/modal/DiaryConfirmModal';
import { img } from '@/assets/img';
import { useCalendarStore } from '@/stores/calendarStore';
import { useNavigate } from 'react-router-dom';
import "@/styles/calendar/calendar.styles.css";
import MonthCalendarSection from '@/components/calender/MonthCalendarSection';
import DiaryHeader from '@/components/calender/DiaryHeader';
import DiaryEmptyState from '@/components/calender/DiaryEmptyState';
import DiaryContent from '@/components/calender/DiaryContent';

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
  
  // 캘린더 접기/펼치기 상태
  const [isCalendarCollapsed, setIsCalendarCollapsed] = useState(false);
  const calendarTouchStartY = React.useRef(0);
  const calendarRef = React.useRef<HTMLDivElement | null>(null);
  const diaryAreaRef = React.useRef<HTMLDivElement | null>(null);
  const diaryTouchStartY = React.useRef(0);
  
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
  
  // 선택된 날짜가 속한 주의 날짜들을 계산
  const getWeekDays = (day: number): number[] => {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay();
    const weekStart = day - dayOfWeek;
    const weekDays: number[] = [];
    for (let i = 0; i < 7; i++) {
      const d = weekStart + i;
      if (d >= 1 && d <= daysInMonth) {
        weekDays.push(d);
      }
    }
    return weekDays;
  };
  
  const currentWeekDays = getWeekDays(selectedDate);
  
  // 캘린더 영역에서 접기/펼치기
  React.useEffect(() => {
    const calendarEl = calendarRef.current;
    if (!calendarEl) return;

    const handleCalendarTouchStart = (e: TouchEvent) => {
      calendarTouchStartY.current = e.touches[0].clientY;
    };

    const handleCalendarTouchMove = (e: TouchEvent) => {
      e.preventDefault(); // 캘린더 영역에서는 스크롤 막기
      
      const currentY = e.touches[0].clientY;
      const deltaY = currentY - calendarTouchStartY.current;
      
      if (Math.abs(deltaY) < 30) return; // 30px 이상만 반응
      
      const swipeDown = deltaY < 0;
      
      if (swipeDown && !isCalendarCollapsed) {
        setIsCalendarCollapsed(true);
        calendarTouchStartY.current = currentY;
      } else if (!swipeDown && isCalendarCollapsed) {
        setIsCalendarCollapsed(false);
        calendarTouchStartY.current = currentY;
      }
    };

    calendarEl.addEventListener('touchstart', handleCalendarTouchStart, { passive: true });
    calendarEl.addEventListener('touchmove', handleCalendarTouchMove, { passive: false });
    
    return () => {
      calendarEl.removeEventListener('touchstart', handleCalendarTouchStart);
      calendarEl.removeEventListener('touchmove', handleCalendarTouchMove);
    };
  }, [isCalendarCollapsed]);

  // 일기 영역에서도 접기/펼치기
  React.useEffect(() => {
    const diaryEl = diaryAreaRef.current;
    if (!diaryEl) return;

    const handleDiaryTouchStart = (e: TouchEvent) => {
      diaryTouchStartY.current = e.touches[0].clientY;
    };

    const handleDiaryTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0].clientY;
      const deltaY = currentY - diaryTouchStartY.current;
      
      if (Math.abs(deltaY) < 50) return; // 50px 이상만 반응 (스크롤과 구분)
      
      const swipeDown = deltaY < 0;
      
      if (swipeDown && !isCalendarCollapsed) {
        setIsCalendarCollapsed(true);
        diaryTouchStartY.current = currentY;
      } else if (!swipeDown && isCalendarCollapsed) {
        setIsCalendarCollapsed(false);
        diaryTouchStartY.current = currentY;
      }
    };

    diaryEl.addEventListener('touchstart', handleDiaryTouchStart, { passive: true });
    diaryEl.addEventListener('touchmove', handleDiaryTouchMove, { passive: true });
    
    return () => {
      diaryEl.removeEventListener('touchstart', handleDiaryTouchStart);
      diaryEl.removeEventListener('touchmove', handleDiaryTouchMove);
    };
  }, [isCalendarCollapsed]);
  
  // 선택된 날짜의 일기 가져오기
  const selectedDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`;
  const diaryEntry = getDiaryEntry(selectedDateStr);
  
  // 날짜 클릭 핸들러
  const handleDateClick = (day: number | null) => {
    if (day) {
      setSelectedDate(day);
      
      // 캘린더가 열려있으면 닫기
      if (!isCalendarCollapsed) {
        setIsCalendarCollapsed(true);
      }
    }
  };
  
  // 작성하기 버튼 클릭 - 감정 선택 페이지로 이동
  const handleWriteClick = () => {
    navigate(`/calendar/diary/emotion?date=${selectedDateStr}`);
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
    <DefaultDiv 
      isPadding={false} 
      isBottomNav={true} 
      title='소비일기' 
      isHeader={true}
      isShowClose={true}
      style={{ backgroundColor: '#FBFBFB' }}
      onClose={() => navigate('/calendar')}
    >
      <div className="flex relative flex-col h-full" style={{ height: '    height: calc(-12rem + 100vh);' }}>
        {/* 월 선택 + 캘린더 영역 */}
        <MonthCalendarSection
          month={month}
          changeMonth={changeMonth}
          calendarStickyRef={calendarRef}
          calendarDays={calendarDays}
          selectedDate={selectedDate}
          onDateClick={handleDateClick}
          isCalendarCollapsed={isCalendarCollapsed}
          currentWeekDays={currentWeekDays}
          dateHeight="h-24"
          renderDateContent={(day) => {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const entry = getDiaryEntry(dateStr);
            const hasDiary = entry !== null;
            
            return hasDiary ? (
              <div className="-mt-[0.6rem]">
                <img 
                  src={emotionIcons[entry?.emotion || 2]} 
                  alt="일기 있음"
                  className="object-contain w-20 h-20"
                />
              </div>
            ) : null;
          }}
        />
        
        {/* 일기 표시 영역 (스크롤 가능) */}
        <div ref={diaryAreaRef} className="overflow-y-auto flex-1 px-5 pt-4 pb-50">
          <div className="px-6 bg-white rounded-3xl shadow-sm">
            <DiaryHeader
              diaryEntry={diaryEntry}
              selectedDate={selectedDate}
              selectedDayOfWeek={selectedDayOfWeek}
              emotionIcons={emotionIcons}
              onEditClick={() => navigate(`/calendar/diary/emotion?date=${selectedDateStr}&edit=true`)}
            />
            
            {!diaryEntry && <DiaryEmptyState onWriteClick={handleWriteClick} />}
            
            {diaryEntry && <DiaryContent content={diaryEntry.content} />}
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
    </DefaultDiv>
  );
};

export default DiaryView;