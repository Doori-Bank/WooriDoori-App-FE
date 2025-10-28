import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DefaultButton from '@/components/button/DefaultButton';
import DefaultDiv from '@/components/default/DefaultDiv';
import { img } from '@/assets/img';
import { addCard } from '@/utils/cardData';

interface CardData {
  cardNumber: string[];
  expiryDate: string;
  birthDate: string;
  nickname: string;
}

const CardAddComplete: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cardData = location.state as CardData;

  const handleComplete = () => {
    if (cardData) {
      // 카드 추가 완료 페이지에서 직접 카드를 추가
      addCard({
        title: cardData.nickname || '새 카드',
        cardName: '[우리] 우리체크카드',
        cardNum: cardData.cardNumber.join('').slice(-4),
        cardImage: img.cardExample,
        benefits: '가맹점 0.1% 할인, 온라인 0.1% 할인, 교통비 0.1% 할인',
        isEdit: false
      });
    }
    
    navigate('/card');
  };


  return (
    <DefaultDiv>
      {/* 로고 - 우측 상단 */}
      <div className="absolute top-4 right-4 z-10">
        <img
          src={img.wooriDooriLogo}
          alt="우리두리 로고"
          className="w-28 h-auto"
        />
      </div>

      <div className="flex flex-col h-full">
        {/* 메인 컨텐츠 */}
        <div className="flex flex-col flex-1 justify-center items-center px-8">
          {/* 제목 */}
          <div className="mb-8 text-center">
            <h2 className="text-[1.9rem] font-semibold text-gray-900 mb-2">
              카드 등록 완료
            </h2>
            <p className="text-gray-500 text-[1.05rem]">
              새로운 카드가 성공적으로 등록되었습니다.
            </p>
          </div>

          {/* 등록된 카드 */}
          <div className="flex justify-center mb-8">
            {cardData ? (
              <img
                src={img.cardExample}
                alt="등록된 카드"
                className="object-cover w-80 h-48 rounded-2xl shadow-lg transition-transform duration-300 transform hover:scale-105"
              />
            ) : (
              <div className="flex justify-center items-center w-80 h-48 bg-gray-100 rounded-2xl">
                <span className="text-gray-400">카드 정보 없음</span>
              </div>
            )}
          </div>

          {/* 카드 정보 */}
          <div className="text-center">
            <h3 className="text-[1.3rem] font-bold text-gray-900 mb-2">
              우리 기후동행카드(체크)
            </h3>
            <p className="text-sm text-gray-500">
              카드이미지는 멤버십 등급에 따라 실제 카드와 다를 수 있습니다.
            </p>
          </div>
        </div>

        {/* 완료 버튼 - 하단 고정 */}
        <div className="px-8 pb-8">
          <DefaultButton
            text="완료"
            onClick={handleComplete}
            className="py-4 w-full text-lg font-semibold"
          />
        </div>
      </div>
    </DefaultDiv>
  );
};

export default CardAddComplete;
