import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { img } from '@/assets/img';
import IconButton from '@/components/button/IconButton';
import ConfirmModal from '@/components/modal/ConfirmModal';
import { useCalendarStore } from '@/stores/calendarStore';
import NavBar from '@/components/default/NavBar';
import DefaultDiv from '@/components/default/DefaultDiv';
import BottomButtonWrapper from '@/components/button/BottomButtonWrapper';

const DiaryWriteView = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const date = searchParams.get('date') || '';
  const emotionFromUrl = searchParams.get('emotion');
  const editMode = searchParams.get('edit') === 'true';
  const setDiaryEntry = useCalendarStore((state) => state.setDiaryEntry);
  const getDiaryEntry = useCalendarStore((state) => state.getDiaryEntry);
  
  // 기존 일기 정보 가져오기
  const existingEntry = getDiaryEntry(date);
  
  const emotion = emotionFromUrl ? parseInt(emotionFromUrl) : (existingEntry?.emotion || 0);
  const [content, setContent] = useState(existingEntry?.content || '');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const maxLength = 50;
  
  // 날짜 파싱
  const [year, month, day] = date.split('-');
  const selectedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][selectedDate.getDay()];
  
  // 감정 아이콘 매핑
  const emotionIcons = [
    img.doori_face1, // 매우 좋음
    img.doori_face2, // 좋음
    img.doori_face3, // 보통
    img.doori_face4, // 나쁨
    img.doori_face5, // 매우 나쁨
  ];
  
  const handleComplete = () => {
    if (content.trim()) {
      setShowSaveModal(true);
    }
  };
  
  const handleConfirmSave = () => {
    setDiaryEntry(date, {
      date,
      content: content.trim(),
      emotion,
    });
    navigate('/calendar/diary');
  };
  
  const handleCancel = () => {
    setShowCancelModal(true);
  };
  
  const handleConfirmCancel = () => {
    navigate('/calendar/diary');
  };
  
  return (
    <DefaultDiv isPadding={false} style={{ backgroundColor: '#FBFBFB' }}>
      <div className="flex flex-col w-full h-screen bg-white">
        {/* 헤더 */}
        <div className="flex justify-between items-center px-5 py-all">
          <div className="w-10"></div>
          <div className="text-3xl font-bold">소비 일기</div>
          <button onClick={handleCancel}>
            <IconButton src={img.BsX} alt="닫기" height={33} />
          </button>
        </div>
        
        {/* 메인 컨텐츠 */}
        <div className="flex-1 px-6 pb-[112px] flex flex-col">
          {/* 날짜 필드 */}
          <div className="mb-6">
            <div className="px-4 py-3 bg-gray-100 rounded-2xl">
              <span className="text-xl text-gray-700">
                {day}일 {dayOfWeek}요일
              </span>
            </div>
          </div>
          
          {/* 감정 아이콘 - 큰 원형 */}
          <div className="mb-8">
            <button 
              onClick={() => navigate(`/calendar/diary/emotion?date=${date}&emotion=${emotion}`)}
            >
              <IconButton
                src={emotionIcons[emotion]}
                alt="감정"
                width={100}
                height={100}
              />
            </button>
          </div>
          
          {/* 텍스트 입력 영역 (일기 스타일) */}
          <div className="flex relative flex-col">
            <div className="rounded-2xl border border-gray-200 shadow-sm bg-[#FFFEFB] transition-colors focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-300">
              <textarea
                value={content}
                onChange={(e) => {
                  const text = e.target.value;
                  if (text.length <= maxLength) {
                    setContent(text);
                  }
                }}
                placeholder="오늘의 소비 일기를 써봐요. (50자 이내)"
                className="p-7 w-full h-44 text-[1.25rem] leading-8 text-gray-800 rounded-2xl bg-transparent resize-none font-serif italic focus:outline-none"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(transparent, transparent 30px, rgba(16,24,40,0.06) 31px)',
                  backgroundSize: '100% 31px',
                  backgroundPositionY: '12px',
                }}
                autoFocus
              />
            </div>
            <div className="absolute right-1 -bottom-6 text-sm text-gray-400">
              {content.length}/{maxLength}
            </div>
          </div>
        </div>
        
        {/* 완료 버튼 - 하단 고정 */}
        <BottomButtonWrapper paddingBottom="pb-[7rem]">
          <button
            onClick={handleComplete}
            disabled={!content.trim()}
            className={`w-full py-4 rounded-2xl text-2xl font-bold transition-colors ${
              content.trim() 
                ? 'text-white' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            style={content.trim() ? { backgroundColor: 'rgb(139, 195, 75)' } : {}}
          >
            완료
          </button>
        </BottomButtonWrapper>
        
        {/* 저장 확인 모달 */}
        <ConfirmModal
          message="내용을 저장하시겠습니까?"
          isOpen={showSaveModal}
          onConfirm={handleConfirmSave}
          onCancel={() => setShowSaveModal(false)}
        />
        
        {/* 취소 확인 모달 */}
        <ConfirmModal
          message={editMode ? "수정을 취소하시겠습니까?" : "작성을 취소하시겠습니까?"}
          isOpen={showCancelModal}
          onConfirm={handleConfirmCancel}
          onCancel={() => setShowCancelModal(false)}
        />
      </div>
      <NavBar />
    </DefaultDiv>
  );
};

export default DiaryWriteView;
