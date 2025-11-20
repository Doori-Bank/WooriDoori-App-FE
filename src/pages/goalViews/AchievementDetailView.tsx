import { useMemo, useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DefaultDiv from "@/components/default/DefaultDiv";
import BorderBox from "@/components/default/BorderBox";
import { img } from "@/assets/img";
import RadarChart from "@/components/RadarChart";
import ConsumptionGradeGauge from "@/components/Progress/ConsumptionGradeGauge";
import ChatModal from "@/components/modal/ChatModal";
import "@/styles/goal/gaugePointerAnimations.css";
import "@/styles/home/animations.css";

export default function AchievementDetailView() {
  const navigate = useNavigate();
  const { state } = useLocation(); 
  const from = state?.from || "home";
  // year, month는 Number 타입으로 전달받음
  const year = state?.year as number;
  const month = state?.month as number; 

  // API 응답 DTO로 상태 타입 정의
  const [detail, setDetail] = useState<AchievementDetailDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (year && month) {
        // 월을 두 자리 문자열로 포맷팅 ('9' -> '09')
        const formattedMonth = month < 10 ? `0${month}` : `${month}`;

        apiList.goaldetail.getGoalDetail(year, month)
        .then((data: AchievementDetailDto) => {
            setDetail({
                ...data,
                // UI 표기용 월 정보 보강
                monthDisplay: `${year}.${formattedMonth}`,
                // 코멘트 필드가 없다면 기본값 사용 (백엔드 DTO에 comment 필드가 없다고 가정)
                comment: data.comment || "이번 달 목표는 잘 달성했어요! 💯", 
            });
        })
        .catch(error => {
            console.error("Failed to fetch goal detail:", error);
            setDetail(null); // 에러 발생 시 데이터 초기화
        })
        .finally(() => setLoading(false));
    } else {
        setLoading(false);
    }
  }, [year, month]); // year, month 변경 시 재호출

  const handleBack = () => navigate(-1);
  const handleClose = () => (from === "mypage" ? navigate("/mypage") : navigate("/home"));

  // 스와이프 제스처를 위한 ref와 state
  const contentRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number>(0);
  const touchEndY = useRef<number>(0);
  const isScrolling = useRef<boolean>(false);

  // ✅ 카테고리 매핑 함수
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

  // ✅ 더미 히스토리 데이터 (추후 백엔드 연동) - AchievementHistoryView와 동일한 데이터 사용
  // 점수 범위: achievementScore(0-40), stabilityScore(0-20), ratioScore(0-20), continuityScore(0-20)
  const mockHistory = useMemo(
    () => [
      { 
        month: "2025.11", 
        percent: 90, 
        comment: "OTL",
        goalAchievementScore: 10,  // 40점 만점
        goalStabilityScore: 5,     // 20점 만점
        goalRatioScore: 6,          // 20점 만점
        goalContinuityScore: 4,     // 20점 만점
        top4: [
          { category: "식비", price: 450000 },
          { category: "쇼핑", price: 320000 },
          { category: "교통/자동차", price: 180000 },
          { category: "교육", price: 150000 },
        ]
      },
      { 
        month: "2025.04", 
        percent: 80, 
        comment: "절약모드 필요해요 ⚠️",
        goalAchievementScore: 40,  // 40점 만점
        goalStabilityScore: 10,     // 20점 만점
        goalRatioScore: 11,        // 20점 만점
        goalContinuityScore:20,    // 20점 만점
        top4: [
          { category: "식비", price: 400000 },
          { category: "교통/자동차", price: 300000 },
          { category: "쇼핑", price: 200000 },
          { category: "교육", price: 100000 },
        ]
      },
      { 
        month: "2025.03", 
        percent: 40, 
        comment: "조금 과소비했어요 💸",
        goalAchievementScore: 32,  // 40점 만점
        goalStabilityScore: 16,    // 20점 만점
        goalRatioScore: 17,        // 20점 만점
        goalContinuityScore: 14,   // 20점 만점
        top4: [
          { category: "식비", price: 280000 },
          { category: "쇼핑", price: 150000 },
          { category: "병원", price: 120000 },
          { category: "주거", price: 100000 },
        ]
      },
      { 
        month: "2025.02", 
        percent: 25, 
        comment: "좋아요! 이대로만 유지해요 🌱",
        goalAchievementScore: 38,  // 40점 만점
        goalStabilityScore: 19,    // 20점 만점
        goalRatioScore: 19,        // 20점 만점
        goalContinuityScore: 18,   // 20점 만점
        top4: [
          { category: "식비", price: 200000 },
          { category: "교통/자동차", price: 150000 },
          { category: "교육", price: 80000 },
          { category: "통신", price: 50000 },
        ]
      },
    ],
    []
  );

  // ✅ 현재 인덱스 안전 계산
  const foundIndex = mockHistory.findIndex((item) => item.month === data?.month);
  const initialIndex = foundIndex !== -1 ? foundIndex : 0;
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  // ✅ 현재 데이터
  const currentData = mockHistory[currentIndex];
  const percent = currentData.percent; // 과소비 진행도(0~100)
  const goal = 120_000; // 이번달 목표(예시)
  
  // ✅ 4개 점수 데이터
  const achievementScore = currentData.goalAchievementScore || 0;
  const stabilityScore = currentData.goalStabilityScore || 0;
  const ratioScore = currentData.goalRatioScore || 0;
  const continuityScore = currentData.goalContinuityScore || 0;
  
  // ✅ Radar 차트용 점수 환산 (100점 만점 기준)
  const achievementScorePercent = (achievementScore / 40) * 100;  // 40점 만점 -> 100점 만점
  const stabilityScorePercent = (stabilityScore / 20) * 100;      // 20점 만점 -> 100점 만점
  const ratioScorePercent = (ratioScore / 20) * 100;              // 20점 만점 -> 100점 만점
  const continuityScorePercent = (continuityScore / 20) * 100;    // 20점 만점 -> 100점 만점
  
  // ✅ 소비 등급 계산 (1~5등급)
  const getGrade = (p: number) => {
    if (p <= 20) return 1;
    if (p <= 40) return 2;
    if (p <= 60) return 3;
    if (p <= 80) return 4;
    return 5;
  };
  const grade = getGrade(percent);
  
  // ✅ 3개월 이상 데이터가 있을 때만 점수 표시
  const shouldShowScore = mockHistory.length >= 3;

  // ✅ TOP 4 카테고리 (현재 월 데이터에서 가져오기)
  const top4 = (currentData.top4 || []).map(item => {
    const categoryInfo = getCategoryInfo(item.category);
    return {
      icon: categoryInfo.icon,
      price: item.price,
      color: categoryInfo.color,
    };
  });



  // 유저 이름 로드 (유지)
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

  // 스와이프 제스처 핸들러
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    isScrolling.current = false;
  };

  const handleTouchMove = (_e: React.TouchEvent) => {
    // 수직 스크롤이 있는지 확인
    if (contentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      const isAtTop = scrollTop === 0;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
      
      // 스크롤 가능한 영역이 있고, 상단/하단에 있지 않으면 스크롤로 간주
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
    const minSwipeDistance = 50; // 최소 스와이프 거리

    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0) {
        // 위로 스와이프 (다음 달)
        if (currentIndex < mockHistory.length - 1) {
          setCurrentIndex((v) => v + 1);
        }
      } else {
        // 아래로 스와이프 (이전 달)
        if (currentIndex > 0) {
          setCurrentIndex((v) => v - 1);
        }
      }
    }
  };

  // 마우스 드래그 지원 (데스크톱)
  const handleMouseDown = (e: React.MouseEvent) => {
    touchStartY.current = e.clientY;
    isScrolling.current = false;
  };

  const handleMouseMove = (_e: React.MouseEvent) => {
    if (touchStartY.current === 0) return;
    
    // 스크롤 가능한 영역 확인
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
        // 위로 드래그 (다음 달)
        if (currentIndex < mockHistory.length - 1) {
          setCurrentIndex((v) => v + 1);
        }
      } else {
        // 아래로 드래그 (이전 달)
        if (currentIndex > 0) {
          setCurrentIndex((v) => v - 1);
        }
      }
    }
    
    touchStartY.current = 0;
  };

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
        {/* ✅ 월 선택 (헤더 바로 아래) */}
        <div className="flex items-center justify-center gap-4 text-gray-600 text-[1.4rem] font-semibold">
          <button
            onClick={() => currentIndex > 0 && setCurrentIndex((v) => v - 1)}
            disabled={currentIndex === 0}
            className={`transition ${currentIndex === 0 ? "text-gray-300 cursor-default" : "hover:text-black"}`}
            aria-label="이전 달"
          >
            ◀
          </button>
          <span className="text-[1.6rem] font-bold text-gray-800">{currentData.month || ""}</span>
          <button
            onClick={() =>
              currentIndex < mockHistory.length - 1 && setCurrentIndex((v) => v + 1)
            }
            disabled={currentIndex === mockHistory.length - 1}
            className={`transition ${
              currentIndex === mockHistory.length - 1 ? "text-gray-300 cursor-default" : "hover:text-black"
            }`}
            aria-label="다음 달"
          >
            ▶
          </button>
        </div>

        {/* ✅ 상단: 이번달 목표 / 이번달 달성 */}
          <div className="flex gap-10 justify-center items-center text-center">
            <div className="flex flex-col">
              <span className="text-gray-500 text-[1.3rem]">이번달 목표</span>
              <span className="font-extrabold text-[1.6rem]">₩{fmt(goal)}</span>
            </div>
            <span className="text-[2rem] font-bold text-gray-400 mt-6">+</span>
            <div className="flex flex-col">
              <span className="text-gray-500 text-[1.3rem]">이번달 달성</span>
              <span className="font-extrabold text-[1.6rem]">{percent}%</span>
            </div>
          </div>

        {/* ✅ 신용등급 그래프 (공통 컴포넌트 사용) */}
        <BorderBox flex="" padding="p-0" borderRadius="rounded-2xl" borderColor="border-transparent" shadow="shadow-none">
          <ConsumptionGradeGauge key={`${currentIndex}-${grade}`} userName={userName} grade={grade} />
        </BorderBox>

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
                <div className="flex flex-col items-start">
                    <span className="text-[1.1rem] text-gray-500">{item.categoryName}</span>
                  <span className="text-[1.3rem] text-gray-700 font-semibold whitespace-nowrap">
                    {fmt(item.price)}원
                  </span>
                </div>
              </div>
            ))}
              </div>
            </div>
          </div>
        </div>

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

        {/* 최근 기록(첫 번째 항목)에만 챗봇 버튼 표시 */}
        {currentIndex === 0 && (
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