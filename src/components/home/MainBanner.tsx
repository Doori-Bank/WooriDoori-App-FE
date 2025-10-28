import React, { useState, useEffect } from "react";

interface MainBannerProps {
  totalDays: number;       // 전체 일수
  passedDays: number;      // 경과 일수
  progressColor?: string;  // 진행바 색상
  bgColor?: string;        // 배경색
  bgImage?: string;        // 배경 이미지 (선택)
  className? : string;
}

const MainBanner: React.FC<MainBannerProps> = ({
  totalDays,
  passedDays,
  progressColor = "#FFD84D",
  bgColor = "#4C8B73",
  bgImage,
  className,
}) => {
  const percent = Math.round((passedDays / totalDays) * 100);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    // 첫 로딩 시 바로 흔들림
    setShake(true);
    const timeout = setTimeout(() => setShake(false), 1000);

    // 10초마다 흔들림
    const interval = setInterval(() => {
      setShake(true);
      setTimeout(() => setShake(false), 1000);
    }, 10000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      className={`w-full h-[15rem] rounded-xl p-5 text-white flex flex-col justify-center ${className}`}
      style={{
        backgroundColor: bgColor,
        backgroundImage: bgImage ? `url(${bgImage})` : undefined,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        backgroundSize: "cover",
      }}
    >
      {/* 진행 바 */}
      <div className="mb-3">
        <div className="w-1/2 bg-gray-300/40 rounded-full h-5 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${percent}%`, backgroundColor: progressColor }}
          ></div>
        </div>
        <p className="text-[1.2rem] mt-1 opacity-80">{`${totalDays}일 중 ${passedDays}일이 지났어요`}</p>
      </div>

      {/* 퍼센트 표시 */}
      <div className={`font-bold flex items-end gap-2`}>
        <span className={`text-[4rem] ${shake ? "diagonal-shake" : ""}`}>{percent}%</span>
        <span className="text-[2rem] mb-4">달성!</span>
      </div>
    </div>
  );
};

export default MainBanner;