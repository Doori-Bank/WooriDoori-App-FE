import React, { useEffect, useState } from "react";
import { img } from "@/assets/img";

interface FallingRockScoreViewProps {
  score: number; // 목표 점수
  rockImg? : string; // 돌 이미지
}

const FallingRockScoreView: React.FC<FallingRockScoreViewProps> = ({ score, rockImg = img.stomIcon }) => {
  const [displayScore, setDisplayScore] = useState(0);
  const [isRockDown, setIsRockDown] = useState(false);

  useEffect(() => {
    // 돌 애니메이션이 끝난 뒤 점수 증가 시작
    if (isRockDown) {
      let current = 0;
      const interval = setInterval(() => {
        current += 1;
        setDisplayScore(current);
        if (current >= score) clearInterval(interval);
      }, 30); // 점수 증가 속도 조절
      return () => clearInterval(interval);
    }
  }, [isRockDown, score]);

  return (
    <div className="relative flex flex-col items-center justify-center h-[400px] overflow-hidden">
      {/* 돌 이미지 */}
      <img
        src={rockImg}
        alt="rock"
        className={`w-full rock-fall ${isRockDown ? "rock-landed" : ""}`}
        onAnimationEnd={() => setIsRockDown(true)}
      />

      {/* 점수 텍스트 */}
      {isRockDown && (
        <div
          className="absolute text-[7rem] font-black text-[#005b66]"
          style={{ top: "35%" }}
        >
          {displayScore}점
        </div>
      )}

      {/* 저울 영역 */}
      <img src={img.scaleIcon} alt="저울" width={95}  className="absolute bottom-[1rem] text-[3rem] font-bold text-[#005b66]" />
    </div>
  );
};

export default FallingRockScoreView;
