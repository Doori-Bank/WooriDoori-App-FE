import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DefaultDiv from "@/components/default/DefaultDiv";
import BorderBox from "@/components/default/BorderBox";
import { img } from "@/assets/img";
import RadarChart from "@/components/RadarChart";
import ConsumptionGradeGauge from "@/components/Progress/ConsumptionGradeGauge";
import "@/styles/goal/gaugePointerAnimations.css";
import { apiList } from "@/api/apiList";

// ✅ 두리 등급별 이미지 (유지)
import dooriCool from "@/assets/doori/doori_cool.png";
import dooriCoffee from "@/assets/doori/doori_coffee.png";
import dooriPouting from "@/assets/doori/doori_pouting.png";
import dooriFrustrated from "@/assets/doori/doori_frustrated.png";
import dooriAngry from "@/assets/doori/doori_angry.png";

// =========================================================================
// 💡 1. 백엔드 DTO (DashboardResponseDto) 기반 TypeScript 인터페이스 정의
// =========================================================================
type TopCategorySpending = Record<string, number>;

interface AchievementDetailDto {
  goalAmount: number;           // 이번달 목표 금액
  achievementRate: number;      // 이번달 달성률 (0~100)
  achievementScore: number;     // 목표 달성도 점수 (0~40)
  stabilityScore: number;       // 소비 안정성 점수 (0~20)
  ratioScore: number;           // 필수/비필수 비율 점수 (0~20)
  continuityScore: number;      // 절약 지속성 점수 (0~20)
  topCategorySpending: TopCategorySpending; // 카테고리별 소비 금액 Map
  
  // 프론트엔드에서 계산/보강할 필드
  monthDisplay?: string; // "YYYY.MM" 형식의 표시용 월
  comment?: string;
}
// =========================================================================

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

  // ✅ 카테고리 매핑 함수 (유지)
  const getCategoryInfo = (categoryName: string) => {
    const categoryMap: Record<string, { icon: string; color: string }> = {
      'FOOD': { icon: img.foodIcon, color: "#FF715B" }, // DTO의 키값에 맞게 수정 필요
      'TRANSPORT': { icon: img.trafficIcon, color: "#34D1BF" },
      'CONVENIENCE': { icon: img.martIcon, color: "#FFC456" },
      'SHOPPING': { icon: img.shoppingIcon, color: "#345BD1" },
      'RESIDENCE': { icon: img.residenceIcon, color: "#FFF1D6" },
      'HOSPITAL': { icon: img.hospitalIcon, color: "#31BB66" },
      'TRANSFER': { icon: img.transferIcon, color: "#FFF495" },
      'ENTERTAINMENT': { icon: img.entertainmentIcon, color: "#FF715B" },
      'PHONE': { icon: img.phoneIcon, color: "#FFFFFF" },
      'EDUCATION': { icon: img.educationIcon, color: "#969191" },
      'ETC': { icon: img.etcIcon, color: "#E4EAF0" },
      // 💡 DTO의 CategoryType에 맞춰 키 값을 대문자로 변경했습니다.
    };
    // UI 표시용 한글 이름 매핑 (CategoryType이 실제 DB/DTO 키라고 가정)
    const displayNames: Record<string, string> = {
        'FOOD': '식비', 'TRANSPORT': '교통/자동차', 'CONVENIENCE': '편의점',
        'SHOPPING': '쇼핑', 'RESIDENCE': '주거', 'HOSPITAL': '병원',
        'TRANSFER': '이체', 'ENTERTAINMENT': '술/유흥', 'PHONE': '통신',
        'EDUCATION': '교육', 'ETC': '기타',
    };
    const info = categoryMap[categoryName] || { icon: img.etcIcon, color: "#E4EAF0" };
    return { ...info, displayName: displayNames[categoryName] || categoryName };
  };
  
  // ⚠️ MockHistory 및 관련 로직 전체 제거 (currentIndex, useMemo, foundIndex 등)

  // =========================================================================
  // 💡 데이터 로딩 및 NULL 상태 처리
  // =========================================================================
  if (loading) {
    return (
      <DefaultDiv isHeader title="목표 관리" isShowBack isShowClose onBack={handleBack} onClose={handleClose}>
        <div className="p-4 text-center text-gray-500">데이터를 불러오는 중입니다...</div>
      </DefaultDiv>
    );
  }

  if (!detail) {
    return (
      <DefaultDiv isHeader title="목표 관리" isShowBack isShowClose onBack={handleBack} onClose={handleClose}>
        <div className="p-4 text-center text-red-500">해당 월의 목표 상세 데이터를 찾을 수 없습니다.</div>
      </DefaultDiv>
    );
  }

  // =========================================================================
  // 💡 API 응답 데이터 기반으로 변수 재정의
  // =========================================================================
  const percent = detail.achievementRate; // DTO: achievementRate
  const goal = detail.goalAmount; // DTO: goalAmount
  const comment = detail.comment || "코멘트 없음";
  
  // 4개 점수 데이터
  const achievementScore = detail.achievementScore || 0;
  const stabilityScore = detail.stabilityScore || 0;
  const ratioScore = detail.ratioScore || 0;
  const continuityScore = detail.continuityScore || 0;
  
  // Radar 차트용 점수 환산 (100점 만점 기준)
  const achievementScorePercent = (achievementScore / 40) * 100;
  const stabilityScorePercent = (stabilityScore / 20) * 100;
  const ratioScorePercent = (ratioScore / 20) * 100;
  const continuityScorePercent = (continuityScore / 20) * 100;
  
  // 소비 등급 계산 (1~5등급) (로직 유지)
  const getGrade = (p: number) => {
    if (p <= 20) return 1;
    if (p <= 40) return 2;
    if (p <= 60) return 3;
    if (p <= 80) return 4;
    return 5;
  };
  const grade = getGrade(percent);
  
  // 실제 데이터 연동 시에는 데이터가 있다면 점수 표시
  const shouldShowScore = true; 

  // ✅ TOP 4 카테고리: DTO의 Map을 Array로 변환하여 사용
  const top4 = Object.entries(detail.topCategorySpending || {})
    .sort(([, priceA], [, priceB]) => priceB - priceA) // 금액 내림차순 정렬
    .slice(0, 4) // TOP 4만 추출
    .map(([categoryKey, price]) => {
      const categoryInfo = getCategoryInfo(categoryKey);
      return {
        icon: categoryInfo.icon,
        price: price,
        color: categoryInfo.color,
        categoryName: categoryInfo.displayName, // UI 표시용 한글 이름
      };
    });

  // 등급별 스타일 설정 (1~5등급) (유지)
  const gradeStyle = {
    1: { border: "border-[#6BB64A]", img: dooriCool },
    2: { border: "border-[#B6DB4A]", img: dooriCoffee },
    3: { border: "border-[#F7E547]", img: dooriPouting },
    4: { border: "border-[#F9A23B]", img: dooriFrustrated },
    5: { border: "border-[#E74C3C]", img: dooriAngry },
  }[grade];


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
        {/* ✅ 월 표시 (월 선택 버튼 제거) */}
        <div className="flex items-center justify-center text-[1.6rem] font-bold text-gray-800">
          <span>{detail.monthDisplay || `${year}.${month}`}</span>
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
        <ConsumptionGradeGauge key={`${detail.monthDisplay}-${grade}`} userName={userName} grade={grade} />

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
          <BorderBox padding="p-5" borderRadius="rounded-2xl" borderColor="border-gray-200" shadow="shadow-sm">
            <div className="w-full h-[28rem] flex items-center justify-center">
              <RadarChart dataValues={[achievementScorePercent, stabilityScorePercent, ratioScorePercent, continuityScorePercent]} />
            </div>
          </BorderBox>
        )}

          <div className="flex gap-4 items-end">
            {/* 폼: 왼쪽 - 두리 한마디 */}
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
                • {comment}
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