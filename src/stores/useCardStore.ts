// /src/stores/useCardStore.ts
import { create } from 'zustand';
import { getCards, deleteCard, updateCardTitle, CardData } from '@/utils/card/CardUtils';
import { apiList } from '@/api/apiList';

type CardStore = {
  cards: CardData[];
  originalCards: CardData[]; // 편집 모드 진입 시 원본 카드 목록 저장
  pendingDeletes: string[]; // 삭제 예정 카드 ID 목록
  pendingUpdates: Map<string, string>; // 수정 예정 카드 별명 (카드ID -> 새 별명)
  isSettingsModalOpen: boolean;
  isEditMode: boolean;
  isEditNicknameModalOpen: boolean;
  newNickname: string;
  editingCardId: string | null;
  isUpdatingNickname: boolean;
  isDeletingCard: boolean;

  // actions
  loadCards: () => void;
  toggleSettingsModal: () => void;
  toggleEditMode: () => void;
  handleDeleteCard: (id: string) => void;
  handleSaveChanges: () => Promise<void>;
  handleSaveNickname: () => void;
  setNewNickname: (name: string) => void;
  openNicknameModal: (id: string, nickname: string) => void;
  closeNicknameModal: () => void;
};

export const useCardStore = create<CardStore>((set, get) => ({
  cards: [],
  originalCards: [],
  pendingDeletes: [],
  pendingUpdates: new Map(),
  isSettingsModalOpen: false,
  isEditMode: false,
  isEditNicknameModalOpen: false,
  newNickname: '',
  editingCardId: null,
  isUpdatingNickname: false,
  isDeletingCard: false,

  loadCards: () => set({ cards: getCards() }),

  toggleSettingsModal: () =>
    set(state => ({ isSettingsModalOpen: !state.isSettingsModalOpen })),

  toggleEditMode: () => {
    const { isEditMode, cards, originalCards } = get();
    
    if (isEditMode) {
      // 편집 모드 종료 시 - 변경사항 취소
      // 원본 카드 목록으로 복원
      set({
        isEditMode: false,
        cards: originalCards.map(card => ({
          ...card,
          isEdit: false,
        })),
        pendingDeletes: [],
        pendingUpdates: new Map(),
        originalCards: [],
      });
    } else {
      // 편집 모드 진입 시 - 원본 카드 목록 저장
      set({
        isEditMode: true,
        originalCards: [...cards],
        cards: cards.map(card => ({
          ...card,
          isEdit: true,
        })),
        pendingDeletes: [],
        pendingUpdates: new Map(),
      });
    }
  },

  handleDeleteCard: (id: string) => {
    const { cards, pendingDeletes } = get();
    
    // 현재 카드 찾기
    const currentCard = cards.find(c => c.id === id);
    if (!currentCard) {
      console.error('카드를 찾을 수 없습니다:', id);
      return;
    }

    // 삭제 예정 목록에 추가하고 화면에서만 제거
    set({
      cards: cards.filter(c => c.id !== id),
      pendingDeletes: [...pendingDeletes, id],
    });
  },

  handleSaveChanges: async () => {
    const { pendingDeletes, pendingUpdates, originalCards } = get();
    
    // 변경사항이 없으면 편집 모드만 종료
    if (pendingDeletes.length === 0 && pendingUpdates.size === 0) {
      set({
        isEditMode: false,
        cards: originalCards.map(card => ({
          ...card,
          isEdit: false,
        })),
        originalCards: [],
        pendingDeletes: [],
        pendingUpdates: new Map(),
      });
      return;
    }

    set({ isDeletingCard: true });

    try {
      // 1. 삭제 예정 목록의 모든 카드를 실제로 삭제
      const deletePromises = pendingDeletes.map(async (id) => {
        const cardIdNumber = parseInt(id, 10);
        
        // 유효한 숫자 ID가 아니면 로컬에서만 삭제
        if (isNaN(cardIdNumber) || cardIdNumber <= 0) {
          console.warn('유효하지 않은 카드 ID, 로컬에서만 삭제:', id);
          deleteCard(id);
          return { success: true, id };
        }

        try {
          const result = await apiList.card.deleteCard(cardIdNumber);
          if (result?.success) {
            deleteCard(id);
            return { success: true, id };
          } else {
            return { success: false, id, error: result?.resultMsg };
          }
        } catch (error: any) {
          return { success: false, id, error: error?.message };
        }
      });

      // 2. 수정 예정 목록의 모든 카드 별명을 실제로 수정
      const updatePromises = Array.from(pendingUpdates.entries()).map(async ([id, newNickname]) => {
        const cardIdNumber = parseInt(id, 10);
        
        // 유효한 숫자 ID가 아니면 로컬에서만 업데이트
        if (isNaN(cardIdNumber) || cardIdNumber <= 0) {
          console.warn('유효하지 않은 카드 ID, 로컬에서만 업데이트:', id);
          updateCardTitle(id, newNickname);
          return { success: true, id };
        }

        try {
          const result = await apiList.card.editCard({
            id: cardIdNumber,
            cardAlias: newNickname,
          });
          if (result?.success) {
            updateCardTitle(id, newNickname);
            return { success: true, id };
          } else {
            return { success: false, id, error: result?.resultMsg };
          }
        } catch (error: any) {
          return { success: false, id, error: error?.message };
        }
      });

      // 삭제와 수정을 병렬로 처리
      const [deleteResults, updateResults] = await Promise.all([
        Promise.all(deletePromises),
        Promise.all(updatePromises),
      ]);
      
      // 실패한 작업이 있는지 확인
      const failedDeletes = deleteResults.filter(r => !r.success);
      const failedUpdates = updateResults.filter(r => !r.success);
      
      if (failedDeletes.length > 0 || failedUpdates.length > 0) {
        const errors = [
          ...failedDeletes.map(f => `삭제 실패: ${f.error}`),
          ...failedUpdates.map(f => `수정 실패: ${f.error}`),
        ];
        console.error('일부 작업 실패:', errors);
        alert(`일부 작업에 실패했습니다:\n${errors.join('\n')}`);
      }

      // 성공적으로 삭제된 카드들을 제외한 나머지 카드로 업데이트
      const successfulDeletes = deleteResults.filter(r => r.success).map(r => r.id);
      let remainingCards = originalCards.filter(c => !successfulDeletes.includes(c.id));

      // 성공적으로 수정된 카드들의 별명 업데이트
      const successfulUpdates = updateResults.filter(r => r.success);
      remainingCards = remainingCards.map(card => {
        const update = successfulUpdates.find(u => u.id === card.id);
        if (update) {
          const newNickname = pendingUpdates.get(card.id);
          return { ...card, title: newNickname || card.title };
        }
        return card;
      });

      set({
        isEditMode: false,
        cards: remainingCards.map(card => ({
          ...card,
          isEdit: false,
        })),
        originalCards: [],
        pendingDeletes: [],
        pendingUpdates: new Map(),
        isDeletingCard: false,
      });
    } catch (error: any) {
      console.error('카드 변경사항 저장 중 오류 발생:', error);
      alert(error?.message || '카드 변경사항 저장 중 오류가 발생했습니다.');
      set({ isDeletingCard: false });
    }
  },

  openNicknameModal: (id, nickname) =>
    set({
      isEditNicknameModalOpen: true,
      editingCardId: id,
      newNickname: nickname,
    }),

  closeNicknameModal: () =>
    set({
      isEditNicknameModalOpen: false,
      editingCardId: null,
      newNickname: '',
    }),

  setNewNickname: name => set({ newNickname: name }),

  handleSaveNickname: () => {
    const { editingCardId, newNickname, cards, pendingUpdates } = get();
    
    if (!editingCardId || !newNickname.trim()) {
      return;
    }

    // 현재 카드 찾기
    const currentCard = cards.find(c => c.id === editingCardId);
    if (!currentCard) {
      console.error('카드를 찾을 수 없습니다:', editingCardId);
      return;
    }

    // pendingUpdates에 추가하고 화면에만 반영
    const updatedPendingUpdates = new Map(pendingUpdates);
    updatedPendingUpdates.set(editingCardId, newNickname.trim());

    set({
      cards: cards.map(c =>
        c.id === editingCardId ? { ...c, title: newNickname.trim() } : c
      ),
      pendingUpdates: updatedPendingUpdates,
      isEditNicknameModalOpen: false,
      editingCardId: null,
      newNickname: '',
    });
  },
}));
