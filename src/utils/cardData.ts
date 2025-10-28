import cardsData from '@/data/cards.json';
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
  // localStorage에서 데이터를 가져오고, 없으면 기본 JSON 데이터 사용
  const storedCards = localStorage.getItem(CARDS_STORAGE_KEY);
  if (storedCards) {
    const parsedCards = JSON.parse(storedCards);
    return parsedCards.map((card: any) => ({
      ...card,
      cardImage: img.cardExample
    }));
  }
  
  // 기본 데이터를 localStorage에 저장
  const defaultCards = cardsData.cards.map(card => ({
    ...card,
    cardImage: img.cardExample
  }));
  localStorage.setItem(CARDS_STORAGE_KEY, JSON.stringify(defaultCards));
  
  return defaultCards;
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
