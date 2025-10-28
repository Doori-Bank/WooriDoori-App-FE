import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultDiv from "@/components/default/DefaultDiv";
import Header from "@/components/default/Header";
import Title2 from "@/components/title/Title2";
import SubText from "@/components/text/SubText";
import GoalInput from "@/components/input/GoalInput";
import DefaultButton from "@/components/button/DefaultButton";
import check from "@/assets/check2.png";

// 문자열 → 숫자 변환
function parseAmountToNumber(v: string | number | null) {
  if (v === null || v === undefined) return 0;
  const s = String(v).replace(/,/g, "").trim();
  const n = Number(s);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0;
}

export default function GoalEditView() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1(수입 수정) → 2(목표 수정) → 3(완료)

  const [incomeText, setIncomeText] = useState("");
  const [goalText, setGoalText] = useState("");

  const incomeNum = useMemo(() => parseAmountToNumber(incomeText), [incomeText]);
  const goalNum = useMemo(() => parseAmountToNumber(goalText), [goalText]);

  const isValidStep = useMemo(() => {
    if (step === 1 && incomeNum <= 0) return false;
    if (step === 2 && goalNum <= 0) return false;
    return true;
  }, [step, incomeNum, goalNum]);

  const handleNext = () => {
    if (!isValidStep) return;
    if (step < 3) setStep((prev) => (prev + 1) as 1 | 2 | 3);
  };

  const handleRestart = () => {
    setStep(1);
    setIncomeText("");
    setGoalText("");
    // ✅ 홈으로 이동
    navigate("/");
  };

  const handleClose = () => {
    navigate("/");
  };

  return (
    <DefaultDiv>
      <Header
        title="목표 금액 수정"
        showBack={true}
        onClose={handleClose}
        onBack={() => {
          if (step > 1) setStep((prev) => (prev - 1) as 1 | 2 | 3);
        }}
      />

      {/* STEP 1: 수입 수정 */}
      {step === 1 && (
        <div className="flex flex-col h-full px-6 pt-16 pb-10">
          <div className="text-left mt-[3rem]">
            <Title2 text="석기시대님의 수입은 어느정도이신가요?" />
            <div className="mt-[2rem]">
              <SubText text="실제 수령하는 금액 기준으로 입력 부탁드려요." />
            </div>
          </div>

          <div className="mt-[5rem]">
            <GoalInput
              value={incomeText}
              onChange={setIncomeText}
              placeholder="0"
            />
          </div>

          <div className="mt-auto w-full flex justify-center">
            <DefaultButton text="다음" disabled={!isValidStep} onClick={handleNext} />
          </div>
        </div>
      )}

      {/* STEP 2: 목표 금액 수정 */}
      {step === 2 && (
        <div className="flex flex-col h-full px-6 pt-16 pb-10">
          <div className="text-left mt-[3rem]">
            <Title2 text="목표 금액을 수정해주세요." />
            <div className="mt-[2rem]">
              <SubText text="변경된 목표 금액은 다음 달부터 적용됩니다." />
            </div>
          </div>

          <div className="mt-[5rem]">
            <GoalInput
              value={goalText}
              onChange={setGoalText}
              placeholder="0"
            />
          </div>

          <div className="mt-auto w-full flex justify-center">
            <DefaultButton text="다음" disabled={!isValidStep} onClick={handleNext} />
          </div>
        </div>
      )}

      {/* STEP 3: 완료 화면 */}
      {step === 3 && (
        <div className="flex flex-col items-center h-full px-4 pt-20 pb-10">
          {/* 체크 아이콘 */}
          <div className="w-[10rem] h-[10rem] flex items-center justify-center translate-y-[10rem]">
            <img
              src={check}
              alt="완료 체크"
              className="w-[10rem] h-[10rem] object-contain"
            />
          </div>

          {/* 완료 텍스트 */}
          <h2 className="mt-[13rem]">
            <Title2 text="목표 금액을 수정했어요" />
          </h2>

          {/* 수입 / 목표 요약 */}
          <div className="w-[85%] mt-[22rem] flex flex-col gap-[1rem] mx-auto">
            <div className="flex justify-between">
              <span className="text-[#A1A1A1] text-[1.3rem]">한달 내 수입</span>
              <span className="text-[#4D4D4D] font-semibold text-[1.3rem]">
                {incomeNum.toLocaleString()} 만원
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#A1A1A1] text-[1.3rem]">목표 금액</span>
              <span className="text-[#4D4D4D] font-semibold text-[1.3rem]">
                {goalNum.toLocaleString()} 만원
              </span>
            </div>
          </div>

          <div className="mt-auto w-full flex justify-center">
            <DefaultButton text="확인" onClick={handleRestart} />
          </div>
        </div>
      )}
    </DefaultDiv>
  );
}
