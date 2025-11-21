import '@/styles/report/animations.css';
import ReportLayout from "@/components/report/ReportLayout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProgressDonet from "@/components/Progress/ProgressDonet";
import ProgressCategoryView from "./ProgressCategoryView";
import FallingRockScoreView from './FallingRockScoreView';
import { apiList } from "@/api/apiList";
import { useUserStore } from "@/stores/useUserStore";
import { getCategoryMeta } from "@/utils/categoryMeta";

// 백엔드 DTO (ReportResponseDto) 기반 TypeScript 인터페이스 정의
interface ReportDto {
  goalAmount: number;                     // 이번 달 목표 금액
  actualSpending: number;                 // 실제 지출
  goalScore: number;                      // 목표 점수
  categorySpending: Record<string, number>; // 카테고리별 소비
}

const ReportView = () => {
  const navigate = useNavigate();
  const { userInfo, isLoggedIn } = useUserStore();
  const userName = isLoggedIn && userInfo?.name ? userInfo.name : "사용자";

  const [pageNum, setPageNum] = useState(1);
  const [title, setTitle] = useState("");
  const [month, setMonth] = useState<number | null>(null);
  const [reportData, setReportData] = useState<ReportDto | null>(null);

  // ===================== 페이지별 타이틀 =====================
  const getTitle = (page: number) => {
    const titleMap: Record<number, string> = {
      1: `${userName}님의 소비습관 점수는 ?!`,
      2: `${userName}님의 한 달 동안\n전체 소비내역을 분석해봤어요`,
      3: `${userName}님의 한 달 동안\n소비한 카테고리를 보여드릴게요`,
    };
    return titleMap[page] || "";
  };

  // ===================== DTO → categoriesList 변환 =====================
  const convertToCategoriesList = (dto: ReportDto) => {
    if (!dto?.categorySpending) return [];

    const categoryObj = dto.categorySpending;
    const totalAmount = Object.values(categoryObj).reduce((acc, val) => acc + val, 0);

    return Object.entries(categoryObj).map(([categoryName, amount]) => {
      const meta = getCategoryMeta(categoryName);
      const percent = totalAmount === 0 ? "0%" : ((amount / totalAmount) * 100).toFixed(2) + "%";

      return {
        name: meta.label,
        value: amount,
        color: meta.color,
        percent,
        src: meta.icon,
      };
    });
  };

  // ===================== 페이지 타이틀 업데이트 =====================
  useEffect(() => {
    setTitle(getTitle(pageNum));
  }, [pageNum, userName]);

  // ===================== API 호출 =====================
  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const res = await apiList.goalreport.getGoalReport(); // API 호출
        setReportData(res);
        setMonth(new Date().getMonth() + 1); // 현재 달로 세팅
      } catch (error) {
        console.error("월 데이터 불러오기 실패:", error);
        setMonth(new Date().getMonth());
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
    if (!reportData) return null; // 데이터 없으면 렌더링 안 함

    const categoriesList = convertToCategoriesList(reportData);

    if (pageNum === 1) {
      return <FallingRockScoreView score={reportData.goalScore} />;
    }

    if (pageNum === 2) {
      return (
        <div className="w-full">
          <p className="text-[#4A4A4A] font-semibold">카테고리별 소비</p>
          <ProgressDonet
            total={reportData.actualSpending}
            categories={categoriesList}
            month={`${month ?? ""}월`}
            size={300}
          />
        </div>
      );
    }

    if (pageNum === 3) {
      return (
        <ProgressCategoryView
          categoriesList={categoriesList}
          totalPrice={reportData.actualSpending}
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
