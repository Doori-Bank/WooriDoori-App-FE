import React, { useEffect, useState } from "react";

interface BottomsheetProps {
  title?: string;
  isOpen: boolean;
  onClose?: () => void;
  onSelect?: (activity: string) => void;
}

const activities = ["무직", "학생", "프리랜서", "자영업", "회사원"];

const Bottomsheet: React.FC<BottomsheetProps> = ({
  title = "활동 형태를 선택해주세요",
  isOpen,
  onClose,
  onSelect,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // 열릴 때/닫힐 때 애니메이션 상태 관리
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      // 애니메이션 후 DOM 제거를 위한 지연
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (activity: string) => {
    setSelected(activity);
    if (onSelect) onSelect(activity);
    if (onClose) onClose(); // 선택 시 바텀시트 닫기
  };

  if (!isVisible && !isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end justify-center transition-all duration-300 ${
        isOpen ? "bg-black/40" : "bg-black/0 pointer-events-none"
      }`}
      onClick={onClose} // ✅ 배경 클릭 시 닫힘
    >
      <div
        className={`w-[400px] bg-white shadow-md overflow-hidden flex flex-col items-center text-center transform transition-transform duration-300 ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ borderRadius: "4rem 4rem 0 0" }}
        onClick={(e) => e.stopPropagation()} // ✅ 내부 클릭 시 이벤트 버블링 방지
      >
        {/* 상단 회색 바 */}
        <div className="mt-3 bg-gray-300 h-2 w-20 rounded-lg" />

        {/* 본문 */}
        <div className="py-6 px-6 w-full">
          <h2 className="text-[1.6rem] font-semibold text-gray-800 mb-6">
            {title}
          </h2>

          <div className="flex-1 w-full flex flex-col items-center gap-3">
            {activities.map((activity, index) => (
              <button
                key={activity}
                onClick={() => handleSelect(activity)}
                className={`w-full py-4 text-gray-700 text-[1.4rem] border-gray-200 transition 
                ${
                  selected === activity
                    ? "text-blue-600 font-semibold"
                    : "hover:text-black"
                } 
                ${index === activities.length - 1 ? "mb-10" : "border-b"}
                `}
              >
                {activity}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bottomsheet;
