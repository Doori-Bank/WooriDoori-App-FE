import React, { useState } from 'react';
import { CardData } from '@/utils/card/cardData';

interface CardDetailViewProps {
  card: CardData;
  currentIndex: number;
  totalCards: number;
  onCardChange?: (index: number) => void;
  onViewBenefits?: () => void;
  onViewFullCardNumber?: () => void;
  onChangePaymentDate?: () => void;
}

const CardDetailView: React.FC<CardDetailViewProps> = ({
  card,
  currentIndex,
  totalCards,
  onCardChange,
  onViewBenefits,
  onViewFullCardNumber,
  onChangePaymentDate,
}) => {
  const [showFullCardNumber, setShowFullCardNumber] = useState(false);

  // 카드번호 마스킹 처리
  const maskCardNumber = (cardNum: string) => {
    if (!cardNum) return '****-****-****-****';
    const cleaned = cardNum.replace(/\D/g, '');
    if (cleaned.length < 4) return '****-****-****-****';
    
    if (showFullCardNumber) {
      // 전체 번호 표시 (4자리씩 나누기)
      return cleaned.match(/.{1,4}/g)?.join('-') || cardNum;
    }
    
    // 마스킹 처리 (앞 4자리와 뒤 4자리만 표시)
    const firstFour = cleaned.slice(0, 4);
    const lastFour = cleaned.slice(-4);
    return `${firstFour}-****-****-${lastFour}`;
  };

  // 카드 타입 추출 (카드명에서)
  const getCardTags = () => {
    const tags = [];
    if (card.cardName.toLowerCase().includes('체크')) {
      tags.push({ label: '체크', color: 'blue' });
    }
    if (card.cardName.toLowerCase().includes('visa')) {
      tags.push({ label: 'VISA VISA', color: 'blue' });
    }
    // 후불교통은 예시로 추가 (실제 데이터에 따라 수정 필요)
    if (card.cardName.toLowerCase().includes('교통') || card.cardName.toLowerCase().includes('패스')) {
      tags.push({ label: '후불교통', color: 'green' });
    }
    return tags;
  };

  const tags = getCardTags();

  return (
    <div className="flex flex-col w-full">
      {/* 카드 이미지 영역 - 스와이프 가능 */}
      <div className="relative mb-6">
        <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <div className="flex-shrink-0 w-full snap-center">
            <div className="relative mx-auto" style={{ width: 'calc(100% - 4rem)', aspectRatio: '1.58 / 1' }}>
              <img
                src={card.cardImage}
                alt={card.cardName}
                className="object-contain w-full h-full rounded-2xl"
              />
              {/* 카드 인덱스 표시 */}
              <div className="absolute bottom-4 right-4 text-white text-[1.2rem] font-medium">
                {currentIndex + 1}/{totalCards}
              </div>
            </div>
          </div>
        </div>
        
        {/* 카드 네비게이션 인디케이터 */}
        {totalCards > 1 && (
          <div className="flex gap-2 justify-center mt-4">
            {Array.from({ length: totalCards }).map((_, index) => (
              <button
                key={index}
                onClick={() => onCardChange?.(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? 'bg-blue-500 w-6' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* 카드 태그 */}
      {tags.length > 0 && (
        <div className="flex gap-2 px-4 mb-4">
          {tags.map((tag, index) => (
            <span
              key={index}
              className={`px-3 py-1 rounded-full text-[1rem] font-medium border ${
                tag.color === 'blue'
                  ? 'border-blue-500 text-blue-500'
                  : 'border-green-500 text-green-500'
              }`}
            >
              {tag.label}
            </span>
          ))}
        </div>
      )}

      {/* 카드 이름 */}
      <div className="px-4 mb-4">
        <h2 className="text-[1.4rem] font-semibold text-black">{card.title}</h2>
      </div>

      {/* 내카드 혜택 링크 */}
      <div className="px-4 mb-6">
        <button
          onClick={onViewBenefits}
          className="text-[1.2rem] text-blue-500 font-medium"
        >
          내카드 혜택
        </button>
        {/* 인디케이터 */}
        <div className="flex gap-1 mt-2">
          <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
          <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
          <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
        </div>
      </div>

      {/* 구분선 */}
      <div className="my-4 border-t border-gray-200"></div>

      {/* 카드번호 섹션 */}
      <div className="px-4 mb-4">
        <label className="text-[1rem] text-gray-500 mb-2 block">카드번호</label>
        <div className="mb-2">
          <p className="text-[1.8rem] font-bold text-black mb-1">
            {maskCardNumber(card.cardNum)}
          </p>
          <p className="text-[1.2rem] text-black">**/**</p>
        </div>
        <button
          onClick={() => {
            setShowFullCardNumber(!showFullCardNumber);
            onViewFullCardNumber?.();
          }}
          className="w-full py-3 bg-gray-100 rounded-lg text-[1.2rem] text-black font-medium mt-2"
        >
          {showFullCardNumber ? '카드번호 숨기기' : '카드번호 전체보기'}
        </button>
      </div>

      {/* 구분선 */}
      <div className="my-4 border-t border-gray-200"></div>

      {/* 결제일 섹션 */}
      <div className="px-4">
        <div className="flex justify-between items-start mb-2">
          <label className="text-[1rem] text-gray-500">결제일</label>
          <div className="text-right">
            <p className="text-[1.4rem] font-medium text-black mb-1">09일</p>
            <button
              onClick={onChangePaymentDate}
              className="text-[1.2rem] text-blue-500 font-medium"
            >
              결제일 변경
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetailView;

