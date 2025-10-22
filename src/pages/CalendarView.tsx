import React, { useState } from 'react';
import cardIcon from '@/assets/card-icon.svg';
import naverRound from '@/assets/card-icon.svg';
import { DetailModal, Payment } from '@/components/calender/detail';
import { useCalendarStore } from '@/stores/calendarStore';
import { useThemeStore } from '@/stores/useThemeStore';
import saveMoney from '@/assets/card-icon.svg?url';
import DefaultDiv from '@/components/default/DefaultDiv';

// 결제 데이터 타입
type MonthMap = Record<string, Payment[]>;
type YearMonthMap = Record<string, MonthMap>;

// 결제 데이터 (JSON 형식)
const paymentData: YearMonthMap = {
  "2025-10": {
    "1": [
      { merchant: "네이버페이", company: "(주) 네이버페이", amount: -20000, reward: 200 }
    ],
    "3": [
      { merchant: "네이버페이", company: "(주) 네이버페이", amount: -471000, reward: 4710 }
    ],
    "4": [
      { merchant: "CU편의점", company: "(주) BGF리테일", amount: -17000, reward: 0 }
    ],
    "6": [
      { merchant: "스타벅스", company: "(주) 스타벅스코리아", amount: -17000, reward: 0 }
    ],
    "7": [
      { merchant: "올리브영", company: "(주) CJ올리브영", amount: -180000, reward: 1800 }
    ],
    "10": [
      { merchant: "쿠팡", company: "(주) 쿠팡", amount: -180000, reward: 1800 }
    ],
    "11": [
      { merchant: "네이버페이", company: "(주) 네이버페이", amount: -15000, reward: 150 }
    ],
    "12": [
      { merchant: "네이버페이", company: "(주) 네이버페이", amount: -15000, reward: 150 }
    ],
    "13": [
      { merchant: "네이버페이", company: "(주) 네이버페이", amount: -15000, reward: 150 }
    ],
    "14": [
      { merchant: "네이버페이", company: "(주) 네이버페이", amount: -15000, reward: 150 }
    ],
    "15": [
      { merchant: "네이버페이", company: "(주) 네이버페이", amount: -15000, reward: 150 }
    ],
    "16": [
      { merchant: "네이버페이", company: "(주) 네이버페이", amount: -15000, reward: 150 }
    ],
    "17": [
      { merchant: "네이버페이", company: "(주) 네이버페이", amount: -15000, reward: 150 }
    ],
    "18": [
      { merchant: "네이버페이", company: "(주) 네이버페이", amount: -15000, reward: 150 }
    ],
    "19": [
      { merchant: "네이버페이", company: "(주) 네이버페이", amount: -15000, reward: 150 }
    ],
    "20": [
      { merchant: "네이버페이", company: "(주) 네이버페이", amount: -15000, reward: 150 }
    ],
    "21": [
      { merchant: "네이버페이", company: "(주) 네이버페이", amount: -15000, reward: 150 }
    ],
    "22": [
      { merchant: "네이버페이", company: "(주) 네이버페이", amount: -15000, reward: 150 }
    ],
    "23": [
      { merchant: "네이버페이", company: "(주) 네이버페이", amount: -15000, reward: 150 }
    ]
  },
  "2025-09": {
    "1": [
      { merchant: "네이버페이", company: "(주) 네이버페이", amount: -15000, reward: 150 },
      { merchant: "메가커피", company: "(주) 메가커피", amount: -5000, reward: 0 }
    ],
    "3": [
      { merchant: "네이버페이", company: "(주) 네이버페이", amount: -456000, reward: 4560 },
      { merchant: "콘하스", company: "(주) 콘하스", amount: -15000, reward: 0 }
    ]
  }
};

const CalendarView = () => {
  // Zustand store 사용
  const currentDate = useCalendarStore((state) => state.currentDate);
  const selectedDate = useCalendarStore((state) => state.selectedDate);
  const detail = useCalendarStore((state) => state.detail);
  const setSelectedDate = useCalendarStore((state) => state.setSelectedDate);
  const setDetail = useCalendarStore((state) => state.setDetail);
  const changeMonth = useCalendarStore((state) => state.changeMonth);
  
  // 다크모드
  const { isDark, toggleDarkMode } = useThemeStore();

  const dateRefs = React.useRef<Record<string, HTMLDivElement | null>>({});
  const scrollRef = React.useRef<HTMLDivElement | null>(null);

  // Pull-to-refresh 상태
  const [pullY, setPullY] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startYRef = React.useRef(0);
  const THRESHOLD = 80;
  const MAX_PULL = 130;

  // 해당 월의 첫날과 마지막날 계산
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

  // 현재 월의 키 생성
  const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
  const currentMonthData: MonthMap = paymentData[monthKey] || {} as MonthMap;

  // 해당 날짜의 총 지출 계산
  const getDayTotal = (day: number): number => {
    const dayData = currentMonthData[String(day)];
    if (!dayData) return 0;
    return dayData.reduce((sum, payment) => sum + payment.amount, 0);
  };

  // 총 혜택 계산
  const totalReward = (Object.values(currentMonthData).flat() as Payment[])
    .reduce((sum, payment) => sum + payment.reward, 0);

  // 날짜 클릭
  const handleDateClick = (day: number | null) => {
    if (day) {
      setSelectedDate(day);
      const dayKey = day.toString();
      if (dateRefs.current[dayKey]) {
        dateRefs.current[dayKey]!.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // 날짜별로 그룹화된 결제 내역
  const groupedPayments = (Object.entries(currentMonthData) as [string, Payment[]][])
    .sort((a, b) => parseInt(a[0]) - parseInt(b[0]));

  // 새로고침 핸들러
  const onTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (isRefreshing) return;
    const sc = scrollRef.current;
    if (sc && sc.scrollTop <= 0) {
      setIsPulling(true);
      startYRef.current = e.touches[0].clientY;
    } else {
      setIsPulling(false);
    }
  };

  const onTouchMove: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (!isPulling || isRefreshing) return;
    const delta = e.touches[0].clientY - startYRef.current;
    if (delta > 0) {
      const damped = Math.min(MAX_PULL, delta * 0.6);
      setPullY(damped);
    } else {
      setPullY(0);
    }
  };

  const onTouchEnd: React.TouchEventHandler<HTMLDivElement> = () => {
    if (!isPulling || isRefreshing) return;
    if (pullY >= THRESHOLD) {
      setIsRefreshing(true);
      setTimeout(() => {
        window.location.reload();
      }, 200);
    } else {
      setPullY(0);
      setIsPulling(false);
    }
  };

  return (
    <DefaultDiv>
      <div
        ref={scrollRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className="relative dark:bg-gray-700"
      >
        {/* Pull 영역 인디케이터 */}
        <div 
          className={`absolute top-0 left-0 right-0 bg-gray-100 flex items-end justify-center overflow-hidden border-b ${
            pullY > 0 || isRefreshing ? 'flex' : 'hidden'
          } ${isPulling ? '' : 'transition-all duration-180 ease-out'}`}
          style={{ height: `${Math.max(0, pullY)}px` }}
        >
          <div className="w-full text-center pb-2 text-gray-500 text-xs relative">
            <div 
              className="absolute left-0 right-0 h-0.5 bg-gray-400 transition-opacity duration-180"
              style={{ 
                top: `${Math.max(0, THRESHOLD - 2)}px`,
                opacity: pullY >= THRESHOLD ? 1 : 0.5
              }}
            />
            {isRefreshing ? '새로고치는 중…' : pullY >= THRESHOLD ? '놓으면 새로고침' : '당겨서 새로고침'}
          </div>
        </div>

        {/* 콘텐츠 */}
        <div 
          className={isPulling ? '' : 'transition-transform duration-180 ease-out'}
          style={{ transform: `translateY(${pullY}px)` }}
        >
          {/* 헤더 */}
          <div className="py-6 px-5 text-center text-2xl font-semibold border-b border-gray-100 dark:border-gray-600 dark:text-white relative">
            소비내역
            <button 
              onClick={toggleDarkMode}
              className="absolute right-5 top-1/2 transform -translate-y-1/2 p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {isDark ? '☀️' : '🌙'}
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
              <span className="text-lg font-medium dark:text-white">{month + 1}월</span>
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
                  className={`text-center text-sm font-medium py-2 ${
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
                const dayTotal = day ? getDayTotal(day) : 0;
                const isSelected = day === selectedDate;

                return (
                  <div
                    key={idx}
                    onClick={() => handleDateClick(day)}
                    className={`h-14 flex flex-col items-center justify-start pt-2 rounded-lg relative cursor-${day ? 'pointer' : 'default'} ${
                      isSelected ? 'bg-gray-100 dark:bg-gray-600' : 'bg-transparent'
                    }`}
                  >
                    {day && (
                      <>
                        <div className={`text-base mb-1 h-5 leading-5 text-gray-900 dark:text-white ${
                          isSelected ? 'font-semibold' : 'font-normal'
                        }`}>
                          {day}
                        </div>
                        <div className="text-xs text-red-500 dark:text-red-400 font-medium h-3.5 leading-3.5 whitespace-nowrap">
                          {dayTotal < 0 ? dayTotal.toLocaleString() : ''}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 혜택 박스 */}
          <div className="mx-5 p-4 bg-gray-50 dark:bg-gray-600 rounded-2xl flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <img src={saveMoney} alt="saveMoney" className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                이번달 <span className="text-green-600 dark:text-green-400 font-semibold">네이버페이 우리카드 체크</span> 로
              </div>
              <div className="text-lg text-blue-600 dark:text-blue-400 font-bold">{totalReward.toLocaleString()}원의 혜택을 받았어요!</div>
            </div>
          </div>

          {/* 결제 내역 리스트 */}
          <div className="px-5 pb-5">
            {groupedPayments.map(([day, payments]) => {
              const date = new Date(year, month, parseInt(day));
              const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];

              return (
                <div
                  key={day}
                  ref={(el) => (dateRefs.current[day] = el)}
                  className="mb-8"
                >
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-4 font-medium">{day}일 {dayOfWeek}요일</div>

                  {payments.map((payment, idx) => (
                    <div
                      key={idx}
                      onClick={() => setDetail({ day, data: payment })}
                      className="flex items-center p-4 bg-white dark:bg-gray-600 rounded-2xl mb-3 shadow-sm gap-4 cursor-pointer hover:shadow-md dark:hover:shadow-lg transition-shadow"
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                        payment.merchant.includes('네이버페이') ? 'overflow-hidden bg-green-500' : 'bg-blue-500'
                      }`}>
                        <img
                          src={payment.merchant.includes('네이버페이') ? naverRound : cardIcon}
                          alt={payment.merchant.includes('네이버페이') ? 'naver' : 'card'}
                          className={payment.merchant.includes('네이버페이') ? 'w-full h-full object-cover' : 'w-6 h-4 object-contain'}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="text-base font-bold mb-1 text-gray-900 dark:text-white">{payment.amount.toLocaleString()} 원</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{payment.company}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-base font-semibold text-gray-900 dark:text-white">{payment.merchant}</div>
                        {payment.reward > 0 && <div className="text-sm text-green-600 dark:text-green-400 font-medium">+{payment.reward.toLocaleString()}원</div>}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* 상세 내역 모달 */}
        {detail && (
          <DetailModal
            dateLabel={`${year}년 ${month + 1}월 ${detail.day}일 17:11`}
          />
        )}
      </div>
    </DefaultDiv>
  );
};

export default CalendarView;