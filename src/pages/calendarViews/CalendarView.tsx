import React, { useState } from 'react';
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


// 결제 데이터 (테이블 형식 - 플랫 배열)
const paymentData: Payment[] = [
  // 11월 데이터
  { id: 24, date: "2025-11-01 08:30", category: "식비", categoryColor: "FF715B", company: "(주) 투썸플레이스", amount: -8500, includeInTotal: true, cardName: "네이버페이 우리 카드", dutchPay: 1 },
  { id: 25, date: "2025-11-01 12:20", category: "식비", categoryColor: "FF715B", company: "(주) 맥도날드", amount: -12000, includeInTotal: true, cardName: "네이버페이 우리 카드", dutchPay: 2 },
  { id: 26, date: "2025-11-02 09:00", category: "교통/자동차", categoryColor: "34D1BF", company: "(주) 코레일", amount: -35000, includeInTotal: true, cardName: "네이버페이 우리 카드", dutchPay: 1 },
  { id: 27, date: "2025-11-03 14:15", category: "쇼핑", categoryColor: "345BD1", company: "(주) 다이소", amount: -23000, includeInTotal: true, cardName: "네이버페이 우리 카드", dutchPay: 1 },
  { id: 28, date: "2025-11-04 18:30", category: "식비", categoryColor: "FF715B", company: "(주) 버거킹", amount: -15000, includeInTotal: true, cardName: "네이버페이 우리 카드", dutchPay: 1 },
  { id: 29, date: "2025-11-05 10:45", category: "편의점", categoryColor: "FFC456", company: "(주) GS25", amount: -8900, includeInTotal: true, cardName: "네이버페이 우리 카드", dutchPay: 1 },
  { id: 30, date: "2025-11-06 16:20", category: "쇼핑", categoryColor: "345BD1", company: "(주) 무신사", amount: -89000, includeInTotal: true, cardName: "네이버페이 우리 카드", dutchPay: 1 },
  { id: 31, date: "2025-11-07 19:00", category: "술/유흥", categoryColor: "FF715B", company: "호프집", amount: -45000, includeInTotal: true, cardName: "네이버페이 우리 카드", dutchPay: 3 },
  { id: 32, date: "2025-11-08 13:30", category: "식비", categoryColor: "FF715B", company: "(주) 백다방", amount: -6500, includeInTotal: true, cardName: "네이버페이 우리 카드", dutchPay: 1 },
  { id: 33, date: "2025-11-09 11:00", category: "병원", categoryColor: "31BB66", company: "(주) 서울안과", amount: -25000, includeInTotal: true, cardName: "네이버페이 우리 카드", dutchPay: 1 },
  { id: 34, date: "2025-11-10 00:00", category: "주거", categoryColor: "FFF1D6", company: "월세", amount: -300000, includeInTotal: true, cardName: "우리 체크카드", dutchPay: 1 },
  { id: 35, date: "2025-11-11 15:45", category: "쇼핑", categoryColor: "345BD1", company: "(주) 11번가", amount: -67000, includeInTotal: true, cardName: "네이버페이 우리 카드", dutchPay: 1 },
  { id: 36, date: "2025-11-12 20:30", category: "식비", categoryColor: "FF715B", company: "치킨집", amount: -28000, includeInTotal: true, cardName: "네이버페이 우리 카드", dutchPay: 2 },
  { id: 37, date: "2025-11-13 09:20", category: "교통/자동차", categoryColor: "34D1BF", company: "(주) 카카오택시", amount: -18500, includeInTotal: true, cardName: "네이버페이 우리 카드", dutchPay: 1 },
  { id: 38, date: "2025-11-14 14:00", category: "편의점", categoryColor: "FFC456", company: "(주) 세븐일레븐", amount: -12500, includeInTotal: true, cardName: "네이버페이 우리 카드", dutchPay: 1 },
  { id: 39, date: "2025-11-15 12:15", category: "식비", categoryColor: "FF715B", company: "(주) 스타벅스코리아", amount: -9800, includeInTotal: true, cardName: "네이버페이 우리 카드", dutchPay: 1 },
  { id: 40, date: "2025-11-16 17:30", category: "쇼핑", categoryColor: "345BD1", company: "(주) 네이버페이", amount: -45000, includeInTotal: true, cardName: "네이버페이 우리 카드", dutchPay: 1 },
  { id: 41, date: "2025-11-17 10:00", category: "교육", categoryColor: "969191", company: "(주) 밀리의서재", amount: -9900, includeInTotal: true, cardName: "네이버페이 우리 카드", dutchPay: 1 },
  { id: 42, date: "2025-11-18 08:00", category: "통신", categoryColor: "FFF", company: "(주) KT", amount: -85000, includeInTotal: true, cardName: "우리 체크카드", dutchPay: 1 },
  { id: 43, date: "2025-11-19 13:45", category: "식비", categoryColor: "FF715B", company: "(주) 써브웨이", amount: -11000, includeInTotal: true, cardName: "네이버페이 우리 카드", dutchPay: 1 },
  { id: 44, date: "2025-11-20 19:20", category: "술/유흥", categoryColor: "FF715B", company: "와인바", amount: -65000, includeInTotal: true, cardName: "네이버페이 우리 카드", dutchPay: 2 },
  { id: 45, date: "2025-11-21 11:30", category: "쇼핑", categoryColor: "345BD1", company: "(주) 쿠팡", amount: -123000, includeInTotal: true, cardName: "네이버페이 우리 카드", dutchPay: 1 },
  { id: 46, date: "2025-11-22 15:00", category: "이체", categoryColor: "FFF495", company: "박민수", amount: -50000, includeInTotal: true, cardName: "우리 체크카드", dutchPay: 1 },
  { id: 47, date: "2025-11-23 18:15", category: "식비", categoryColor: "FF715B", company: "일식집", amount: -38000, includeInTotal: true, cardName: "네이버페이 우리 카드", dutchPay: 1 },
  { id: 48, date: "2025-11-24 10:20", category: "편의점", categoryColor: "FFC456", company: "(주) CU 편의점", amount: -15600, includeInTotal: true, cardName: "네이버페이 우리 카드", dutchPay: 1 },
  { id: 49, date: "2025-11-25 14:40", category: "쇼핑", categoryColor: "345BD1", company: "(주) CJ올리브영", amount: -72000, includeInTotal: true, cardName: "네이버페이 우리 카드", dutchPay: 1 },
  { id: 50, date: "2025-11-26 16:50", category: "기타", categoryColor: "E4EAF0", company: "주차장", amount: -10000, includeInTotal: true, cardName: "네이버페이 우리 카드", dutchPay: 1 },
  { id: 51, date: "2025-11-27 12:00", category: "식비", categoryColor: "FF715B", company: "(주) 롯데리아", amount: -13500, includeInTotal: true, cardName: "네이버페이 우리 카드", dutchPay: 1 },
  { id: 52, date: "2025-11-28 20:00", category: "술/유흥", categoryColor: "FF715B", company: "노래방", amount: -32000, includeInTotal: true, cardName: "네이버페이 우리 카드", dutchPay: 4 },
  { id: 53, date: "2025-11-29 09:30", category: "교통/자동차", categoryColor: "34D1BF", company: "(주) 주유소", amount: -75000, includeInTotal: true, cardName: "네이버페이 우리 카드", dutchPay: 1 },
  { id: 54, date: "2025-11-30 14:20", category: "식비", categoryColor: "FF715B", company: "(주) 이디야커피", amount: -4500, includeInTotal: true, cardName: "네이버페이 우리 카드", dutchPay: 1 },
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
  const [paymentDataState, setPaymentDataState] = useState<Payment[]>(paymentData);

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
            window.location.reload();
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
          <PaymentListByDate
            groupedPayments={groupedPayments}
            year={year}
            month={month}
            dateRefs={dateRefs}
            onPaymentClick={(day, payment) => setDetail({ day, data: payment })}
            getCategoryIcon={getCategoryIcon}
          />
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

    </DefaultDiv>
  );
};

export default CalendarView;