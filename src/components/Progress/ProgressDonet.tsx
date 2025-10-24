import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface Category {
  name: string;
  value: number;
  color: string;
}

interface ProgressDonetProps {
  total: number;
  categories: Category[];
  month: string;
}

const ProgressDonet: React.FC<ProgressDonetProps> = ({ total, categories, month }) => {
  return (
    <div className="w-full relative mx-auto text-center">
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {categories.map((cat) => (
          <div key={cat.name} className="flex items-center flex-wap gap-1">
            <span className="w-5 h-5" style={{ backgroundColor: cat.color }}></span>
            <span className="text-[1rem]">{cat.name}</span>
          </div>
        ))}
      </div>
      
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={categories.map(cat => ({
              ...cat,
              value: Number(cat.value)  // string -> number
            }))}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={2}
            startAngle={90}
            endAngle={-270} // 시계방향
          >
            {categories.map((cat, index) => (
              <Cell key={`cell-${index}`} fill={cat.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div className="absolute inset-0 mt-2 flex flex-col justify-center items-center pointer-events-none">
        <span className="text-[1.4rem] font-medium">{month} 총 지출</span>
        <span className="text-[1.6rem] font-bold">₩ {total.toLocaleString()}</span>
      </div>

      
    </div>
  );
};

export default ProgressDonet;