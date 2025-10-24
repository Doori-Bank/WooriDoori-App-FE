import React from "react";

interface ProgressCardProps {
  date: string;
  title: string;
  progress: number; // 0 ~ 100
  score: number;
}

const ProgressCard: React.FC<ProgressCardProps> = ({ date, title, progress, score }) => {
  return (
    <div className="w-full p-4 bg-white flex justify-between items-center">
      <div>
        <p className="text-gray-400 text-[1.4rem]">{date}</p>
        <h3 className="text-[1.5rem] font-medium mt-1">{title}</h3>
        <div className="flex items-center gap-5 mt-4">
          <div className="w-[16rem] bg-gray-200 rounded-full h-">
            <div
              className="bg-green-500 h-4 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-gray-500 text-[1.2rem]">{progress}%</p>
        </div>
      </div>
      <div className="text-[2rem] font-extrabold ml-4">{score}점</div>
    </div>
  );
};

export default ProgressCard;
