import '@/styles/report/animations.css';
import ReportLayout from "@/components/report/ReportLayout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProgressDonet from "@/components/Progress/ProgressDonet";
import { img } from "@/assets/img";
import ProgressCategoryView from "./ProgressCategoryView";
import FallingRockScoreView from './FallingRockScoreView';
import MonthCategoryListView from './MonthCategroyListView';

const ReportView = () => {
  const navigate = useNavigate();
  const name = "석기";

  const [month, setMonth] = useState<number | null>(null);
  const [score, setScore] = useState<number | null>(null);

  const [pageNum, setPageNum] = useState(1);
  const [title, setTitle] = useState("");

  const getTitle = (page: number, monthValue: number | null) => {
    const monthText = monthValue ? `${monthValue}월` : "이번 달";
    const titleMap: Record<number, string> = {
      1: `${name}님의 소비습관 점수는 ?!`,
      2: `${name}님의 한 달 동안\n전체 소비내역을 분석해봤어요`,
      3: `${name}님의 한 달 동안\n소비한 카테고리를 보여드릴게요`,
      4: `${name}님의 ${monthText} 소비 내역`, // ✅ 동적 표시
    };
    return titleMap[page] || "";
  };

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        // 🔹 실제 API 연동 시 아래 주석 해제
        // const res = await fetch("/api/report/summary");
        // const data = await res.json();
        // setMonth(data.month);
        // setScore(data.score);

        // 🔹 지금은 더미 데이터
        setMonth(10);
        setScore(0);
      } catch (error) {
        console.error("월 데이터 불러오기 실패:", error);
        setMonth(new Date().getMonth() + 1); // 실패 시 현재 달로 대체
        setScore(45);
      }
    };
    fetchReportData();
  }, []);

  useEffect(() => {
    setTitle(getTitle(pageNum, month));
  }, [pageNum, month]);

  // ==================================================

  //도넛 리스트
  const totalPrice = 1080000;
  const categoriesList = [
    { name: "식비", value: 400000, color: "#FF8353", percent: "37.04%", src: img.foodIcon },
    { name: "교통/자동차", value: 300000, color: "#3ACFA3", percent: "27.78%", src: img.trafficIcon },
    { name: "쇼핑/마트", value: 200000, color: "#6B5DD3", percent: "18.52%", src: img.shoppingIcon },
    { name: "교육", value: 100000, color: "#6E6E6E", percent: "9.26%", src: img.educationIcon },
    { name: "기타", value: 80000, color: "#C4C4C4", percent: "7.41%", src: img.etcIcon }
  ];


  // 카테고리 리스트
  const categoriesByMonthList = [
    { src: img.trafficIcon, title: "교통/자동차", color: "#3ACFA3" },
    { src: img.foodIcon, title: "식비", color: "#FF8353" },
    { src: img.shoppingIcon, title: "쇼핑/마트", color: "#6B5DD3" },
    { src: img.educationIcon, title: "교육", color: "#6E6E6E" },
    { src: img.etcIcon, title: "기타", color: "#C4C4C4" },
  ];


  // 함수 ==========================================


  useEffect(() => {
    const handlePopState = () => {
      // 다른 페이지에서 뒤로가기 해서 돌아왔을 때
      setPageNum(4); // 4번째 페이지 선택
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);


  const onClick = (type?: string) => {
    if (type !== "back" && pageNum === 4) {
      navigate('/report-card');
      return;
    }

    const nextPage = type === "back" ? pageNum - 1 : pageNum + 1;
    setPageNum(nextPage);
    setTitle(getTitle(nextPage, month));
  };

  const renderPage = () => {
    if (pageNum === 1) {
      return <FallingRockScoreView score={score ?? 0} />;
    }
    // 총 지출 카테고리별
    if (pageNum == 2) {
      return (
        <div className="w-full">
          <p className="text-[#4A4A4A] font-semibold">카테고리별 소비</p>
          <ProgressDonet total={totalPrice} categories={categoriesList} month={`${month ?? ""}월`} size={300} />
        </div>
      );
    }
    if (pageNum === 3)
      return <MonthCategoryListView categoriesByMonthList={categoriesByMonthList} />;
    if (pageNum === 4)
      return <ProgressCategoryView categoriesList={categoriesList} totalPrice={totalPrice} />;
  };

  return (
    <ReportLayout
      mainText={title}
      isMainTextCenter={false}
      // ✅ 뒤로가기 버튼 표시 여부 (1페이지면 숨김)
      showBack={pageNum !== 1}
      // ✅ 뒤로가기 동작: 이전 페이지 이동
      onBack={() => onClick("back")}
      // ✅ 닫기 버튼 누르면 홈으로 이동
      onClose={() => navigate('/home')}
      // ✅ 다음 버튼 클릭
      onButtonClick={onClick}
    >
      {renderPage()}
    </ReportLayout>
  );
};

export default ReportView;