import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultDiv from "@/components/default/DefaultDiv";
import Header from "@/components/default/Header";
import DefaultButton from "@/components/button/DefaultButton";
import BottomButtonWrapper from "@/components/button/BottomButtonWrapper";

type Achievement = {
  month: string;
  goal: string;
  score: number;
  percent: number;
};

export default function AchievementHistoryView() {
  const navigate = useNavigate();
  const goHome = () => navigate("/home");

  // ✅ 더미 데이터 (임시 테스트용)
  const mockHistory: Achievement[] = [
    { month: "2025.04", goal: "10,000만원 쓰기", percent: 80, score: 20 },
    { month: "2025.03", goal: "1,000만원 쓰기", percent: 40, score: 60 },
    { month: "2025.02", goal: "300만원 쓰기", percent: 25, score: 75 },
  ];

  const [historyList, setHistoryList] = useState<Achievement[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  // ✅ 컴포넌트 마운트 시 mock 데이터 로드
  useEffect(() => {
    // 추후 백엔드 연동 시 이 부분만 교체하면 됨
    setHistoryList(mockHistory);
  }, []);

  return (
    <DefaultDiv>
      <Header title="달성도" showBack={true} onBack={() => navigate(-1)} onClose={goHome} />

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
                <p className="text-[1.3rem] text-gray-500">{a.month}</p>
                <p className="text-[1.4rem] font-medium text-gray-700">{a.goal}</p>

                {/* ✅ 진행바 (색상 고정 버전) */}
                <div className="w-full bg-[#FFFCD9] h-[0.8rem] rounded-full mt-3 flex items-center relative">
                  <div
                    className="h-[0.8rem] rounded-full bg-[#8BC34A]"
                    style={{ width: `${a.percent}%` }}
                  />
                  <span className="absolute right-0 text-[1.2rem] text-gray-500 font-medium translate-x-[130%]">
                    {a.percent}%
                  </span>
                </div>
              </div>

              <p className="text-[1.8rem] font-bold text-gray-900">{a.score}점</p>
            </div>
          </button>
        ))}

        {/* 선택 시 다음 버튼 */}
        {selected !== null && (
          <div className="mt-auto">
            <BottomButtonWrapper>
              <DefaultButton text="달성도 확인하기"
              onClick={() =>
                navigate("/achievement/detail", { state: { data: historyList[selected] } })
              } />
            </BottomButtonWrapper>
          </div>
        )}
      </div>
    </DefaultDiv>
  );
}
