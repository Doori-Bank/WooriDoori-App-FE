interface CategoryGridProps {
  iconSrc: string;
  label: string;
}

const CategoryGrid = ({ iconSrc, label }: CategoryGridProps) => {
  return (
    <div className="flex flex-col items-center justify-center w-[7rem] h-[7rem] rounded-2xl border border-gray-200 bg-white shadow-sm">
      <img src={iconSrc} alt={label} className="w-12 h-12 object-contain mb-1" />
      <span className="text-gray-700 text-sm font-medium">{label}</span>
    </div>
  );
};

export default CategoryGrid;
