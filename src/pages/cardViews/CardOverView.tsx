import React, { useState, useEffect } from 'react';
import DefaultDiv from '@/components/default/DefaultDiv';
import { useNavigate } from 'react-router-dom';
import { img } from '@/assets/img';
import { apiList } from '@/api/apiList';

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

const CardRecommendView: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'체크카드' | '신용카드'>('체크카드');
  const [cards, setCards] = useState<CardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 카드 목록 API 호출
  useEffect(() => {
    const fetchCardList = async () => {
      setIsLoading(true);
      try {
        const result = await apiList.card.getCardList();
        if (result?.success && result.data) {
          setCards(result.data || []);
        } else {
          console.error('카드 목록 조회 실패:', result?.resultMsg);
        }
      } catch (error) {
        console.error('카드 목록 조회 중 오류 발생:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCardList();
  }, []);

  // 필터링된 카드 목록
  const filteredCards = cards.filter(card => {
    const matchesType = selectedFilter === '체크카드' 
      ? card.cardType === 'CHECK' 
      : card.cardType === 'CREDIT';
    const matchesSearch = card.cardName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <DefaultDiv
      isHeader={true}
      title="카드 살펴보기"
      isShowBack={true}
      isShowClose={false}
      isShowSetting={false}
      style={{ backgroundColor: '#FBFBFB' }}
      onBack={() => navigate(-1)}
      isMainTitle={false}
    >
      <div className="flex flex-col h-screen">
        {/* 상단 고정 영역 */}
        <div className="flex-shrink-0 pb-6">
          {/* 검색바 */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="검색 할 내용을 입력해주세요"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 rounded-lg text-[1.2rem] focus:outline-none focus:bg-white transition-colors border border-gray-300 focus:border-blue-500"
              />
              <img
                src={img.searchIcon}
                alt="검색"
                className="absolute right-4 top-1/2 w-6 h-6 transform -translate-y-1/2"
              />
            </div>
          </div>

          {/* 필터 버튼 */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setSelectedFilter('신용카드')}
              className={`px-6 py-2 rounded-full text-[1.2rem] font-medium transition-colors ${
                selectedFilter === '신용카드'
                  ? 'bg-green-100 text-green-600 border border-green-300'
                  : 'bg-white text-gray-500 border border-gray-300'
              }`}
            >
              신용카드
            </button>
            <button
              onClick={() => setSelectedFilter('체크카드')}
              className={`px-6 py-2 rounded-full text-[1.2rem] font-medium transition-colors ${
                selectedFilter === '체크카드'
                  ? 'bg-green-100 text-green-600 border border-green-300'
                  : 'bg-white text-gray-500 border border-gray-300'
              }`}
            >
              체크카드
            </button>
          </div>
        </div>

        {/* 스크롤 가능한 카드 목록 */}
        <div className="overflow-y-auto flex-1 pb-80 space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <p className="text-[1.2rem] text-gray-500">카드 목록을 불러오는 중...</p>
            </div>
          ) : filteredCards.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <p className="text-[1.2rem] text-gray-500">
                {searchQuery ? '검색 결과가 없습니다.' : '등록된 카드가 없습니다.'}
              </p>
            </div>
          ) : (
            filteredCards.map((card) => (
              <div
                key={card.id}
                onClick={() => navigate(`/card/detail/${card.id}`, { state: { card } })}
                className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm transition-shadow cursor-pointer hover:shadow-md"
              >
                <div className="flex gap-4 items-start">
                  {/* 카드 이미지 */}
                  <div className="flex flex-shrink-0 justify-center items-center w-36 h-36">
                    <img
                      src={card.cardImageUrl || card.cardUrl || img.wooriCard}
                      alt={card.cardName}
                      className="object-contain w-48 h-48"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = img.wooriCard;
                      }}
                    />
                  </div>

                  {/* 카드 정보 */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[1.4rem] font-bold text-black mb-2">
                      {card.cardName}
                    </h3>
                    <p className="text-[1.1rem] text-gray-600 mb-2 line-clamp-2">
                      {card.cardBenef}
                    </p>
                    <p className="text-[1rem] text-gray-500 mb-3">
                      연회비: {card.annualFee1} {card.annualFee2 && `| ${card.annualFee2}`}
                    </p>
                    
                    {/* 카드 타입 태그 */}
                    <div className="flex gap-2 mb-2" style={{ backgroundColor: '#FBFBFB' }}>
                      <span className="px-3 py-1 rounded-full text-[0.9rem] font-medium bg-green-100 text-green-600">
                        {card.cardType === 'CHECK' ? '#체크카드' : '#신용카드'}
                      </span>
                      {card.cardSvc === 'YES' && (
                        <span className="px-3 py-1 rounded-full text-[0.9rem] font-medium bg-blue-100 text-blue-600">
                          #해외겸용
                        </span>
                      )}
                    </div>

                    {/* 상세보기 버튼 */}
                    <div className="flex justify-end -mt-9">
                      <button className="flex items-center gap-1 text-[1.1rem] text-gray-600 hover:text-gray-800 transition-colors">
                        상세보기
                        <img
                          src={img.grayCheckRightIcon}
                          alt="화살표"
                          className="w-4 h-4"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DefaultDiv>
  );
};

export default CardRecommendView;
