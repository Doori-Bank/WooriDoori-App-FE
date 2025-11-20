import React from 'react';
import { Line, XAxis, YAxis, ResponsiveContainer, Area, AreaChart, Tooltip, DotProps } from 'recharts';

interface BenefitChartProps {
  data: {
    month: string;
    benefit: number;
  }[];
  currentMonthIndex?: number;
  userName?: string;
}

const BenefitChart: React.FC<BenefitChartProps> = ({ 
  data, 
  currentMonthIndex = data.length - 1,
  userName = '사용자'
}) => {
  const currentData = data[currentMonthIndex];
  const currentBenefit = currentData?.benefit || 0;

  // 등급 계산 (점수에 따라)
  const getGradeMessage = (score: number) => {
    if (score >= 80) return { message: '훌륭해요!', subMessage: '소비 습관이 매우 좋은 것 같아요!' };
    if (score >= 60) return { message: '좋아요!', subMessage: '소비 습관이 괜찮은 편이에요!' };
    if (score >= 40) return { message: '조금 아쉽군요!', subMessage: '소비 습관을 조금 더 개선해볼까요?' };
    return { message: '조금 아쉽군요!', subMessage: '소비 습관을 조금 더 개선해볼까요?' };
  };

  const gradeInfo = getGradeMessage(currentBenefit);

  // 커스텀 도트 컴포넌트 (그린 테두리 + 흰색 내부)
  const CustomDot = (props: DotProps) => {
    const { cx, cy } = props;
    if (!cx || !cy) return null;
    
    return (
      <g>
        {/* 외부 그린 동그라미 */}
        <circle cx={cx} cy={cy} r={6} fill="#8BC34A" />
        {/* 내부 흰색 동그라미 */}
        <circle cx={cx} cy={cy} r={2.5} fill="white" />
      </g>
    );
  };

  // 커스텀 활성 도트 컴포넌트
  const CustomActiveDot = (props: DotProps) => {
    const { cx, cy } = props;
    if (!cx || !cy) return null;
    
    return (
      <g>
        {/* 외부 그린 동그라미 (더 큼) */}
        <circle cx={cx} cy={cy} r={8} fill="#7EB73F" />
        {/* 내부 흰색 동그라미 */}
        <circle cx={cx} cy={cy} r={4} fill="white" />
      </g>
    );
  };

  return (
    <div className="mb-4 w-full">
      {/* 상단 문구 섹션 */}
      <div className="mb-5">
        <p className="mb-1 font-bold text-gray-800">
          <span className="text-[1.6rem]">{userName}님,</span>{' '}
          <span className="text-[1.7rem] text-blue-800">{gradeInfo.message}</span>
        </p>
        <p className="text-[1.3rem] text-gray-600">
          {gradeInfo.subMessage}
        </p>
      </div>

      {/* 그래프 영역 */}
      <div className="overflow-y-hidden overflow-x-visible relative w-full">
        {/* 라인 그래프 */}
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={data} margin={{ top: 10, right: 5, left: 5, bottom: 20 }}>
            <defs>
              <linearGradient id="colorBenefit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8BC34A" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#8BC34A" stopOpacity={0}/>
              </linearGradient>
            </defs>
            {/* 그리드 제거 - 깔끔한 디자인 */}
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 500 }}
              padding={{ left: 5, right: 5 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={false}
              domain={[0, 100]}
              width={0}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="px-4 py-3 text-white bg-gray-800 rounded-lg shadow-lg">
                      <p className="text-[1rem] text-gray-300 mb-1">{data.month}</p>
                      <p className="text-[1.4rem] font-bold">점수: {data.benefit.toFixed(0)}점</p>
                    </div>
                  );
                }
                return null;
              }}
              cursor={{ stroke: '#8BC34A', strokeWidth: 2, strokeDasharray: '5 5' }}
            />
            <Area
              type="monotone"
              dataKey="benefit"
              stroke="#8BC34A"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorBenefit)"
            />
            <Line
              type="monotone"
              dataKey="benefit"
              stroke="#8BC34A"
              strokeWidth={2.5}
              dot={<CustomDot />}
              activeDot={<CustomActiveDot />}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BenefitChart;

