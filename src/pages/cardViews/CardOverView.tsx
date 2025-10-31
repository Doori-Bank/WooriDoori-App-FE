import React, { useState } from 'react';
import DefaultDiv from '@/components/default/DefaultDiv';
import BottomNav from '@/components/default/NavBar';
import { img } from '@/assets/img';

const CardRecommendView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('체크카드');

  // 체크카드 데이터 (API 명세서 형식)
  const checkCardData = [
    {
      userCardId: 1000001,
      cardName: "우리카드 7CORE",
      expireDate: "2025-02",
      cardNum: "7541-1232-3332-1234",
      cardUrl: "/file/woori_7core_card",
      cardBenefit: "온라인쇼핑, 대형마트, 배달앱 10% 청구할인",
      isCheckCard: true
    },
    {
      userCardId: 1000002,
      cardName: "우리카드 프리미엄",
      expireDate: "2025-03",
      cardNum: "7541-1232-3332-1235",
      cardUrl: "/file/woori_premium_card",
      cardBenefit: "교통비, 통신비, 주유비 5% 청구할인",
      isCheckCard: true
    },
    {
      userCardId: 1000003,
      cardName: "우리카드 라이프",
      expireDate: "2025-04",
      cardNum: "7541-1232-3332-1236",
      cardUrl: "/file/woori_life_card",
      cardBenefit: "마트, 편의점, 카페 3% 청구할인",
      isCheckCard: true
    },
    {
      userCardId: 1000004,
      cardName: "우리카드 스마트",
      expireDate: "2025-05",
      cardNum: "7541-1232-3332-1237",
      cardUrl: "/file/woori_smart_card",
      cardBenefit: "온라인 결제, 모바일 결제 7% 청구할인",
      isCheckCard: true
    },
    {
        userCardId: 2000005,
        cardName: "우리카드 골드",
        expireDate: "2025-06",
        cardNum: "7541-1232-3332-2234",
        cardUrl: "/file/woori_gold_card",
        cardBenefit: "해외결제, 면세점, 항공권 15% 청구할인",
        isCheckCard: false
      }
  ];

  // 신용카드 데이터 (API 명세서 형식)
  const creditCardData = [
    {
      userCardId: 2000001,
      cardName: "우리카드 골드",
      expireDate: "2025-06",
      cardNum: "7541-1232-3332-2234",
      cardUrl: "/file/woori_gold_card",
      cardBenefit: "해외결제, 면세점, 항공권 15% 청구할인",
      isCheckCard: false
    },
    {
      userCardId: 2000002,
      cardName: "우리카드 플래티넘",
      expireDate: "2025-07",
      cardNum: "7541-1232-3332-2235",
      cardUrl: "/file/woori_platinum_card",
      cardBenefit: "호텔, 레스토랑, 쇼핑 12% 청구할인",
      isCheckCard: false
    },
    {
      userCardId: 2000003,
      cardName: "우리카드 비즈니스",
      expireDate: "2025-08",
      cardNum: "7541-1232-3332-2236",
      cardUrl: "/file/woori_business_card",
      cardBenefit: "사무용품, 연료비, 통신비 8% 청구할인",
      isCheckCard: false
    },
    {
      userCardId: 2000004,
      cardName: "우리카드 프리미엄 플러스",
      expireDate: "2025-09",
      cardNum: "7541-1232-3332-2237",
      cardUrl: "/file/woori_premium_plus_card",
      cardBenefit: "전체 가맹점 2% 청구할인, 연회비 면제",
      isCheckCard: false
    },
    {
        userCardId: 2000005,
        cardName: "우리카드 골드",
        expireDate: "2025-06",
        cardNum: "7541-1232-3332-2234",
        cardUrl: "/file/woori_gold_card",
        cardBenefit: "해외결제, 면세점, 항공권 15% 청구할인",
        isCheckCard: false
      }
  ];

  const filteredCards = (selectedFilter === '체크카드' ? checkCardData : creditCardData).filter(card => 
    card.cardName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DefaultDiv isBottomNav={true}>
      <div className="flex flex-col h-screen">
        {/* 상단 고정 영역 */}
        <div className="flex-shrink-0 pb-6 bg-white">
          {/* 헤더 */}
          <div className="pt-4 pb-6">
            <h1 className="text-[2rem] font-bold text-black text-center">
              카드 살펴보기
            </h1>
          </div>
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
          {filteredCards.map((card) => (
            <div
              key={card.userCardId}
              className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm"
            >
              <div className="flex gap-4 items-start">
                {/* 카드 이미지 */}
                <div className="flex flex-shrink-0 justify-center items-center w-36 h-36">
                  <img
                    src={img.wooriCard}
                    alt={card.cardName}
                    className="object-contain w-48 h-48"
                  />
                </div>

                {/* 카드 정보 */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-[1.4rem] font-bold text-black mb-2">
                    {card.cardName}
                  </h3>
                  <p className="text-[1.1rem] text-gray-600 mb-2 line-clamp-2">
                    {card.cardBenefit}
                  </p>
                  <p className="text-[1rem] text-gray-500 mb-3">
                    만료일: {card.expireDate} | 카드번호: {card.cardNum}
                  </p>
                  
                  {/* 카드 타입 태그 */}
                  <div className="flex gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full text-[0.9rem] font-medium bg-green-100 text-green-600">
                      {card.isCheckCard ? '#체크카드' : '#신용카드'}
                    </span>
                    <span className="px-3 py-1 rounded-full text-[0.9rem] font-medium bg-blue-100 text-blue-600">
                      #{card.cardUrl.split('/').pop()}
                    </span>
                  </div>

                  {/* 상세보기 버튼 */}
                  <div className="flex justify-end">
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
          ))}
        </div>
      </div>
    </DefaultDiv>
  );
};

export default CardRecommendView;
