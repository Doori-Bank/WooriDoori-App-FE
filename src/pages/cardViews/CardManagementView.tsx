import React, { useEffect } from 'react';
import MyCardBox from '@/components/card/MyCardBox';
import DefaultButton from '@/components/button/DefaultButton';
import DefaultDiv from '@/components/default/DefaultDiv';
import SubText from '@/components/text/SubText';
import { updateCardTitle } from '@/utils/card/CardUtils';
import { useCardStore } from '@/stores/useCardStore';
import { CardModals } from '../CardRecomViews/CardModals';
import BottomButtonWrapper from '@/components/button/BottomButtonWrapper';

const CardManagement: React.FC = () => {
  const {
    cards,
    isEditMode,
    isEditNicknameModalOpen,
    loadCards,
    toggleSettingsModal,
    toggleEditMode,
    handleDeleteCard,
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

  const handleSaveChanges = () => {
    console.log('변경사항 저장');
    toggleEditMode();
  };


  return (
    <div>
      <DefaultDiv
        className={`transition-all duration-200 ${isEditNicknameModalOpen ? 'bg-black/40' : ''
          }`}
        isBottomNav={!isEditMode}
        isHeader={true}
        title='카드 관리' isMainTitle={true} isShowClose={isEditMode} isShowSetting={!isEditMode} onClickSetting={toggleSettingsModal} onClose={toggleEditMode}
      >


        <SubText text={`총 등록 (${cards.length}개)`} />

        <div className="space-y-2">
          {cards.map(card => (
            <div key={card.id} className="origin-top-left scale-90">
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


        {isEditMode && (
          <BottomButtonWrapper>
            <DefaultButton
              text="변경사항 저장"
              onClick={!isEditNicknameModalOpen ? handleSaveChanges : undefined}
              className={`w-full ${isEditNicknameModalOpen
                ? 'bg-gray-400 opacity-50 cursor-not-allowed'
                : 'bg-red-500 hover:bg-red-600 active:bg-red-700'
                }`}
            />
          </BottomButtonWrapper>
        )}


        {/* modal 페이지 */}
        <CardModals />

      </DefaultDiv>
    </div>
  );
};

export default CardManagement;
