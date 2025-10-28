import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultButton from '@/components/button/DefaultButton';
import SecureKeypad from '@/components/input/SecureKeypad';
import InputBox from '@/components/input/InputBox';
import SubText from '@/components/text/SubText';
import BottomNav from '@/components/default/NavBar';
import { validateCard, CardValidationErrors } from '@/utils/cardValidation';
import { img } from '@/assets/img';

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
      const currentIndex = cardNumber.findIndex(part => part.length > 0);
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


  const handleComplete = () => {
    const cardData = {
      cardNumber,
      expiryDate,
      cvc,
      password,
      birthDate
    };
    
    const validation = validateCard(cardData);
    setErrors(validation.errors);
    
    if (validation.isValid) {
      // 카드 추가 완료 페이지로 이동 (카드 데이터 전달)
          navigate('/card/cards/complete', {
        state: {
          cardNumber,
          expiryDate,
          birthDate,
          nickname: nickname || '새 카드'
        }
      });
    }
  };

  return (
    <div className="flex relative flex-col w-full h-screen bg-white" style={{width:'400px', margin: '0 auto'}}>
      {/* 헤더 */}
      <div className="relative flex items-center justify-between w-full h-[4.5rem] px-0 bg-white border-b border-gray-200">
        {/* 왼쪽: 뒤로가기 버튼 */}
        <div className="flex justify-start pl-5 w-10">
          <button
            type="button"
            onClick={() => navigate('/card')}
            aria-label="뒤로가기"
            className="flex justify-center items-center"
          >
            <img
              src={img.Vector}
              alt="뒤로가기"
              className="object-contain w-5 h-5"
            />
          </button>
        </div>

        {/* 가운데: 타이틀 */}
        <h1 className="flex-1 text-center text-[1.6rem] font-semibold text-gray-900">
          카드 추가
        </h1>

        {/* 오른쪽: 닫기 버튼 */}
        <div className="flex justify-end pr-5 w-10">
          <button
            type="button"
            onClick={() => navigate('/card')}
            aria-label="닫기"
            className="flex justify-center items-center"
          >
            <img
              src={img.BsX}
              alt="닫기"
              className="object-contain w-7 h-7"
            />
          </button>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex flex-col flex-1 pb-20 bg-white">
        <div className="flex-1 px-8 pt-20 pb-10">
          {/* 폼 */}
          <div className="space-y-12">
            {/* 카드번호 */}
            <div className="py-2">
              <div className="mb-4">
                <SubText text="카드번호" />
              </div>
              <div 
                className={`flex items-center px-3 w-full h-12 bg-gray-50 rounded-lg border cursor-pointer focus:outline-none ${
                  errors.cardNumber ? 'border-red-500' : 'border-gray-200'
                }`}
                onClick={() => handleFieldClick('cardNumber')}
              >
                {cardNumber.map((part, index) => (
                  <React.Fragment key={index}>
                    <div className="flex flex-1 justify-center items-center">
                      <span className="text-[1.2rem] font-medium text-gray-900">
                        {part || '4자리'}
                      </span>
                    </div>
                    {index < 3 && (
                      <div className="flex justify-center items-center w-4">
                        <span className="text-gray-400 text-[1rem] font-medium">-</span>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
              {errors.cardNumber && (
                <p className="mt-2 text-sm text-red-500">{errors.cardNumber}</p>
              )}
            </div>

            {/* 카드 유효기간과 CVC번호 */}
            <div className="flex gap-6 py-2">
              <div className="flex-1">
                <div className="mb-4">
                  <SubText text="카드 유효기간(MMYY)" />
                </div>
                <input
                  type="text"
                  value={expiryDate}
                  placeholder="MMYY"
                  readOnly
                  onClick={() => handleFieldClick('expiryDate')}
                  className={`w-full h-12 border rounded-lg px-3 text-center text-[1.1rem] font-medium bg-gray-50 cursor-pointer focus:outline-none ${
                    errors.expiryDate ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.expiryDate && (
                  <p className="mt-2 text-sm text-red-500">{errors.expiryDate}</p>
                )}
              </div>
              <div className="flex-1">
                <div className="mb-4">
                  <SubText text="CVC번호" />
                </div>
                <input
                  type="text"
                  value={cvc}
                  placeholder="카드 뒤 3자리"
                  readOnly
                  onClick={() => handleFieldClick('cvc')}
                  className={`w-full h-12 border rounded-lg px-3 text-center text-[1.1rem] font-medium bg-gray-50 cursor-pointer focus:outline-none ${
                    errors.cvc ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.cvc && (
                  <p className="mt-2 text-sm text-red-500">{errors.cvc}</p>
                )}
              </div>
            </div>

            {/* 카드 비밀번호 */}
            <div className="py-2">
              <div className="mb-4">
                <SubText text="카드 비밀번호" />
              </div>
              <input
                type="text"
                value={password}
                placeholder="앞 2자리"
                readOnly
                onClick={() => handleFieldClick('password')}
                className={`w-full h-12 border rounded-lg px-3 text-left text-[1.1rem] font-medium bg-gray-50 cursor-pointer focus:outline-none ${
                  errors.password ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* 주민등록번호 */}
            <div className="py-2">
              <div className="mb-4">
                <SubText text="주민등록번호" />
              </div>
              <div className="flex gap-4 items-center">
                <input
                  type="text"
                  value={birthDate.slice(0, 6)}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setBirthDate(value + birthDate.slice(6));
                  }}
                  className={`w-120 h-12 border rounded-lg px-3 text-center text-[1.1rem] font-medium bg-white focus:outline-none ${
                    errors.birthDate ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
                  }`}
                />
                <span className="text-gray-400 text-[1rem]">-</span>
                <input
                  type="text"
                  value={birthDate.slice(6, 7)}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 1);
                    setBirthDate(birthDate.slice(0, 6) + value);
                  }}
                  className={`w-14 h-12 border rounded-lg px-2 text-center text-[1.1rem] font-medium bg-white focus:outline-none ${
                    errors.birthDate ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
                  }`}
                />
                <div className="flex gap-6 ml-4">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                </div>
              </div>
              {errors.birthDate && (
                <p className="mt-2 text-sm text-red-500">{errors.birthDate}</p>
              )}
            </div>

            {/* 카드 별명 */}
            <div className="py-2">
              <div className="mb-4">
                <SubText text="카드 별명 (선택)" />
              </div>
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
          </div>
        </div>

        {/* 완료 버튼 */}
        <div className="flex justify-center px-6 py-10 bg-white">
          <DefaultButton
            text="완료"
            onClick={handleComplete}
            className="bg-[#8BC34A] hover:bg-[#7EB73F] w-full max-w-none py-3 text-base"
          />
        </div>
      </div>

      {/* 보안키패드 */}
      <SecureKeypad
        isVisible={keypadVisible}
        onKeyPress={handleKeyPress}
        onBackspace={handleBackspace}
        onClose={handleKeypadClose}
      />

      {/* 하단 네비게이션 */}
      <div className="relative z-10">
        <BottomNav />
      </div>

    </div>
  );
};

export default AddCard;