import React from "react";
import CategoryGrid from "@/components/category/CategoryGrid";

interface CategoryItem {
  src: string;
  title: string;
}

interface MonthCategoryListViewProps {
  categoriesByMonthList: CategoryItem[];
}

const MonthCategoryListView: React.FC<MonthCategoryListViewProps> = ({ categoriesByMonthList }) => {
  return (
    <div className="mt-10 grid align-stretch grid-cols-3 gap-x-[3rem] gap-y-[2rem]">
      {categoriesByMonthList.map((element, index) => (
        <div
          key={index}
          className="animate-fade-up"
          style={{ animationDelay: `${index * 0.15}s` }}
        >
          <CategoryGrid iconSrc={element.src} label={element.title} />
        </div>
      ))}
    </div>
  );
};

export default MonthCategoryListView;
