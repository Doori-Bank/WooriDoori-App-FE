interface ConsumptionCategoryProps {
    iconSrc: string;
    label: string;
    percentage: string;
    amount: string;
    bgColor?: string;
    isBorder? : boolean;
}

const ConsumptionCategory = ({
    iconSrc,
    label,
    percentage,
    amount,
    bgColor = "bg-gray-100", // 기본 배경
    isBorder = true,
}: ConsumptionCategoryProps) => {
    return (
        <div className={`flex items-center justify-between flex-1 w-full px-5 py-4 ${isBorder ? 'border-b border-gray-100' : ''}`}>
            {/* 왼쪽: 아이콘 + 텍스트 */}
            <div className="flex items-center gap-6">
                {/* ✅ 아이콘 영역 */}
                <div
                    className={`w-20 h-20 ${bgColor} rounded-full flex items-center justify-center shrink-0`}
                >
                    <img
                        src={iconSrc}
                        alt={label}
                        className="w-14 h-14 object-scale-down p-1"
                    />
                </div>

                {/* ✅ 텍스트 정보 */}
                <div className="flex flex-col items-start">
                    <span className="text-gray-900 text-[1.8rem]">{label}</span>
                    <span className="text-gray-400 text-[1.3rem]">{percentage}</span>
                </div>
            </div>

            {/* 오른쪽: 금액 */}
            {amount && (
                <div className="text-right pr-3">
                    <span className="text-gray-900 text-[1.7rem]">{amount}</span>
                </div>
            )}
        </div>
    );
};
export default ConsumptionCategory;
