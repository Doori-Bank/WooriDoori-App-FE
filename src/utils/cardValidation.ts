export interface CardValidationErrors {
  cardNumber?: string;
  expiryDate?: string;
  cvc?: string;
  password?: string;
  birthDate?: string;
}

export interface CardData {
  cardNumber: string[];
  expiryDate: string;
  cvc: string;
  password: string;
  birthDate: string;
}

export const validateCard = (cardData: CardData): { isValid: boolean; errors: CardValidationErrors } => {
  const errors: CardValidationErrors = {};

  // 카드번호 검증 (16자리)
  const fullCardNumber = cardData.cardNumber.join('');
  if (fullCardNumber.length !== 16) {
    errors.cardNumber = '카드번호는 16자리여야 합니다.';
  }

  // 유효기간 검증 (MMYY 형식)
  if (cardData.expiryDate.length !== 4) {
    errors.expiryDate = '유효기간은 4자리여야 합니다.';
  } else {
    const month = parseInt(cardData.expiryDate.slice(0, 2));
    if (month < 1 || month > 12) {
      errors.expiryDate = '월은 01-12 사이여야 합니다.';
    }
  }

  // CVC 검증 (3-4자리)
  if (cardData.cvc.length < 3 || cardData.cvc.length > 4) {
    errors.cvc = 'CVC번호는 3-4자리여야 합니다.';
  }

  // 비밀번호 검증 (2자리)
  if (cardData.password.length !== 2) {
    errors.password = '비밀번호는 2자리여야 합니다.';
  }

  // 주민등록번호 검증 (7자리: 6자리 생년월일 + 1자리 성별코드)
  if (cardData.birthDate.length !== 7) {
    errors.birthDate = '주민등록번호는 7자리여야 합니다.';
  } else {
    const birthPart = cardData.birthDate.slice(0, 6);
    const genderCode = cardData.birthDate.slice(6, 7);
    
    // 생년월일 검증 (YYMMDD)
    const month = parseInt(birthPart.slice(2, 4));
    const day = parseInt(birthPart.slice(4, 6));
    
    if (month < 1 || month > 12) {
      errors.birthDate = '월은 01-12 사이여야 합니다.';
    } else if (day < 1 || day > 31) {
      errors.birthDate = '일은 01-31 사이여야 합니다.';
    }
    
    // 성별코드 검증 (1-4)
    if (genderCode < '1' || genderCode > '4') {
      errors.birthDate = '성별코드는 1-4 사이여야 합니다.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
