import '@/styles/report/animations.css';
import ReportLayout from "@/components/report/ReportLayout";
import { useEffect, useState } from "react";
import ProgressDonet from "@/components/Progress/ProgressDonet";
import { img } from "@/assets/img";
import ProgressCategoryView from "./ProgressCategoryView";
import FallingRockScoreView from './FallingRockScoreView';
import MonthCategoryListView from './MonthCategroyListView';

const ReportView = () => {
  const name = "석기";

  const titleMap: Record<number, string> = {
    1: `${name}님의 소비습관 점수는 ?!`,
    2: `${name}님의 한 달 동안\n전체 소비내역을 분석해봤어요`,
    3: `${name}님의 한 달 소비를\n카테고리별로 정리했어요`,
    // 4: `커피 가맹점 거래 횟수 Top 5`,
    4: `${name}님의 10월 소비 내역`,
  };

  const [pageNum, setPageNum] = useState(1);
  const [title, setTitle] = useState(titleMap[pageNum] || "");

  // ==================================================

  //도넛 리스트
  const totalPrice = 1080000;
  const categoriesList = [
    { name: "식비", value: 400000, color: "#FF8353", percent: "37.04%", src: img.food },
    { name: "교통/자동차", value: 300000, color: "#3ACFA3", percent: "27.78%", src: img.traffic },
    { name: "쇼핑/마트", value: 200000, color: "#6B5DD3", percent: "18.52%", src: img.shopping },
    { name: "교육", value: 100000, color: "#6E6E6E", percent: "9.26%", src: img.education },
    { name: "기타", value: 80000, color: "#C4C4C4", percent: "7.41%", src: img.etc }
  ];


  // 카테고리 리스트
  const categoriesByMonthList = [
    { src: img.entertainment, title: "술/유흥" },
    { src: img.traffic, title: "교통/자동차" },
    { src: img.food, title: "식비" },
    { src: img.shopping, title: "쇼핑/마트" },
    { src: img.education, title: "교육" },
    { src: img.travel, title: "여행" },
    { src: img.hospital, title: "병원" },
    { src: img.transfer, title: "이체" },
    { src: img.communication, title: "통신" },
    { src: img.mart, title: "편의점/마트" },
    { src: img.residence, title: "주거" },
    { src: img.etc, title: "기타" },
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

    if (type != "back" && pageNum == Object.keys(titleMap).length) { return window.location.href = '/report-card'; }

    const num = type == "back" ? pageNum - 1 : pageNum + 1
    setTitle(titleMap[num] || "");
    setPageNum(num);
  }


  const renderPage = () => {
    // 점수
    if (pageNum == 1) {
      return <FallingRockScoreView score={43} />
    }
    // 총 지출 카테고리별
    else if (pageNum == 2) {
      return (
        <div className="w-full">
          <p className="text-[#4A4A4A] font-semibold">카테고리별 소비</p>
          <ProgressDonet total={totalPrice} categories={categoriesList} month="5월" size={300} />
        </div>
      )
    }
    // 한달 소비 카테고리
    else if (pageNum == 3) {
      return <MonthCategoryListView categoriesByMonthList={categoriesByMonthList} />;
    }
    // 카테고리별 소비 금액
    else if (pageNum == 4) {
      return <ProgressCategoryView categoriesList={categoriesList} totalPrice={totalPrice} />;
    }
  }

  return (
    <ReportLayout mainText={title} isMainTextCenter={false}
      onButtonClick={onClick} onBack={() => { onClick("back") }} onClose={() => { window.location.href = '/'; }}
    >
      {
        renderPage()
      }
    </ReportLayout>
  )
}

export default ReportView;