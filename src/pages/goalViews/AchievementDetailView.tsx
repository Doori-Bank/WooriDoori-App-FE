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

// ㅁㅁㅁ 백엔드 DTO (DashboardResponseDto) 기반 TypeScript 인터페이스 정의 ㅁㅁㅁ
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

export default function AchievementDetailView() {
  const navigate = useNavigate();
  const { state } = useLocation();

  // 1. 초기 URL 파라미터에서 year, month를 Number 타입으로 추출
  const initialYear = state?.year as number;
  const initialMonth = state?.month as number;
  const from = state?.from || "home";

  // 2. 현재 조회 중인 연도와 월을 관리하는 상태
  const [currentYear, setCurrentYear] = useState(initialYear);
  const [currentMonth, setCurrentMonth] = useState(initialMonth);

  // 3. API 응답 DTO로 상태 타입 정의
  const [detail, setDetail] = useState<AchievementDetailDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  
  // 4. API 호출 및 데이터 로드 useEffect
  useEffect(() => {
    if (currentYear && currentMonth) {
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
      // alert("유효한 조회 월 정보가 없습니다."); // HistoryView에서 year/month를 전달하지 않은 경우
    }
  }, [currentYear, currentMonth]); // 💡 currentYear, currentMonth가 변경될 때마다 재실행!

  // 5. 이전/다음 월로 이동하는 로직
  const handleNavigateMonth = (direction: "prev" | "next") => {
    let newYear = currentYear;
    let newMonth = currentMonth;

    if (direction === "prev") {
      newMonth -= 1;
      if (newMonth < 1) {
        newMonth = 12;
        newYear -= 1;
      }
    } else {
      newMonth += 1;
      if (newMonth > 12) {
        newMonth = 1;
        newYear += 1;
      }
    }

    // 💡 상태를 업데이트하여 useEffect를 트리거합니다.
    setCurrentYear(newYear);
    setCurrentMonth(newMonth);
  };

  // 6. 네비게이션 핸들러
  const handleBack = () => navigate(-1);
  const handleClose = () => (from === "mypage" ? navigate("/mypage") : navigate("/home"));

  // 7. 스와이프 제스처를 위한 ref와 state (달 이동 기능을 위해 유지)
  const contentRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number>(0);
  const touchEndY = useRef<number>(0);
  const isScrolling = useRef<boolean>(false);
  
  // 8. 카테고리 매핑 함수 (유지)
  const getCategoryInfo = (categoryName: string) => {
    const categoryMap: Record<string, { icon: string; color: string }> = {
      '식비': { icon: img.foodIcon, color: "#FF715B" },
      '교통/자동차': { icon: img.trafficIcon, color: "#34D1BF" },
      '편의점': { icon: img.martIcon, color: "#FFC456" },
      '쇼핑': { icon: img.shoppingIcon, color: "#345BD1" },
      '주거': { icon: img.residenceIcon, color: "#FFF1D6" },
      '병원': { icon: img.hospitalIcon, color: "#31BB66" },
      '이체': { icon: img.transferIcon, color: "#FFF495" },
      '술/유흥': { icon: img.entertainmentIcon, color: "#FF715B" },
      '통신': { icon: img.phoneIcon, color: "#FFFFFF" },
      '교육': { icon: img.educationIcon, color: "#969191" },
      '기타': { icon: img.etcIcon, color: "#E4EAF0" },
    };
    return categoryMap[categoryName] || { icon: img.etcIcon, color: "#E4EAF0" };
  };

  // 9. 데이터 추출 및 계산 (detail 상태 기반)
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

  // 유저 이름 로드
  const getUserName = () => {
    const info = localStorage.getItem("userInfo");
    if (!info) return "사용자";
    try {
      const parsed = JSON.parse(info);
      return parsed?.name || "사용자";
    } catch {
      return "사용자";
    }
  };
  const userName = getUserName();

  const fmt = (n: number) =>
    n.toLocaleString("ko-KR", { maximumFractionDigits: 0 });

  // 10. 스와이프 제스처 핸들러 (유지)
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
        // 위로 스와이프 (다음 월 시도)
        handleNavigateMonth("next");
      } else {
        // 아래로 스와이프 (이전 월 시도)
        handleNavigateMonth("prev");
      }
    }
  };
  
  // 마우스 드래그 지원 핸들러 (유지)
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
        // 위로 드래그 (다음 월 시도)
        handleNavigateMonth("next");
      } else {
        // 아래로 드래그 (이전 월 시도)
        handleNavigateMonth("prev");
      }
    }
    
    touchStartY.current = 0;
  };

  // 11. 로딩/데이터 없음 상태 처리
  if (loading) {
    return (
      <DefaultDiv title="목표 관리" isHeader>
        <div className="flex justify-center items-center h-full text-[1.6rem] text-gray-500">
          데이터를 불러오는 중입니다...
        </div>
      </DefaultDiv>
    );
  }

  // year/month가 유효하지 않았거나 API 호출 실패 시 (detail이 null일 경우)
  if (!currentYear || !currentMonth || !detail) {
    return (
      <DefaultDiv title="목표 관리" isHeader onBack={handleBack} onClose={handleClose}>
        <div className="flex flex-col justify-center items-center h-full text-[1.6rem] text-gray-500">
          <p>{currentMonthDisplay}의 목표 기록을 찾을 수 없습니다. 😭</p>
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
        // 💡 스와이프/드래그 핸들러는 그대로 유지하여 달 이동 로직을 트리거
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* ✅ 월 선택 (버튼 클릭 로직 추가) */}
        <div className="flex items-center justify-center gap-4 text-gray-600 text-[1.4rem] font-semibold">
          <button
            onClick={() => handleNavigateMonth("prev")}
            className="transition hover:text-black"
            aria-label="이전 달"
          >
            ◀
          </button>
          <span className="text-[1.6rem] font-bold text-gray-800">{currentMonthDisplay}</span>
          <button
            onClick={() => handleNavigateMonth("next")}
            className="transition hover:text-black"
            aria-label="다음 달"
          >
            ▶
          </button>
        </div>

        {/* --- */}
        
        {/* ✅ 상단: 이번달 목표 / 이번달 달성 */}
          <div className="flex gap-10 justify-center items-center text-center">
            <div className="flex flex-col">
              <span className="text-gray-500 text-[1.3rem]">이번달 목표</span>
              <span className="font-extrabold text-[1.6rem]">₩{fmt(goalAmount*1000)}</span>
            </div>
            <span className="text-[2rem] font-bold text-gray-400 mt-6">+</span>
            <div className="flex flex-col">
              <span className="text-gray-500 text-[1.3rem]">달성률</span>
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
        {/* 💡 HistoryView에서 받은 초기 month/year와 현재 month/year가 같을 경우에만 표시하도록 변경 */}
        {currentYear === initialYear && currentMonth === initialMonth && (
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