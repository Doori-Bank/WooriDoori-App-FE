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


  size?: number;
  totalPirceClassName?: string;

  isCategoryShow?: boolean;
  isTotalPostionCenter?: boolean;
}

const ProgressDonet: React.FC<ProgressDonetProps> = ({ total, categories, month, size = 250, totalPirceClassName, isCategoryShow = true, isTotalPostionCenter = true }) => {
  return (
    <div className={`w-full mx-auto text-center ${isTotalPostionCenter ? 'relative' : 'flex flex-col-reverse items-center'}`} 
          style={{ width: isTotalPostionCenter ? size : 'auto', height: isTotalPostionCenter ? `${size + 100}px` : 'auto' }}>
      {
        isCategoryShow &&
        <div className="flex flex-wrap justify-start gap-4 mt-4">
          {categories.map((cat) => (
            <div key={cat.name} className="flex items-center flex-wap gap-1">
              <span className="w-5 h-5" style={{ backgroundColor: cat.color }}></span>
              <span className="text-[1rem]">{cat.name}</span>
            </div>
          ))}
        </div>
      }

      <div style={{ width: size, height: size }} className={`${isTotalPostionCenter ?'mt-10' : ''}`}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categories.map((cat) => ({
                ...cat,
                value: Number(cat.value),
              }))}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="80%"
              paddingAngle={0}
              startAngle={90}
              endAngle={-270}
            >
              {categories.map((cat, index) => (
                <Cell key={`cell-${index}`} fill={cat.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>


      {
        isTotalPostionCenter ?
          <div className={`absolute -mt-2 left-1/2 top-1/2 flex flex-col items-center justify-center transform -translate-x-1/2 -translate-y-1/2 pointer-events-none ${totalPirceClassName}`}>
            <span className="text-[1.4rem] font-medium">{month} 총 지출</span>
            <span className="text-[1.6rem] font-bold">₩ {total.toLocaleString()}</span>
          </div>
          :
          <div className={`mt-2 flex flex-col justify-center items-center pointer-events-none ${totalPirceClassName}`}>
            <span className="text-[1.4rem] font-medium">{month} 총 지출</span>
            <span className="text-[2.2rem] font-medium">₩ {total.toLocaleString()}</span>
          </div>
      }


    </div>
  );
};

export default ProgressDonet;