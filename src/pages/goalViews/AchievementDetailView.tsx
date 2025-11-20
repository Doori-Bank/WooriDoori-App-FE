import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DefaultDiv from "@/components/default/DefaultDiv";
import BorderBox from "@/components/default/BorderBox";
import { img } from "@/assets/img";
import RadarChart from "@/components/RadarChart";
import ConsumptionGradeGauge from "@/components/Progress/ConsumptionGradeGauge";
import ChatModal from "@/components/modal/ChatModal";
import "@/styles/goal/gaugePointerAnimations.css";
import "@/styles/home/animations.css";
import { apiList } from "@/api/apiList";
import { useUserStore } from "@/stores/useUserStore";

// 백엔드 DTO (DashboardResponseDto) 기반 TypeScript 인터페이스 정의
type TopCategorySpending = Record<string, number>;

interface AchievementDetailDto {
  goalAmount: number;           // 이번달 목표 금액
  achievementRate: number;      // 이번달 달성률 (0~100)
  achievementScore: number;     // 목표 달성도 점수 (0~40)
  stabilityScore: number;       // 소비 안정성 점수 (0~20)
  ratioScore: number;           // 필수/비필수 비율 점수 (0~20)
  continuityScore: number;      // 절약 지속성 점수 (0~20)
  topCategorySpending: TopCategorySpending; // 카테고리별 소비 금액 Map
  comment?: string;
}

// 💡 HistoryView에서 전달받는 항목의 타입 정의 (날짜 포함)
interface HistoryItem {
  goalStartDate: string; // "YYYY-MM-DD" 형식 (날짜 정보는 이 필드에서 추출)
}


export default function AchievementDetailView() {
  const navigate = useNavigate();
  const { state } = useLocation();
  
  const { userInfo, isLoggedIn } = useUserStore();
  const userName = isLoggedIn && userInfo?.name ? userInfo.name : "사용자";

  const historyList = state?.historyList as HistoryItem[] | undefined; // 1. 전체 달성도 리스트를 받습니다.
  const initialYear = state?.year as number;
  const initialMonth = state?.month as number;
  const from = state?.from || "home";

  // 💡 2. 초기 인덱스 계산 (year와 month가 일치하는 항목을 찾습니다.)
  const getInitialIndex = () => {
    if (!historyList || historyList.length === 0) return -1;
    
    // 리스트에서 처음 진입한 year/month와 일치하는 항목의 인덱스를 찾습니다.
    return historyList.findIndex(item => {
      const dateString = item.goalStartDate;
      const itemYear = Number(dateString?.slice(0, 4));
      const itemMonth = Number(dateString?.slice(5, 7));
      return itemYear === initialYear && itemMonth === initialMonth;
    });
  };

  const initialIndex = getInitialIndex();
  
  // 💡 3. 현재 인덱스를 관리하는 상태 (이전/다음 버튼 클릭 시 이 값이 변경됨)
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  
  // 💡 4. 현재 조회할 데이터 항목을 인덱스로부터 추출
  const currentItem = currentIndex !== -1 && historyList ? historyList[currentIndex] : null;

  // 💡 5. 현재 조회 중인 연도와 월은 현재 항목의 goalStartDate에서 추출
  const currentYear = currentItem ? Number(currentItem.goalStartDate?.slice(0, 4)) : initialYear;
  const currentMonth = currentItem ? Number(currentItem.goalStartDate?.slice(5, 7)) : initialMonth;

  // 6. API 응답 DTO로 상태 타입 정의
  const [detail, setDetail] = useState<AchievementDetailDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  
  // 7. API 호출 및 데이터 로드 useEffect (currentIndex 변경 시 재실행)
  useEffect(() => {
    // 💡 currentIndex가 유효하고, 년/월 정보가 있을 때만 API 호출
    if (currentIndex !== -1 && currentYear && currentMonth) {
      setLoading(true);
      setDetail(null); // 새로운 월 데이터 로드 시 이전 데이터 초기화

      apiList.goaldetail.getGoalDetail(currentYear, currentMonth) 
        .then((data: AchievementDetailDto) => {
          setDetail(data);
        })
        .catch(err => {
          console.error(`목표 상세 기록 조회 실패: ${currentYear}.${currentMonth}`, err);
          // 실제 서비스에서는 에러 시 Alert 대신 빈 화면이나 메시지를 표시하는 것이 일반적입니다.
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [currentIndex, currentYear, currentMonth]); // 💡 currentIndex가 변경될 때마다 재실행!

  // 8. 이전/다음 데이터 기록으로 이동하는 로직 (인덱스 기반)
    const handleNavigateMonth = (direction: "prev" | "next") => {
    if (!historyList || currentIndex === -1) return;

    // HistoryList가 일반적으로 최신순(Index 0)으로 정렬되었다고 가정
    if (direction === "prev") {
      // '이전 달' 버튼 (과거 기록으로 이동 -> 인덱스 증가)
      if (currentIndex >= historyList.length - 1) {
        setCurrentIndex(currentIndex - 1);
      }
    } else {
      // '다음 달' 버튼 (최신 기록으로 이동 -> 인덱스 감소)
      if (currentIndex <= 0) {
        setCurrentIndex(currentIndex + 1);
      }
    }
  };

  // 9. 네비게이션 핸들러
  const handleBack = () => navigate(-1);
  const handleClose = () => (from === "mypage" ? navigate("/mypage") : navigate("/home"));

  // 10. 스와이프 제스처를 위한 ref와 state (달 이동 기능을 위해 유지)
  const contentRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number>(0);
  const touchEndY = useRef<number>(0);
  const isScrolling = useRef<boolean>(false);
  
  // ✅ 카테고리 매핑 함수 (유지)
  const getCategoryInfo = (categoryName: string) => {
    const categoryMap: Record<string, { icon: string; color: string }> = {
      'FOOD': { icon: img.foodIcon, color: "#FF715B" },
      'CAFE': { icon: img.coffeeIcon, color: "#d1a234ff" },
      'TRANSPORTATION': { icon: img.trafficIcon, color: "#34D1BF" },
      'CONVENIENCE_STORE': { icon: img.martIcon, color: "#FFC456" },
      'SHOPPING': { icon: img.shoppingIcon, color: "#345BD1" },
      'TRAVEL': { icon: img.travelIcon, color: "#d134c7ff" },
      'HOUSING': { icon: img.residenceIcon, color: "#FFF1D6" },
      'HOSPITAL': { icon: img.hospitalIcon, color: "#31BB66" },
      'TRANSFER': { icon: img.transferIcon, color: "#FFF495" },
      'ALCOHOL_ENTERTAINMENT': { icon: img.entertainmentIcon, color: "#FF715B" },
      'TELECOM': { icon: img.phoneIcon, color: "#FFFFFF" },
      'EDUCATION': { icon: img.educationIcon, color: "#969191" },
      'ETC': { icon: img.etcIcon, color: "#E4EAF0" },
    };
    const displayNames: Record<string, string> = {
        'FOOD': '식비', 'TRANSPORTATION': '교통/자동차', 'CONVENIENCE_STORE': '편의점',
        'SHOPPING': '쇼핑', 'HOUSING': '주거', 'HOSPITAL': '병원',
        'TRANSFER': '이체', 'ENTERTAINMENT': '주류/유흥', 'TELECOM': '통신',
        'EDUCATION': '교육', 'ETC': '기타', 'ALCOHOL_ENTERTAINMENT': '술/유흥', // DTO 키값에 맞춰 추가
    };
    const info = categoryMap[categoryName] || { icon: img.etcIcon, color: "#E4EAF0" };
    return { ...info, displayName: displayNames[categoryName] || categoryName };
  };


  // 11. 데이터 추출 및 계산 (detail 상태 기반)
  const achievementRate = detail?.achievementRate ?? 0; // 달성률 (0~100)
  const goalAmount = detail?.goalAmount ?? 0; // 목표 금액
  
  const currentMonthDisplay = `${currentYear}.${String(currentMonth).padStart(2, '0')}`;

  // 4개 점수 데이터
  const achievementScore = detail?.achievementScore || 0;
  const stabilityScore = detail?.stabilityScore || 0;
  const ratioScore = detail?.ratioScore || 0;
  const continuityScore = detail?.continuityScore || 0;
  
  const totalScore = achievementScore + stabilityScore + ratioScore + continuityScore; // 0~100

  // Radar 차트용 점수 환산 (100점 만점 기준)
  const achievementScorePercent = (achievementScore / 40) * 100;
  const stabilityScorePercent = (stabilityScore / 20) * 100;
  const ratioScorePercent = (ratioScore / 20) * 100;
  const continuityScorePercent = (continuityScore / 20) * 100;

  // 소비 등급 계산 (1~5등급)
  const getGrade = (p: number) => {
    if (p <= 20) return 1;
    if (p <= 40) return 2;
    if (p <= 60) return 3;
    if (p <= 80) return 4;
    return 5;
  };
  const grade = getGrade(totalScore);
  
  // Radar 차트 표시 조건
  const shouldShowScore = detail !== null && totalScore > 0;

  // TOP 4 카테고리
  const top4 = Object.entries(detail?.topCategorySpending || {})
      .sort(([, priceA], [, priceB]) => priceB - priceA) 
      .slice(0, 4) 
      .map(([categoryName, price]) => {
      const categoryInfo = getCategoryInfo(categoryName);
      return {
        icon: categoryInfo.icon,
        price: price,
        color: categoryInfo.color,
      };
  });

  

  const fmt = (n: number) =>
    n.toLocaleString("ko-KR", { maximumFractionDigits: 0 });

  // 12. 스와이프 제스처 핸들러 (인덱스 기반 로직으로 연결)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    isScrolling.current = false;
  };

  const handleTouchMove = (_e: React.TouchEvent) => {
    if (contentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      const isAtTop = scrollTop === 0;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
      
      if (scrollHeight > clientHeight && !isAtTop && !isAtBottom) {
        isScrolling.current = true;
        return;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isScrolling.current) return;
    
    touchEndY.current = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY.current;
    const minSwipeDistance = 50; 

    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0) {
        // 위로 스와이프 (다음 기록 시도: 인덱스 감소)
        handleNavigateMonth("next");
      } else {
        // 아래로 스와이프 (이전 기록 시도: 인덱스 증가)
        handleNavigateMonth("prev");
      }
    }
  };
  
  // 마우스 드래그 지원 핸들러 (인덱스 기반 로직으로 연결)
  const handleMouseDown = (e: React.MouseEvent) => {
    touchStartY.current = e.clientY;
    isScrolling.current = false;
  };

  const handleMouseMove = (_e: React.MouseEvent) => {
    if (touchStartY.current === 0) return;
    
    if (contentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      const isAtTop = scrollTop === 0;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
      
      if (scrollHeight > clientHeight && !isAtTop && !isAtBottom) {
        isScrolling.current = true;
        return;
      }
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (isScrolling.current || touchStartY.current === 0) {
      touchStartY.current = 0;
      return;
    }
    
    touchEndY.current = e.clientY;
    const diff = touchStartY.current - touchEndY.current;
    const minSwipeDistance = 50;

    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0) {
        // 위로 드래그 (다음 기록 시도: 인덱스 감소)
        handleNavigateMonth("next");
      } else {
        // 아래로 드래그 (이전 기록 시도: 인덱스 증가)
        handleNavigateMonth("prev");
      }
    }
    
    touchStartY.current = 0;
  };
  
  // 💡 인덱스 기반 버튼 활성화/비활성화 상태
  const isFirstItem = currentIndex === 0; // 가장 최신 기록 (다음 버튼 비활성화)
  const isLastItem = historyList && currentIndex === historyList.length - 1; // 가장 오래된 기록 (이전 버튼 비활성화)


  // 13. 로딩/데이터 없음 상태 처리
  if (loading || currentIndex === -1) { // 💡 currentIndex가 -1이면 유효하지 않은 접근으로 간주
    return (
      <DefaultDiv title="목표 관리" isHeader onBack={handleBack} onClose={handleClose}>
        <div className="flex flex-col justify-center items-center h-full text-[1.6rem] text-gray-500">
          {loading ? "데이터를 불러오는 중입니다..." : (
            <>
              <p>목표 기록을 찾을 수 없거나 데이터가 전달되지 않았습니다. 😭</p>
              <button className="mt-4 text-blue-500 text-[1.4rem] hover:underline" onClick={handleBack}>
                뒤로 돌아가기
              </button>
            </>
          )}
        </div>
      </DefaultDiv>
    );
  }

  // API 호출 실패 시 (detail이 null일 경우)
  if (!detail) {
    return (
      <DefaultDiv title="목표 관리" isHeader onBack={handleBack} onClose={handleClose}>
        <div className="flex flex-col justify-center items-center h-full text-[1.6rem] text-gray-500">
          <p>{currentMonthDisplay}의 목표 기록 상세 정보를 로드할 수 없습니다. 😭</p>
          <button className="mt-4 text-blue-500 text-[1.4rem] hover:underline" onClick={handleBack}>
            뒤로 돌아가기
          </button>
        </div>
      </DefaultDiv>
    );
  }


  return (
    <DefaultDiv
      isHeader
      title="목표 관리"
      isShowBack
      isShowClose
      isShowSetting={false}
      onBack={handleBack}
      onClose={handleClose}
      isMainTitle={false}
      isBottomNav={true}
    >
      <div 
        ref={contentRef}
        className="flex overflow-y-auto relative flex-col gap-6 px-4 pt-4 pb-24 h-full"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* ✅ 월 선택 (인덱스 기반 로직 적용) */}
        <div className="flex items-center justify-center gap-4 text-gray-600 text-[1.4rem] font-semibold">
          <button
            onClick={() => handleNavigateMonth("prev")} // 인덱스 증가 (과거 기록)
            disabled={isFirstItem}
            className={`transition ${isFirstItem ? "text-gray-300 cursor-default" : "hover:text-black"}`}
            aria-label="이전 기록"
          >
            ◀
          </button>
          <span className="text-[1.6rem] font-bold text-gray-800">{currentMonthDisplay}</span>
          <button
            onClick={() => handleNavigateMonth("next")} // 인덱스 감소 (최신 기록)
            disabled={isLastItem}
            className={`transition ${isLastItem ? "text-gray-300 cursor-default" : "hover:text-black"}`}
            aria-label="다음 기록"
          >
            ▶
          </button>
        </div>

        {/* --- */}
        
        {/* ✅ 상단: 이번달 목표 / 이번달 달성 */}
          <div className="flex gap-10 justify-center items-center text-center">
            <div className="flex flex-col">
              <span className="text-gray-500 text-[1.3rem]">이번 달 목표</span>
              {/* goalAmount는 만원 단위로 가정하고 10000을 곱했습니다. */}
              <span className="font-extrabold text-[1.6rem]">₩{fmt(goalAmount*10000)}</span>
            </div>
            <span className="text-[2rem] font-bold text-gray-400 mt-6">+</span>
            <div className="flex flex-col">
              <span className="text-gray-500 text-[1.3rem]">이번 달 달성</span>
              <span className="font-extrabold text-[1.6rem]">{achievementRate}%</span>
            </div>
          </div>

        {/* --- */}

        {/* ✅ 신용등급 그래프 (공통 컴포넌트 사용) */}
        <BorderBox flex="" padding="p-0" borderRadius="rounded-2xl" borderColor="border-transparent" shadow="shadow-none">
          {/* key를 변경하여 grade가 바뀔 때 애니메이션이 재실행되도록 합니다. */}
          <ConsumptionGradeGauge key={`${currentMonthDisplay}-${grade}`} userName={userName} grade={grade} />
        </BorderBox>
        
        {/* --- */}

        {/* ✅ 한달 소비 TOP 4 (2x2 그리드) */}
        <div className="mt-6 mb-8">
          <div className="flex flex-col items-center">
            <div className="mx-auto w-fit">
              <p className="font-semibold text-gray-800 mb-5 text-[1.4rem] text-left">한달 소비 TOP 4</p>
              <div className="grid grid-cols-2 gap-6 gap-x-20 w-fit">
            {top4.map((item, i) => (
              <div key={i} className="flex gap-4 justify-start items-center w-fit">
                <div
                  className="w-[3rem] h-[3rem] rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: item.color }}
                >
                  <img src={item.icon} alt="" className="w-[1.8rem] h-[1.8rem] object-contain" />
                </div>
                <span className="text-[1.3rem] text-gray-700 font-semibold whitespace-nowrap">
                  {fmt(item.price)}원
                </span>
              </div>
            ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* --- */}

        {/* ✅ Radar 차트 카드 */}
        {shouldShowScore && (
          <div className="mb-24">
            <BorderBox padding="p-5" borderRadius="rounded-2xl" borderColor="border-gray-200" shadow="shadow-sm" flex="">
              <div className="w-full h-[28rem] flex items-center justify-center">
                <RadarChart dataValues={[achievementScorePercent, stabilityScorePercent, ratioScorePercent, continuityScorePercent]} />
              </div>
            </BorderBox>
          </div>
        )}

        {/* --- */}
        
        {/* 최근 기록(가장 최근 월)에만 챗봇 버튼 표시 */}
        {/* 💡 초기 월/년도와 현재 월/년도가 일치하고, 현재 인덱스가 최신 기록일 때만 표시 */}
        {currentYear === initialYear && currentMonth === initialMonth && isFirstItem && (
          <div className="flex sticky right-6 bottom-8 z-40 justify-end">
            <button
              onClick={() => setIsChatModalOpen(true)}
              className="flex relative justify-center items-center w-20 h-20 bg-white rounded-full border border-black shadow-lg transition-colors hover:bg-green-600"
              aria-label="채팅 상담"
            >
              <img
                src={img.doori_favicon}
                alt="두리"
                className="object-contain w-14 h-14"
              />
              {/* 느낌표 배지 */}
              <div className="flex absolute -top-1 -right-1 justify-center items-center w-6 h-6 bg-red-500 rounded-full border-2 border-white attention-pulse" >
                <span className="text-white text-[1rem] font-bold attention-shake">!</span>
              </div>
            </button>
          </div>
        )}
      </div>
      {/* 채팅 모달 */}
      <ChatModal isOpen={isChatModalOpen} onClose={() => setIsChatModalOpen(false)} />
    </DefaultDiv>
  );
}