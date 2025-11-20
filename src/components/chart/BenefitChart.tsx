import React from 'react';
import { Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart, Tooltip, DotProps } from 'recharts';

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
    <div className="p-1 mb-6 w-full bg-white rounded-2xl">
      {/* 상단 문구 섹션 */}
      <div className="mb-7">
        <p className="mb-1 font-bold text-gray-800">
          <span className="text-[1.5rem]">{userName}님,</span>{' '}
          <span className="text-[1.6rem] text-blue-800">{gradeInfo.message}</span>
        </p>
        <p className="text-[1.2rem] text-gray-600">
          {gradeInfo.subMessage}
        </p>
      </div>

      {/* 그래프 영역 */}
      <div className="relative -mx-20">
        {/* 라인 그래프 */}
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={data} margin={{ top: 10, right: 50, left: 0, bottom: 20 }}>
            <defs>
              <linearGradient id="colorBenefit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8BC34A" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8BC34A" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={false}
              domain={[0, 100]}
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
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorBenefit)"
            />
            <Line
              type="monotone"
              dataKey="benefit"
              stroke="#8BC34A"
              strokeWidth={2}
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

