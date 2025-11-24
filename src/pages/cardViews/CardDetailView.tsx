import React, { useEffect, useState } from 'react';
import DefaultDiv from '@/components/default/DefaultDiv';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { img } from '@/assets/img';
import DefaultButton from '@/components/button/DefaultButton';
import { apiList } from '@/api/apiList';
import { getCategoryMeta } from '@/utils/categoryMeta';

interface CardItem {
  id: number;
  cardName: string;
  cardUrl: string; // 카드 신청 링크
  cardImageUrl?: string; // 카드 이미지 URL (tbl_file의 file_path)
  cardImageFileId?: number; // 카드 이미지 파일 ID
  cardBenef: string;
  cardType: 'CREDIT' | 'CHECK';
  cardSvc: string;
  annualFee1: string;
  annualFee2: string;
}

const CardDetailView: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const cardData = location.state?.card as CardItem | undefined;
  const [card, setCard] = useState<CardItem | null>(cardData || null);
  const [isLoading, setIsLoading] = useState(!cardData);

  useEffect(() => {
    // state로 전달받은 카드 데이터가 없으면 목록에서 다시 조회
    if (!cardData && id) {
      const fetchCardDetail = async () => {
        setIsLoading(true);
        try {
          const result = await apiList.card.getCardList();
          if (result?.success && result.data) {
            // URL에서 카드 ID를 가져와서 해당 카드 찾기
            const cardId = parseInt(id);
            const foundCard = result.data.find((c: CardItem) => c.id === cardId);
            if (foundCard) {
              setCard(foundCard);
            }
          }
        } catch (error) {
          console.error('카드 상세 정보 조회 실패:', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchCardDetail();
    }
  }, [cardData, id]);

  const handleApply = async () => {
    try {
      // 카드 목록 조회
      const result = await apiList.card.getCardList();
      
      if (result?.success && result.data && card) {
        // 현재 카드 ID로 해당 카드 찾기
        const foundCard = result.data.find((c: CardItem) => c.id === card.id);
        
        if (foundCard && foundCard.cardUrl) {
          // cardUrl이 있으면 새 창에서 열기
          window.open(foundCard.cardUrl, '_blank');
        } else {
          alert('카드 신청 링크를 찾을 수 없습니다.');
        }
      } else {
        alert('카드 정보를 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('카드 신청 링크 조회 실패:', error);
      alert('카드 신청 링크를 불러오는데 실패했습니다.');
    }
  };

  // 혜택 텍스트를 파싱하여 카테고리와 내용 분리
  const parseBenefit = (benefitText: string) => {
    const trimmed = benefitText.trim();
    
    // 카테고리 키워드 매핑
    const categoryKeywords: Record<string, string> = {
      '온라인쇼핑': 'SHOPPING',
      '쇼핑': 'SHOPPING',
      '카페': 'CAFE',
      '커피': 'CAFE',
      '편의점': 'CONVENIENCE_STORE',
      '마트': 'CONVENIENCE_STORE',
      '음식점': 'FOOD',
      '푸드': 'FOOD',
      '식비': 'FOOD',
      '교통': 'TRANSPORTATION',
      '주유': 'TRANSPORTATION',
      '자동차': 'TRANSPORTATION',
      '교육': 'EDUCATION',
      '학원': 'EDUCATION',
      '병원': 'HOSPITAL',
      '약국': 'HOSPITAL',
      '공과금': 'HOUSING',
      '주거': 'HOUSING',
      '관리비': 'HOUSING',
      '통신': 'TELECOM',
      '기타': 'ETC',
      '스포츠': 'ETC',
    };

    // 카테고리 찾기
    let matchedCategory = 'ETC';
    for (const [keyword, category] of Object.entries(categoryKeywords)) {
      if (trimmed.includes(keyword)) {
        matchedCategory = category;
        break;
      }
    }

    const categoryMeta = getCategoryMeta(matchedCategory);
    
    // 혜택 내용 추출 (카테고리명 제거)
    let benefitContent = trimmed;
    for (const keyword of Object.keys(categoryKeywords)) {
      if (trimmed.startsWith(keyword)) {
        benefitContent = trimmed.replace(keyword, '').trim();
        break;
      }
    }

    // 메인 텍스트와 서브 텍스트 분리
    const parts = benefitContent.split(' ');
    const mainText = parts[0] || benefitContent;
    const subText = parts.slice(1).join(' ');

    return {
      category: matchedCategory,
      icon: categoryMeta.icon,
      color: categoryMeta.color,
      mainText: mainText || trimmed,
      subText: subText || '',
      fullText: trimmed,
    };
  };

  if (isLoading) {
    return (
      <DefaultDiv
        isHeader={true}
        title="카드 상세"
        isShowBack={true}
        isShowClose={false}
        style={{ backgroundColor: '#FBFBFB' }}
        onBack={() => navigate(-1)}
      >
        <div className="flex justify-center items-center py-20">
          <p className="text-[1.2rem] text-gray-500">카드 정보를 불러오는 중...</p>
        </div>
      </DefaultDiv>
    );
  }

  if (!card) {
    return (
      <DefaultDiv
        isHeader={true}
        title="카드 상세"
        isShowBack={true}
        isShowClose={false}
        style={{ backgroundColor: '#FBFBFB' }}
        onBack={() => navigate(-1)}
      >
        <div className="flex justify-center items-center py-20">
          <p className="text-[1.2rem] text-gray-500">카드 정보를 찾을 수 없습니다.</p>
        </div>
      </DefaultDiv>
    );
  }

  return (
    <DefaultDiv
      isHeader={true}
      title="카드 상세"
      isShowBack={true}
      isShowClose={false}
      style={{ backgroundColor: '#FBFBFB' }}
      onBack={() => navigate(-1)}
    >
      <div className="flex flex-col pb-24">
        {/* 카드 이미지 */}
        <div className="flex justify-center items-center py-7 mb-6">
          <img
            src={card.cardImageUrl || card.cardUrl || img.wooriCard}
            alt={card.cardName}
            className="object-contain w-full max-w-[250px] h-auto drop-shadow-xl"
            onError={(e) => {
              (e.target as HTMLImageElement).src = img.wooriCard;
            }}
          />
        </div>

        {/* 카드 기본 정보 및 안내사항 */}
        <div className="p-6 mb-4 bg-white rounded-2xl border border-gray-100">
          <h1 className="text-[1.8rem] font-bold text-gray-900 mb-4 leading-tight">{card.cardName}</h1>
          
          {/* 카드 타입 태그 */}
          <div className="flex gap-2 mb-5">
            <span className="px-3 py-1.5 rounded-lg text-[0.95rem] font-medium bg-green-50 text-green-700 border border-green-100">
              {card.cardType === 'CHECK' ? '체크카드' : '신용카드'}
            </span>
            {card.cardSvc === 'YES' && (
              <span className="px-3 py-1.5 rounded-lg text-[0.95rem] font-medium bg-blue-50 text-blue-700 border border-blue-100">
                해외겸용
              </span>
            )}
          </div>

          {/* 안내사항 */}
          <div className="pt-5 border-t border-gray-100">
            <h2 className="text-[1.3rem] font-bold text-gray-900 mb-4">안내사항</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-[1.05rem] font-medium text-gray-700">연회비</span>
                <span className="text-[1.05rem] text-gray-600 text-right flex-1 ml-4">
                  {card.annualFee1} {card.annualFee2 && `| ${card.annualFee2}`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 카드 혜택 상세 */}
        <div className="p-6 mb-6 bg-white rounded-2xl border border-gray-100">
          <h2 className="text-[1.4rem] font-bold text-gray-900 mb-5 flex items-center gap-2.5">
            <span className="w-1 h-5 bg-[#8BC34A] rounded-full"></span>
            <span>주요 혜택</span>
          </h2>
          <div className="space-y-0">
            {card.cardBenef.split('|').map((benefit, index) => {
              const benefitInfo = parseBenefit(benefit);
              return (
                <div
                  key={index}
                  className={`flex gap-4 items-center py-4 ${index !== card.cardBenef.split('|').length - 1 ? 'border-b border-gray-100' : ''}`}
                >
                  {/* 아이콘 */}
                  <div
                    className="flex flex-shrink-0 justify-center items-center w-12 h-12 rounded-xl"
                    style={{ backgroundColor: benefitInfo.color }}
                  >
                    <img
                      src={benefitInfo.icon}
                      alt={benefitInfo.category}
                      className="object-contain w-7 h-7"
                    />
                  </div>

                  {/* 텍스트 정보 */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[1.15rem] font-semibold text-gray-900 mb-1">
                      {benefitInfo.fullText}
                    </p>
                    {benefitInfo.subText && (
                      <p className="text-[1rem] text-gray-500 leading-relaxed">
                        {benefitInfo.subText}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 신청하기 버튼 */}
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[400px] bg-white border-t border-gray-200 p-4 flex justify-center">
          <DefaultButton
            text="신청하기"
            onClick={handleApply}
          />
        </div>
      </div>
    </DefaultDiv>
  );
};

export default CardDetailView;

