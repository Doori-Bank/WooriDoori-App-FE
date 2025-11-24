import { useState, useEffect } from 'react';
import '@/styles/report/animations.css'
import Card from "@/components/card/Card";
import ReportLayout from "@/components/report/ReportLayout";
import { useNavigate, useLocation } from "react-router-dom";
import { img } from "@/assets/img";
import CardRankItem from '@/components/card/CardRankItem';
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

const CardRecomView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const name = "석기";
  
  // 리포트에서 전달받은 월 정보 (예: 10)
  const reportMonth = location.state?.month as number | undefined;

  const [cards, setCards] = useState<CardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 카드 추천 API 호출
  useEffect(() => {
    const fetchCardRecommend = async () => {
      setIsLoading(true);
      try {
        const result = await apiList.cardRecommend();
        if (result?.success && result.data) {
          setCards(result.data.cards || []);
        } else {
          console.error('카드 추천 조회 실패:', result?.resultMsg);
        }
      } catch (error) {
        console.error('카드 추천 조회 중 오류 발생:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCardRecommend();
  }, []);

  const onClick = () => {
    // 리포트의 월 정보를 "YYYY.MM" 형식으로 변환
    if (reportMonth) {
      const currentYear = new Date().getFullYear();
      const monthString = reportMonth.toString().padStart(2, '0');
      const monthKey = `${currentYear}.${monthString}`;
      
      navigate("/achievement/detail", {
        state: {
          data: { month: monthKey },
          from: "report"
        }
      });
    } else {
      // 월 정보가 없으면 기본값으로 이동
      navigate("/achievement/detail", {
        state: {
          data: { month: undefined },
          from: "report"
        }
      });
    }
  };

  return (
    <ReportLayout mainText={`${name}님 소비에 딱 맞는 카드`} showClose={false}  onBack={()=>window.history.back()} buttonText={"확인"} 
      onButtonClick={ onClick}>
      <div className='w-full'>
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-[1.2rem] text-gray-500">카드 추천을 불러오는 중...</p>
          </div>
        ) : cards.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-[0.8rem] text-gray-500">추천할 카드가 없습니다.</p>
          </div>
        ) : (
          <>
            {/* 설명 텍스트 */}
            <div className="mb-9 text-center">
              <p className="text-[1.3rem] text-gray-700">
                소비패턴에 맞는 카드 <span className="text-[#8BC34A] font-bold">{cards.length}개</span>를 가져와봤어요
              </p>
            </div>

            {/* 1위 카드 */}
            {cards.length > 0 && (
              <div className="pb-8 mb-8 w-full border-b border-gray-200">
                <div className="relative p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border-2 border-[#8BC34A] shadow-lg">
                  {/* 1위 배지 */}
                  <div className="absolute -top-3 right-4 px-3 py-1 bg-[#8BC34A] rounded-full shadow-md">
                    <span className="text-white text-[1rem] font-bold">1위</span>
                  </div>
                  <Card 
                    rank={1} 
                    buttonOnClick={() => { }} 
                    buttonText="" 
                    cardImageSrc={cards[0].cardImageUrl || cards[0].cardUrl || img.testCard} 
                    subtitle={cards[0].cardBenef} 
                    title={cards[0].cardName} 
                  />
                </div>
              </div>
            )}

            {/* 2위 이후 카드 */}
            <div className="pb-6 space-y-4">
              {cards.slice(1).map((card, index) => (
                <CardRankItem 
                  key={card.id}
                  imageSrc={card.cardImageUrl || card.cardUrl || img.testCard} 
                  rank={index + 2} 
                  subtitle='' 
                  title={card.cardName} 
                  description={card.cardBenef} 
                />
              ))}
            </div>
          </>
        )}
      </div>
    </ReportLayout>
  )
}

export default CardRecomView;