import React, { useState } from 'react';
import DefaultDiv from '@/components/default/DefaultDiv';
import BottomNav from '@/components/default/NavBar';
import { img } from '@/assets/img';

const CardRecommendView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('체크카드');

  // 카드 데이터
  const cardData = [
    {
      id: 1,
      name: '우리두리 카드',
      image: img.doori_card,
      benefits: '가맹점 0.1% 할인, 가맹점 0.1% 할인, 가맹점 0.1% 할인...',
      fees: '국내 22,000원 해외겸용(MasterCard) 22,000원',
      tags: ['#식비', '#교통'],
      type: '체크카드'
    },
    {
      id: 2,
      name: '우리두리 카드',
      image: img.doori_card,
      benefits: '가맹점 0.1% 할인, 가맹점 0.1% 할인, 가맹점 0.1% 할인...',
      fees: '국내 22,000원 해외겸용(MasterCard) 22,000원',
      tags: ['#식비', '#교통'],
      type: '체크카드'
    },
    {
      id: 3,
      name: '우리두리 카드',
      image: img.doori_card,
      benefits: '가맹점 0.1% 할인, 가맹점 0.1% 할인, 가맹점 0.1% 할인...',
      fees: '국내 22,000원 해외겸용(MasterCard) 22,000원',
      tags: ['#식비', '#교통'],
      type: '체크카드'
    },
    {
      id: 4,
      name: '우리두리 카드',
      image: img.doori_card,
      benefits: '가맹점 0.1% 할인, 가맹점 0.1% 할인, 가맹점 0.1% 할인...',
      fees: '국내 22,000원 해외겸용(MasterCard) 22,000원',
      tags: ['#식비', '#교통'],
      type: '체크카드'
    },
    {
      id: 5,
      name: '우리두리 카드',
      image: img.doori_card,
      benefits: '가맹점 0.1% 할인, 가맹점 0.1% 할인, 가맹점 0.1% 할인...',
      fees: '국내 22,000원 해외겸용(MasterCard) 22,000원',
      tags: ['#식비', '#교통'],
      type: '체크카드'
    },
    {
      id: 6,
      name: '우리두리 카드',
      image: img.doori_card,
      benefits: '가맹점 0.1% 할인, 가맹점 0.1% 할인, 가맹점 0.1% 할인...',
      fees: '국내 22,000원 해외겸용(MasterCard) 22,000원',
      tags: ['#식비', '#교통'],
      type: '체크카드'
    },
    {
      id: 7,
      name: '우리두리 카드',
      image: img.doori_card,
      benefits: '가맹점 0.1% 할인, 가맹점 0.1% 할인, 가맹점 0.1% 할인...',
      fees: '국내 22,000원 해외겸용(MasterCard) 22,000원',
      tags: ['#식비', '#교통'],
      type: '체크카드'
    },
    {
      id: 8,
      name: '우리두리 카드',
      image: img.doori_card,
      benefits: '가맹점 0.1% 할인, 가맹점 0.1% 할인, 가맹점 0.1% 할인...',
      fees: '국내 22,000원 해외겸용(MasterCard) 22,000원',
      tags: ['#식비', '#교통'],
      type: '체크카드'
    }
  ];

  const filteredCards = cardData.filter(card => 
    card.type === selectedFilter && 
    card.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DefaultDiv>
      {/* 헤더 */}
      <div className="pt-4 pb-6">
        <h1 className="text-[2rem] font-bold text-black text-center">
          카드 추천
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
            className="w-full px-4 py-3 bg-gray-100 rounded-lg text-[1.2rem] focus:outline-none focus:bg-white transition-colors"
          />
          <img
            src={img.searchIcon}
            alt="검색"
            className="absolute right-4 top-1/2 w-6 h-6 transform -translate-y-1/2"
          />
        </div>
      </div>

      {/* 필터 버튼 */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setSelectedFilter('신용카드')}
          className={`px-6 py-3 rounded-lg text-[1.2rem] font-medium transition-colors ${
            selectedFilter === '신용카드'
              ? 'bg-green-500 text-white border-2 border-green-500'
              : 'bg-white text-black border-2 border-gray-300'
          }`}
        >
          신용카드
        </button>
        <button
          onClick={() => setSelectedFilter('체크카드')}
          className={`px-6 py-3 rounded-lg text-[1.2rem] font-medium transition-colors ${
            selectedFilter === '체크카드'
              ? 'bg-green-500 text-white border-2 border-green-500'
              : 'bg-white text-black border-2 border-gray-300'
          }`}
        >
          체크카드
        </button>
      </div>

      {/* 카드 목록 */}
      <div className="pb-20 space-y-4">
        {filteredCards.map((card) => (
          <div
            key={card.id}
            className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm"
          >
            <div className="flex gap-4 items-start">
              {/* 카드 이미지 */}
              <div className="flex flex-shrink-0 justify-center items-center w-20 h-12 bg-gray-100 rounded-lg">
                <img
                  src={card.image}
                  alt={card.name}
                  className="object-contain w-16 h-10"
                />
              </div>

              {/* 카드 정보 */}
              <div className="flex-1 min-w-0">
                <h3 className="text-[1.4rem] font-bold text-black mb-2">
                  {card.name}
                </h3>
                <p className="text-[1.1rem] text-gray-600 mb-2 line-clamp-2">
                  {card.benefits}
                </p>
                <p className="text-[1rem] text-gray-500 mb-3">
                  {card.fees}
                </p>
                
                {/* 태그 */}
                <div className="flex gap-2 mb-3">
                  {card.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-[0.9rem] font-medium ${
                        tag === '#식비'
                          ? 'bg-pink-100 text-pink-600'
                          : 'bg-blue-100 text-blue-600'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
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

      {/* 네비게이션 바 */}
      <div className="mt-auto">
        <BottomNav />
      </div>
    </DefaultDiv>
  );
};

export default CardRecommendView;
