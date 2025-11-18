import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultDiv from "@/components/default/DefaultDiv";
import Title2 from "@/components/title/Title2";
import SubText from "@/components/text/SubText";
import GoalInput from "@/components/input/GoalInput";
import DefaultButton from "@/components/button/DefaultButton";
import BottomButtonWrapper from "@/components/button/BottomButtonWrapper";
import Bottomsheet from "@/components/default/Bottomsheet";
import check from "@/assets/check2.png";
import { img } from "@/assets/img";

// 카테고리 데이터
const essentialCategories = [
  { src: img.coffeeIcon, title: "카페" },
  { src: img.foodIcon, title: "식비" },
  { src: img.entertainmentIcon, title: "술/유흥" },
  { src: img.martIcon, title: "편의점/마트" },
  { src: img.educationIcon, title: "교육" },
  { src: img.shoppingIcon, title: "쇼핑" },
  { src: img.trafficIcon, title: "주유/자동차" },
  { src: img.residenceIcon, title: "주거/관리" },
  { src: img.hospitalIcon, title: "병원" },
  { src: img.transferIcon, title: "이체" },
  { src: img.travelIcon, title: "여행" },
  { src: img.phoneIcon, title: "통신" },
  { src: img.etcIcon, title: "기타" },
];

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
  // 단계: 1(직업) → 2(수입) → 3(목표) → 4(카테고리) → 5(완료)
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [job, setJob] = useState<string | null>(null);
  const [isBottomsheetOpen, setBottomsheetOpen] = useState(false);

  const [incomeText, setIncomeText] = useState(""); // 숫자 문자열 (콤마 제거 상태)
  const [goalText, setGoalText] = useState("");
  
  // 카테고리 선택 상태 (필수/비필수)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const incomeNum = useMemo(() => parseAmountToNumber(incomeText), [incomeText]);
  const goalNum = useMemo(() => parseAmountToNumber(goalText), [goalText]);

  // 단계별 유효성
  const isValidStep = useMemo(() => {
    if (step === 1 && !job) return false;
    if (step === 2 && incomeNum <= 0) return false;
    if (step === 3 && (goalNum <= 0 || goalNum > incomeNum)) return false;
    if (step === 4 && selectedCategories.length === 0) return false;
    return true;
  }, [step, job, incomeNum, goalNum, selectedCategories]);

  const handleNext = () => {
    if (!isValidStep) return;
    if (step < 5) setStep((prev) => (prev + 1) as 1 | 2 | 3 | 4 | 5);
  };

  const handleRestart = () => {
    setStep(1);
    setJob(null);
    setIncomeText("");
    setGoalText("");
    setSelectedCategories([]);

    // ✅ 홈으로 이동
    navigate("/home");
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as 1 | 2 | 3 | 4 | 5);
    } else {
      // step === 1 인 상태에서 뒤로가기 눌렀을 때의 정책:
      // 아무 것도 안 하거나, 나가거나 중 하나인데
      // 기존 코드상 else 로직 없었으니 아무 것도 안 함
      // 필요하면 navigate(-1) 같은 거 넣어도 됨.
    }
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleClose = () => {
    navigate("/home");
  };

  return (
    <DefaultDiv
      isHeader={true}
      title="목표 금액 설정"
      isShowBack={step !== 1}
      isShowClose={true}
      isShowSetting={false}
      onBack={handleBack}
      onClose={handleClose}
      isMainTitle={false}
    >
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

          <BottomButtonWrapper>
            <DefaultButton text="다음" disabled={!isValidStep} onClick={handleNext} />
          </BottomButtonWrapper>

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

          <div className="mt-[5rem]">
            <GoalInput
              value={incomeText}
              onChange={setIncomeText}
              placeholder={incomePlaceholder}
            />
          </div>

          <BottomButtonWrapper>
            <DefaultButton text="다음" disabled={!isValidStep} onClick={handleNext} />
          </BottomButtonWrapper>
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

          <BottomButtonWrapper>
            <DefaultButton text="다음" disabled={!isValidStep} onClick={handleNext} />
          </BottomButtonWrapper>
        </div>
      )}

      {/* STEP 4: 카테고리 선택 (필수/비필수) */}
      {step === 4 && (
        <div className="flex flex-col px-6 pt-16 pb-10 h-full">
          <div className="text-left mt-[3rem]">
            <Title2 text="필수 소비 항목을" />
            <Title2 text="선택해주세요" />
            <div className="mt-[2rem]">
              <SubText text="선택한 항목은 필수 소비로 분류됩니다." />
            </div>
          </div>

          <div className="mt-[3rem] flex-1 overflow-y-auto">
            <div className="grid grid-cols-3 gap-x-[3rem] gap-y-[2rem]">
              {essentialCategories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => toggleCategory(category.title)}
                  className={`
                    flex flex-col items-center justify-center p-4 rounded-xl
                    transition-all duration-200
                    ${
                      selectedCategories.includes(category.title)
                        ? "bg-[#8BC34A] border-2 border-[#8BC34A] shadow-lg scale-105"
                        : "bg-white border-2 border-gray-200 hover:border-gray-300"
                    }
                  `}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <img
                    src={category.src}
                    alt={category.title}
                    className="w-[3rem] h-[3rem] object-contain mb-2"
                  />
                  <span
                    className={`text-[1.2rem] font-medium ${
                      selectedCategories.includes(category.title)
                        ? "text-white"
                        : "text-gray-700"
                    }`}
                  >
                    {category.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <BottomButtonWrapper>
            <DefaultButton text="다음" disabled={!isValidStep} onClick={handleNext} />
          </BottomButtonWrapper>
        </div>
      )}

      {/* STEP 5: 완료 화면 */}
      {step === 5 && (
        <div className="flex flex-col items-center px-4 pt-20 pb-10 h-full">
          <div className="flex flex-col items-center justify-center h-[50%]">
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
          </div>

          {/* 수입 / 목표 요약 */}
          <div className="w-[85%] mt-[27rem] flex flex-col gap-[1rem] mx-auto fixed bottom-[12.5rem]">
            <div className="flex justify-between">
              <span className="text-[#A1A1A1] text-[1.3rem]">한달 내 수입</span>
              <span className="text-[#4D4D4D] font-semibold text-[1.5rem]">
                {incomeNum.toLocaleString()} 만원
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#A1A1A1] text-[1.3rem]">목표 금액</span>
              <span className="text-[#4D4D4D] font-semibold text-[1.5rem]">
                {goalNum.toLocaleString()} 만원
              </span>
            </div>
          </div>

          <BottomButtonWrapper>
            <DefaultButton text="확인" onClick={handleRestart} />
          </BottomButtonWrapper>
        </div>
      )}

    </DefaultDiv>
  );
}
