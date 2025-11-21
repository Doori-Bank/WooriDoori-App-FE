import React, { useEffect, useState } from "react";
import ConsumptionCategory from "@/components/category/ConsumptionCategory";

interface Category {
  name: string;
  value: number;
  color: string;
  percent: string;
  src: string;
}

interface Props {
  categoriesList: Category[];
  totalPrice: number;
}

interface ProgressBarProps {
  categories: Category[];
  size: number;
  totalPrice: number;
  onCategoryFill: (index: number) => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ categories, size, totalPrice, onCategoryFill }) => {
  const total = categories.reduce((sum, cat) => sum + cat.value, 0);
  const ratios = categories.map(cat => cat.value / total);

  const [filledIndex, setFilledIndex] = useState(-1);

  useEffect(() => {
    let current = -1;

    const fillNext = () => {
      current++;
      if (current < categories.length) {
        setFilledIndex(current);
        onCategoryFill(current);
        setTimeout(fillNext, 200); // 다음 카테고리로 넘어가기까지의 시간 (0.초)
      }
    };

    fillNext();
  }, [categories]);

  let cumulative = 0;

  return (
    <div className="w-full mx-auto">
      <p className="text-[1.8rem] font-medium text-start">{totalPrice.toLocaleString()}원</p>
      <div
        className="mt-5 relative h-[2.5rem] rounded-full bg-gray-200 overflow-hidden mx-auto"
        style={{ width: size }}
      >
        {categories.map((cat, idx) => {
          const width = ratios[idx] * size;
          const left = cumulative;
          cumulative += width;

          return (
            <div 
              key={cat.name}
              className={`absolute top-0 h-full transition-all duration-500 ease-in-out ${
                idx <= filledIndex ? "opacity-100" : "opacity-0"
              }`}
              style={{
                width: idx <= filledIndex ? `${width}px` : "0px",
                left: `${left}px`,
                backgroundColor: cat.color,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

const ProgressCategoryView: React.FC<Props> = ({ categoriesList, totalPrice }) => {
  const [visibleCount, setVisibleCount] = useState(0);

  const handleCategoryFill = (index: number) => {
    // 각 카테고리 막대가 채워질 때마다 하나씩 표시
    setTimeout(() => {
      setVisibleCount(prev => Math.max(prev, index + 1));
    }, 200); // 살짝 지연 후 등장
  };

  return (
    <div>
      <div className="flex-shrink-0 p-6 bg-white z-10 sticky top-0">
      <ProgressBar 
        size={300}
        totalPrice={totalPrice}
        categories={categoriesList}
        onCategoryFill={handleCategoryFill}
      />
      <hr className="my-10 border-[#E4EAF0] border-[1.5px] rounded-full" />
      </div>


      <div className="flex flex-col gap-4 overflow-y-auto flex-1 px-6 pt-4 pb-56 min-h-0 -webkit-overflow-scrolling-touch">
        {categoriesList.map((element, index) => (
          <div
            key={index}
            className={`category-item ${index < visibleCount ? "show" : ""}`}
          >
            <ConsumptionCategory
              amount={`${element.value.toLocaleString()}원`}
              iconSrc={element.src}
              label={element.name}
              bgColor={element.color}
              percentage={element.percent}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressCategoryView;
