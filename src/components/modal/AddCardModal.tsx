import React, { useState } from 'react';
import DefaultButton from '@/components/button/DefaultButton';
import IconButton from '@/components/button/IconButton';
import SecureKeypad from '@/components/input/SecureKeypad';
import { img } from '@/assets/img';

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (cardData: any) => void;
}

const AddCardModal: React.FC<AddCardModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [cardNumber, setCardNumber] = useState(['', '', '', '']);
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [password, setPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [nickname, setNickname] = useState('');
  
  const [activeField, setActiveField] = useState<string | null>(null);
  const [keypadVisible, setKeypadVisible] = useState(false);

  if (!isOpen) return null;

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
      if (cvc.length < 4) {
        setCvc(cvc + key);
      }
    } else if (activeField === 'password') {
      if (password.length < 2) {
        setPassword(password + key);
      }
    } else if (activeField === 'birthDate') {
      if (birthDate.length < 8) {
        setBirthDate(birthDate + key);
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
    } else if (activeField === 'birthDate') {
      setBirthDate(birthDate.slice(0, -1));
    }
  };

  const handleKeypadClose = () => {
    setKeypadVisible(false);
    setActiveField(null);
  };

  const handleFieldClick = (field: string) => {
    setActiveField(field);
    setKeypadVisible(true);
  };

  const handleComplete = () => {
    const cardData = {
      cardNumber: cardNumber.join(''),
      expiryDate,
      cvc,
      password,
      birthDate,
      nickname: nickname || '새 카드'
    };
    onComplete(cardData);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-[500] bg-black/50 flex items-center justify-center">
        <div className="w-[400px] bg-white rounded-3xl p-6 max-h-[90vh] overflow-y-auto">
          {/* 헤더 */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[1.8rem] font-bold text-gray-900">카드 추가</h2>
            <IconButton 
              src={img.BsX} 
              alt="닫기" 
              width={24} 
              height={24} 
              onClick={onClose} 
            />
          </div>

          {/* 폼 */}
          <div className="space-y-6">
            {/* 카드번호 */}
            <div>
              <label className="block text-[1.4rem] font-semibold text-gray-800 mb-3">카드번호</label>
              <div className="flex gap-2">
                {cardNumber.map((part, index) => (
                  <div key={index} className="flex-1">
                    <input
                      type="text"
                      value={part}
                      placeholder="4자리"
                      readOnly
                      onClick={() => handleFieldClick('cardNumber')}
                      className="w-full h-12 border border-gray-300 rounded-xl px-4 text-center text-[1.4rem] font-semibold bg-gray-50 cursor-pointer"
                    />
                    {index < 3 && <span className="mx-1 text-gray-400">-</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* 카드 유효기간 */}
            <div>
              <label className="block text-[1.4rem] font-semibold text-gray-800 mb-3">카드 유효기간(MMYY)</label>
              <input
                type="text"
                value={expiryDate}
                placeholder="MMYY"
                readOnly
                onClick={() => handleFieldClick('expiryDate')}
                className="w-full h-12 border border-gray-300 rounded-xl px-4 text-center text-[1.4rem] font-semibold bg-gray-50 cursor-pointer"
              />
            </div>

            {/* CVC번호 */}
            <div>
              <label className="block text-[1.4rem] font-semibold text-gray-800 mb-3">CVC번호</label>
              <input
                type="text"
                value={cvc}
                placeholder="카드 뒤 3~4자리"
                readOnly
                onClick={() => handleFieldClick('cvc')}
                className="w-full h-12 border border-gray-300 rounded-xl px-4 text-center text-[1.4rem] font-semibold bg-gray-50 cursor-pointer"
              />
            </div>

            {/* 카드 비밀번호 */}
            <div>
              <label className="block text-[1.4rem] font-semibold text-gray-800 mb-3">카드 비밀번호</label>
              <input
                type="text"
                value={password}
                placeholder="앞 2자리"
                readOnly
                onClick={() => handleFieldClick('password')}
                className="w-full h-12 border border-gray-300 rounded-xl px-4 text-center text-[1.4rem] font-semibold bg-gray-50 cursor-pointer"
              />
            </div>

            {/* 생년월일 */}
            <div>
              <label className="block text-[1.4rem] font-semibold text-gray-800 mb-3">생년월일</label>
              <input
                type="text"
                value={birthDate}
                placeholder="YYYYMMDD"
                readOnly
                onClick={() => handleFieldClick('birthDate')}
                className="w-full h-12 border border-gray-300 rounded-xl px-4 text-center text-[1.4rem] font-semibold bg-gray-50 cursor-pointer"
              />
            </div>

            {/* 카드 별명 */}
            <div>
              <label className="block text-[1.4rem] font-semibold text-gray-800 mb-3">카드 별명 (선택)</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="등록할 카드의 별명을 입력해주세요"
                className="w-full h-12 border border-gray-300 rounded-xl px-4 text-[1.4rem] bg-white"
              />
            </div>
          </div>

          {/* 완료 버튼 */}
          <div className="mt-8">
            <DefaultButton
              text="완료"
              onClick={handleComplete}
              className="bg-[#8BC34A] hover:bg-[#7EB73F]"
            />
          </div>
        </div>
      </div>

      {/* 보안키패드 */}
      <SecureKeypad
        isVisible={keypadVisible}
        onKeyPress={handleKeyPress}
        onBackspace={handleBackspace}
        onClose={handleKeypadClose}
      />
    </>
  );
};

export default AddCardModal;
