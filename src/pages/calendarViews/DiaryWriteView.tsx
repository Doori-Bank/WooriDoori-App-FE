import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { img } from '@/assets/img';
import IconButton from '@/components/button/IconButton';
import ConfirmModal from '@/components/modal/ConfirmModal';
import { useCalendarStore } from '@/stores/calendarStore';
import NavBar from '@/components/default/NavBar';
import DefaultDiv from '@/components/default/DefaultDiv';
import BottomButtonWrapper from '@/components/button/BottomButtonWrapper';
import { apiList } from '@/api/apiList';
import { emotionIndexToEnum, emotionEnumToIndex } from '@/utils/diaryUtils';
import { OneBtnModal } from '@/components/modal/OneBtnModal';

const DiaryWriteView = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const date = searchParams.get('date') || '';
  const emotionFromUrl = searchParams.get('emotion');
  const editMode = searchParams.get('edit') === 'true';
  const diaryIdFromUrl = searchParams.get('diaryId');
  const setDiaryEntry = useCalendarStore((state) => state.setDiaryEntry);
  const getDiaryEntry = useCalendarStore((state) => state.getDiaryEntry);
  
  // 기존 일기 정보 가져오기
  const existingEntry = getDiaryEntry(date);
  
  // 수정 모드이고 diaryId가 URL에 있으면 store의 diaryId와 매칭 확인
  const diaryId = editMode && diaryIdFromUrl 
    ? parseInt(diaryIdFromUrl) 
    : (existingEntry && (existingEntry as any).diaryId ? (existingEntry as any).diaryId : undefined);
  
  // 감정 값 결정: URL > 기존 일기 > 기본값(보통)
  const emotion = emotionFromUrl !== null 
    ? parseInt(emotionFromUrl) 
    : (existingEntry?.emotion !== undefined ? existingEntry.emotion : 2);
  
  console.log('DiaryWriteView - emotion:', emotion, 'emotionFromUrl:', emotionFromUrl, 'existingEntry:', existingEntry);
  const [content, setContent] = useState(existingEntry?.content || '');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<{ message: string; showModal: boolean } | null>(null);
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
  
  const handleConfirmSave = async () => {
    setIsSaving(true);
    setError(null);
    
    try {
      const emotionEnum = emotionIndexToEnum(emotion);
      console.log('일기 저장 시작 - emotion index:', emotion, 'emotion enum:', emotionEnum);
      
      if (editMode && diaryId) {
        // 수정 모드
        const result = await apiList.updateDiary(
          diaryId,
          emotionEnum,
          content.trim()
        );
        
        if (result.success) {
          // API 응답에서 업데이트된 감정 정보 가져오기
          const updatedEmotion = result.data?.diaryEmotion 
            ? emotionEnumToIndex(result.data.diaryEmotion)
            : emotion;
          
          // store 업데이트 (감정 정보 포함)
          setDiaryEntry(date, {
            date,
            content: result.data?.diaryContent || content.trim(),
            emotion: updatedEmotion,
            diaryId: diaryId,
          });
          navigate('/calendar/diary');
        } else {
          setError({
            message: result.resultMsg || '일기 수정에 실패했습니다.',
            showModal: true,
          });
        }
      } else {
        // 생성 모드
        const result = await apiList.createDiary(date, emotionEnum, content.trim());
        
        if (result.success && result.data) {
          // DiaryCreateResponseDto는 diaryId만 반환하므로 로컬 state의 emotion 사용
          // store 업데이트 (로컬 state의 감정 정보 사용)
          console.log('일기 생성 - 저장할 감정:', emotion, 'date:', date);
          setDiaryEntry(date, {
            date,
            content: content.trim(),
            emotion: emotion, // 선택한 감정 그대로 사용
            diaryId: result.data.diaryId || result.data.id,
          });
          console.log('store 업데이트 완료');
          navigate('/calendar/diary');
        } else {
          setError({
            message: result.resultMsg || '일기 생성에 실패했습니다.',
            showModal: true,
          });
        }
      }
    } catch (error: any) {
      console.error('일기 저장 에러:', error);
      setError({
        message: '일기 저장에 실패했습니다.',
        showModal: true,
      });
    } finally {
      setIsSaving(false);
    }
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
            disabled={!content.trim() || isSaving}
            className={`w-full py-4 rounded-2xl text-2xl font-bold transition-colors ${
              content.trim() && !isSaving
                ? 'text-white' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            style={content.trim() && !isSaving ? { backgroundColor: 'rgb(139, 195, 75)' } : {}}
          >
            {isSaving ? '저장 중...' : '완료'}
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

        {/* 에러 모달 */}
        <OneBtnModal
          isOpen={error?.showModal || false}
          message={
            <div className="py-2">
              <div className="text-5xl mb-4">⚠️</div>
              <p className="text-[1.4rem] leading-relaxed">{error?.message}</p>
            </div>
          }
          confirmTitle="확인"
          confirmColor="#4C8B73"
          onConfirm={() => {
            setError(null);
          }}
        />
      </div>
      <NavBar />
    </DefaultDiv>
  );
};

export default DiaryWriteView;
