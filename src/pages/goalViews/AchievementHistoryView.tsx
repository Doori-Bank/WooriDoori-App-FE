import { useEffect, useState } from "react";
import { apiList } from "@/api/apiList";


import { useNavigate, useLocation } from "react-router-dom";
import DefaultDiv from "@/components/default/DefaultDiv";
import DefaultButton from "@/components/button/DefaultButton";
import BottomButtonWrapper from "@/components/button/BottomButtonWrapper";


export default function AchievementHistoryView() {
  const navigate = useNavigate();
  const location = useLocation();
  


  const from = location.state?.from || "home";

  const handleClose = () => {
    if (from === "mypage") navigate("/mypage");
    else navigate("/home");
  };


  const [historyList, setHistoryList] = useState<any[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const selectedItem = selected !== null ? historyList[selected] : null;
  
  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    apiList.goalhistory.getGoalHistory()
      .then((goalList) => {
        setHistoryList(goalList); // 백엔드 GetGoalDto 그대로 넣기
      })
      .catch((err) => {
        console.error("목표 히스토리 조회 실패:", err);
        alert("목표 히스토리를 불러오지 못했습니다.");
      });
  }, []);
  

  return (
    <DefaultDiv
      isHeader={true}
      title="달성도"
      isShowBack={false}
      isShowClose={true}
      isShowSetting={false}
      onClose={handleClose}
      isMainTitle={false}
    >
      <div className="flex flex-col gap-6 px-6 pt-20 pb-10 h-full">
        {/* 달성도 카드 목록 */}
        {historyList.map((a, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`
              w-full text-left rounded-2xl p-4 transition-all
              ${selected === i ? "border-2 border-[#8BC34A] shadow-md" : "border border-transparent"}
              bg-white hover:bg-gray-50
            `}
          >
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <p className="text-[1.3rem] text-gray-500">{a.goalStartDate?.slice(0, 7).replace("-", ".")}</p>
                <p className="text-[1.4rem] font-medium text-gray-700">{a.previousGoalMoney}만원 쓰기</p>

                {/* ✅ 진행바 (색상 고정 버전) */}
                <div className="w-full bg-[#FFFCD9] h-[0.8rem] rounded-full mt-3 flex items-center relative">
                  <div
                    className="h-[0.8rem] rounded-full bg-[#8BC34A]"
                    style={{ width: `${(a.goalIncome/a.previousGoalMoney)}%` }}
                  />
                  <span className="absolute right-0 text-[1.2rem] text-gray-500 font-medium translate-x-[130%]">
                    {(a.goalIncome/a.previousGoalMoney)}%
                  </span>
                </div>
              </div>

              <p className="text-[1.8rem] font-bold text-gray-900">{a.goalScore ?? 0}점</p>
            </div>
          </button>
        ))}


        {/* 선택 시 다음 버튼 */}
        {selected !== null && (
          <div className="mt-auto">
            <BottomButtonWrapper>
              <DefaultButton
    text="달성도 확인하기"
    onClick={() => {
      const selectedItem = historyList[selected];
      
      // ✅ 1단계: year와 month를 Number 타입으로 변환
      const year = Number(selectedItem.goalStartDate.slice(0, 4));
      const month = Number(selectedItem.goalStartDate.slice(5, 7)); // 예: "2025-04-01" -> 4

      // 💡 콘솔 로그 1: 전달되는 year와 month의 값과 타입 확인
      console.log("--- [상세 뷰로 전달되는 Data] ---");
      console.log("Year:", year, typeof year); // 예상: 2025 'number'
      console.log("Month:", month, typeof month); // 예상: 4 'number'
      console.log("----------------------------------");

      navigate("/achievement/detail", {
        state: {
          year,
          month,
          from,
        },
      });
    }}
  />
            </BottomButtonWrapper>
          </div>
        )}
      </div>
    </DefaultDiv>
  );
}
