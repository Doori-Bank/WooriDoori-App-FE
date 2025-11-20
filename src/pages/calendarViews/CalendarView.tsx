import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import cardIcon from '@/assets/card-icon.svg';
import { DetailModal, Payment } from '@/components/calender/detail';
import { DutchPayModal } from '@/components/calender/DutchPayModal';
import { useCalendarStore } from '@/stores/calendarStore';
import DefaultDiv from '@/components/default/DefaultDiv';
import IconButton from '@/components/button/IconButton';
import { img } from '@/assets/img';
import "@/styles/calendar/calendar.styles.css";
import PullToRefreshIndicator from '@/components/calender/PullToRefreshIndicator';
import MonthCalendarSection from '@/components/calender/MonthCalendarSection';
import PaymentListByDate from '@/components/calender/PaymentListByDate';
import { apiList } from '@/api/apiList';
import { getCategoryMeta } from '@/utils/categoryMeta';
import { OneBtnModal } from '@/components/modal/OneBtnModal';

// 백엔드 응답을 프론트엔드 Payment 형식으로 변환
const convertBackendToPayment = (backendData: any): Payment => {
  const categoryMeta = getCategoryMeta(backendData.historyCategory);
  const dateStr = backendData.date || '';
  // 시간 정보가 없으면 기본값 "00:00" 추가
  const dateTime = dateStr.includes(' ') ? dateStr : `${dateStr} 00:00`;
  
  return {
    id: backendData.id,
    date: dateTime,
    category: categoryMeta.label,
    categoryColor: categoryMeta.color.replace('#', ''),
    company: backendData.historyName || '',
    amount: -(backendData.historyPrice || 0), // 음수로 변환
    includeInTotal: backendData.includeTotal === 'Y' || backendData.includeTotal === 'YES', // 백엔드는 "Y"/"N" 사용
    cardName: '우리 카드', // 백엔드에서 제공하지 않으면 기본값
    dutchPay: backendData.historyDutchpay || 1,
  };
};

const getCategoryIcon = (category: string) => {
  const iconMap: Record<string, string> = {
    '식비': img.foodIcon,
    '교통/자동차': img.trafficIcon,
    '편의점': img.martIcon,
    '쇼핑': img.shoppingIcon,
    '주거': img.residenceIcon,
    '병원': img.hospitalIcon,
    '이체': img.transferIcon,
    '술/유흥': img.entertainmentIcon,
    '통신': img.phoneIcon,
    '교육': img.educationIcon,
    '기타': img.etcIcon,
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
  const [paymentDataState, setPaymentDataState] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ message: string; showModal: boolean } | null>(null);

  // 캘린더 접기/펼치기 상태
  const [isCalendarCollapsed, setIsCalendarCollapsed] = useState(false);
  const [isManuallyOpened, setIsManuallyOpened] = useState(false); // 수동으로 열었는지
  const calendarTouchStartY = React.useRef(0);
  const isDateClickScrolling = React.useRef(false); // 날짜 클릭으로 인한 스크롤인지

  // Pull-to-refresh 상태 (캘린더 영역에서만)
  const [pullY, setPullY] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshStartY = React.useRef(0);
  const THRESHOLD = 80;
  const MAX_PULL = 130;

  // 월별 소비 내역 조회
  const fetchMonthlySpendings = async (targetDate: Date, showError = true) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const year = targetDate.getFullYear();
      const month = targetDate.getMonth() + 1;
      const dateStr = `${year}-${String(month).padStart(2, '0')}-01`;
      
      const result = await apiList.getMonthlySpendings(dateStr);
      
      // 받아온 데이터 콘솔에 출력
      console.log('📊 받아온 소비 내역 데이터:', result);
      console.log('📋 result.data:', result.data);
      
      if (result.success && result.data) {
        const spendings = result.data.spendings || [];
        console.log('💰 spendings 배열:', spendings);
        console.log('📝 spendings 개수:', spendings.length);
        
        const convertedPayments = spendings.map(convertBackendToPayment);
        console.log('🔄 변환된 Payment 데이터:', convertedPayments);
        setPaymentDataState(convertedPayments);
        
        // 데이터가 없을 때는 에러가 아니라 정상 상태
        if (spendings.length === 0) {
          console.log('📭 해당 월에 소비 내역이 없습니다.');
        }
      } else {
        const errorMessage = result.resultMsg || '소비 내역을 불러오는데 실패했습니다.';
        console.error('소비 내역 조회 실패:', errorMessage);
        setPaymentDataState([]);
        
        if (showError) {
          setError({
            message: errorMessage,
            showModal: true,
          });
        }
      }
    } catch (error: any) {
      console.error('소비 내역 조회 에러:', error);
      setPaymentDataState([]);
      
      // 네트워크 에러 처리
      let errorMessage = '소비 내역을 불러오는데 실패했습니다.';
      if (error?.message?.includes('Network Error') || error?.code === 'ERR_NETWORK') {
        errorMessage = '네트워크 연결을 확인해주세요.';
      } else if (error?.response?.status === 401) {
        errorMessage = '로그인이 필요합니다.';
      } else if (error?.response?.status === 404) {
        errorMessage = '해당 월의 소비 내역을 찾을 수 없습니다.';
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      if (showError) {
        setError({
          message: errorMessage,
          showModal: true,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // currentDate 변경 시 데이터 조회
  useEffect(() => {
    fetchMonthlySpendings(currentDate);
  }, [currentDate]);

  
  // detail 변경 감지하여 paymentData 업데이트 및 데이터 재조회
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
      // 수정 후 데이터 재조회 (선택적 - 필요시 주석 해제)
      // fetchMonthlySpendings(currentDate);
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

  // 캘린더 영역: 접기/펼치기 + Pull-to-refresh
  React.useEffect(() => {
    const calendarEl = calendarStickyRef.current;
    if (!calendarEl) return;

    const handleCalendarTouchStart = (e: TouchEvent) => {
      calendarTouchStartY.current = e.touches[0].clientY;
      refreshStartY.current = e.touches[0].clientY;
    };

    const handleCalendarTouchMove = (e: TouchEvent) => {
      const sc = scrollRef.current;
      if (!sc) return;
      
      const currentY = e.touches[0].clientY;
      const deltaY = currentY - calendarTouchStartY.current;
      
      // Pull-to-refresh 처리 (위로 당길 때, 스크롤 위치 무관)
      if (deltaY > 0 && !isRefreshing) {
        e.preventDefault();
        const pullDelta = currentY - refreshStartY.current;
        if (pullDelta > 0) {
          setIsPulling(true);
          const damped = Math.min(MAX_PULL, pullDelta * 0.6);
          setPullY(damped);
          return;
        }
      }
      
      // 캘린더 접기/펼치기 (아래로 또는 위로)
      if (Math.abs(deltaY) < 30) return;
      
      e.preventDefault(); // 캘린더에서는 스크롤 막기
      
      const swipeDown = deltaY < 0;
      
      if (swipeDown && !isCalendarCollapsed) {
        setIsCalendarCollapsed(true);
        setIsManuallyOpened(false); // 닫으면 수동 모드 해제
        calendarTouchStartY.current = currentY;
      } else if (!swipeDown && isCalendarCollapsed) {
        setIsCalendarCollapsed(false);
        setIsManuallyOpened(true); // 수동으로 열었음
        calendarTouchStartY.current = currentY;
      }
    };

    const handleCalendarTouchEnd = () => {
      if (isPulling && !isRefreshing) {
        if (pullY >= THRESHOLD) {
          setIsRefreshing(true);
          setTimeout(() => {
            fetchMonthlySpendings(currentDate, false); // Pull-to-refresh는 에러 모달 표시 안 함
            setPullY(0);
            setIsPulling(false);
            setIsRefreshing(false);
          }, 200);
        } else {
          setPullY(0);
          setIsPulling(false);
        }
      }
    };

    calendarEl.addEventListener('touchstart', handleCalendarTouchStart, { passive: true });
    calendarEl.addEventListener('touchmove', handleCalendarTouchMove, { passive: false });
    calendarEl.addEventListener('touchend', handleCalendarTouchEnd, { passive: true });
    
    return () => {
      calendarEl.removeEventListener('touchstart', handleCalendarTouchStart);
      calendarEl.removeEventListener('touchmove', handleCalendarTouchMove);
      calendarEl.removeEventListener('touchend', handleCalendarTouchEnd);
    };
  }, [isCalendarCollapsed, isPulling, isRefreshing, pullY, isManuallyOpened]);

  // 스크롤 위치에 따라 캘린더 자동 제어
  React.useEffect(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    let scrollTouchStartY = 0;

    const handleScrollTouchStart = (e: TouchEvent) => {
      scrollTouchStartY = e.touches[0].clientY;
    };

    const handleScrollTouchMove = (e: TouchEvent) => {
      const sc = scrollRef.current;
      if (!sc) return;
      
      const currentY = e.touches[0].clientY;
      const deltaY = scrollTouchStartY - currentY;
      
      // 맨 위에서 캘린더 열려있고 아래로 스크롤 시도: 먼저 캘린더 닫기
      if (sc.scrollTop === 0 && !isCalendarCollapsed && deltaY > 0) {
        e.preventDefault(); // 스크롤 완전 차단
        // 충분히 내렸을 때 캘린더 닫기
        if (Math.abs(deltaY) > 20) {
          setIsCalendarCollapsed(true);
          scrollTouchStartY = currentY;
          // 캘린더 닫힌 후 자동으로 스크롤 시작
          setTimeout(() => {
            if (sc.scrollTop === 0) {
              sc.scrollTop = 1;
            }
          }, 500); // 애니메이션 시간 후
        }
      }
      // 맨 위에서 캘린더 닫혀있고 위로 스크롤: 캘린더 열기
      else if (sc.scrollTop === 0 && isCalendarCollapsed && deltaY < 0) {
        // 충분히 올렸을 때만 캘린더 열기
        if (Math.abs(deltaY) > 20) {
          setIsCalendarCollapsed(false);
          setIsManuallyOpened(true); // 수동으로 열었음
          scrollTouchStartY = currentY;
        }
      }
    };

    const handleScroll = () => {
      const sc = scrollRef.current;
      if (!sc) return;
      
      // 조금이라도 내리면: 무조건 캘린더 닫기 (수동 모드도 해제)
      if (sc.scrollTop > 0) {
        if (!isCalendarCollapsed) {
          setIsCalendarCollapsed(true);
        }
        // 수동 모드 해제
        if (isManuallyOpened) {
          setIsManuallyOpened(false);
        }
      }
    };

    scrollEl.addEventListener('touchstart', handleScrollTouchStart, { passive: true });
    scrollEl.addEventListener('touchmove', handleScrollTouchMove, { passive: false });
    scrollEl.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      scrollEl.removeEventListener('touchstart', handleScrollTouchStart);
      scrollEl.removeEventListener('touchmove', handleScrollTouchMove);
      scrollEl.removeEventListener('scroll', handleScroll);
    };
  }, [isCalendarCollapsed, isManuallyOpened]);

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

  // 초기 렌더링 시 스크롤을 맨 위로 리셋
  React.useEffect(() => {
    const sc = scrollRef.current;
    if (sc) {
      sc.scrollTop = 0;
    }
  }, []);

  // 스크롤 시 현재 보이는 날짜 자동 선택 (결제 내역 영역 기준)
  React.useEffect(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    const handleScrollForDate = () => {
      // 날짜 클릭으로 인한 스크롤이면 자동 선택 안함
      if (isDateClickScrolling.current) return;
      
      // 스크롤 컨테이너의 viewport 영역
      const containerRect = scrollEl.getBoundingClientRect();
      
      // 스크롤 컨테이너 맨 위를 기준으로 (클릭 시 스크롤과 동일한 기준)
      const visibleTop = containerRect.top;
      
      // 가장 먼저 보이는 날짜 섹션 찾기
      let closestDay = null;
      let closestDistance = Infinity;
      
      for (const [day] of groupedPayments) {
        const el = dateRefs.current[day];
        if (el) {
          const rect = el.getBoundingClientRect();
          // 내역이 보이는 영역에 있는지 확인
          if (rect.bottom > visibleTop && rect.top < containerRect.bottom) {
            const distance = Math.abs(rect.top - visibleTop);
            if (distance < closestDistance) {
              closestDistance = distance;
              closestDay = parseInt(day);
            }
          }
        }
      }
      
      if (closestDay !== null && selectedDate !== closestDay) {
        setSelectedDate(closestDay);
      }
    };

    scrollEl.addEventListener('scroll', handleScrollForDate, { passive: true });
    
    return () => {
      scrollEl.removeEventListener('scroll', handleScrollForDate);
    };
  }, [groupedPayments, selectedDate]);

 // 날짜 클릭 - 해당 날짜를 맨 위로 스크롤
 const handleDateClick = (day: number | null) => {
  if (day) {
    setSelectedDate(day);
    isDateClickScrolling.current = true; // 날짜 클릭 스크롤 시작
    
    // 캘린더가 열려있으면 먼저 닫기
    if (!isCalendarCollapsed) {
      setIsCalendarCollapsed(true);
      setIsManuallyOpened(false);
    }
    
    // 캘린더 닫히는 시간 대기 후 스크롤
    setTimeout(() => {
      const dayKey = day.toString();
      const targetEl = dateRefs.current[dayKey];
      const sc = scrollRef.current;
      
      if (targetEl && sc) {
        // 현재 스크롤 위치
        const currentScroll = sc.scrollTop;
        // 스크롤 컨테이너의 위치
        const containerRect = sc.getBoundingClientRect();
        // 타겟 요소의 위치
        const targetRect = targetEl.getBoundingClientRect();
        
        // 타겟이 스크롤 컨테이너의 맨 위에 오도록 계산
        const scrollTo = currentScroll + (targetRect.top - containerRect.top);
        
        sc.scrollTo({ 
          top: scrollTo, 
          behavior: 'smooth' 
        });
      }
      
      // 스크롤 완료 후 플래그 해제
      setTimeout(() => {
        isDateClickScrolling.current = false;
      }, 600);
    }, isCalendarCollapsed ? 0 : 500); // 캘린더가 열려있었으면 닫히는 시간 대기
  }
};

  return (
    <DefaultDiv 
      isPadding={false} 
      isBottomNav={true} 
      title='소비내역' 
      isHeader={true}
      style={{ backgroundColor: '#FBFBFB' }}
      isShowClose={false}
      headerChildren={
          <IconButton onClick={() => navigate('/calendar/diary')}
            src={img.diaryIcon.toString()}
            alt="일기"
            height={24}
          />
      }
    > 
      {/* Pull-to-refresh 인디케이터 */}
      <PullToRefreshIndicator 
        pullY={pullY}
        isPulling={isPulling}
        isRefreshing={isRefreshing}
        threshold={THRESHOLD}
      />

      <div 
        className="flex relative flex-col transition-transform"
        style={{ 
          height: 'calc(100vh - 6rem - 6rem)',
          transform: `translateY(${pullY}px)`,
          transitionDuration: isPulling ? '0ms' : '180ms'
        }}
      >
        {/* 월 선택 + 캘린더 영역 */}
        <MonthCalendarSection
          month={month}
          changeMonth={changeMonth}
          calendarStickyRef={calendarStickyRef}
          calendarDays={calendarDays}
          selectedDate={selectedDate}
          onDateClick={handleDateClick}
          isCalendarCollapsed={isCalendarCollapsed}
          currentWeekDays={currentWeekDays}
          dateHeight="h-20"
          renderDateContent={(day) => {
            const dayTotal = getDayTotal(day);
            return (
              <div className="mt-[0.5rem] text-md text-red-500 font-medium h-3.5 leading-3.5 whitespace-nowrap">
                {dayTotal < 0 ? dayTotal.toLocaleString() : ''}
              </div>
            );
          }}
        />

        {/* 결제 내역 리스트 영역 (별도 스크롤) */}
        <div 
          ref={scrollRef}
          className="overflow-y-auto overscroll-contain flex-1 px-5 pb-32"
        >
          {isLoading && paymentDataState.length === 0 ? (
            // 로딩 상태
            <div className="flex flex-col items-center justify-center h-full min-h-[200px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4C8B73] mb-4"></div>
              <p className="text-[1.4rem] text-gray-500">소비 내역을 불러오는 중...</p>
            </div>
          ) : paymentDataState.length === 0 && !isLoading ? (
            // 빈 데이터 상태
            <div className="flex flex-col items-center justify-center h-full min-h-[200px] px-4">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-[1.6rem] font-semibold text-gray-700 mb-2">
                소비 내역이 없습니다
              </p>
              <p className="text-[1.2rem] text-gray-500 text-center">
                {year}년 {month + 1}월에는<br />
                기록된 소비 내역이 없습니다.
              </p>
            </div>
          ) : (
            // 정상 데이터 표시
          <PaymentListByDate
            groupedPayments={groupedPayments}
            year={year}
            month={month}
            dateRefs={dateRefs}
            onPaymentClick={(day, payment) => setDetail({ day, data: payment })}
            getCategoryIcon={getCategoryIcon}
          />
          )}
        </div>

      </div>

       {/* 상세 내역 모달 */}
       {detail && (
          <DetailModal
            dateLabel={detail.data.date}
          />
        )}

        {/* 더치페이 모달 */}
        <DutchPayModal />

        {/* 에러 모달 */}
        <OneBtnModal
          isOpen={error?.showModal || false}
          message={
            <div className="py-2">
              <div className="text-5xl mb-4">⚠️</div>
              <p className="text-[1.4rem] leading-relaxed">{error?.message}</p>
            </div>
          }
          confirmTitle="확인"
          confirmColor="#4C8B73"
          onConfirm={() => {
            setError(null);
          }}
        />
    </DefaultDiv>
  );
};

export default CalendarView;