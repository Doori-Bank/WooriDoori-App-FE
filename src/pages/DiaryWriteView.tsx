import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { img } from '@/assets/img';
import IconButton from '@/components/button/IconButton';
import ConfirmModal from '@/components/modal/ConfirmModal';
import { useCalendarStore } from '@/stores/calendarStore';
import NavBar from '@/components/default/NavBar';
import DefaultDiv from '@/components/default/DefaultDiv';

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
    <DefaultDiv isPadding={false}>
      <div className="w-full h-screen bg-white dark:bg-gray-700 flex flex-col">
        {/* 헤더 */}
        <div className="py-all px-5 flex items-center justify-between">
          <div className="w-10"></div>
          <div className="text-3xl font-bold dark:text-white">소비 일기</div>
          <button onClick={handleCancel}>
            <IconButton src={img.BsX} alt="닫기" height={33} />
          </button>
        </div>
        
        {/* 메인 컨텐츠 */}
        <div className="flex-1 px-6 pb-[112px] flex flex-col">
          {/* 날짜 필드 */}
          <div className="mb-6">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3">
              <span className="text-xl text-gray-700 dark:text-gray-300">
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
          
          {/* 텍스트 입력 영역 */}
          <div className="flex-1 flex flex-col">
            <textarea
              value={content}
              onChange={(e) => {
                const text = e.target.value;
                if (text.length <= maxLength) {
                  setContent(text);
                }
              }}
              placeholder="오늘의 소비 일기를 써봐요. (50자 이내)"
              className="flex-1 w-full border-2 border-green-500 rounded-2xl p-4 text-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
              autoFocus
            />
          </div>
        </div>
        
        {/* 완료 버튼 - 하단 고정 */}
        <div className="w-full px-6 py-4 fixed bottom-[50px] left-0 right-0 bg-white dark:bg-gray-700 z-40">
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
        </div>
        
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
