import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultDiv from "@/components/default/DefaultDiv";
import Header from "@/components/default/Header";
import Title2 from "@/components/title/Title2";
import SubText from "@/components/text/SubText";
import GoalInput from "@/components/input/GoalInput";
import DefaultButton from "@/components/button/DefaultButton";
import Bottomsheet from "@/components/default/Bottomsheet";
import check from "@/assets/check2.png";


// 숫자 문자열(콤마 포함 가능) -> 정수 변환
function parseAmountToNumber(v: string | number | null) {
  if (v === null || v === undefined) return 0;
  const s = String(v).replace(/,/g, "").trim();
  const n = Number(s);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0;
}

type Props = {
  incomePlaceholder?: string; // 수입 입력 placeholder
  goalPlaceholder?: string;   // 목표 입력 placeholder
};

export default function GoalSetupView({
  incomePlaceholder = "0",
}: Props) {
  const navigate = useNavigate();
  // 단계: 1(직업) → 2(수입) → 3(목표) → 4(완료)
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [job, setJob] = useState<string | null>(null);
  const [isBottomsheetOpen, setBottomsheetOpen] = useState(false);

  const [incomeText, setIncomeText] = useState(""); // 숫자 문자열 (콤마 제거 상태)
  const [goalText, setGoalText] = useState("");

  const incomeNum = useMemo(() => parseAmountToNumber(incomeText), [incomeText]);
  const goalNum = useMemo(() => parseAmountToNumber(goalText), [goalText]);

  // 단계별 유효성
  const isValidStep = useMemo(() => {
    if (step === 1 && !job) return false;
    if (step === 2 && incomeNum <= 0) return false;
    if (step === 3 && (goalNum <= 0 || goalNum > incomeNum)) return false;
    return true;
  }, [step, job, incomeNum, goalNum]);

  const handleNext = () => {
    if (!isValidStep) return;
    if (step < 4) setStep((prev) => (prev + 1) as 1 | 2 | 3 | 4);
  };

  const handleRestart = () => {
    setStep(1);
    setJob(null);
    setIncomeText("");
    setGoalText("");

    // ✅ 홈으로 이동
    navigate("/home");
  };

  const handleClose = () => {
    navigate("/home");
  };

  return (
    <DefaultDiv>
      <Header
        title="목표 금액 설정"
        showBack={true}
        onClose={handleClose}
        onBack={() => {
          if (step > 1) setStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
        }}
      />

      {/* STEP 1: 직업 선택 */}
      {step === 1 && (
        <div className="flex flex-col px-6 pt-16 pb-10 h-full">
          <div className="text-left mt-[3rem]">
            <Title2 text="지금은 어떤" />
            <Title2 text="상황에 가장 가까우신가요?" />
            <div className="mt-[2rem]">
              <SubText text="입력한 정보는 맞춤 리포트 생성에 사용됩니다." />
            </div>
          </div>

          <button
            onClick={() => setBottomsheetOpen(true)}
            className="
              mt-[5rem] w-full h-12 px-4 rounded-xl 
              border border-gray-300
              flex items-center justify-between text-left
              text-[1.4rem] font-medium text-gray-700"
          >
            <span className={job ? "text-gray-900" : "text-gray-400"}>
              {job ?? "선택하기"}
            </span>
            <span className="text-gray-400">▾</span>
          </button>

          <div className="flex justify-center mt-auto w-full">
            <DefaultButton text="다음" disabled={!isValidStep} onClick={handleNext} />
          </div>

          <Bottomsheet
            isOpen={isBottomsheetOpen}
            title="활동 형태를 선택해주세요"
            onClose={() => setBottomsheetOpen(false)}
            onSelect={(activity) => {
              setJob(activity);
              setBottomsheetOpen(false);
            }}
          />
        </div>
      )}

      {/* STEP 2: 수입 입력 */}
      {step === 2 && (
        <div className="flex flex-col px-6 pt-16 pb-10 h-full">
          <div className="text-left mt-[3rem]">
            <Title2 text="석기시대님의 수입은" />
            <Title2 text="어느정도이신가요?" />
            <div className="mt-[2rem]">
              <SubText text="실제 수령하는 금액 기준으로 입력 부탁드려요." />
            </div>
          </div>

          <div className="mt-[3rem]">
            <GoalInput
              value={incomeText}
              onChange={setIncomeText}
              placeholder={incomePlaceholder}
            />
          </div>

          <div className="flex justify-center mt-auto w-full">
            <DefaultButton text="다음" disabled={!isValidStep} onClick={handleNext} />
          </div>
        </div>
      )}

      {/* STEP 3: 목표 입력 */}
      {step === 3 && (
        <div className="flex flex-col px-6 pt-16 pb-10 h-full">
          <div className="text-left mt-[3rem]">
            <Title2 text="이번 달에는" />
            <Title2 text="얼마까지 쓰고 싶으신가요?" />
            <div className="mt-[2rem]">
              <SubText text="목표는 한달에 한 번만 변경 가능해요." />
            </div>
          </div>

          <div className="mt-[5rem]">
            <GoalInput
              value={goalText}
              onChange={setGoalText}
              placeholder={incomePlaceholder}
            />
            {goalNum > 0 && goalNum > incomeNum && (
              <div className="mt-3 text-red-500 text-[1rem]">
                목표 금액은 한달 내 수입을 초과할 수 없어요.
              </div>
            )}
          </div>

          <div className="flex justify-center mt-auto w-full">
            <DefaultButton text="다음" disabled={!isValidStep} onClick={handleNext} />
          </div>

        </div>
      )}

      {/* STEP 4: 완료 화면 */}
      {step === 4 && (
        <div className="flex flex-col items-center px-4 pt-20 pb-10 h-full">
          {/* 체크 아이콘 */}
          <div className="w-[10rem] h-[10rem] flex items-center translate-y-[11rem]">
            <img
              src={check}
              alt="완료 체크"
              className="w-[10rem] h-[10rem] object-contain"
            />
          </div>

          {/* 완료 텍스트 */}
          <h2 className="mt-[13rem]">
            <Title2 text="목표 금액을 설정했어요" />
          </h2>

          {/* 수입 / 목표 요약 */}
          <div className="w-[80%] mt-[23rem] flex flex-col gap-[1rem] mx-auto">
            <div className="flex justify-between">
              <span className="text-[#A1A1A1] text-[1.2rem]">한달 내 수입</span>
              <span className="text-[#4D4D4D] font-semibold text-[1.5rem]">
                {incomeNum.toLocaleString()} 만원
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#A1A1A1] text-[1.2rem]">목표 금액</span>
              <span className="text-[#4D4D4D] font-semibold text-[1.5rem]">
                {goalNum.toLocaleString()} 만원
              </span>
            </div>
          </div>

          <div className="flex justify-center mt-auto w-full">
            <DefaultButton text="확인" onClick={handleRestart} />
          </div>

        </div>
      )}

    </DefaultDiv>
  );
}
