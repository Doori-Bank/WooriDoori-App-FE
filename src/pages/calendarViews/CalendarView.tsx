import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cardIcon from '@/assets/card-icon.svg';
import { DetailModal, DutchPayModal, Payment } from '@/components/calender/detail';
import { useCalendarStore } from '@/stores/calendarStore';
import DefaultDiv from '@/components/default/DefaultDiv';
import IconButton from '@/components/button/IconButton';
import { img } from '@/assets/img';
import "@/styles/calendar/calendar.styles.css";
import NavBar from '@/components/default/NavBar';


// 결제 데이터 (테이블 형식 - 플랫 배열)
const paymentData: Payment[] = [
  // 10월 데이터
  { id: 1, date: "2025-10-01 12:30", category: "식비", categoryColor: "FF715B", company: "(주) KFC", amount: -20000, includeInTotal: true, cardName: "네이버페이 우리 카드", dutchPay: 1 },
  { id: 2, date: "2025-10-03 09:15", category: "교통/자동차", categoryColor: "34D1BF", company: "(주) 버스타고", amount: -47100, includeInTotal: true, cardName: "네이버페이 우리 카드", dutchPay: 1 },
  { id: 3, date: "2025-10-04 18:45", category: "편의점", categoryColor: "FFC456", company: "(주) CU 편의점", amount: -17000, includeInTotal: true, cardName: "네이버페이 우리 카드" , dutchPay: 1 },
  { id: 4, date: "2025-10-06 14:20", category: "식비", categoryColor: "FF715B", company: "(주) 스타벅스코리아", amount: -17000, includeInTotal: true, cardName: "네이버페이 우리 카드" , dutchPay: 1 },
  { id: 5, date: "2025-10-07 16:00", category: "쇼핑", categoryColor: "345BD1", company: "(주) CJ올리브영", amount: -180000, includeInTotal: true, cardName: "네이버페이 우리 카드" , dutchPay: 1 },
  { id: 6, date: "2025-10-10 10:30", category: "쇼핑", categoryColor: "FF715B", company: "(주) 쿠팡", amount: -180000, includeInTotal: true, cardName: "네이버페이 우리 카드", dutchPay: 1  },
  { id: 7, date: "2025-10-11 00:00", category: "주거", categoryColor: "FFF1D6", company: "월세", amount: -300000, includeInTotal: true, cardName: "우리 체크카드" , dutchPay: 1 },
  { id: 8, date: "2025-10-12 11:00", category: "병원", categoryColor: "31BB66", company: "(주) 조은피부과", amount: -15000, includeInTotal: true, cardName: "네이버페이 우리 카드" , dutchPay: 1 },
  { id: 9, date: "2025-10-13 15:45", category: "이체", categoryColor: "FFF495", company: "최홍석", amount: -15000, includeInTotal: true, cardName: "우리 체크카드" , dutchPay: 1 },
  { id: 10, date: "2025-10-14 20:00", category: "술/유흥", categoryColor: "FF715B", company: "오늘의술", amount: -15000, includeInTotal: true, cardName: "네이버페이 우리 카드" , dutchPay: 1 },
  { id: 11, date: "2025-10-15 13:15", category: "쇼핑", categoryColor: "345BD1", company: "(주) 네이버페이", amount: -15000, includeInTotal: true, cardName: "네이버페이 우리 카드", dutchPay: 1  },
  { id: 12, date: "2025-10-16 14:30", category: "쇼핑", categoryColor: "345BD1", company: "(주) 네이버페이", amount: -15000, includeInTotal: true, cardName: "네이버페이 우리 카드" , dutchPay: 1 },
  { id: 13, date: "2025-10-17 17:20", category: "쇼핑", categoryColor: "345BD1", company: "(주) 네이버페이", amount: -15000, includeInTotal: true, cardName: "네이버페이 우리 카드", dutchPay: 1  },
  { id: 14, date: "2025-10-18 08:00", category: "통신", categoryColor: "FFF", company: "(주) LG유플러스", amount: -100000, includeInTotal: true, cardName: "우리 체크카드", dutchPay: 1  },
  { id: 15, date: "2025-10-19 19:30", category: "쇼핑", categoryColor: "345BD1", company: "(주) 네이버페이", amount: -15000, includeInTotal: true, cardName: "네이버페이 우리 카드", dutchPay: 1  },
  { id: 16, date: "2025-10-20 11:45", category: "쇼핑", categoryColor: "345BD1", company: "(주) 네이버페이", amount: -15000, includeInTotal: true, cardName: "네이버페이 우리 카드" , dutchPay: 1 },
  { id: 17, date: "2025-10-21 16:15", category: "쇼핑", categoryColor: "345BD1", company: "(주) 네이버페이", amount: -15000, includeInTotal: true, cardName: "네이버페이 우리 카드" , dutchPay: 1 },
  { id: 18, date: "2025-10-22 10:00", category: "교육", categoryColor: "969191", company: "(주) 메가스터디", amount: -15000, includeInTotal: true, cardName: "네이버페이 우리 카드", dutchPay: 1  },
  { id: 19, date: "2025-10-23 12:30", category: "기타", categoryColor: "E4EAF0", company: "합정역", amount: -15000, includeInTotal: true, cardName: "네이버페이 우리 카드", dutchPay: 1  },
  // 9월 데이터
  { id: 20, date: "2025-09-01 14:00", category: "이체", categoryColor: "FF715B", company: "김순자", amount: -15000, includeInTotal: true, cardName: "우리 체크카드", dutchPay: 1  },
  { id: 21, date: "2025-09-01 15:30", category: "식비", categoryColor: "FF715B", company: "(주) 메가커피", amount: -5000, includeInTotal: true, cardName: "네이버페이 우리 카드", dutchPay: 1  },
  { id: 22, date: "2025-09-03 09:00", category: "쇼핑", categoryColor: "345BD1", company: "(주) 네이버페이", amount: -456000, includeInTotal: true, cardName: "네이버페이 우리 카드", dutchPay: 1  },
  { id: 23, date: "2025-09-03 19:15", category: "식비", categoryColor: "FF715B", company: "콘하스", amount: -15000, includeInTotal: true, cardName: "네이버페이 우리 카드", dutchPay: 1  },
];
const getCategoryIcon = (category: string) => {
  const iconMap: Record<string, string> = {
    '식비': img.food,
    '교통/자동차': img.traffic,
    '편의점': img.storeIcon,
    '쇼핑': img.shopping,
    '주거': img.homeIcon,
    '병원': img.hospitalIcon,
    '이체': img.transfer,
    '술/유흥': img.drinkIcon,
    '통신': img.phoneIcon,
    '교육': img.education,
    '기타': img.etc,
  };
  
  return iconMap[category] || cardIcon; // 매칭 안되면 기본 카드 아이콘
};
const CalendarView = () => {
  const navigate = useNavigate();
  
  // Zustand store 사용
  const currentDate = useCalendarStore((state) => state.currentDate);
  const selectedDate = useCalendarStore((state) => state.selectedDate);
  const detail = useCalendarStore((state) => state.detail);
  const dutchPayModal = useCalendarStore((state) => state.dutchPayModal);
  const setSelectedDate = useCalendarStore((state) => state.setSelectedDate);
  const setDetail = useCalendarStore((state) => state.setDetail);
  const changeMonth = useCalendarStore((state) => state.changeMonth);
  
  const dateRefs = React.useRef<Record<string, HTMLDivElement | null>>({});
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const calendarStickyRef = React.useRef<HTMLDivElement | null>(null);

  // Payment 데이터를 state로 관리
  const [paymentDataState, setPaymentDataState] = useState<Payment[]>(paymentData);

  // Pull-to-refresh 상태
  const [pullY, setPullY] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startYRef = React.useRef(0);
  const THRESHOLD = 80;
  const MAX_PULL = 130;

  
  // detail 변경 감지하여 paymentData 업데이트
  React.useEffect(() => {
    if (detail && detail.data.id) {
      setPaymentDataState(prev => {
        return prev.map(p => {
          if (p.id === detail.data.id) {
            return {
              ...p,
              category: detail.data.category,
              categoryColor: detail.data.categoryColor,
              includeInTotal: detail.data.includeInTotal,
            };
          }
          return p;
        });
      });
    }
  }, [detail]);

  // DutchPayModal 완료 시 데이터 업데이트 (더치페이 인원과 수정된 금액 업데이트)
  React.useEffect(() => {
    if (dutchPayModal && dutchPayModal.id && dutchPayModal.dutchPay) {
      setPaymentDataState(prev => {
        return prev.map(p => {
          if (p.id === dutchPayModal.id) {
            return {
              ...p,
              dutchPay: dutchPayModal.dutchPay || p.dutchPay,
              amount: dutchPayModal.amount,
            };
          }
          return p;
        });
      });
    }
  }, [dutchPayModal]);

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

  // 현재 월의 필터링된 데이터 (date에서 날짜만 추출)
  const currentMonthFiltered = paymentDataState.filter(payment => {
    const dateOnly = payment.date.split(' ')[0]; // "YYYY-MM-DD"
    const [yy, mm] = dateOnly.split('-').map(Number);
    return yy === year && (mm - 1) === month; // 문자열 파싱으로 TZ 이슈 회피
  });

  // 해당 날짜의 총 지출 계산 (더치페이 고려)
  const getDayTotal = (day: number): number => {
    const dayData = currentMonthFiltered.filter(payment => {
      const dateOnly = payment.date.split(' ')[0];
      const dayNum = parseInt(dateOnly.split('-')[2], 10);
      return dayNum === day;
    });
    
    return dayData.reduce((sum, payment) => {
      // includeInTotal이 false인 경우 제외
      if (payment.includeInTotal === false) {
        return sum;
      }
      // 더치페이 인원이 1명보다 많으면 금액을 인원수로 나눔 (올림)
      const displayAmount = payment.dutchPay && payment.dutchPay > 1 
        ? Math.ceil(payment.amount / payment.dutchPay) 
        : payment.amount;
      return sum + displayAmount;
    }, 0);
  };

  // 날짜별로 그룹화된 결제 내역
  const groupedPaymentsMap = currentMonthFiltered.reduce((acc, payment) => {
    const dateOnly = payment.date.split(' ')[0];
    const day = parseInt(dateOnly.split('-')[2], 10);
    const dayKey = day.toString();
    if (!acc[dayKey]) {
      acc[dayKey] = [];
    }
    acc[dayKey].push(payment);
    return acc;
  }, {} as Record<string, Payment[]>);
  
  const groupedPayments = (Object.entries(groupedPaymentsMap) as [string, Payment[]][])
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

 // 날짜 클릭
 const handleDateClick = (day: number | null) => {
  if (day) {
    setSelectedDate(day);
    const dayKey = day.toString();
    const targetEl = dateRefs.current[dayKey];
    const sc = scrollRef.current;
    if (targetEl && sc) {
      // 자기 스크롤 컨테이너 기준 위치를 계산
      const stickyH = calendarStickyRef.current?.clientHeight ?? 0;
      const containerTop = sc.getBoundingClientRect().top;
      const targetTopInViewport = targetEl.getBoundingClientRect().top;
      const currentScrollTop = sc.scrollTop;
      const delta = targetTopInViewport - containerTop; // 컨테이너 상단부터 목표까지 거리
      const targetTop = currentScrollTop + delta - stickyH + 1; // 여유 8px
      sc.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
    }
  }
};
  return (
    <DefaultDiv isPadding={false}>
      <div className="flex relative flex-col h-screen dark:bg-gray-700">
        {/* 헤더 (상단 고정) */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[100vw] max-w-[400px] z-[60] bg-white border-b border-gray-200">
          <div className="flex justify-between items-center px-5 py-all">
            <div className="block gap-2 items-center">
              <div className="flex relative items-center text-3xl font-semibold text-center border-b border-gray-100 dark:border-gray-600">소비내역</div>
            </div>
              <button onClick={() => navigate('/calendar/diary')}>
                <IconButton
                  src={img.diaryIcon.toString()}
                  alt="일기"
                  height={28}
                />
              </button>
          </div>
          
          {/* 월 선택 (헤더에 포함) */}
          <div className="flex gap-5 justify-center items-center px-5 mb-5">
            <div 
              onClick={() => changeMonth(-1)} 
              className="text-2xl text-gray-600 transition-colors cursor-pointer select-none dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
            >
              ◀
            </div>
            <span className="text-2xl font-400 dark:text-white">{month + 1}월</span>
            <div 
              onClick={() => changeMonth(1)} 
              className="text-2xl text-gray-600 transition-colors cursor-pointer select-none dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
            >
              ▶
            </div>
          </div>
        </div>

        {/* 헤더 공간 확보 (헤더 높이만큼) */}
        <div className="h-[12rem]"></div>

        {/* Pull-to-refresh 인디케이터 */}
        <div 
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] max-w-[400px] bg-gray-100 flex items-end justify-center overflow-hidden border-b ${
            pullY > 0 || isRefreshing ? 'flex' : 'hidden'
          } ${isPulling ? '' : 'transition-all duration-180 ease-out'}`}
          style={{ height: `${Math.max(0, pullY)}px` }}
        >
          <div className="relative pb-2 w-full text-xs text-center text-gray-500">
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

        {/* 결제 내역 리스트 (스크롤 가능) */}
        <div 
          ref={scrollRef}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          className="overflow-y-auto flex-1 px-5 pb-60"
        >
            {/* 캘린더 (스크롤 컨테이너 상단 sticky) */}
            <div ref={calendarStickyRef} className="sticky top-0 z-[55] bg-white dark:bg-gray-700 pt-2 pb-5">
              {/* 요일 헤더 */}
              <div className="grid grid-cols-7 gap-1 mb-3">
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
                  const dayTotal = day ? getDayTotal(day) : 0;
                  const isSelected = day === selectedDate;

                  return (
                    <div
                      key={idx}
                      onClick={() => handleDateClick(day)}
                      className={`h-20 flex flex-col items-center justify-start pt-2 rounded-3xl relative cursor-${day ? 'pointer' : 'default'} ${
                        isSelected ? 'shadow-xl' : 'bg-transparent'
                      }`}
                    >
                      {day && (
                        <>
                          <div className={` text-5lg text-base mb-1 h-5 leading-5 text-gray-900 ${
                            isSelected ? 'font-semibold' : 'font-normal'
                          }`}>
                            {day}
                          </div>
                          <div className="mt-[0.5rem] text-md text-red-500 dark:text-red-400 font-medium h-3.5 leading-3.5 whitespace-nowrap">
                            {dayTotal < 0 ? dayTotal.toLocaleString() : ''}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            {groupedPayments.map(([day, payments]) => {
              const date = new Date(year, month, parseInt(day));
              const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];

              return (
                <div
                  key={day}
                  ref={(el) => (dateRefs.current[day] = el)}
                  className="mb-8 scroll-mt-[14rem]"
                >
                  <div className="mb-4 text-xl font-medium text-gray-600 dark:text-gray-300">{day}일 {dayOfWeek}요일</div>
                  {payments.map((payment, idx) => (
                    <div
                      key={idx}
                      onClick={() => setDetail({ day, data: payment })}
                      className="flex gap-4 items-center p-4 mb-3 bg-white rounded-2xl shadow-sm transition-shadow cursor-pointer dark:bg-gray-600 hover:shadow-md dark:hover:shadow-lg"
                    >
                      <div 
                        className="flex flex-shrink-0 justify-center items-center w-20 h-20 rounded-full"
                        style={{ backgroundColor: `#${payment.categoryColor}` }}
                      >
                        <img
                          src={getCategoryIcon(payment.category) as any}
                          alt={payment.category}
                          className="object-contain w-12"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="mb-1 text-2xl font-bold text-gray-900 dark:text-white">
                          {(() => {
                            const displayAmount = payment.dutchPay && payment.dutchPay > 1 
                              ? Math.ceil(payment.amount / payment.dutchPay) 
                              : payment.amount;
                            return displayAmount.toLocaleString();
                          })()} 원
                          {payment.dutchPay && payment.dutchPay > 1 && (
                            <span className="ml-2 text-base text-blue-500">({payment.dutchPay}인)</span>
                          )}
                        </div>
                        <div className="text-xl text-gray-500 dark:text-gray-400">{payment.company}</div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
        </div>

        {/* 하단 네비게이션 (고정) */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[100vw] max-w-[400px] z-50">
          <NavBar />
        </div>

        {/* 상세 내역 모달 */}
        {detail && (
          <DetailModal
            dateLabel={detail.data.date}
          />
        )}

        {/* 더치페이 모달 */}
        <DutchPayModal />
      </div>
    </DefaultDiv>
  );
};

export default CalendarView;