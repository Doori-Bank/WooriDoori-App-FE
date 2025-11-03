import React from 'react';

interface PullToRefreshIndicatorProps {
  pullY: number;
  isPulling: boolean;
  isRefreshing: boolean;
  threshold?: number;
}

const PullToRefreshIndicator: React.FC<PullToRefreshIndicatorProps> = ({
  pullY,
  isPulling,
  isRefreshing,
  threshold = 80,
}) => {
  return (
    <div 
      className={`fixed top-0 left-1/2 -translate-x-1/2 w-[100vw] max-w-[400px] bg-gray-100 flex items-end justify-center overflow-hidden border-b z-[70] ${
        pullY > 0 || isRefreshing ? 'flex' : 'hidden'
      } ${isPulling ? '' : 'transition-all duration-180 ease-out'}`}
      style={{ height: `${Math.max(0, pullY)}px` }}
    >
      <div className="relative pb-2 w-full text-xs text-center text-gray-500">
        <div 
          className="absolute left-0 right-0 h-0.5 bg-gray-400 transition-opacity duration-180"
          style={{ 
            top: `${Math.max(0, threshold - 2)}px`,
            opacity: pullY >= threshold ? 1 : 0.5
          }}
        />
        {isRefreshing ? '새로고치는 중…' : pullY >= threshold ? '놓으면 새로고침' : '당겨서 새로고침'}
      </div>
    </div>
  );
};

export default PullToRefreshIndicator;

