import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultButton from '@/components/button/DefaultButton';
import SecureKeypad from '@/components/input/SecureKeypad';
import InputBox from '@/components/input/InputBox';
import SubText from '@/components/text/SubText';
import { validateCard, CardValidationErrors } from '@/utils/card/cardValidation';
import DefaultDiv from '@/components/default/DefaultDiv';
import { CardNumInput } from '@/components/input/CardNumInput';
import { CardBirthNumInput } from '@/components/input/CardBirthNumInput';
import BottomButtonWrapper from '@/components/button/BottomButtonWrapper';
import { apiList } from '@/api/apiList';
import { useApi } from '@/hooks/useApi';
import { OneBtnModal } from '@/components/modal/OneBtnModal';
import { ERROR_RESPONSE } from '@/api/errorResponse';
import { getCards } from '@/utils/card/cardData';

const AddCard: React.FC = () => {
  const navigate = useNavigate();
  const [cardNumber, setCardNumber] = useState(['', '', '', '']);
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [password, setPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [nickname, setNickname] = useState('');

  const [activeField, setActiveField] = useState<string | null>(null);
  const [keypadVisible, setKeypadVisible] = useState(false);
  const [errors, setErrors] = useState<CardValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const putCardApi = useApi(apiList.card.putCard);

  // 유효기간 검증 함수 (MMYY 형식)
  const isExpired = (expiryMmYy: string): boolean => {
    if (!expiryMmYy || expiryMmYy.length !== 4) return false;
    
    const month = parseInt(expiryMmYy.slice(0, 2));
    const year = parseInt('20' + expiryMmYy.slice(2, 4)); // YY를 20YY로 변환
    
    // 해당 월의 마지막 날 다음 날 (다음 달 첫 날)과 비교
    const expiryEndDate = new Date(year, month, 1); // 다음 달 첫 날
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // 유효기간이 지났는지 확인 (다음 달 첫 날 이전이면 만료)
    return expiryEndDate <= today;
  };

  const handleKeyPress = (key: string) => {
    if (activeField === 'cardNumber') {
      const currentIndex = cardNumber.findIndex(part => part.length < 4);
      if (currentIndex !== -1) {
        const newCardNumber = [...cardNumber];
        newCardNumber[currentIndex] += key;
        setCardNumber(newCardNumber);
      }
    } else if (activeField === 'expiryDate') {
      if (expiryDate.length < 4) {
        setExpiryDate(expiryDate + key);
      }
    } else if (activeField === 'cvc') {
      if (cvc.length < 3) {
        setCvc(cvc + key);
      }
    } else if (activeField === 'password') {
      if (password.length < 2) {
        setPassword(password + key);
      }
    }
  };

  const handleBackspace = () => {
    if (activeField === 'cardNumber') {
      // 뒤에서부터 비어있지 않은 부분을 찾기
      let currentIndex = -1;
      for (let i = cardNumber.length - 1; i >= 0; i--) {
        if (cardNumber[i].length > 0) {
          currentIndex = i;
          break;
        }
      }
      
      if (currentIndex !== -1) {
        const newCardNumber = [...cardNumber];
        newCardNumber[currentIndex] = newCardNumber[currentIndex].slice(0, -1);
        setCardNumber(newCardNumber);
      }
    } else if (activeField === 'expiryDate') {
      setExpiryDate(expiryDate.slice(0, -1));
    } else if (activeField === 'cvc') {
      setCvc(cvc.slice(0, -1));
    } else if (activeField === 'password') {
      setPassword(password.slice(0, -1));
    }
  };

  const handleKeypadClose = () => {
    setKeypadVisible(false);
    setActiveField(null);
  };

  const handleFieldClick = (field: string) => {
    // 생년월일은 보안키패드를 사용하지 않음
    if (field === 'birthDate') return;

    setActiveField(field);
    setKeypadVisible(true);
  };


  const handleComplete = async () => {
    const cardData = {
      cardNumber,
      expiryDate,
      cvc,
      password,
      birthDate
    };

    const validation = validateCard(cardData);
    setErrors(validation.errors);

    if (!validation.isValid) {
      return;
    }

    // 카드 번호를 하나의 문자열로 합치기
    const cardNum = cardNumber.join('');
    
    // 이미 등록된 카드인지 확인 (API 호출 전에 체크)
    const existingCards = getCards();
    const isDuplicate = existingCards.some(card => {
      if (!card.cardNum) return false;
      
      // 저장된 카드 번호에서 숫자만 추출 (하이픈, 공백, 마스킹 문자 제거)
      const storedCardNum = card.cardNum.replace(/[-\s*]/g, '');
      // 입력한 카드 번호에서 숫자만 추출
      const inputCardNum = cardNum.replace(/[-\s]/g, '');
      
      // 전체 카드 번호가 일치하는 경우
      if (storedCardNum === inputCardNum) {
        return true;
      }
      
      // 마스킹된 카드 번호의 경우 마지막 4자리 비교
      // 저장된 카드 번호가 마스킹되어 있고, 마지막 4자리가 일치하면 중복으로 판단
      if (storedCardNum.length >= 4 && inputCardNum.length >= 4) {
        const storedLast4 = storedCardNum.slice(-4);
        const inputLast4 = inputCardNum.slice(-4);
        
        // 마지막 4자리가 일치하고, 저장된 카드 번호에 마스킹이 있으면 중복
        if (storedLast4 === inputLast4 && card.cardNum.includes('*')) {
          return true;
        }
      }
      
      return false;
    });

    if (isDuplicate) {
      setErrorMessage('이미 불러온 카드입니다.');
      setShowErrorModal(true);
      return;
    }

    setIsLoading(true);

    try {
      // 주민등록번호 앞 6자리와 뒷자리 첫 번째 분리
      const cardUserRegistNum = birthDate.slice(0, 6);
      const cardUserRegistBack = birthDate.length > 6 ? birthDate[6] : '1';

      const requestData = {
        cardNum: cardNum,
        cardPw: password,
        expiryMmYy: expiryDate,
        cardUserRegistNum: cardUserRegistNum,
        cardUserRegistBack: cardUserRegistBack,
        cardCvc: cvc,
        cardAlias: nickname || undefined,
      };

      // putCard API 호출 (카드 정보 검증 먼저)
      const result = await putCardApi.call(requestData);

      if (result?.success && result.data) {
        // API 성공 후 유효기간 검증
        if (isExpired(expiryDate)) {
          setErrorMessage('유효기간이 만료된 카드입니다.');
          setShowErrorModal(true);
          setIsLoading(false);
          return;
        }

        // 성공 시 API 응답 데이터와 함께 카드 추가 완료 페이지로 이동
        navigate('/card/cards/complete', {
          state: {
            cardNumber,
            expiryDate,
            cvc,
            password,
            birthDate,
            nickname: nickname || '', // 빈 문자열로 전달 (API 응답의 cardAlias 사용)
            apiResponse: result.data // API 응답 데이터 전달
          }
        });
      } else {
        // 실패 시 에러 모달 표시 (카드 정보 오류 우선)
        const errorMsg = result?.resultMsg || '';
        const errorName = result?.errorName || '';
        const resultCode = result?.resultCode;
        
        let displayMessage = errorMsg;
        
        // ERROR_RESPONSE에서 에러 메시지 확인
        if (errorName && ERROR_RESPONSE[errorName]) {
          displayMessage = ERROR_RESPONSE[errorName].message;
        } else {
          // 중복 카드 에러 처리 (에러명이나 메시지에 중복 관련 키워드가 있는 경우)
          if (
            errorName?.includes('DUPLICATE') || 
            errorName?.includes('ALREADY') ||
            errorMsg?.includes('이미') ||
            errorMsg?.includes('불러') ||
            errorMsg?.includes('중복') ||
            resultCode === 409 // Conflict
          ) {
            displayMessage = '이미 불러온 카드입니다.';
          } else if (errorName === 'CARD_ISNULL' || resultCode === 404) {
            displayMessage = '해당 카드는 존재하지 않습니다. 카드 정보를 확인해주세요.';
          }
        }
        
        setErrorMessage(displayMessage || '카드 등록에 실패했습니다.');
        setShowErrorModal(true);
      }
    } catch (error: any) {
      console.error('❌ 카드 등록 중 오류 발생:', error);
      setErrorMessage(error?.response?.data?.errorResultMsg || error?.message || '카드 등록 중 오류가 발생했습니다.');
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DefaultDiv
      isHeader={true}
      title='카드추가' onClose={() => { window.history.back(); }}
    >

      {/* 카드 번호 */}
      <div className="py-6">
        <SubText text="카드번호" className='mb-4' />
        <CardNumInput
          cardNumList={cardNumber}
          errors={errors}
          onClick={() => handleFieldClick('cardNumber')}
        />
      </div>


      {/* 카드 유효기간과 CVC번호 */}
      <div className="flex gap-6 py-5">
        {/* 유효기간 */}
        <div className="flex-1">
          <SubText text="카드 유효기간(MMYY)" className='mb-4' />
          <InputBox
            type="text"
            value={expiryDate}
            placeholder="MMYY"
            isReadOnly={true}
            onClick={() => handleFieldClick('expiryDate')}
            className={`
              cursor-pointer focus:outline-none 
              ${errors.cvc ? 'border-red-500' : 'border-gray-200'}
            `}
          />
          {errors.expiryDate && (
            <p className="mt-2 text-red-500">{errors.expiryDate}</p>
          )}
        </div>

        {/* cvc */}
        <div className="flex-1">
          <SubText text="CVC번호" className='mb-4' />
          <InputBox
            type="text"
            value={cvc}
            placeholder="카드 뒤 3자리"
            isReadOnly={true}
            onClick={() => handleFieldClick('cvc')}
            className={`
              cursor-pointer focus:outline-none 
              ${errors.cvc ? 'border-red-500' : 'border-gray-200'}
            `}
          />
          {errors.cvc && (
            <p className="mt-2 text-red-500">{errors.cvc}</p>
          )}
        </div>
      </div>


      {/* 카드 비밀번호 */}
      <div className="py-5">
        <SubText text="카드 비밀번호" className='mb-4' />
        <InputBox
          type="text"
          value={password}
          placeholder="앞 2자리"
          isReadOnly={true}
          onClick={() => handleFieldClick('password')}
          className={`
              cursor-pointer focus:outline-none 
              ${errors.cvc ? 'border-red-500' : 'border-gray-200'}
            `}
        />
        {errors.password && (
          <p className="mt-2 text-red-500">{errors.password}</p>
        )}
      </div>

      {/* 주민등록번호 */}
      <div className="py-5">
        <SubText text="주민등록번호" className='mb-4' />
        <CardBirthNumInput
          setBirthDate={(e) => { setBirthDate(e) }}
          birthDate={birthDate}
          errors={errors}
        />
      </div>

      {/* 카드 별명 */}
      <div className="py-5">
        <SubText text="카드 별명 (선택)" className='mb-4' />
        <InputBox
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="등록할 카드의 별명을 입력해주세요"
          borderColor="border-gray-200"
          textColor="text-gray-800"
          bgColor="bg-white"
          focusColor="focus:ring-blue-300"
        />
      </div>



      {/* 보안키패드 */}
      <SecureKeypad
        isVisible={keypadVisible}
        onKeyPress={handleKeyPress}
        onBackspace={handleBackspace}
        onClose={handleKeypadClose}
      />



{/* 등록 버튼 */}
        <BottomButtonWrapper>
          <DefaultButton 
            text={isLoading || putCardApi.loading ? '등록 중...' : '등록'} 
            onClick={handleComplete}
            disabled={isLoading || putCardApi.loading}
          />
        </BottomButtonWrapper>

      {/* 에러 모달 */}
      <OneBtnModal
        isOpen={showErrorModal}
        message={errorMessage || '카드 등록에 실패했습니다.'}
        confirmTitle="확인"
        confirmColor="#EF4444"
        onConfirm={() => {
          setShowErrorModal(false);
          setErrorMessage('');
        }}
      />
    </DefaultDiv>
  );
};

export default AddCard;