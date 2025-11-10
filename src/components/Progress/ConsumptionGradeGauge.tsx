import React from "react";
import { img } from "@/assets/img";

interface ConsumptionGradeGaugeProps {
  userName: string;
  grade: number;   // 1~5 등급
  className?: string;
}

/* ---------- Utils ---------- */
const d2r = (deg: number) => (Math.PI / 180) * deg;

function ringSegmentPath(
  cx: number,
  cy: number,
  rOuter: number,
  rInner: number,
  startDeg: number,
  endDeg: number
) {
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;

  const sx = cx + rOuter * Math.cos(d2r(startDeg));
  const sy = cy + rOuter * Math.sin(d2r(startDeg));
  const ex = cx + rOuter * Math.cos(d2r(endDeg));
  const ey = cy + rOuter * Math.sin(d2r(endDeg));

  const isx = cx + rInner * Math.cos(d2r(endDeg));
  const isy = cy + rInner * Math.sin(d2r(endDeg));
  const iex = cx + rInner * Math.cos(d2r(startDeg));
  const iey = cy + rInner * Math.sin(d2r(startDeg));

  return [
    `M ${sx} ${sy}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${ex} ${ey}`,
    `L ${isx} ${isy}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 0 ${iex} ${iey}`,
    "Z",
  ].join(" ");
}

const ConsumptionGradeGauge: React.FC<ConsumptionGradeGaugeProps> = ({
  userName,
  grade,
  className,
}) => {
  const segments = [1, 2, 3, 4, 5];

  // 색상 (좌 -> 우)
  const colors = ["#6BB64A", "#B6DB4A", "#F7E547", "#F9A23B", "#E74C3C"];
  const baseColor = "#2E7B4E"; // 하단 반원(중앙 원) 색

  // ----- SVG 치수/반지름 설정 -----
  const size = 340;               // 전체 폭(px). 높이는 자동으로 절반
  const W = size;
  const H = size / 2;
  const cx = W / 2;
  const cy = H;                   // 반원 중심(아래쪽 가운데)

  const thickness = 40;           // 컬러 링 두께
  const gapDeg = 0;               // 세그먼트 간격(도) - gap 제거
  const outerR = (W * 0.78) / 2;  // 스샷과 비슷한 비율
  const innerR = outerR - thickness;

  const innerGap = 12;            // 컬러링과 베이스 사이 간격
  const whiteR = (innerR - innerGap) * 0.7; // 하단 초록 반원 반지름(디자인 맞춤)

  const totalAngle = 180;
  const totalGap = gapDeg * (segments.length - 1);
  const segAngle = (totalAngle - totalGap) / segments.length;

  // ----- 세그먼트 경로 & 라벨 좌표 -----
  const segmentPaths = segments.map((num, i) => {
    // 세그먼트가 충분히 겹치도록 overlapDeg 추가 (경계선 완전 제거)
    const overlapDeg = 2; // 더 많이 겹치게
    const start = 180 + i * segAngle - (i > 0 ? overlapDeg : 0);
    const end = start + segAngle + (i < segments.length - 1 ? overlapDeg * 2 : 0);
    const path = ringSegmentPath(cx, cy, outerR, innerR, start, end);

    // 라벨은 각 세그먼트 중앙 각도에 배치
    const labelAngle = start + segAngle / 2;
    const labelRadius = (outerR + innerR) / 2;
    const labelX = cx + labelRadius * Math.cos(d2r(labelAngle));
    const labelY = cy + labelRadius * Math.sin(d2r(labelAngle));

    return { path, labelX, labelY, num, color: colors[i] };
  });

  // 각 등급의 세그먼트 중앙 각도를 계산하고 CSS rotate에 맞게 변환
  // 각 등급의 실제 세그먼트 중앙 각도 계산 (overlap 고려)
  const getSegmentCenterAngle = (g: number) => {
    const i = Math.min(Math.max(g, 1), 5) - 1; // 0~4
    const overlapDeg = 2;
    const start = 180 + i * segAngle - (i > 0 ? overlapDeg : 0);
    // 실제 세그먼트의 정확한 중앙 각도
    return start + segAngle / 2;
  };
  
  // 포인터 위치: 게이지 중심에서 각 등급 세그먼트 중앙으로 이동한 위치
  const pointerRadius = (innerR + whiteR) / 2; // 세그먼트와 베이스 사이
  const centerDeg = getSegmentCenterAngle(grade);
  const pointerRad = d2r(centerDeg);
  // SVG 좌표계 기준 위치
  const pointerX = cx + pointerRadius * Math.cos(pointerRad);
  const pointerY = cy + pointerRadius * Math.sin(pointerRad);
  // 상대 위치를 퍼센트로 변환 (컨테이너 기준)
  const pointerLeftPercent = (pointerX / W) * 100;
  // 아래로 조금 더 내리기 위해 보정
  const pointerBottomPercent = ((H - pointerY) / H) * 100 - 5;
  
  // CSS rotate 각도 계산
  // SVG: 0도=오른쪽, 90도=아래, 180도=왼쪽, 270도=위
  // CSS rotate: 위쪽이 0도, 시계방향이 양수
  // SVG 270도(위)를 CSS 0도로 변환: CSS각도 = SVG각도 - 270
  const pointerAngle = centerDeg - 270;
  
  // 시작 위치: 3등급 위치 (정위치, 상단 중앙)
  const startGrade = 3;
  const startCenterDeg = getSegmentCenterAngle(startGrade);
  const startRad = d2r(startCenterDeg);
  const startY = cy + pointerRadius * Math.sin(startRad);
  const startBottomPercent = ((H - startY) / H) * 100 - 5;


  return (
    <div
      className={`flex overflow-hidden relative flex-col justify-center items-center py-6 w-full bg-white rounded-2xl border ${className ?? ""}`}
      aria-label={`${userName}님의 소비 등급 게이지`}
    >
      {/* 폭죽 - 모서리 배치 */}
      <img
        src={img.fireworkLeft}
        alt=""
        className="absolute left-0 top-0 w-[6rem] h-[6rem] pointer-events-none select-none"
      />
      <img
        src={img.fireworkRight}
        alt=""
        className="absolute right-0 bottom-0 w-[6rem] h-[6rem] pointer-events-none select-none"
      />

      {/* 등급 텍스트 */}
      <p className="text-[1.2rem] font-semi-bold text-gray-500 mb-1">
        {userName}님의 소비 등급은 {grade}등급입니다
      </p>

      {/* 반원 게이지 */}
      <div className="relative w-[17rem] h-[10rem] flex items-center justify-center mb-4">
        <svg viewBox={`0 0 ${W} ${H}`} className="relative z-10 w-full h-full" shapeRendering="geometricPrecision">
          {/* 세그먼트 */}
          {segmentPaths.map((seg, i) => (
            <g key={i}>
              <path d={seg.path} fill={seg.color} stroke="none" strokeWidth="0" vectorEffect="non-scaling-stroke" />
              <text
                x={seg.labelX}
                y={seg.labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#000"
                fontWeight="bold"
                style={{ fontSize: "20px" }}
              >
                {seg.num}
              </text>
            </g>
          ))}

          {/* 하단 초록 반원 베이스 */}
          <path
            d={`M ${cx - whiteR} ${cy} A ${whiteR} ${whiteR} 0 0 1 ${cx + whiteR} ${cy}
                L ${cx + whiteR} ${cy} L ${cx} ${cy} Z`}
            fill={baseColor}
          />
          
          {/* 등급 텍스트 - 녹색 반원 위에 표시 */}
          <text
            x={cx}
            y={cy - whiteR * 0.4}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#FFFFFF"
            fontSize="25"
            fontWeight="bold"
            style={{ fontSize: '25px' }}
          >
            {grade}
          </text>

        </svg>

        {/* 포인터: CSS 애니메이션 적용 */}
        <div
          className={`absolute origin-bottom gauge-pointer-grade-${grade}`}
          style={{
            '--pointer-angle': `${pointerAngle}deg`,
            '--pointer-left': `${pointerLeftPercent}%`,
            '--pointer-bottom': `${pointerBottomPercent}%`,
            '--start-bottom': `${startBottomPercent}%`,
          } as React.CSSProperties}
        >
          <svg
            width="8"
            height="10"
            viewBox="0 0 14 16"
            style={{
              display: 'block',
            }}
          >
            <path
              d={`M 7 0 L 0 16 L 14 16 Z`}
              fill="#111"
            />
          </svg>
        </div>
      </div>

    </div>
  );
};

export default ConsumptionGradeGauge;
