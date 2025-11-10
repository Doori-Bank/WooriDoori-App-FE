import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DefaultDiv from "@/components/default/DefaultDiv";
import BorderBox from "@/components/default/BorderBox";
import { img } from "@/assets/img";
import RadarChart from "@/components/RadarChart";
import ConsumptionGradeGauge from "@/components/Progress/ConsumptionGradeGauge";
import "@/styles/goal/gaugePointerAnimations.css";

// ✅ 두리 등급별 이미지
import dooriCool from "@/assets/doori/doori_cool.png";
import dooriCoffee from "@/assets/doori/doori_coffee.png";
import dooriPouting from "@/assets/doori/doori_pouting.png";
import dooriFrustrated from "@/assets/doori/doori_frustrated.png";
import dooriAngry from "@/assets/doori/doori_angry.png";

export default function AchievementDetailView() {
  const navigate = useNavigate();
  const { state } = useLocation(); 
  const data = state?.data as { month?: string } | undefined;
  const from = state?.from || "home";

  const handleBack = () => navigate(-1);
  const handleClose = () => (from === "mypage" ? navigate("/mypage") : navigate("/home"));

  // ✅ 더미 히스토리 데이터 (추후 백엔드 연동) - AchievementHistoryView와 동일한 데이터 사용
  const mockHistory = useMemo(
    () => [
      { month: "2025.04", percent: 80, comment: "절약모드 필요해요 ⚠️" },
      { month: "2025.03", percent: 40, comment: "조금 과소비했어요 💸" },
      { month: "2025.02", percent: 25, comment: "좋아요! 이대로만 유지해요 🌱" },
    ],
    []
  );

  // ✅ 현재 인덱스 안전 계산
  const foundIndex = mockHistory.findIndex((item) => item.month === data?.month);
  const initialIndex = foundIndex !== -1 ? foundIndex : 0;
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // ✅ 현재 데이터
  const currentData = mockHistory[currentIndex];
  const percent = currentData.percent; // 과소비 진행도(0~100)
  const score = 100 - percent; // 점수(낮을수록 과소비)
  const goal = 120_000; // 이번달 목표(예시)
  
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

  // ✅ TOP 4
  const top4 = [
    { icon: img.foodIcon, price: 330314, color: "#FF715B" },
    { icon: img.trafficIcon, price: 330314, color: "#34D1BF" },
    { icon: img.shoppingIcon, price: 330314, color: "#345BD1" },
    { icon: img.educationIcon, price: 330314, color: "#969191" },
  ];

  // ✅ 등급별 스타일 설정 (1~5등급) - 게이지 색상과 일치
  const gradeStyle = {
    1: { border: "border-[#6BB64A]", img: dooriCool },
    2: { border: "border-[#B6DB4A]", img: dooriCoffee },
    3: { border: "border-[#F7E547]", img: dooriPouting },
    4: { border: "border-[#F9A23B]", img: dooriFrustrated },
    5: { border: "border-[#E74C3C]", img: dooriAngry },
  }[grade];


  // ✅ 유저 이름 로드
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
    >
      <div className="flex flex-col gap-6 px-4 pt-4 pb-0 h-full">
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
        <ConsumptionGradeGauge key={`${currentIndex}-${grade}`} userName={userName} grade={grade} />

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

        {/* ✅ Radar 차트 카드 */}
        {shouldShowScore && (
          <BorderBox padding="p-5" borderRadius="rounded-2xl" borderColor="border-gray-200" shadow="shadow-sm">
            <div className="w-full h-[28rem] flex items-center justify-center">
              <RadarChart dataValues={[score, score * 0.9, score * 0.85, score * 0.95]} />
            </div>
          </BorderBox>
        )}

          <div className="flex gap-4 items-end">
            {/* 폼: 왼쪽 */}
          <BorderBox
            padding="p-6"
            borderRadius="rounded-2xl"
            borderColor={gradeStyle.border}
            bgColor="bg-[#FFFEFB]"
            flex="flex-1"
            shadow=""
          >
            <div className="min-w-[13rem] min-h-[18rem] flex flex-col" style={{
              backgroundImage: 'repeating-linear-gradient(transparent, transparent 28px, rgba(16,24,40,0.12) 29px)',
              backgroundSize: '100% 29px',
              backgroundPositionY: '12px',
            }}>
              <p className="text-[1.4rem] font-medium text-left px-1 mb-2" style={{ 
                lineHeight: '29px',
                paddingTop: '12px'
              }}>두리의 한마디</p>
              <p className="text-[1.2rem] font-light text-left whitespace-pre-wrap break-words flex-1 overflow-y-auto px-1" style={{ 
                lineHeight: '29px'
              }}>
                • {currentData.comment}
              </p>
            </div>
          </BorderBox>
          <img
            src={gradeStyle.img}
            alt="두리 캐릭터"
            className="w-[14.5rem] h-[18.5rem] object-contain select-none pointer-events-none shrink-0"
          />
        </div>
      </div>
    </DefaultDiv>
  );
}
