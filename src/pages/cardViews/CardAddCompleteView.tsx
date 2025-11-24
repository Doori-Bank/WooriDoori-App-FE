import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DefaultButton from '@/components/button/DefaultButton';
import BottomButtonWrapper from "@/components/button/BottomButtonWrapper";
import DefaultDiv from '@/components/default/DefaultDiv';
import { img } from '@/assets/img';
import { apiList } from '@/api/apiList';
import { useApi } from '@/hooks/useApi';
import { useCardStore } from '@/stores/useCardStore';
import { OneBtnModal } from '@/components/modal/OneBtnModal';

interface CardData {
  cardNumber: string[];
  expiryDate: string;
  cvc: string;
  password: string;
  birthDate: string;
  nickname: string;
  apiResponse?: any; // AddCardView에서 전달받은 API 응답 데이터
}

const CardAddComplete: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cardData = location.state as CardData;
  const putCardApi = useApi(apiList.card.putCard);
  const { loadCards } = useCardStore();
  const [isLoading, setIsLoading] = useState(false);
  const [registeredCard, setRegisteredCard] = useState<{
    cardName: string;
    cardImage: string;
    cardAlias?: string;
  } | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [hasCalledApi, setHasCalledApi] = useState(false);
  const [apiError, setApiError] = useState<{ message: string; errorName?: string } | null>(null);

  // 페이지 로드 시 API 응답 데이터가 있으면 바로 표시 (AddCardView에서 이미 API 호출 완료)
  useEffect(() => {
    if (cardData?.apiResponse && !registeredCard) {
      // AddCardView에서 이미 API 호출 완료된 경우
      const card = cardData.apiResponse;
      
      // 등록된 카드 정보를 state에 저장 (화면 표시용)
      setRegisteredCard({
        cardName: card.cardName || '[우리] 우리체크카드',
        cardImage: card.cardImageUrl || card.cardUrl || img.cardExample,
        cardAlias: card.cardAlias,
      });
      
      // 카드 번호 포맷팅 (4자리씩 하이픈으로 구분)
      const cardNumFormatted = card.cardNum 
        ? card.cardNum.replace(/[-\s]/g, '').match(/.{1,4}/g)?.join('-') || card.cardNum
        : cardData.cardNumber.join('-');
      
      // 카드 데이터를 CardData 형식으로 변환
      const newCard = {
        id: card.userCardId?.toString() || Date.now().toString(),
        title: card.cardAlias || card.cardName || cardData.nickname || '새 카드',
        cardName: card.cardName || '[우리] 우리체크카드',
        cardNum: cardNumFormatted,
        cardImage: card.cardImageUrl || card.cardUrl || img.cardExample,
        benefits: card.cardBenefit || '가맹점 0.1% 할인, 온라인 0.1% 할인, 교통비 0.1% 할인',
        isEdit: false
      };

      // 기존 카드 목록 가져오기
      const storedCards = localStorage.getItem('userCards');
      const existingCards = storedCards ? JSON.parse(storedCards) : [];
      
      // 중복 체크 (userCardId로 확인)
      const isDuplicate = existingCards.some((c: any) => c.id === newCard.id);
      
      if (!isDuplicate) {
        // 새 카드를 맨 앞에 추가
        existingCards.unshift(newCard);
        localStorage.setItem('userCards', JSON.stringify(existingCards));
        
        // 카드 스토어 새로고침
        loadCards();
      }
    } else if (cardData && !cardData.apiResponse && !hasCalledApi && !registeredCard && !isLoading && !putCardApi.loading) {
      // API 응답이 없는 경우에만 API 호출 (레거시 지원)
      setHasCalledApi(true);
      handleComplete();
    }
  }, [cardData]); // cardData가 있을 때 한 번만 실행

  // 유효기간 검증 함수 (MMYY 형식)
  const isExpired = (expiryMmYy: string): boolean => {
    if (!expiryMmYy || expiryMmYy.length !== 4) return false;
    
    const month = parseInt(expiryMmYy.slice(0, 2));
    const year = parseInt('20' + expiryMmYy.slice(2, 4)); // YY를 20YY로 변환
    
    // 해당 월의 마지막 날 다음 날 (다음 달 첫 날)과 비교
    // 예: "1129" (2029년 11월) -> 2029년 12월 1일과 비교
    const expiryEndDate = new Date(year, month, 1); // 다음 달 첫 날
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // 유효기간이 지났는지 확인 (다음 달 첫 날 이전이면 만료)
    return expiryEndDate <= today;
  };

  const handleComplete = async () => {
    if (!cardData) {
      console.error('카드 데이터가 없습니다.');
      navigate('/card');
      return;
    }

    // 유효기간 검증
    if (isExpired(cardData.expiryDate)) {
      setApiError({
        message: '유효기간이 만료된 카드입니다.',
        errorName: 'EXPIRED_CARD'
      });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      // 카드 번호를 하나의 문자열로 합치기
      const cardNum = cardData.cardNumber.join('');
      
      // 주민등록번호 앞 6자리와 뒷자리 첫 번째 분리
      const cardUserRegistNum = cardData.birthDate.slice(0, 6);
      const cardUserRegistBack = cardData.birthDate.length > 6 ? cardData.birthDate[6] : '1';

      // 별명이 없으면 undefined로 전달 (API가 기존 cardAlias를 사용하도록)
      const requestData = {
        cardNum: cardNum,
        cardPw: cardData.password,
        expiryMmYy: cardData.expiryDate,
        cardUserRegistNum: cardUserRegistNum,
        cardUserRegistBack: cardUserRegistBack,
        cardCvc: cardData.cvc,
        cardAlias: cardData.nickname && cardData.nickname.trim() ? cardData.nickname.trim() : undefined,
      };

      console.log('📤 putCard API 호출 시작:', {
        cardNum: cardNum.replace(/\d(?=\d{4})/g, '*'), // 마스킹
        cardPw: '**',
        expiryMmYy: cardData.expiryDate,
        cardUserRegistNum: cardUserRegistNum,
        cardUserRegistBack: cardUserRegistBack,
        cardCvc: '***',
        cardAlias: cardData.nickname,
      });

      // putCard API 호출
      const result = await putCardApi.call(requestData);

      console.log('📥 putCard API 응답:', result);

      if (result?.success && result.data) {
        // API 응답은 단일 카드 객체
        const card = result.data;
        
        // 등록된 카드 정보를 state에 저장 (화면 표시용)
        setRegisteredCard({
          cardName: card.cardName || '[우리] 우리체크카드',
          cardImage: card.cardImageUrl || card.cardUrl || img.cardExample,
          cardAlias: card.cardAlias,
        });
        
        // 카드 번호 포맷팅 (4자리씩 하이픈으로 구분)
        const cardNumFormatted = card.cardNum 
          ? card.cardNum.replace(/[-\s]/g, '').match(/.{1,4}/g)?.join('-') || card.cardNum
          : cardData.cardNumber.join('-');
        
        // 카드 데이터를 CardData 형식으로 변환
        // 별명이 없으면 API 응답의 cardAlias 사용
        const newCard = {
          id: card.userCardId?.toString() || Date.now().toString(),
          title: card.cardAlias || card.cardName || cardData.nickname || '새 카드',
          cardName: card.cardName || '[우리] 우리체크카드',
          cardNum: cardNumFormatted,
          cardImage: card.cardImageUrl || card.cardUrl || img.cardExample,
          benefits: card.cardBenefit || '가맹점 0.1% 할인, 온라인 0.1% 할인, 교통비 0.1% 할인',
          isEdit: false
        };

        // 기존 카드 목록 가져오기
        const storedCards = localStorage.getItem('userCards');
        const existingCards = storedCards ? JSON.parse(storedCards) : [];
        
        // 중복 체크 (userCardId로 확인)
        const isDuplicate = existingCards.some((c: any) => c.id === newCard.id);
        
        if (!isDuplicate) {
          // 새 카드를 맨 앞에 추가
          existingCards.unshift(newCard);
          localStorage.setItem('userCards', JSON.stringify(existingCards));
          
          // 카드 스토어 새로고침
          loadCards();
        }
        
        // registeredCard 설정만 하고 자동 이동하지 않음 (확인 버튼 클릭 시 이동)
      } else {
        // API 호출 실패 시 에러 저장 (확인 버튼 클릭 시 표시)
        const errorMsg = result?.resultMsg || '';
        const errorName = result?.errorName || '';
        const resultCode = result?.resultCode;
        
        console.error('❌ 카드 검증 실패:', {
          success: result?.success,
          resultMsg: errorMsg,
          resultCode: resultCode,
          errorName: errorName,
          fullResult: result,
        });
        
        // 에러 정보 저장 (확인 버튼 클릭 시 모달 표시)
        // CARD_ISNULL 에러는 "해당 카드는 존재하지 않습니다" 메시지 사용
        let displayMessage = errorMsg;
        if (errorName === 'CARD_ISNULL' || resultCode === 404) {
          displayMessage = '해당 카드는 존재하지 않습니다. 카드 정보를 확인해주세요.';
        }
        
        setApiError({
          message: displayMessage || '카드 등록에 실패했습니다.',
          errorName: errorName
        });
      }
    } catch (error: any) {
      console.error('❌ 카드 등록 중 오류 발생:', {
        error,
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
      });
      
      // 에러 정보 저장 (확인 버튼 클릭 시 모달 표시)
      setApiError({
        message: error?.response?.data?.errorResultMsg || error?.message || '카드 등록 중 오류가 발생했습니다.',
        errorName: error?.response?.data?.errorName
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <DefaultDiv>
      {/* 로고 - 우측 상단 */}
      <div className="absolute top-4 right-4 z-10">
        <img
          src={img.wooridoori_logo}
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
            {registeredCard ? (
              <img
                src={registeredCard.cardImage}
                alt="등록된 카드"
                className="object-cover w-80 h-48 rounded-2xl shadow-lg transition-transform duration-300 transform hover:scale-105"
                onError={(e) => {
                  // 이미지 로드 실패 시 기본 이미지 사용
                  (e.target as HTMLImageElement).src = img.cardExample;
                }}
              />
            ) : cardData ? (
              <img
                src={img.cardExample}
                alt="등록 중인 카드"
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
              {registeredCard?.cardName || cardData?.nickname || '우리 기후동행카드(체크)'}
            </h3>
            {registeredCard?.cardAlias && (
              <p className="text-[1.1rem] text-gray-600 mb-2">
                {registeredCard.cardAlias}
              </p>
            )}
            <p className="text-sm text-gray-500">
              카드이미지는 멤버십 등급에 따라 실제 카드와 다를 수 있습니다.
            </p>
          </div>
        </div>

        {/* 확인 버튼 - 하단 고정 */}
        <BottomButtonWrapper>
            <DefaultButton  
              text={isLoading || putCardApi.loading ? "처리 중..." : "확인"}
              onClick={() => {
                // 에러가 있는 경우 에러 모달 표시
                if (apiError) {
                  setErrorMessage(apiError.message);
                  setShowErrorModal(true);
                } else if (registeredCard) {
                  // 성공한 경우 카드 관리 페이지로 이동
                  navigate('/card');
                }
              }}
              disabled={isLoading || putCardApi.loading || (!registeredCard && !apiError)}
            />
          </BottomButtonWrapper>
      </div>

      {/* 에러 모달 */}
      <OneBtnModal
        isOpen={showErrorModal}
        message={errorMessage || '카드 등록에 실패했습니다.'}
        confirmTitle="확인"
        confirmColor="#EF4444"
        onConfirm={() => {
          setShowErrorModal(false);
          setApiError(null);
          navigate('/card/cards');
        }}
      />
    </DefaultDiv>
  );
};

export default CardAddComplete;
