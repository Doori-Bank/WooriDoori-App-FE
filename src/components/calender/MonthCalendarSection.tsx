import React from 'react';

interface MonthCalendarSectionProps {
  month: number;
  changeMonth: (delta: number) => void;
  calendarStickyRef?: React.RefObject<HTMLDivElement>;
  calendarDays: (number | null)[];
  selectedDate: number;
  onDateClick: (day: number | null) => void;
  isCalendarCollapsed: boolean;
  currentWeekDays: number[];
  dateHeight?: string;
  renderDateContent: (day: number) => React.ReactNode;
}

const MonthCalendarSection: React.FC<MonthCalendarSectionProps> = ({
  month,
  changeMonth,
  calendarStickyRef,
  calendarDays,
  selectedDate,
  onDateClick,
  isCalendarCollapsed,
  currentWeekDays,
  dateHeight = "h-20",
  renderDateContent,
}) => {
  return (
    <div className="px-5">
      {/* 월 선택 */}
      <div className="flex gap-5 justify-center items-center py-5 bg-white">
        <div 
          onClick={() => changeMonth(-1)} 
          className="text-2xl text-gray-600 transition-colors cursor-pointer select-none hover:text-gray-800"
        >
          ◀
        </div>
        <span className="text-2xl font-400">{month + 1}월</span>
        <div 
          onClick={() => changeMonth(1)} 
          className="text-2xl text-gray-600 transition-colors cursor-pointer select-none hover:text-gray-800"
        >
          ▶
        </div>
      </div>

      {/* 캘린더 */}
      <div ref={calendarStickyRef} className="bg-white pt-2 pb-5">
        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 gap-1 mb-3">
          {['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => (
            <div 
              key={idx} 
              className={`text-center text-5lg font-medium py-2 ${
                idx === 0 ? 'text-red-500' : 
                idx === 6 ? 'text-blue-500' : 
                'text-gray-600'
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
            const shouldShow = !isCalendarCollapsed || (day && currentWeekDays.includes(day));

            return (
              <div
                key={idx}
                onClick={() => onDateClick(day)}
                className={`flex flex-col items-center justify-start pt-2 rounded-3xl relative cursor-${day ? 'pointer' : 'default'} overflow-hidden transition-all duration-500 ease-in-out ${
                  isSelected ? 'shadow-xl' : 'bg-transparent'
                } ${shouldShow ? `${dateHeight} opacity-100` : 'h-0 opacity-0 pt-0'}`}
              >
                {day && (
                  <>
                    <div className={`text-5lg text-base mb-1 h-5 leading-5 text-gray-900 ${
                      isSelected ? 'font-semibold' : 'font-normal'
                    }`}>
                      {day}
                    </div>
                    {renderDateContent(day)}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MonthCalendarSection;
