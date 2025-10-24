interface ConsumptionCategoryDetailProps {
  iconSrc: string; // 카테고리 아이콘
  amount: string; // 금액
  store: string; // 가맹점 이름
  cardName: string; // 카드명
  bgColor?: string; // 아이콘 배경색
}

const ConsumptionCategoryDetail = ({
  iconSrc,
  amount,
  store,
  cardName,
  bgColor = "bg-gray-100",
}: ConsumptionCategoryDetailProps) => {
  return (
    <div className="flex items-center justify-between w-full px-5 py-3 border-b border-gray-100">
      {/* 왼쪽: 아이콘 + 텍스트 */}
      <div className="flex items-center gap-4">
        {/* 아이콘 */}
        <div
          className={`w-20 h-20 ${bgColor} rounded-full flex items-center justify-center shrink-0`}
        >
          <img src={iconSrc} alt="icon" className="w-14 h-14 object-scale-down p-1" />
        </div>

        {/* 텍스트 */}
        <div className="flex flex-col items-start">
          <span className="text-gray-900 text-[1.7rem] leading-tight">
            {amount}
          </span>
          <span className="text-gray-400 text-[1.1rem] mt-[2px]">
            {store} | {cardName}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ConsumptionCategoryDetail;
