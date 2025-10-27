import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MyCardBox from '@/components/card/MyCardBox';
import DefaultButton from '@/components/button/DefaultButton';
import DefaultDiv from '@/components/default/DefaultDiv';
import BottomNav from '@/components/default/NavBar';
import SubText from '@/components/text/SubText';
import ChoiceModal from '@/components/modal/ChoiceModal';
import { img } from '@/assets/img';
import { getCards, deleteCard, updateCardTitle, CardData } from '@/utils/cardData';

const CardManagement: React.FC = () => {
  const navigate = useNavigate();
  
  // 모달 상태
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  // 편집 모드 상태
  const [isEditMode, setIsEditMode] = useState(false);
  
  // 타이틀 편집 상태
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  
  // 별명 편집 모달 상태
  const [isEditNicknameModalOpen, setIsEditNicknameModalOpen] = useState(false);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editingCardNickname, setEditingCardNickname] = useState<string>('');
  const [newNickname, setNewNickname] = useState<string>('');
  
  // 카드 데이터 상태
  const [cards, setCards] = useState<CardData[]>([]);

  // JSON에서 카드 데이터 불러오기
  useEffect(() => {
    setCards(getCards());
  }, []);

  // 페이지 포커스 시 카드 목록 새로고침
  useEffect(() => {
    const handleFocus = () => {
      setCards(getCards());
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // 설정 모달 열기/닫기
  const toggleSettingsModal = () => {
    if (!isSettingsModalOpen) {
      setIsSettingsModalOpen(true);
      setTimeout(() => setIsModalVisible(true), 10);
    } else {
      setIsModalVisible(false);
      setTimeout(() => setIsSettingsModalOpen(false), 500);
    }
  };

  // 편집 모드 토글
  const toggleEditMode = () => {
    const newEditMode = !isEditMode;
    setIsEditMode(newEditMode);
    setCards(prevCards => 
      prevCards.map(card => ({
        ...card,
        isEdit: newEditMode
      }))
    );
    setIsSettingsModalOpen(false);
  };

  // 변경사항 저장
  const handleSaveChanges = () => {
    console.log('변경사항 저장');
    setIsEditMode(false); // 편집 모드 종료
    setCards(prevCards => 
      prevCards.map(card => ({
        ...card,
        isEdit: false
      }))
    );
  };

  // 카드 추가
  const handleAddCard = () => {
    navigate('/card/cards');
    setIsSettingsModalOpen(false);
  };

  // 카드 삭제
  const handleDeleteCard = (cardId: string) => {
    deleteCard(cardId);
    setCards(prevCards => prevCards.filter(card => card.id !== cardId));
  };

  // 카드 편집
  const handleEditCard = (cardId: string) => {
    // 카드 편집 로직 구현
    console.log('카드 편집:', cardId);
  };

  // 타이틀 편집 시작
  const handleEditTitle = (cardId: string) => {
    setEditingTitleId(cardId);
  };

  // 타이틀 저장
  const handleSaveTitle = (cardId: string, newTitle: string) => {
    updateCardTitle(cardId, newTitle);
    setCards(prevCards => 
      prevCards.map(card => 
        card.id === cardId ? { ...card, title: newTitle } : card
      )
    );
    setEditingTitleId(null);
  };

  // 타이틀 편집 취소
  const handleCancelEdit = () => {
    setEditingTitleId(null);
  };

  // 별명 편집 모달 열기
  const handleEditNickname = (cardId: string, currentNickname: string) => {
    setEditingCardId(cardId);
    setEditingCardNickname(currentNickname);
    setNewNickname(currentNickname);
    setIsEditNicknameModalOpen(true);
  };

  // 별명 저장
  const handleSaveNickname = () => {
    if (editingCardId && newNickname.trim()) {
      updateCardTitle(editingCardId, newNickname.trim());
      setCards(prevCards => 
        prevCards.map(card => 
          card.id === editingCardId ? { ...card, title: newNickname.trim() } : card
        )
      );
    }
    setIsEditNicknameModalOpen(false);
    setEditingCardId(null);
    setEditingCardNickname('');
    setNewNickname('');
  };

  // 별명 편집 모달 닫기
  const handleCloseNicknameModal = () => {
    setIsEditNicknameModalOpen(false);
    setEditingCardId(null);
    setEditingCardNickname('');
    setNewNickname('');
  };

  return (
    <div>
      <DefaultDiv className={`transition-all duration-200 ${isEditNicknameModalOpen ? 'bg-black/40' : ''}`}>
        {/* 헤더 */}
        <div className="relative flex items-center justify-between w-full h-[4.5rem] px-0 bg-white border-b border-gray-200">
          {/* 왼쪽: 뒤로가기 버튼 */}
          <div className="flex justify-start pl-5 w-10">
            <button
              type="button"
              onClick={() => window.history.back()}
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

        {/* 왼쪽: 타이틀 */}
        <h1 className="flex-1 text-left text-[1.9rem] font-semibold text-gray-900 truncate -ml-10">
          카드 관리
        </h1>

          {/* 오른쪽: 설정 버튼 */}
          {!isEditMode && (
            <div className="flex justify-end pr-5 w-11">
              <button
                type="button"
                onClick={toggleSettingsModal}
                aria-label="설정"
                className="flex justify-center items-center"
              >
                <img
                  src={img.settingIcon}
                  alt="설정"
                  className="object-contain w-8 h-8"
                />
              </button>
            </div>
          )}
        </div>

      {/* 메인 컨텐츠 */}
      <div className="pb-32">
        {/* 총 등록 카드 수 */}
        <div className="mt-4 mb-4">
          <SubText text={`총 등록 (${cards.length}개)`} />
        </div>

        {/* 카드 목록 */}
        <div className="space-y-2">
          {cards.map((card) => (
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
                onEdit={() => handleEditCard(card.id)}
                onDelete={() => handleDeleteCard(card.id)}
                onEditTitle={() => handleEditTitle(card.id)}
                isEditingTitle={editingTitleId === card.id}
                onSaveTitle={(newTitle) => handleSaveTitle(card.id, newTitle)}
                onCancelEdit={handleCancelEdit}
                onEditNickname={() => handleEditNickname(card.id, card.title)}
              />
            </div>
          ))}
        </div>

        {/* 설정 모달 */}
        {isSettingsModalOpen && (
          <div 
            className={`flex absolute inset-0 z-[500] justify-center items-end bg-black/40 transition-all duration-500 ${
              isModalVisible ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={toggleSettingsModal}
          >
            <div 
              className={`w-[400px] h-[170px] bg-white rounded-t-3xl shadow-lg flex flex-col transform transition-transform duration-500 ease-out ${
                isModalVisible ? 'translate-y-0' : 'translate-y-full'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 상단 회색 바 */}
              <div className="flex justify-center pt-[0.75rem]">
                <div className="w-[5rem] h-[0.5rem] bg-gray-300 rounded-lg" />
              </div>
              
              {/* 모달 제목 */}
              <div className="px-[1.5rem] py-[1.25rem]">
                <h2 className="text-[1.6rem] font-semibold text-gray-800 text-center">
                  설정
                </h2>
              </div>
              
              {/* 버튼 영역 */}
              <div className="px-[1.5rem] pb-[1.5rem] mt-[1rem]">
                <div className="flex gap-[0.75rem]">
                  <button
                    onClick={handleAddCard}
                    className="flex-1 py-[1rem] bg-gray-100 text-gray-800 text-[1.4rem] font-medium rounded-xl active:bg-gray-200"
                  >
                    카드 추가
                  </button>
                  <button
                    onClick={toggleEditMode}
                    className="flex-1 py-[1rem] bg-gray-800 text-white text-[1.4rem] font-medium rounded-xl active:bg-gray-700"
                  >
                    카드 수정
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 편집 모드일 때 저장 버튼 */}
        {isEditMode && (
          <div className="absolute bottom-[7rem] left-0 right-0 z-[60] px-[1.2rem] flex justify-center">
            <DefaultButton
              text="변경사항 저장"
              onClick={isEditNicknameModalOpen ? undefined : handleSaveChanges}
              className={`${
                isEditNicknameModalOpen 
                  ? 'bg-gray-400 opacity-50 cursor-not-allowed' 
                  : 'bg-red-500 hover:bg-red-600 active:bg-red-700'
              }`}
            />
          </div>
        )}
      </div>
      
      {/* 네비게이션 바 */}
      <div>
        <BottomNav />
      </div>
      
      {/* 별명 편집 모달 */}
      <ChoiceModal
        message="변경할 카드별명을 입력해주세요"
        isOpen={isEditNicknameModalOpen}
        onConfirm={handleSaveNickname}
        onCancel={handleCloseNicknameModal}
        btnTitle="저장"
        btnColor="text-blue-500"
        inputVisible={true}
        inputValue={newNickname}
        onInputChange={setNewNickname}
        inputPlaceholder="카드별명을 입력하세요"
      />
      </DefaultDiv>
    </div>
  );
  };

  export default CardManagement;
