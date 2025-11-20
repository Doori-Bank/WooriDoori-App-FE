export * from './cardData';
export * from './cardValidation';

// 카드 번호를 4자리씩 하이픈으로 구분하여 포맷팅하는 함수
export const formatCardNumber = (cardNum: string): string => {
  if (!cardNum) return '';
  
  // 하이픈과 공백 제거
  const cleaned = cardNum.replace(/[-\s]/g, '');
  
  // 4자리씩 나누어 하이픈으로 연결
  const formatted = cleaned.match(/.{1,4}/g)?.join('-') || cleaned;
  
  return formatted;
};