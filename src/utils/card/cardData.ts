import { img } from '@/assets/img';

export interface CardData {
  id: string;
  title: string;
  cardName: string;
  cardNum: string;
  cardImage: string;
  benefits: string;
  isEdit?: boolean;
}

// localStorage 키
const CARDS_STORAGE_KEY = 'userCards';

// 카드 데이터를 가져오는 함수
export const getCards = (): CardData[] => {
  // localStorage에서 데이터를 가져오기
  const storedCards = localStorage.getItem(CARDS_STORAGE_KEY);
  if (storedCards) {
    const parsedCards = JSON.parse(storedCards);
    // 빈 배열이거나 유효한 카드 데이터가 있으면 반환
    if (Array.isArray(parsedCards)) {
      return parsedCards.map((card: any) => ({
        ...card,
        // cardImage가 URL인 경우 그대로 사용, 아니면 기본 이미지 사용
        cardImage: card.cardImage && (
          card.cardImage.startsWith('http://') || 
          card.cardImage.startsWith('https://') ||
          card.cardImage.startsWith('/')
        ) ? card.cardImage : (card.cardImage === 'cardExample' ? img.cardExample : img.cardExample)
      }));
    }
  }
  
  // 기본 데이터 없이 빈 배열 반환 (로그인 시 카드가 없어야 함)
  return [];
};

// 새 카드를 추가하는 함수
export const addCard = (newCard: Omit<CardData, 'id'>): CardData => {
  const cardId = Date.now().toString();
  const cardData: CardData = {
    id: cardId,
    ...newCard,
    cardImage: img.cardExample
  };
  
  // localStorage에서 기존 카드 목록 가져오기
  const storedCards = localStorage.getItem(CARDS_STORAGE_KEY);
  const cards = storedCards ? JSON.parse(storedCards) : [];
  
  // 새 카드를 맨 앞에 추가
  cards.unshift({
    id: cardId,
    title: newCard.title,
    cardName: newCard.cardName,
    cardNum: newCard.cardNum,
    cardImage: 'cardExample', // JSON에는 문자열로 저장
    benefits: newCard.benefits,
    isEdit: false
  });
  
  // localStorage에 저장
  localStorage.setItem(CARDS_STORAGE_KEY, JSON.stringify(cards));
  
  return cardData;
};

// 카드를 삭제하는 함수
export const deleteCard = (cardId: string): void => {
  const storedCards = localStorage.getItem(CARDS_STORAGE_KEY);
  if (storedCards) {
    const cards = JSON.parse(storedCards);
    const filteredCards = cards.filter((card: any) => card.id !== cardId);
    localStorage.setItem(CARDS_STORAGE_KEY, JSON.stringify(filteredCards));
  }
};

// 카드 제목을 업데이트하는 함수
export const updateCardTitle = (cardId: string, newTitle: string): void => {
  const storedCards = localStorage.getItem(CARDS_STORAGE_KEY);
  if (storedCards) {
    const cards = JSON.parse(storedCards);
    const updatedCards = cards.map((card: any) => 
      card.id === cardId ? { ...card, title: newTitle } : card
    );
    localStorage.setItem(CARDS_STORAGE_KEY, JSON.stringify(updatedCards));
  }
};
