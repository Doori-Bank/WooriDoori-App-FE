import React, { useEffect } from 'react';
import MyCardBox from '@/components/card/MyCardBox';
import DefaultButton from '@/components/button/DefaultButton';
import DefaultDiv from '@/components/default/DefaultDiv';
import { updateCardTitle } from '@/utils/card/CardUtils';
import { useCardStore } from '@/stores/useCardStore';
import { CardModals } from '../CardRecomViews/CardModals';

const CardManagement: React.FC = () => {
  const {
    cards,
    isEditMode,
    isEditNicknameModalOpen,
    isDeletingCard,
    loadCards,
    toggleSettingsModal,
    toggleEditMode,
    handleDeleteCard,
    handleSaveChanges,
    openNicknameModal,
  } = useCardStore();

  // 카드 데이터 초기화
  useEffect(() => {
    loadCards();
  }, [loadCards]);

  // 페이지 포커스 시 새로고침
  useEffect(() => {
    const handleFocus = () => loadCards();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [loadCards]);



  return (
    <div>
      <DefaultDiv
        className={`transition-all duration-200 ${isEditNicknameModalOpen ? 'bg-black/40' : ''}`}
        isBottomNav={!isEditMode}
        isHeader={true}
        title='카드 관리' isMainTitle={true} isShowClose={isEditMode} isShowSetting={!isEditMode} onClickSetting={toggleSettingsModal} onClose={toggleEditMode}
        style={{ backgroundColor: '#FBFBFB' }}
        headerClassName="bg-white"
      >

        <div
          className={`
            absolute
            left-0 right-0
            top-[7rem]
            ${isEditMode ? 'bottom-[10rem]' : 'bottom-[1rem]'}
            overflow-y-auto
            px-4
            ${isEditMode ? 'pb-0' : 'pb-24'}
          `}
        >
          {/* 총 등록 카드 섹션 */}
          <div className="mb-6">
            <div className="px-5 py-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-[1.3rem] font-semibold text-gray-800">내 카드</h2>
                  <p className="mt-1 text-[1.2rem] text-gray-500">총 {cards.length}개 등록됨</p>
                </div>
                <div className="flex justify-center items-center w-12 h-12 bg-green-100 rounded-full">
                  <span className="text-[1.4rem] font-bold text-green-600">{cards.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 카드 리스트 */}
          {cards.length > 0 ? (
            <div className="pb-8 space-y-4">
              {cards.map(card => (
                <div key={card.id} className="overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-sm transition-all duration-200 hover:shadow-md">
                  <MyCardBox
                    src={card.cardImage}
                    alt={card.title}
                    title={card.title}
                    cardName={card.cardName}
                    cardNum={card.cardNum}
                    content={card.benefits}
                    isEidit={card.isEdit}
                    isEditMode={isEditMode}
                    onEditTitle={() => updateCardTitle(card.id, card.title)}
                    onDelete={() => handleDeleteCard(card.id)}
                    onEditNickname={() => openNicknameModal(card.id, card.title)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center py-20">
              <div className="flex justify-center items-center mb-4 w-24 h-24 bg-gray-100 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-12 h-12 text-gray-400"
                >
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                  <line x1="1" y1="10" x2="23" y2="10"></line>
                </svg>
              </div>
              <p className="text-[1.4rem] text-gray-500">등록된 카드가 없습니다</p>
              <p className="mt-2 text-[1.2rem] text-gray-400">카드를 추가해보세요</p>
            </div>
          )}

        </div>

        {/* 변경사항 저장 버튼 - 화면 하단 고정 */}
        {isEditMode && (
          <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[400px] px-4 py-20 z-40 flex justify-center" style={{ backgroundColor: '#FBFBFB' }}>
            <DefaultButton
              text={isDeletingCard ? "저장 중..." : "변경사항 저장"}
              onClick={!isEditNicknameModalOpen && !isDeletingCard ? handleSaveChanges : undefined}
              disabled={isEditNicknameModalOpen || isDeletingCard}
              className={`${isEditNicknameModalOpen || isDeletingCard
                ? 'bg-gray-400 opacity-50 cursor-not-allowed'
                : 'bg-red-500 hover:bg-red-600 active:bg-red-700'
                }`}
            />
          </div>
        )}

        {/* modal 페이지 */}
        <CardModals />

      </DefaultDiv>
    </div>
  );
};

export default CardManagement;
