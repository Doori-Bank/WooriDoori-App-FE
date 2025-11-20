import '@/styles/report/animations.css';
import ReportLayout from "@/components/report/ReportLayout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProgressDonet from "@/components/Progress/ProgressDonet";
import { img } from "@/assets/img";
import ProgressCategoryView from "./ProgressCategoryView";
import FallingRockScoreView from './FallingRockScoreView';
import { apiList } from "@/api/apiList";
import { useUserStore } from "@/stores/useUserStore";

// 백엔드 DTO (DashboardResponseDto) 기반 TypeScript 인터페이스 정의
interface AchievementDetailDto {
  goalAmount: number;        // 이번 달 목표 금액
  achievementRate: number;   // 달성률 (0~100)
  achievementScore: number;  // 목표 달성 점수
  stabilityScore: number;    
  ratioScore: number;        
  continuityScore: number;   
  topCategorySpending: Record<string, number>; // 카테고리별 소비
  comment?: string;
}

const ReportView = () => {
  const navigate = useNavigate();
  const { userInfo, isLoggedIn } = useUserStore();
  const userName = isLoggedIn && userInfo?.name ? userInfo.name : "사용자";

  const [pageNum, setPageNum] = useState(1);
  const [title, setTitle] = useState("");

  const [month, setMonth] = useState<number | null>(null);
  const [reportData, setReportData] = useState<AchievementDetailDto | null>(null);

  // ===================== 페이지별 타이틀 =====================
  const getTitle = (page: number) => {
    const titleMap: Record<number, string> = {
      1: `${userName}님의 소비습관 점수는 ?!`,
      2: `${userName}님의 한 달 동안\n전체 소비내역을 분석해봤어요`,
      3: `${userName}님의 한 달 동안\n소비한 카테고리를 보여드릴게요`
    };
    return titleMap[page] || "";
  };

  useEffect(() => {
    setTitle(getTitle(pageNum));
  }, [pageNum, userName]);

  // ===================== API 호출 =====================
  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const res = await apiList.goaldashboard.getGoalDashboard(); // Dashboard API 호출
        setReportData(res);

        // month와 score 상태 업데이트
        const currentMonth = res.goalAmount ? new Date().getMonth() + 1 : null;
        setMonth(currentMonth);
      } catch (error) {
        console.error("월 데이터 불러오기 실패:", error);
        setMonth(new Date().getMonth() + 1);
      }
    };
    fetchReportData();
  }, []);

  // ===================== 페이지 이동 =====================
  const onClick = (type?: "back") => {
    if (type !== "back" && pageNum === 3) {
      navigate("/report-card", { state: { month } });
      return;
    }
    const nextPage = type === "back" ? pageNum - 1 : pageNum + 1;
    setPageNum(nextPage);
    setTitle(getTitle(nextPage));
  };

  // ===================== 렌더링 페이지 =====================
  const renderPage = () => {
    if (!reportData) return null;

    if (pageNum === 1) {
      return <FallingRockScoreView score={reportData.achievementScore+reportData.stabilityScore+reportData.ratioScore+reportData.continuityScore} />;
    }

    // ProgressDonet용 카테고리 데이터
    const categoriesForDonut = Object.entries(reportData.topCategorySpending).map(([name, value]) => ({
      name,
      value,
      color: "#FF8353", // 필요 시 카테고리별 색상 매핑
      percent: `${Math.round((value / reportData.goalAmount) * 100)}%`,
      src: img.foodIcon // 필요 시 아이콘 매핑
    }));

    if (pageNum === 2) {
      return (
        <div className="w-full">
          <p className="text-[#4A4A4A] font-semibold">카테고리별 소비</p>
          <ProgressDonet 
            total={reportData.goalAmount*reportData.achievementRate} 
            categories={categoriesForDonut} 
            month={`${month ?? ""}월`} 
            size={300} 
          />
        </div>
      );
    }

    if (pageNum === 3) {
      return (
        <ProgressCategoryView 
          categoriesList={categoriesForDonut} 
          totalPrice={reportData.goalAmount} 
        />
      );
    }
  };

  return (
    <ReportLayout
      mainText={title}
      isMainTextCenter={false}
      showBack={pageNum !== 1}
      onBack={() => onClick("back")}
      onClose={() => navigate('/home')}
      onButtonClick={onClick}
    >
      {renderPage()}
    </ReportLayout>
  );
};

export default ReportView;
