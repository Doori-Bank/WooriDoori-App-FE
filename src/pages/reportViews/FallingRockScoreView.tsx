import React, { useEffect, useState } from "react";
import { img } from "@/assets/img";

interface FallingRockScoreViewProps {
  score: number; // 목표 점수
}

const FallingRockScoreView: React.FC<FallingRockScoreViewProps> = ({ score }) => {
  const [displayScore, setDisplayScore] = useState(0);
  const [isRockDown, setIsRockDown] = useState(false);

  // =================함수======================
  useEffect(() => {
    if (isRockDown) {
      let current = 0;
      const interval = setInterval(() => {
        current += 1;
        setDisplayScore(current);
        if (current >= score) clearInterval(interval);
      }, 30);
      return () => clearInterval(interval);
    }
  }, [isRockDown, score]);

  /** 점수별 돌 이미지 및 위치 지정 **/
  const rockData = () => {
    if (score >= 80) {
      return { src: img.emeraldIcon, top: "18%", width: "50%" };
    } else if (score >= 60) {
      return { src: img.goldIcon, top: "14%", width: "48%" };
    } else if (score >= 40) {
      return { src: img.silverIcon, top: "13%", width: "100%" };
    } else if (score >= 20) {
      return { src: img.copperIcon2, top: "7%", width: "85%" };
    } else {
      return { src: img.stoneIcon, top: "5%", width: "90%" };
    }
  };

  const { src, top, width } = rockData();

  return (
    <div className="relative flex flex-col items-center justify-center h-[400px] overflow-hidden">
      {/* 돌 이미지 */}
      <img
        src={src}
        alt="rock"
        className={`absolute rock-fall ${isRockDown ? "rock-landed" : ""}`}
        style={{
          top,
          left: "0",
          width,
          transform: "translate(0%, 0)",
        }}
        onAnimationEnd={() => setIsRockDown(true)}
      />

      {/* 점수 텍스트 */}
      {isRockDown && (
        <div
          className="absolute text-[7rem] font-black text-[#005b66]"
          style={{ top: "5%" }}
        >
          {displayScore}점
        </div>
      )}

      {/* 저울 영역 */}
      <img
        src={img.scaleIcon}
        alt="저울"
        width={95}
        className="absolute bottom-[1rem]"
      />
    </div>
  );
};

export default FallingRockScoreView;
